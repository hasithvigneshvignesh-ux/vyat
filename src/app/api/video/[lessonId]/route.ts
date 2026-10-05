import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET: Generate a signed URL for a lesson video
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const supabase = await createClient();
    const { lessonId } = await params;

    // Verify authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the lesson (RLS will enforce skill access for students)
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('id, video_path, skill_id')
      .eq('id', lessonId)
      .single();

    if (lessonError || !lesson) {
      return NextResponse.json(
        { error: 'Lesson not found or access denied' },
        { status: 403 }
      );
    }

    if (!lesson.video_path) {
      return NextResponse.json(
        { error: 'No video available for this lesson' },
        { status: 404 }
      );
    }

    // Generate signed URL (1 hour expiry)
    const { data: signedUrl, error: signError } = await supabase
      .storage
      .from('lesson-videos')
      .createSignedUrl(lesson.video_path, 3600);

    if (signError || !signedUrl) {
      return NextResponse.json(
        { error: 'Unable to generate video URL' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: signedUrl.signedUrl,
      expires_in: 3600,
    });
  } catch (error) {
    console.error('Video URL error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
