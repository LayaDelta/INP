const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

const dbPath = path.resolve(__dirname, 'inventory_v2.db');

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
      // CPUs
      { name: 'AMD Ryzen 9 7950X3D', category: 'CPU', quantity: 15, price: 699.99, desc_en: '16-core, 32-thread flagship gaming processor.', desc_es: 'Procesador insignia de 16 núcleos y 32 hilos para juegos.' },
      { name: 'Intel Core i9-14900K', category: 'CPU', quantity: 12, price: 589.99, desc_en: '24-core flagship desktop processor with 6GHz boost.', desc_es: 'Procesador insignia de 24 núcleos con boost de hasta 6GHz.' },
      { name: 'AMD Ryzen 7 7800X3D', category: 'CPU', quantity: 22, price: 449.99, desc_en: 'The world\'s fastest gaming CPU with 3D V-Cache.', desc_es: 'La CPU para juegos más rápida del mundo con 3D V-Cache.' },
      
      // GPUs
      { name: 'NVIDIA RTX 4090 Founders Edition', category: 'GPU', quantity: 5, price: 1599.99, desc_en: 'Ultimate 4K ray-tracing performance.', desc_es: 'El máximo rendimiento en Ray Tracing para 4K.' },
      { name: 'ASUS ROG Strix RTX 4080 Super', category: 'GPU', quantity: 8, price: 1199.99, desc_en: 'High-performance OC edition with massive triple fans.', desc_es: 'Edición OC de alto rendimiento con giga-ventiladores triples.' },
      { name: 'AMD Radeon RX 7900 XTX', category: 'GPU', quantity: 10, price: 929.99, desc_en: 'Powerhouse GPU with 24GB VRAM.', desc_es: 'Potente GPU con 24GB de memoria VRAM.' },
      
      // RAM
      { name: 'Corsair Vengeance RGB 32GB DDR5-6000', category: 'RAM', quantity: 30, price: 119.99, desc_en: 'High-speed DDR5 memory with customized RGB lightning.', desc_es: 'Memoria DDR5 de alta velocidad con iluminación RGB personalizable.' },
      { name: 'G.Skill Trident Z5 RGB 64GB DDR5', category: 'RAM', quantity: 15, price: 219.99, desc_en: 'Premium ultra-low latency RAM for professionals.', desc_es: 'RAM de latencia ultra baja premium para profesionales.' },
      { name: 'Kingston FURY Beast 16GB DDR4', category: 'RAM', quantity: 50, price: 45.99, desc_en: 'Reliable DDR4 performance for budget builds.', desc_es: 'Rendimiento DDR4 confiable para ensambles económicos.' },
      
      // Storage
      { name: 'Samsung 990 PRO 2TB NVMe', category: 'Storage', quantity: 40, price: 179.99, desc_en: 'Industry-leading Gen4 speed up to 7450MB/s.', desc_es: 'Velocidad Gen4 líder en la industria de hasta 7450MB/s.' },
      { name: 'Crucial T700 1TB PCIe 5.0', category: 'Storage', quantity: 12, price: 169.99, desc_en: 'Next-gen PCIe 5.0 speed, reaching 11,700MB/s.', desc_es: 'Velocidad PCIe 5.0 de próxima generación, alcanza 11,700MB/s.' },
      { name: 'Seagate IronWolf 8TB NAS HDD', category: 'Storage', quantity: 20, price: 189.99, desc_en: 'Built for 24/7 reliability in NAS systems.', desc_es: 'Construido para fiabilidad 24/7 en sistemas NAS.' },
      
      // Motherboards
      { name: 'MSI MAG B650 TOMAHAWK WIFI', category: 'Motherboard', quantity: 25, price: 219.99, desc_en: 'Solid AM5 board with great VRM cooling.', desc_es: 'Placa AM5 sólida con excelente enfriamiento de VRM.' },
      { name: 'ASUS ROG MAXIMUS Z790 HERO', category: 'Motherboard', quantity: 7, price: 629.99, desc_en: 'Extreme overclocking board for Intel 14th gen.', desc_es: 'Placa de overclocking extremo para Intel de 14ª gen.' },
      
      // PSUs
      { name: 'Corsair RM850x Gold Modular', category: 'PSU', quantity: 35, price: 129.99, desc_en: 'Silent, efficient 850W power for gaming rigs.', desc_es: 'Energía silenciosa y eficiente de 850W para juegos.' },
      { name: 'EVGA SuperNOVA 1000 G7', category: 'PSU', quantity: 15, price: 189.99, desc_en: 'Compact 1000W 80 PLUS Gold efficiency.', desc_es: 'Eficiencia 1000W 80 PLUS Gold muy compacta.' },
      
      // Cases
      { name: 'Lian Li O11 Dynamic EVO', category: 'Case', quantity: 18, price: 169.99, desc_en: 'Dual-chamber design for stunning aesthetics.', desc_es: 'Diseño de doble cámara para una estética impresionante.' },
      { name: 'NZXT H9 Flow White', category: 'Case', quantity: 10, price: 159.99, desc_en: 'Panoramic view with high airflow for cool systems.', desc_es: 'Vista panorámica con alto flujo de aire para sistemas frescos.' },
      
      // Cooling
      { name: 'NZXT Kraken Elite 360 RGB', category: 'Cooler', quantity: 15, price: 279.99, desc_en: 'AIO Liquid cooler with customizable LCD display.', desc_es: 'Enfriamiento líquido AIO con pantalla LCD personalizable.' },
      { name: 'Noctua NH-D15 chromax.black', category: 'Cooler', quantity: 25, price: 119.95, desc_en: 'The king of air coolers, silent and powerful.', desc_es: 'El rey de los disipadores de aire, silencioso y potente.' },
      
      // Others/Peripherals
      { name: 'Logitech G Pro X Superlight 2', category: 'Other', quantity: 20, price: 159.00, desc_en: 'Professional wireless gaming mouse, ultra lightweight.', desc_es: 'Mouse inalámbrico para juegos profesional, ultra ligero.' },
      { name: 'Razer Huntsman V3 Pro', category: 'Other', quantity: 15, price: 249.99, desc_en: 'Keyboard with analog optical switches for rapid response.', desc_es: 'Teclado con switches ópticos analógicos para respuesta rápida.' },
      { name: 'SteelSeries Arctis Nova Pro', category: 'Other', quantity: 12, price: 349.99, desc_en: 'Premium gaming headset with active noise cancellation.', desc_es: 'Auriculares premium con cancelación de ruido activa.' },
      { name: 'ASUS ROG Swift 27" 1440p 240Hz', category: 'Other', quantity: 8, price: 699.00, desc_en: 'Ultra-fast OLED gaming monitor.', desc_es: 'Monitor para juegos OLED ultra rápido.' },
      { name: 'Elgato Stream Deck MK.2', category: 'Other', quantity: 25, price: 149.99, desc_en: '15 customizable LCD keys for streaming.', desc_es: '15 teclas LCD personalizables para streaming.' }
    ];

    const stmt = await db.prepare('INSERT INTO components (name, category, quantity, price, description_en, description_es) VALUES (?, ?, ?, ?, ?, ?)');
    for (const item of seedData) {
      await stmt.run([item.name, item.category, item.quantity, item.price, item.desc_en, item.desc_es]);
    }
    await stmt.finalize();
    console.log('Database seeded with 25 premium PC components.');
  }

  return db;
}

module.exports = { getDbConnection };
