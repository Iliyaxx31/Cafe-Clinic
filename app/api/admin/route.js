import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { writeFileSafe } from "@/app/lib/fileLock";  // SADECE BUNU EKLE

export async function POST(request) {
  try {
    const { action, data } = await request.json();

    const authCookie = request.cookies.get("admin_auth");
    if (!authCookie || authCookie.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jsonDir = path.join(process.cwd(), "app/json");

    if (action === "getData") {
      const dataFile = await fs.readFile(
        path.join(jsonDir, "data.json"),
        "utf-8",
      );
      const priceFile = await fs.readFile(
        path.join(jsonDir, "price.json"),
        "utf-8",
      );
      return NextResponse.json({
        data: JSON.parse(dataFile),
        prices: JSON.parse(priceFile),
      });
    }

    if (action === "updatePrices") {
      // SADECE BURASI DEĞİŞTİ - writeFileSafe kullan
      await writeFileSafe(path.join(jsonDir, "price.json"), data.prices);
      return NextResponse.json({ success: true });
    }

    if (action === "updateData") {
      // SADECE BURASI DEĞİŞTİ - writeFileSafe kullan
      await writeFileSafe(path.join(jsonDir, "data.json"), data.data);
      return NextResponse.json({ success: true });
    }

    if (action === "addItem") {
      const { categoryId, newItem } = data;
      const currentData = JSON.parse(
        await fs.readFile(path.join(jsonDir, "data.json"), "utf-8"),
      );

      let maxId = 0;
      currentData.categories.forEach((cat) => {
        cat.items.forEach((item) => {
          if (item.id > maxId) maxId = item.id;
        });
      });
      newItem.id = maxId + 1;

      const category = currentData.categories.find((c) => c.id === categoryId);
      if (!category) {
        return NextResponse.json(
          { error: "Kategori bulunamadı" },
          { status: 400 },
        );
      }

      category.items.push(newItem);

      // BURASI DEĞİŞTİ - writeFileSafe kullan
      await writeFileSafe(path.join(jsonDir, "data.json"), currentData);

      const prices = JSON.parse(
        await fs.readFile(path.join(jsonDir, "price.json"), "utf-8"),
      );
      prices[newItem.id] = "0";
      // BURASI DEĞİŞTİ - writeFileSafe kullan
      await writeFileSafe(path.join(jsonDir, "price.json"), prices);

      return NextResponse.json({ success: true, newId: newItem.id });
    }

    if (action === "updateItem") {
      const { categoryId, itemId, updatedItem } = data;
      let currentData = JSON.parse(
        await fs.readFile(path.join(jsonDir, "data.json"), "utf-8"),
      );

      const category = currentData.categories.find((c) => c.id === categoryId);
      if (!category) {
        return NextResponse.json(
          { error: "Kategori bulunamadı" },
          { status: 400 },
        );
      }

      const itemIndex = category.items.findIndex((i) => i.id === itemId);
      if (itemIndex === -1) {
        return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 400 });
      }

      category.items[itemIndex] = {
        ...category.items[itemIndex],
        ...updatedItem,
      };

      // BURASI DEĞİŞTİ - writeFileSafe kullan
      await writeFileSafe(path.join(jsonDir, "data.json"), currentData);
      return NextResponse.json({ success: true });
    }

    if (action === "deleteItem") {
      const { categoryId, itemId } = data;
      const currentData = JSON.parse(
        await fs.readFile(path.join(jsonDir, "data.json"), "utf-8"),
      );

      const category = currentData.categories.find((c) => c.id === categoryId);
      category.items = category.items.filter((i) => i.id !== itemId);

      // BURASI DEĞİŞTİ - writeFileSafe kullan
      await writeFileSafe(path.join(jsonDir, "data.json"), currentData);

      const prices = JSON.parse(
        await fs.readFile(path.join(jsonDir, "price.json"), "utf-8"),
      );
      delete prices[itemId];
      // BURASI DEĞİŞTİ - writeFileSafe kullan
      await writeFileSafe(path.join(jsonDir, "price.json"), prices);

      return NextResponse.json({ success: true });
    }

    if (action === "addCategory") {
      const { newCategory } = data;
      const currentData = JSON.parse(
        await fs.readFile(path.join(jsonDir, "data.json"), "utf-8"),
      );

      const maxCatId = Math.max(...currentData.categories.map((c) => c.id), 0);
      newCategory.id = maxCatId + 1;
      newCategory.items = [];

      currentData.categories.push(newCategory);
      // BURASI DEĞİŞTİ - writeFileSafe kullan
      await writeFileSafe(path.join(jsonDir, "data.json"), currentData);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}