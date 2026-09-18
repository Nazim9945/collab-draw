import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiInstance } from "./config";

const publicRoutes = ["/", "/signin"];
const protectedRoutes = ["/dashboard","/room/:path*"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);
  const isProtectedRoute =
    protectedRoutes.includes(path) || path.startsWith("/room");

  if (!isPublicRoute && !isProtectedRoute) {
    return NextResponse.next();
  }

  const cookieHeader = (await cookies()).toString();

  try {
    const response = await apiInstance.get("/me", {
      headers: {
        cookie: cookieHeader,
      },
    });

    const user = response.data;

    if (!user || !user.username) {
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL("/signin", req.nextUrl));
      }

      return NextResponse.next();
    }

    if (isPublicRoute) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    return NextResponse.next();
  } catch (error) {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/signin", req.nextUrl));
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/", "/signin", "/room/:path*", "/dashboard"],
};
