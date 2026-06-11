import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

// GET - Tüm siparişleri getir (admin için)
export async function GET(request) {
  const authCookie = request.cookies.get("admin_auth");
  if (!authCookie || authCookie.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [orders] = await pool.query(`
    SELECT 
      id, 
      order_id, 
      items, 
      total, 
      customer_name, 
      customer_phone, 
      customer_address, 
      note, 
      status, 
      created_at
    FROM orders 
    ORDER BY created_at DESC
  `);

  // items JSON string'ini parse et
  const formattedOrders = orders.map(order => ({
    ...order,
    items: JSON.parse(order.items)
  }));

  return NextResponse.json(formattedOrders);
}

// POST - Yeni sipariş oluştur
export async function POST(request) {
  const { items, total, customerName, customerPhone, customerAddress, note } = await request.json();

  // Validasyonlar
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

  // Yeni order_id bul
  const [[maxRow]] = await pool.query("SELECT MAX(order_id) as maxId FROM orders");
  const newOrderId = (maxRow?.maxId || 0) + 1;

  // Siparişi ekle
  const [result] = await pool.query(
    `INSERT INTO orders (order_id, items, total, customer_name, customer_phone, customer_address, note, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [newOrderId, JSON.stringify(items), total, customerName, customerPhone, customerAddress, note || null, 'pending']
  );

  const newOrder = {
    id: result.insertId,
    order_id: newOrderId,
    items,
    total,
    customerName,
    customerPhone,
    customerAddress,
    note: note || null,
    status: 'pending',
    created_at: new Date().toISOString()
  };

  // WebSocket bildirimi
  if (global.io) {
    global.io.emit("new-order", newOrder);
  }

  // Bale bildirimi
  const BALE_BOT_TOKEN = process.env.BALE_BOT_TOKEN;
  const BALE_CHAT_ID = process.env.BALE_CHAT_ID;

  if (BALE_BOT_TOKEN && BALE_CHAT_ID) {
    const message = `🆕 سفارش جدید!\n👤 نام: ${customerName}\n📞 تلفن: ${customerPhone}\n📍 آدرس: ${customerAddress}\n💰 مبلغ: ${total.toLocaleString()} تومان\n🆔 شماره پیگیری: ${newOrderId}`;
    
    fetch(`https://tapi.bale.ai/bot${BALE_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: BALE_CHAT_ID, text: message }),
    }).catch(err => console.error("Bale hatası:", err));
  }

  return NextResponse.json({ success: true, orderId: newOrderId });
}

// PUT - Sipariş durumunu güncelle
export async function PUT(request) {
  const authCookie = request.cookies.get("admin_auth");
  if (!authCookie || authCookie.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId, status } = await request.json();
  await pool.query("UPDATE orders SET status = ? WHERE order_id = ?", [status, orderId]);

  return NextResponse.json({ success: true });
}