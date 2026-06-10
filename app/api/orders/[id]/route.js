import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const ordersFile = path.join(process.cwd(), "app/json/orders.json");

async function getOrders() {
  try {
    const data = await fs.readFile(ordersFile, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveOrders(orders) {
  await fs.writeFile(ordersFile, JSON.stringify(orders, null, 2));
}

// GET - Tek sipariş getir (müşteri takip)
export async function GET(request, { params }) {
  const { id } = params;
  const orders = await getOrders();
  const order = orders.find((o) => o.id === parseInt(id));
  if (!order) {
    return NextResponse.json({ error: "سفارش یافت نشد" }, { status: 404 });
  }
  return NextResponse.json(order);
}

// DELETE - Sipariş sil (admin için)
export async function DELETE(request, { params }) {
  const authCookie = request.cookies.get("admin_auth");
  if (!authCookie || authCookie.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const { id } = params;
  const orders = await getOrders();
  const filteredOrders = orders.filter((o) => o.id !== parseInt(id));
  await saveOrders(filteredOrders);
  
  return NextResponse.json({ success: true });
}