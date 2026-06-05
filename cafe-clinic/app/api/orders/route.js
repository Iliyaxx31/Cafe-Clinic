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

export async function GET(request) {
  const authCookie = request.cookies.get("admin_auth");
  if (!authCookie || authCookie.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const orders = await getOrders();
  return NextResponse.json(orders);
}

export async function POST(request) {
  const { items, total, customerName, customerPhone, customerAddress, note } = await request.json();

  if (!customerName?.trim()) {
    return NextResponse.json({ error: "نام الزامی است" }, { status: 400 });
  }
  const phoneRegex = /^09[0-9]{9}$/;
  if (!phoneRegex.test(customerPhone)) {
    return NextResponse.json({ error: "شماره تماس نامعتبر است" }, { status: 400 });
  }
  if (!customerAddress?.trim() || customerAddress.trim().length < 5) {
    return NextResponse.json({ error: "آدرس کامل الزامی است" }, { status: 400 });
  }

  const orders = await getOrders();
  const newOrder = {
    id: Date.now(),
    items,
    total,
    customerName,
    customerPhone,
    customerAddress,
    note: note || null,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  orders.push(newOrder);
  await saveOrders(orders);

  if (global.io) {
    global.io.emit("new-order", newOrder);
  }

  return NextResponse.json({ success: true, orderId: newOrder.id });
}

export async function PUT(request) {
  const authCookie = request.cookies.get("admin_auth");
  if (!authCookie || authCookie.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { orderId, status } = await request.json();
  const orders = await getOrders();
  const order = orders.find((o) => o.id === orderId);
  if (order) {
    order.status = status;
    await saveOrders(orders);
  }
  return NextResponse.json({ success: true });
}