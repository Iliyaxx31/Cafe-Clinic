import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function GET() {
  try {
    // 1. Kategorileri ve ürünleri çek
    const [categories] = await pool.query(`
      SELECT 
        c.id, 
        c.name, 
        c.icon,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', i.id,
            'name', i.name,
            'description', i.description,
            'img', i.img
          )
        ) as items
      FROM categories c
      LEFT JOIN items i ON c.id = i.category_id
      GROUP BY c.id
      ORDER BY c.id ASC
    `);

    // items içindeki null'ları temizle
    const formattedCategories = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      items: cat.items ? JSON.parse(cat.items).filter(item => item.id !== null) : []
    }));

    // 2. Fiyatları çek
    const [prices] = await pool.query("SELECT item_id, price FROM prices");
    const pricesMap = {};
    prices.forEach(p => pricesMap[p.item_id] = p.price);

    return NextResponse.json({
      data: {
        cafeName: "Cafe Clinic",
        categories: formattedCategories
      },
      prices: pricesMap
    });
  } catch (error) {
    console.error("Menu API hatası:", error);
    return NextResponse.json({ error: "Veri yüklenemedi" }, { status: 500 });
  }
}