import mysql from 'mysql2/promise';
import { promises as fs } from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

async function migrate() {
  let connection;
  try {
    console.log('🔄 Migration başlıyor...');
    console.log('📡 Bağlantı bilgileri:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
      password: dbConfig.password ? '****' : 'yok'
    });
    
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Veritabanına bağlanıldı.');
    
    // 1. Kategorileri ve ürünleri aktar
    const dataPath = path.join(process.cwd(), 'app/json/data.json');
    console.log('📂 Okunuyor:', dataPath);
    const dataFile = await fs.readFile(dataPath, 'utf-8');
    const { categories } = JSON.parse(dataFile);
    console.log(`📦 ${categories.length} kategori bulundu.`);
    
    for (const cat of categories) {
      // Kategori ekle
      await connection.query(
        "INSERT INTO categories (id, name, icon) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name = ?, icon = ?",
        [cat.id, cat.name, cat.icon || 'CiCoffeeCup', cat.name, cat.icon || 'CiCoffeeCup']
      );
      
      // Ürünleri ekle
      for (const item of cat.items) {
        await connection.query(
          "INSERT INTO items (id, category_id, name, description, img) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = ?, description = ?, img = ?",
          [item.id, cat.id, item.name, item.description || '', item.img || '/da.jpg', item.name, item.description || '', item.img || '/da.jpg']
        );
      }
      console.log(`✅ Kategori: ${cat.name} (${cat.items.length} ürün) eklendi`);
    }
    
    // 2. Fiyatları aktar
    const pricePath = path.join(process.cwd(), 'app/json/price.json');
    const priceFile = await fs.readFile(pricePath, 'utf-8');
    const prices = JSON.parse(priceFile);
    
    for (const [itemId, price] of Object.entries(prices)) {
      await connection.query(
        "INSERT INTO prices (item_id, price) VALUES (?, ?) ON DUPLICATE KEY UPDATE price = ?",
        [parseInt(itemId), price, price]
      );
    }
    console.log(`✅ ${Object.keys(prices).length} fiyat eklendi`);
    
    // 3. Siparişleri aktar (varsa)
    try {
      const ordersPath = path.join(process.cwd(), 'app/json/orders.json');
      const ordersFile = await fs.readFile(ordersPath, 'utf-8');
      const orders = JSON.parse(ordersFile);
      
      for (const order of orders) {
        await connection.query(
          `INSERT INTO orders (order_id, items, total, customer_name, customer_phone, customer_address, note, status, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE status = ?, note = ?`,
          [
            order.id,
            JSON.stringify(order.items),
            order.total,
            order.customerName,
            order.customerPhone,
            order.customerAddress,
            order.note || null,
            order.status,
            order.createdAt,
            order.status,
            order.note || null
          ]
        );
      }
      console.log(`✅ ${orders.length} sipariş eklendi`);
    } catch (err) {
      console.log('⚠️ Sipariş dosyası bulunamadı veya boş, atlanıyor.');
    }
    
    console.log('🎉 Migration tamamlandı!');
    
  } catch (error) {
    console.error('❌ Migration hatası:', error.message);
    console.error('🔍 Detay:', error);
  } finally {
    if (connection) await connection.end();
  }
}

migrate();