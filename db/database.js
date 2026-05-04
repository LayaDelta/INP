const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

const dbPath = path.resolve(__dirname, 'inventory.db');

async function getDbConnection() {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Enable foreign keys
  await db.exec('PRAGMA foreign_keys = ON;');

  // Create components table if it doesn't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS components (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      quantity INTEGER DEFAULT 0,
      price REAL NOT NULL,
      description TEXT
    );
  `);

  // Create users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user'
    );
  `);


  // Seed data if table is empty
  const countRow = await db.get('SELECT COUNT(*) as count FROM components');
  if (countRow.count === 0) {
    const seedData = [
      { name: 'AMD Ryzen 9 7950X3D', category: 'CPU', quantity: 15, price: 699.99, description: '16-core, 32-thread flagship gaming processor.' },
      { name: 'Intel Core i9-13900K', category: 'CPU', quantity: 12, price: 589.99, description: '24-core desktop processor.' },
      { name: 'NVIDIA GeForce RTX 4090 Founders Edition', category: 'GPU', quantity: 5, price: 1599.99, description: 'Top-tier graphics card for 4K gaming.' },
      { name: 'ASUS ROG Strix GeForce RTX 4080', category: 'GPU', quantity: 8, price: 1199.99, description: 'High-performance OC edition GPU.' },
      { name: 'Corsair Vengeance RGB Pro 32GB (2x16GB) DDR4', category: 'RAM', quantity: 24, price: 89.99, description: '3200MHz C16 desktop memory.' },
      { name: 'G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5', category: 'RAM', quantity: 18, price: 129.99, description: '6000MHz CL36 high-speed memory.' },
      { name: 'Samsung 990 PRO 2TB PCIe 4.0 NVMe', category: 'Storage', quantity: 30, price: 169.99, description: 'Ultra-fast M.2 SSD up to 7450 MB/s.' },
      { name: 'Western Digital WD Black SN850X 1TB', category: 'Storage', quantity: 45, price: 84.99, description: 'High-end gaming NVMe SSD.' },
      { name: 'MSI MAG B650 TOMAHAWK WIFI', category: 'Motherboard', quantity: 10, price: 219.99, description: 'AM5 ATX motherboard.' },
      { name: 'Corsair RM850x 850W 80 Plus Gold', category: 'PSU', quantity: 20, price: 134.99, description: 'Fully modular ATX power supply.' }
    ];

    const stmt = await db.prepare('INSERT INTO components (name, category, quantity, price, description) VALUES (?, ?, ?, ?, ?)');
    for (const item of seedData) {
      await stmt.run([item.name, item.category, item.quantity, item.price, item.description]);
    }
    await stmt.finalize();
    console.log('Database seeded with 10 real PC components.');
  }

  // Seed default admin
  const countUsers = await db.get('SELECT COUNT(*) as count FROM users');
  if (countUsers.count === 0) {
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    await db.run(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      ['admin', 'admin@inp.com', hashedPassword, 'admin']
    );
    console.log('Admin user seeded (admin@inp.com / admin123).');
  }

  return db;
}

module.exports = { getDbConnection };
