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

  // Create table if it doesn't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS components (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      quantity INTEGER DEFAULT 0,
      price REAL NOT NULL,
      description_en TEXT,
      description_es TEXT
    );
  `);

  // Seed data if table is empty
  const countRow = await db.get('SELECT COUNT(*) as count FROM components');
  if (countRow.count === 0) {
    const seedData = [
      { name: 'AMD Ryzen 9 7950X3D', category: 'CPU', quantity: 15, price: 699.99, desc_en: '16-core, 32-thread flagship gaming processor.', desc_es: 'Procesador insignia para juegos de 16 núcleos y 32 hilos.' },
      { name: 'Intel Core i9-13900K', category: 'CPU', quantity: 12, price: 589.99, desc_en: '24-core desktop processor.', desc_es: 'Procesador de sobremesa de 24 núcleos.' },
      { name: 'NVIDIA GeForce RTX 4090 Founders Edition', category: 'GPU', quantity: 5, price: 1599.99, desc_en: 'Top-tier graphics card for 4K gaming.', desc_es: 'Tarjeta gráfica de gama alta para juegos 4K.' },
      { name: 'ASUS ROG Strix GeForce RTX 4080', category: 'GPU', quantity: 8, price: 1199.99, desc_en: 'High-performance OC edition GPU.', desc_es: 'GPU edición OC de alto rendimiento.' },
      { name: 'Corsair Vengeance RGB Pro 32GB (2x16GB) DDR4', category: 'RAM', quantity: 24, price: 89.99, desc_en: '3200MHz C16 desktop memory.', desc_es: 'Memoria de escritorio 3200MHz C16.' },
      { name: 'G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5', category: 'RAM', quantity: 18, price: 129.99, desc_en: '6000MHz CL36 high-speed memory.', desc_es: 'Memoria de alta velocidad 6000MHz CL36.' },
      { name: 'Samsung 990 PRO 2TB PCIe 4.0 NVMe', category: 'Storage', quantity: 30, price: 169.99, desc_en: 'Ultra-fast M.2 SSD up to 7450 MB/s.', desc_es: 'SSD M.2 ultra rápido de hasta 7450 MB/s.' },
      { name: 'Western Digital WD Black SN850X 1TB', category: 'Storage', quantity: 45, price: 84.99, desc_en: 'High-end gaming NVMe SSD.', desc_es: 'SSD NVMe para juegos de gama alta.' },
      { name: 'MSI MAG B650 TOMAHAWK WIFI', category: 'Motherboard', quantity: 10, price: 219.99, desc_en: 'AM5 ATX motherboard.', desc_es: 'Placa base AM5 ATX.' },
      { name: 'Corsair RM850x 850W 80 Plus Gold', category: 'PSU', quantity: 20, price: 134.99, desc_en: 'Fully modular ATX power supply.', desc_es: 'Fuente de alimentación ATX totalmente modular.' }
    ];

    const stmt = await db.prepare('INSERT INTO components (name, category, quantity, price, description_en, description_es) VALUES (?, ?, ?, ?, ?, ?)');
    for (const item of seedData) {
      await stmt.run([item.name, item.category, item.quantity, item.price, item.desc_en, item.desc_es]);
    }
    await stmt.finalize();
    console.log('Database seeded with 10 real PC components.');
  }

  return db;
}

module.exports = { getDbConnection };
