import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const token = await getToken({ req: request });
  const pathname = request.nextUrl.pathname;

  const isAuthPage = pathname.startsWith("/auth");

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/auth/:path*",
    "/dashboard/:path*",
    "/invoices/:path*",
    "/clients/:path*",
    "/reports/:path*",
    "/settings/:path*",
  ],
};
