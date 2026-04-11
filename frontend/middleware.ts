import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('nga_token_cookie')?.value;
  const { pathname } = request.nextUrl;

  // Rotas que exigem autenticação
  const isProtectedRoute = pathname.startsWith('/admin') || pathname.startsWith('/medico');

  // Se for uma rota protegida e não houver token, redireciona para a home ou login
  // Nota: No lado do servidor (Middleware), só temos acesso aos Cookies.
  // Como estamos usando localStorage no AuthContext, faremos uma proteção híbrida.
  // Para proteção real no middleware, precisaríamos salvar o token em Cookies.
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/medico/:path*'],
};
