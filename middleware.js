import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  if (
    hostname === "dr-korddentalclinic.ir" ||
    hostname === "www.dr-korddentalclinic.ir"
  ) {
    const isStaticFile = /\.(png|jpg|jpeg|svg|webp|gif|ico|css|js|woff|woff2|ttf|txt|xml|json|mp4|glb|gltf)$/.test(
      pathname
    );

    if (
      !pathname.startsWith("/kartvizitMevaredQR") &&
      !pathname.startsWith("/_next") &&
      !pathname.startsWith("/favicon") &&
      !isStaticFile
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/kartvizitMevaredQR" + (pathname === "/" ? "" : pathname);
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  console.log("Middleware çalıştı:", pathname);

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    if (pathname === "/api/admin/login") {
      return NextResponse.next();
    }

    // Auth kontrolü
    const authToken = request.cookies.get("admin_auth");
    console.log("Auth token:", authToken?.value);

    if (!authToken || authToken.value !== "authenticated") {
      console.log("Yönlendiriliyor: /admin/login");
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};