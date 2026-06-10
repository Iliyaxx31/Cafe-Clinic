import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  console.log("Middleware çalıştı:", pathname);

  // SADECE /admin ile başlayan sayfaları kontrol et (api/admin dahil)
  if (pathname.startsWith("/admin")) {
    // Login sayfasına her zaman izin ver
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }
    
    // API login'e izin ver
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
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};