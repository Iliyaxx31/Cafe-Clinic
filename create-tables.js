import pool from './app/lib/db.js';

const queries = `
CREATE TABLE IF NOT EXISTS categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50) DEFAULT 'CiCoffeeCup'
);

CREATE TABLE IF NOT EXISTS items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  img VARCHAR(200) DEFAULT '/da.jpg',
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS prices (
  item_id INT PRIMARY KEY,
  price VARCHAR(20) DEFAULT '0',
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT UNIQUE,
  items JSON NOT NULL,
  total INT,
  customer_name VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_address TEXT NOT NULL,
  note TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

async function createTables() {
  try {
    await pool.query(queries);
    console.log('✅ Tablolar başarıyla oluşturuldu');
  } catch (error) {
    console.error('❌ Hata:', error.message);
  }
  process.exit();
}

createTables();