import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    const jsonDir = path.join(process.cwd(), "app/json");
    const dataFile = await fs.readFile(
      path.join(jsonDir, "data.json"),
      "utf-8",
    );
    const priceFile = await fs.readFile(
      path.join(jsonDir, "price.json"),
      "utf-8",
    );

    return NextResponse.json({
      data: JSON.parse(dataFile),
      prices: JSON.parse(priceFile),
    });
  } catch (error) {
    console.error("Menu API hatası:", error);
    return NextResponse.json({ error: "Veri yüklenemedi" }, { status: 500 });
  }
}
