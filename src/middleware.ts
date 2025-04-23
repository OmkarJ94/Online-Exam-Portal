import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Specify allowed routes where no authentication is required
const allowedRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/",
];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isAllowedRoute = allowedRoutes.includes(path);

  if (isAllowedRoute) {
    return NextResponse.next();
  }
  const accessToken = (await cookies()).get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
