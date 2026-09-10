import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    return NextResponse.json({ error: 'Painel administrativo não configurado.' }, { status: 503 });
  }

  const auth = request.headers.get('authorization');
  if (!auth?.startsWith('Basic ')) return unauthorized();

  try {
    const decoded = Buffer.from(auth.slice(6), 'base64').toString('utf8');
    const separator = decoded.indexOf(':');
    const user = separator >= 0 ? decoded.slice(0, separator) : '';
    const pass = separator >= 0 ? decoded.slice(separator + 1) : '';

    if (user !== username || pass !== password) return unauthorized();
    return NextResponse.next();
  } catch {
    return unauthorized();
  }
}

function unauthorized() {
  return new NextResponse('Autenticação necessária', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Painel de Agendamentos"' },
  });
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
