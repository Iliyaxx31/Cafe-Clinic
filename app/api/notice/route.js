import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const noticePath = path.join(process.cwd(), "app/json/notice.json");

export async function GET() {
  const file = await fs.readFile(noticePath, "utf-8");
  return NextResponse.json(JSON.parse(file));
}

export async function POST(request) {
  const body = await request.json();
  await fs.writeFile(noticePath, JSON.stringify(body, null, 2));
  return NextResponse.json({ success: true });
}