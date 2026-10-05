import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    let role = 'student';
    try {
      const body = await request.json();
      if (body && body.role) {
        role = body.role;
      }
    } catch {
      // If parsing body fails, check query params or default
      const url = new URL(request.url);
      const queryRole = url.searchParams.get('role');
      if (queryRole === 'admin' || queryRole === 'student') {
        role = queryRole;
      }
    }

    const redirectUrl = role === 'admin' ? '/admin/dashboard' : '/dashboard';
    const response = NextResponse.json({ success: true, redirectUrl });

    const demoUser = role === 'admin'
      ? {
          id: 'demo-admin-id',
          email: 'admin@vyat.com',
          full_name: 'Prof. Rajesh Sharma (Admin)',
          role: 'admin',
        }
      : {
          id: 'demo-student-id',
          email: 'student@vyat.com',
          full_name: 'Aarav Patel',
          role: 'student',
        };

    // Set cookies on the response object
    response.cookies.set('demo_role', role, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    response.cookies.set('demo_user', JSON.stringify(demoUser), {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err: any) {
    console.error('Demo auth route error:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Failed to initialize demo session' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const role = url.searchParams.get('role') === 'admin' ? 'admin' : 'student';
  const targetUrl = new URL(role === 'admin' ? '/admin/dashboard' : '/dashboard', request.url);
  const response = NextResponse.redirect(targetUrl);

  const demoUser = role === 'admin'
    ? {
        id: 'demo-admin-id',
        email: 'admin@vyat.com',
        full_name: 'Prof. Rajesh Sharma (Admin)',
        role: 'admin',
      }
    : {
        id: 'demo-student-id',
        email: 'student@vyat.com',
        full_name: 'Aarav Patel',
        role: 'student',
      };

  response.cookies.set('demo_role', role, {
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });

  response.cookies.set('demo_user', JSON.stringify(demoUser), {
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('demo_role', '', { path: '/', maxAge: 0 });
  response.cookies.set('demo_user', '', { path: '/', maxAge: 0 });
  return response;
}

