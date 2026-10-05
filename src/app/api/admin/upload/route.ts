import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (adminProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const category = (formData.get('category') as string) || 'videos'; // 'videos' | 'certificates' | 'resources'

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Clean filename
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${safeName}`;

    // 1. Try uploading to Supabase Storage bucket
    let supabaseUrl: string | null = null;
    const bucketName = category === 'videos' ? 'lesson-videos' : 'certificates';

    try {
      const { data: storageData, error: storageError } = await supabaseAdmin
        .storage
        .from(bucketName)
        .upload(`${category}/${fileName}`, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (!storageError && storageData) {
        const { data: publicUrlData } = supabaseAdmin
          .storage
          .from(bucketName)
          .getPublicUrl(`${category}/${fileName}`);

        if (publicUrlData?.publicUrl) {
          supabaseUrl = publicUrlData.publicUrl;
        }
      }
    } catch (storageEx) {
      // Supabase storage bucket may not exist in local mode; fallback to local public directory
    }

    // 2. Also save to local public/uploads directory for instant local serving
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', category);
    await mkdir(uploadDir, { recursive: true });
    const localFilePath = path.join(uploadDir, fileName);
    await writeFile(localFilePath, buffer);

    const localUrl = `/uploads/${category}/${fileName}`;

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      url: supabaseUrl || localUrl,
      localUrl,
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to upload file' },
      { status: 500 }
    );
  }
}
