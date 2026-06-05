import { NextResponse } from "next/server";
import bcrypt from "bcrypt"; // bcrypt'i import edin

export async function POST(request) {
  const { username, password } = await request.json();

  const adminUser = process.env.ADMIN_USERNAME;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH; // Hash'i alıyoruz

  // Eğer hash değişkeni yoksa, hata ver
  if (!adminPasswordHash) {
    console.error("ADMIN_PASSWORD_HASH ortam değişkeni ayarlanmamış!");
    return NextResponse.json(
      { error: "Sunucu yapılandırma hatası" },
      { status: 500 },
    );
  }

  // Kullanıcı adı doğruysa, şifreyi hash ile karşılaştır
  if (username === adminUser) {
    // bcrypt.compare, verilen düz metin şifreyi saklanan hash ile karşılaştırır
    const passwordMatch = await bcrypt.compare(password, adminPasswordHash);

    if (passwordMatch) {
      const response = NextResponse.json({ success: true });
      response.cookies.set("admin_auth", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24,
        path: "/",
      });
      return response;
    }
  }

  return NextResponse.json(
    { error: "Password or Username Incorrect" },
    { status: 401 },
  );
}
