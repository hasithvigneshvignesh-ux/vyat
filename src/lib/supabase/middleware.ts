import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Middleware Error: Missing Supabase environment variables. Please check your Vercel configuration.');
    // Return a regular response so it doesn't crash the entire routing
    return NextResponse.next({ request });
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const demoRole = request.cookies.get('demo_role')?.value;

  // Public routes that don't need auth
  const isPublicRoute = path === '/' || path === '/login' || path.startsWith('/api/certificates/verify') || path.startsWith('/api/auth/demo');

  const isAuthenticated = !!user || !!demoRole;

  if (!isAuthenticated && !isPublicRoute) {
    // Not logged in, redirect to login
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirectTo', path);
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && (path === '/' || path === '/login')) {
    // Logged in, redirect to appropriate dashboard
    let role = demoRole;
    if (!role && user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      role = profile?.role;
    }

    const url = request.nextUrl.clone();
    url.pathname = role === 'admin' ? '/admin/dashboard' : '/dashboard';
    return NextResponse.redirect(url);
  }

  // Admin route protection
  if (path.startsWith('/admin')) {
    let role = demoRole;
    if (!role && user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      role = profile?.role;
    }

    if (role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
