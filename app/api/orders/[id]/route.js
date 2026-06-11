import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

// GET - Tek sipariş getir (müşteri takip için)
export async function GET(request, { params }) {
  const { id } = params;
  
  const [rows] = await pool.query(
    "SELECT * FROM orders WHERE order_id = ?",
    [id]
  );
  
  if (rows.length === 0) {
    return NextResponse.json({ error: "سفارش یافت نشد" }, { status: 404 });
  }
  
  const order = rows[0];
  // items JSON string'ini parse et
  order.items = JSON.parse(order.items);
  
  return NextResponse.json(order);
}

// DELETE - Sipariş sil (admin için)
export async function DELETE(request, { params }) {
  const authCookie = request.cookies.get("admin_auth");
  if (!authCookie || authCookie.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const { id } = params;
  await pool.query("DELETE FROM orders WHERE order_id = ?", [id]);
  
  return NextResponse.json({ success: true });
}