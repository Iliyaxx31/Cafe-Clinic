import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function POST(request) {
  try {
    const { action, data } = await request.json();

    const authCookie = request.cookies.get("admin_auth");
    if (!authCookie || authCookie.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ----- GET DATA -----
    if (action === "getData") {
      // Kategorileri ve ürünleri çek
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
        ...cat,
        items: cat.items ? JSON.parse(cat.items).filter(item => item.id !== null) : []
      }));

      // Fiyatları çek
      const [prices] = await pool.query("SELECT item_id, price FROM prices");
      const pricesMap = {};
      prices.forEach(p => pricesMap[p.item_id] = p.price);

      return NextResponse.json({
        data: { cafeName: "Cafe Clinic", categories: formattedCategories },
        prices: pricesMap
      });
    }

    // ----- UPDATE PRICES -----
    if (action === "updatePrices") {
      const { prices } = data;
      for (const [itemId, price] of Object.entries(prices)) {
        await pool.query(
          "INSERT INTO prices (item_id, price) VALUES (?, ?) ON DUPLICATE KEY UPDATE price = ?",
          [parseInt(itemId), price, price]
        );
      }
      return NextResponse.json({ success: true });
    }

    // ----- UPDATE DATA (kategoriler ve ürünler) -----
    if (action === "updateData") {
      const { data: newData } = data;
      for (const cat of newData.categories) {
        // Kategori ekle veya güncelle
        await pool.query(
          "INSERT INTO categories (id, name, icon) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name = ?, icon = ?",
          [cat.id, cat.name, cat.icon || 'CiCoffeeCup', cat.name, cat.icon || 'CiCoffeeCup']
        );
        
        // Kategoriye ait tüm ürünleri sil (yerine yenilerini ekle)
        await pool.query("DELETE FROM items WHERE category_id = ?", [cat.id]);
        
        // Yeni ürünleri ekle
        for (const item of cat.items) {
          await pool.query(
            "INSERT INTO items (id, category_id, name, description, img) VALUES (?, ?, ?, ?, ?)",
            [item.id, cat.id, item.name, item.description || '', item.img || '/da.jpg']
          );
        }
      }
      return NextResponse.json({ success: true });
    }

    // ----- ADD ITEM -----
    if (action === "addItem") {
      const { categoryId, newItem } = data;
      const [[maxRow]] = await pool.query(
        "SELECT MAX(id) as maxId FROM items WHERE category_id = ?",
        [categoryId]
      );
      const newId = (maxRow?.maxId || 0) + 1;
      newItem.id = newId;

      await pool.query(
        "INSERT INTO items (id, category_id, name, description, img) VALUES (?, ?, ?, ?, ?)",
        [newId, categoryId, newItem.name, newItem.description || '', newItem.img || '/da.jpg']
      );

      await pool.query(
        "INSERT INTO prices (item_id, price) VALUES (?, ?)",
        [newId, "0"]
      );

      return NextResponse.json({ success: true, newId });
    }

    // ----- UPDATE ITEM -----
    if (action === "updateItem") {
      const { categoryId, itemId, updatedItem } = data;
      await pool.query(
        `UPDATE items SET 
          name = COALESCE(?, name),
          description = COALESCE(?, description),
          img = COALESCE(?, img)
        WHERE id = ? AND category_id = ?`,
        [updatedItem.name, updatedItem.description, updatedItem.img, itemId, categoryId]
      );
      return NextResponse.json({ success: true });
    }

    // ----- DELETE ITEM -----
    if (action === "deleteItem") {
      const { categoryId, itemId } = data;
      await pool.query("DELETE FROM items WHERE id = ? AND category_id = ?", [itemId, categoryId]);
      await pool.query("DELETE FROM prices WHERE item_id = ?", [itemId]);
      return NextResponse.json({ success: true });
    }

    // ----- ADD CATEGORY -----
    if (action === "addCategory") {
      const { newCategory } = data;
      const [[maxRow]] = await pool.query("SELECT MAX(id) as maxId FROM categories");
      const newId = (maxRow?.maxId || 0) + 1;
      await pool.query(
        "INSERT INTO categories (id, name, icon) VALUES (?, ?, ?)",
        [newId, newCategory.name, newCategory.icon || 'CiCoffeeCup']
      );
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}