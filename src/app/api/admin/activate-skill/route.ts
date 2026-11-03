import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// POST: Activate skills for a student
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const cookieStore = (await request.headers.get('cookie')) || '';

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser();
    let isAdmin = false;
    let adminId: string | null = null;

    if (user) {
      const { data: adminProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (adminProfile?.role === 'admin') {
        isAdmin = true;
        adminId = user.id;
      }
    } else if (cookieStore.includes('demo_role=admin')) {
      isAdmin = true;
    }

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      student_id,
      skill_ids,
      payment_amount,
      payment_method,
      payment_status,
      payment_reference,
      payment_notes,
    } = body;

    if (!student_id || !skill_ids || !Array.isArray(skill_ids) || skill_ids.length === 0) {
      return NextResponse.json(
        { error: 'Student ID and at least one skill ID are required' },
        { status: 400 }
      );
    }

    // Verify student exists
    const { data: student } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name')
      .eq('id', student_id)
      .eq('role', 'student')
      .single();

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Activate each skill
    const activationResults = [];
    for (const skill_id of skill_ids) {
      // Check if access already exists
      const { data: existing } = await supabaseAdmin
        .from('student_skill_access')
        .select('id, status')
        .eq('student_id', student_id)
        .eq('skill_id', skill_id)
        .single();

      if (existing) {
        // Reactivate if revoked/expired
        if (existing.status === 'revoked' || existing.status === 'expired') {
          const { error } = await supabaseAdmin
            .from('student_skill_access')
            .update({
              status: 'active',
              activated_by: adminId,
              activated_at: new Date().toISOString(),
              access_start_date: new Date().toISOString(),
              completion_date: null,
              access_expiry_date: null,
            })
            .eq('id', existing.id);

          if (error) {
            activationResults.push({ skill_id, success: false, error: error.message });
          } else {
            activationResults.push({ skill_id, success: true, reactivated: true });
          }
        } else {
          activationResults.push({ skill_id, success: false, error: 'Already active or completed' });
        }
      } else {
        // Create new access record
        const { error } = await supabaseAdmin
          .from('student_skill_access')
          .insert({
            student_id,
            skill_id,
            activated_by: adminId,
            status: 'active',
            activated_at: new Date().toISOString(),
            access_start_date: new Date().toISOString(),
          });

        if (error) {
          activationResults.push({ skill_id, success: false, error: error.message });
        } else {
          activationResults.push({ skill_id, success: true });

          // Auto-create a certificate record (locked until completion)
          try {
            await supabaseAdmin.from('certificates').insert({
              student_id,
              skill_id,
              certificate_number: '',
              status: 'generated',
            });
          } catch (certErr) {
            console.error('Certificate pre-creation notice:', certErr);
          }
        }
      }
    }

    // Record payment ONLY if explicitly provided and amount > 0
    // (If covered by enrollment package, payment_amount will be 0 or omitted)
    const numericPayment = payment_amount ? parseFloat(payment_amount) : 0;
    if (numericPayment > 0 && payment_method) {
      try {
        await supabaseAdmin.from('payments').insert({
          student_id,
          amount: numericPayment,
          payment_method,
          payment_status: payment_status || 'paid',
          payment_reference: payment_reference || null,
          notes: payment_notes || 'Additional skill activation fee',
          recorded_by: adminId,
          received_at: payment_status === 'paid' ? new Date().toISOString() : null,
        });
      } catch (payErr) {
        console.error('Payment record error:', payErr);
      }
    }

    // Log admin action
    if (adminId) {
      try {
        await supabaseAdmin.from('admin_actions').insert({
          admin_id: adminId,
          action_type: 'skills_activated',
          description: `Activated ${skill_ids.length} skill(s) for ${student.full_name}`,
          metadata: { student_id, skill_ids, activationResults },
        });
      } catch (logErr) {
        console.error('Admin log error:', logErr);
      }
    }

    return NextResponse.json({
      success: true,
      results: activationResults,
    });
  } catch (error) {
    console.error('Skill activation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
