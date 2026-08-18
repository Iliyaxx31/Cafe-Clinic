
import { NextResponse } from "next/server";

// ------------------------------------------------------------------
// Şifreyi .env.local dosyasına STAFF_PASSWORD=... olarak koy.
// Ortam değişkeni yoksa aşağıdaki varsayılan kullanılır — canlıya
// çıkmadan önce mutlaka .env.local ile kendi şifreni tanımla.
// ------------------------------------------------------------------
const STAFF_PASSWORD = process.env.STAFF_PASSWORD || "personel123";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { password } = body;

  if (password !== STAFF_PASSWORD) {
    return NextResponse.json(
      { ok: false, error: "Şifre yanlış" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("staff_auth", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 saat — bir vardiya süresi
  });

  return response;
}