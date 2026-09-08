import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const settingsFile = path.join(process.cwd(), "data/settings.json");

async function getSettings() {
  try {
    const data = await fs.readFile(settingsFile, "utf-8");
    return JSON.parse(data);
  } catch {
    return {
      maintenanceMode: false,
      maintenanceMessage: "",
      powerOutageMode: false,
    };
  }
}

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

// POST - Admin panelden ayarları güncelle (maintenanceMode, powerOutageMode vb.)
export async function POST(request) {
  const authCookie = request.cookies.get("admin_auth");
  if (!authCookie || authCookie.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const current = await getSettings();
  const updated = { ...current, ...body };

  await fs.writeFile(settingsFile, JSON.stringify(updated, null, 2));
  return NextResponse.json(updated);
}