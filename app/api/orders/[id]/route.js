import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const ordersFile = path.join(process.cwd(), "data/orders.json");

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

// PATCH - Mevcut siparişe ürün ekle (müşteri track sayfasından)
export async function PATCH(request, { params }) {
  const { id } = params;
  const { newItems } = await request.json();

  if (!Array.isArray(newItems) || newItems.length === 0) {
    return NextResponse.json({ error: "هیچ آیتمی انتخاب نشده" }, { status: 400 });
  }

  const orders = await getOrders();
  const order = orders.find((o) => o.id === parseInt(id));

  if (!order) {
    return NextResponse.json({ error: "سفارش یافت نشد" }, { status: 404 });
  }

  // sadece pending veya preparing durumundaki siparişlere ekleme yapılabilir
  // "در مسیر ارسال" (delivering) durumuna geçtikten sonra ekleme kapanır
  const editableStatuses = ["pending", "preparing"];
  if (!editableStatuses.includes(order.status)) {
    return NextResponse.json(
      { error: "سفارش شما در مسیر ارسال است و دیگر قابل ویرایش نیست" },
      { status: 400 }
    );
  }

  // aynı üründen varsa quantity'yi artır, yoksa yeni satır ekle
  newItems.forEach((newItem) => {
    const existing = order.items.find((i) => i.id === newItem.id);
    if (existing) {
      existing.quantity += newItem.quantity;
      existing.total = existing.price * existing.quantity;
    } else {
      order.items.push({
        id: newItem.id,
        name: newItem.name,
        quantity: newItem.quantity,
        price: newItem.price,
        total: newItem.price * newItem.quantity,
      });
    }
  });

  order.total = order.items.reduce((sum, i) => sum + i.total, 0);
  order.updatedAt = new Date().toISOString();

  await saveOrders(orders);

  // WebSocket bildirimi (admin panel polling ile de günceller ama varsa socket'e de yollayalım)
  if (global.io) {
    global.io.emit("order-updated", order);
  }

  // ================= BALE BİLDİRİMİ (SİPARİŞE EKLEME) =================
  const BALE_BOT_TOKEN = process.env.BALE_BOT_TOKEN;

  const chatIds = [
    process.env.BALE_CHAT_ID,
    process.env.BALE_CHAT_MH_ID,
    process.env.BALE_CHAT_ARIYAA_ID,
  ].filter((cid) => cid && cid.trim() !== "");

  if (BALE_BOT_TOKEN && chatIds.length > 0) {
    const addedList = newItems
      .map(
        (item, idx) =>
          `   ${idx + 1}️⃣ ${item.name} (${item.quantity} عدد) = ${(
            item.price * item.quantity
          ).toLocaleString()} تومان`
      )
      .join("\n");

    const message = `
➕ افزودن به سفارش قبلی!

🆔 شماره پیگیری: ${order.id}
👤 نام مشتری: ${order.customerName}
📞 تلفن: ${order.customerPhone}
📍 آدرس: ${order.customerAddress}

🛒 آیتم‌های تازه اضافه‌شده:
${addedList}

💰 مبلغ کل جدید سفارش: ${order.total.toLocaleString()} تومان
📅 تاریخ بروزرسانی: ${new Date().toLocaleString("fa-IR")}
    `;

    for (const chatId of chatIds) {
      fetch(`https://tapi.bale.ai/bot${BALE_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId.trim(), text: message }),
      }).catch((err) => console.error(`Bale hatası (${chatId}):`, err));
    }
  }
  // ======================================================================

  return NextResponse.json({ success: true, order });
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