import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const settingsFile = path.join(process.cwd(), "data/settings.json");

export async function GET() {
  try {
    const data = await fs.readFile(settingsFile, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json({ maintenanceMode: true });
  }
}