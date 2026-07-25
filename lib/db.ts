import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { hashPassword, verifyPassword } from './auth';

let dbInstance: Database | null = null;
const dbDir = path.join(process.cwd(), 'database');
const dbFilePath = path.join(dbDir, 'aurelia.db');

function saveDatabase(db: Database) {
  try {
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbFilePath, buffer);
  } catch (err) {
    console.error('Failed to save SQLite database to disk:', err);
  }
}

export async function getDb(): Promise<Database> {
  if (dbInstance) return dbInstance;

  const init = typeof initSqlJs === 'function' ? initSqlJs : (initSqlJs as any).default || initSqlJs;
  let wasmBinary: Buffer | undefined;

  try {
    const wasmPath = path.join(process.cwd(), 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm');
    if (fs.existsSync(wasmPath)) {
      wasmBinary = fs.readFileSync(wasmPath);
    }
  } catch (e) {
    console.error('Failed to read sql-wasm.wasm:', e);
  }

  const SQL = await init({
    locateFile: (file: string) => path.join(process.cwd(), 'node_modules', 'sql.js', 'dist', file),
    ...(wasmBinary ? { wasmBinary } : {})
  });

  let db: Database;
  if (fs.existsSync(dbFilePath)) {
    try {
      const fileBuffer = fs.readFileSync(dbFilePath);
      if (fileBuffer && fileBuffer.length > 0) {
        db = new SQL.Database(fileBuffer);
      } else {
        db = new SQL.Database();
      }
    } catch (err) {
      console.error('Error reading existing database file, creating fresh DB:', err);
      db = new SQL.Database();
    }
  } else {
    db = new SQL.Database();
  }

  dbInstance = db;

  // Create Tables
  db.run(`
    CREATE TABLE IF NOT EXISTS restaurant (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      tagline TEXT,
      description TEXT,
      chef_name TEXT,
      address TEXT,
      phone TEXT,
      whatsapp TEXT,
      opening_hours TEXT,
      logo_url TEXT,
      hero_image_url TEXT,
      instagram_url TEXT,
      facebook_url TEXT,
      map_latitude TEXT,
      map_longitude TEXT,
      map_embed_url TEXT
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      display_order INTEGER DEFAULT 0,
      icon TEXT
    );

    CREATE TABLE IF NOT EXISTS menu_items (
      id TEXT PRIMARY KEY,
      category_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      image TEXT,
      ingredients TEXT,
      allergens TEXT,
      tags TEXT,
      spice_level INTEGER DEFAULT 0,
      available INTEGER DEFAULT 1,
      wine_pairing TEXT,
      calories INTEGER,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS promotions (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subtitle TEXT,
      description TEXT,
      image TEXT,
      discount_tag TEXT,
      active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS gallery (
      id TEXT PRIMARY KEY,
      image TEXT NOT NULL,
      caption TEXT,
      category TEXT DEFAULT 'Culinary'
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      rating INTEGER DEFAULT 5,
      comment TEXT NOT NULL,
      date TEXT NOT NULL,
      verified INTEGER DEFAULT 1,
      avatar TEXT
    );

    CREATE TABLE IF NOT EXISTS reservations (
      id TEXT PRIMARY KEY,
      guest_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      guests INTEGER NOT NULL,
      seating_area TEXT,
      special_requests TEXT,
      status TEXT DEFAULT 'Confirmed',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS table_orders (
      id TEXT PRIMARY KEY,
      table_number TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      items TEXT NOT NULL,
      total_amount REAL NOT NULL,
      status TEXT DEFAULT 'Pending',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS server_calls (
      id TEXT PRIMARY KEY,
      table_number TEXT NOT NULL,
      request_type TEXT NOT NULL,
      status TEXT DEFAULT 'Pending',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS uploaded_images (
      id TEXT PRIMARY KEY,
      filename TEXT,
      mime_type TEXT,
      data_url TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      name TEXT,
      role TEXT DEFAULT 'admin',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS support_tickets (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'Pending',
      admin_reply TEXT,
      replied_at TEXT,
      created_at TEXT NOT NULL
    );
  `);

  // Add status column to reservations if missing
  try {
    db.run("ALTER TABLE reservations ADD COLUMN status TEXT DEFAULT 'Confirmed'");
  } catch (e) {
    // column already exists
  }

  // Add map columns to restaurant if missing
  try {
    db.run("ALTER TABLE restaurant ADD COLUMN map_latitude TEXT DEFAULT '51.5074'");
  } catch (e) {}
  try {
    db.run("ALTER TABLE restaurant ADD COLUMN map_longitude TEXT DEFAULT '-0.1278'");
  } catch (e) {}
  try {
    db.run("ALTER TABLE restaurant ADD COLUMN map_embed_url TEXT DEFAULT ''");
  } catch (e) {}

  // Seed default admin user if missing
  try {
    const adminCheck = db.exec("SELECT COUNT(*) as count FROM admin_users");
    const adminCount = adminCheck[0]?.values[0]?.[0] as number;
    if (adminCount === 0) {
      const defaultCreds = hashPassword('aurelia2026');
      db.run(
        `INSERT INTO admin_users (id, username, password_hash, salt, name, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['admin_1', 'admin', defaultCreds.hash, defaultCreds.salt, 'Executive Manager', 'admin', new Date().toISOString()]
      );
    }
  } catch (e) {
    console.error('Failed to initialize admin_users:', e);
  }

  // Check if Restaurant table has data, if not seed initial data
  const restCheck = db.exec("SELECT COUNT(*) as count FROM restaurant");
  const count = restCheck[0]?.values[0]?.[0] as number;

  if (count === 0) {
    seedInitialData(db);
  }

  saveDatabase(dbInstance);
  return dbInstance;
}

function seedInitialData(db: Database) {
  // 1. Restaurant
  db.run(`
    INSERT INTO restaurant (
      id, name, tagline, description, chef_name, address, phone, whatsapp, opening_hours, logo_url, hero_image_url, instagram_url, facebook_url, map_latitude, map_longitude, map_embed_url
    ) VALUES (
      'rest_1',
      'AURELIA',
      'Where Mediterranean Elegance Meets Haute Cuisine',
      'Founded by Executive Chef Gabriel Laurent, Aurelia represents a culinary sanctuary celebrating coastal European gastronomy. Sourcing wild-caught Atlantic seafood, Périgord black truffles, and hand-picked organic botanicals, every plate is an intimate dialogue between nature and culinary precision.',
      'Chef Gabriel Laurent (3-Star Michelin Pedigree)',
      '450 Grand Avenue, Mayfair, London W1K 2HP',
      '+44 20 7946 0912',
      '+447946091200',
      'Mon - Sun: 17:30 - 23:30 | Weekend Lunch: 12:00 - 15:30',
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&auto=format&fit=crop&q=80',
      'https://instagram.com/aurelia.dining',
      'https://facebook.com/aureliadining',
      '51.5074',
      '-0.1278',
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.003926955776!2d-0.1441866!3d51.507402!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604d49fb42781%3A0xed492e8c894bf298!2sMayfair%2C%20London!5e0!3m2!1sen!2suk!4v1700000000000!5m2!1sen!2suk'
    );
  `);

  // 2. Categories
  const categories = [
    { id: 'cat_starters', name: 'Starters & Raw Bar', display_order: 1, icon: 'UtensilsCrossed' },
    { id: 'cat_pasta', name: 'Artisanal Hand-Rolled Pasta', display_order: 2, icon: 'Wheat' },
    { id: 'cat_grill', name: 'Prime Charcoal Grill', display_order: 3, icon: 'Flame' },
    { id: 'cat_seafood', name: 'Seafood & Wild Catch', display_order: 4, icon: 'Fish' },
    { id: 'cat_desserts', name: 'Decadent Desserts', display_order: 5, icon: 'Cake' },
    { id: 'cat_beverages', name: 'Cellar Reserve & Cocktails', display_order: 6, icon: 'Wine' }
  ];

  for (const c of categories) {
    db.run(
      `INSERT INTO categories (id, name, display_order, icon) VALUES (?, ?, ?, ?)`,
      [c.id, c.name, c.display_order, c.icon]
    );
  }

  // 3. Menu Items
  const menuItems = [
    {
      id: 'item_1',
      category_id: 'cat_starters',
      name: 'Royal Osetra Caviar & Scallop Crudo',
      description: 'Thinly sliced Hokkaido scallops, Golden Osetra caviar, chive blossom infusion, smoked crème fraîche, brioche tuile.',
      price: 68,
      image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80',
      ingredients: 'Hokkaido Scallops, Royal Osetra Caviar, Chive Oil, Smoked Crème Fraîche, Golden Chive Flowers',
      allergens: 'Seafood, Dairy, Gluten',
      tags: 'Chef Choice,Bestseller,Raw Bar',
      spice_level: 0,
      available: 1,
      wine_pairing: 'Dom Pérignon Vintage 2013 Champagne',
      calories: 320
    },
    {
      id: 'item_2',
      category_id: 'cat_starters',
      name: 'Pugliese Smoked Burrata & Heirloom Peach',
      description: 'Handcrafted burrata, compressed white peach, 25-year aged Modena balsamic emulsion, toasted pine nuts, Thai basil oil.',
      price: 32,
      image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb12765?w=800&auto=format&fit=crop&q=80',
      ingredients: 'Artisanal Burrata, Organic White Peaches, Modena Balsamic, Pine Nuts, Fresh Thai Basil',
      allergens: 'Dairy, Nuts',
      tags: 'Vegetarian,Gluten-Free,Fresh',
      spice_level: 0,
      available: 1,
      wine_pairing: 'Sancerre Blanc, Domaine Vacheron 2022',
      calories: 410
    },
    {
      id: 'item_3',
      category_id: 'cat_pasta',
      name: 'Périgord Black Truffle Tagliolini',
      description: 'House-extruded 40-egg yolk pasta, 36-month Parmigiano-Reggiano emulsion, fresh shaved Périgord black truffles.',
      price: 54,
      image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6288339?w=800&auto=format&fit=crop&q=80',
      ingredients: 'Organic Flour, Egg Yolks, Cultured Normandy Butter, 36m Parmigiano, Fresh Périgord Truffle',
      allergens: 'Gluten, Egg, Dairy',
      tags: 'Chef Choice,Bestseller,Signature',
      spice_level: 0,
      available: 1,
      wine_pairing: 'Barolo DOCG, Pio Cesare 2018',
      calories: 580
    },
    {
      id: 'item_4',
      category_id: 'cat_pasta',
      name: 'Wild Blue Lobster Agnolotti',
      description: 'Hand-folded pasta filled with Maine blue lobster mousse, roasted sweet cornbread bisque, tarragon oil, crispy coral chips.',
      price: 62,
      image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80',
      ingredients: 'Wild Blue Lobster, Sweet Corn, Tarragon, Egg Pasta, Shellfish Cognac Velouté',
      allergens: 'Shellfish, Gluten, Dairy, Egg',
      tags: 'New,Seasonal',
      spice_level: 0,
      available: 1,
      wine_pairing: 'Meursault 1er Cru, Louis Jadot 2020',
      calories: 510
    },
    {
      id: 'item_5',
      category_id: 'cat_grill',
      name: 'Dry-Aged A5 Miyazaki Wagyu Ribcap (8oz)',
      description: 'Seared over Japanese Binchotan charcoal, roasted bone marrow reduction, caramelized sunchoke purée, fleur de sel.',
      price: 148,
      image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&auto=format&fit=crop&q=80',
      ingredients: 'A5 Miyazaki Wagyu, Roasted Bone Marrow, Sunchoke, Fermented Garlic Butter, Smoked Salt',
      allergens: 'Dairy',
      tags: 'Chef Choice,Bestseller,Gluten-Free,Prime',
      spice_level: 0,
      available: 1,
      wine_pairing: 'Château Margaux 1er Grand Cru Classé 2012',
      calories: 780
    },
    {
      id: 'item_6',
      category_id: 'cat_seafood',
      name: 'Line-Caught Mediterranean Turbot',
      description: 'Pan-roasted wild turbot, braised baby fennel, trout roe velvet, saffron-infused lobster reductions, crispy samphire.',
      price: 78,
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80',
      ingredients: 'Wild Atlantic Turbot, Spanish Saffron, Baby Fennel, Trout Roe, French Butter',
      allergens: 'Fish, Dairy',
      tags: 'Gluten-Free,Seasonal',
      spice_level: 0,
      available: 1,
      wine_pairing: 'Puligny-Montrachet, Etienne Sauzet 2021',
      calories: 460
    },
    {
      id: 'item_7',
      category_id: 'cat_desserts',
      name: '24K Gold Valrhona Guanaja Chocolate Sphere',
      description: 'Dark 70% chocolate shell wrapped in edible 24k gold leaf, filled with passionfruit curd, hazelnut praline, poured warm salted caramel.',
      price: 34,
      image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?w=800&auto=format&fit=crop&q=80',
      ingredients: 'Valrhona 70% Guanaja Chocolate, Passionfruit, Piedmont Hazelnuts, Brittany Salted Caramel, Edible Gold Leaf',
      allergens: 'Dairy, Nuts, Egg',
      tags: 'Bestseller,Signature',
      spice_level: 0,
      available: 1,
      wine_pairing: 'Château d’Yquem Sauternes 2015',
      calories: 520
    },
    {
      id: 'item_8',
      category_id: 'cat_beverages',
      name: 'Aurelia Reserve Smoked Old Fashioned',
      description: 'WhistlePig 15-Year Rye, Madagascar vanilla bean reduction, Angostura & orange bitters, smoked with applewood inside crystal decanter.',
      price: 32,
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&auto=format&fit=crop&q=80',
      ingredients: 'WhistlePig 15yr Rye Whisky, Organic Madagascar Vanilla, Aromatic Bitters, Applewood Smoke',
      allergens: 'None',
      tags: 'Signature,Bestseller',
      spice_level: 0,
      available: 1,
      wine_pairing: 'Perfect digestif post-dinner',
      calories: 210
    }
  ];

  for (const item of menuItems) {
    db.run(
      `INSERT INTO menu_items (
        id, category_id, name, description, price, image, ingredients, allergens, tags, spice_level, available, wine_pairing, calories
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        item.id,
        item.category_id,
        item.name,
        item.description,
        item.price,
        item.image,
        item.ingredients,
        item.allergens,
        item.tags,
        item.spice_level,
        item.available,
        item.wine_pairing,
        item.calories
      ]
    );
  }

  // 4. Promotions
  const promotions = [
    {
      id: 'promo_1',
      title: 'Grand Chef 7-Course Culinary Voyage',
      subtitle: 'An Unforgettable Gastronomic Journey',
      description: 'Experience Executive Chef Gabriel Laurent’s signature tasting menu, featuring Royal Osetra Caviar, A5 Wagyu Ribcap, Périgord Black Truffle Tagliolini, and Sommelier cellar pairings.',
      image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1200&auto=format&fit=crop&q=80',
      discount_tag: 'Seasonal Special',
      active: 1
    },
    {
      id: 'promo_2',
      title: 'Golden Sunset & Aperitivo Hour',
      subtitle: 'Complimentary Artisanal Amuse-Bouche',
      description: 'Join us on our garden terrace between 17:30 and 18:30 daily. Receive a hand-crafted chef amuse-bouche with every signature reserve cocktail or champagne glass.',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&auto=format&fit=crop&q=80',
      discount_tag: 'Daily 17:30 - 18:30',
      active: 1
    }
  ];

  for (const p of promotions) {
    db.run(
      `INSERT INTO promotions (id, title, subtitle, description, image, discount_tag, active) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [p.id, p.title, p.subtitle, p.description, p.image, p.discount_tag, p.active]
    );
  }

  // 5. Gallery
  const gallery = [
    { id: 'gal_1', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&auto=format&fit=crop&q=80', caption: 'The Grand Dining Room Ambient Lighting', category: 'Atmosphere' },
    { id: 'gal_2', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop&q=80', caption: 'A5 Miyazaki Wagyu Binchotan Flame Sear', category: 'Culinary' },
    { id: 'gal_3', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1000&auto=format&fit=crop&q=80', caption: 'The Sommelier Private Reserve Wine Cellar', category: 'Wine & Bar' },
    { id: 'gal_4', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1000&auto=format&fit=crop&q=80', caption: 'Chef Counter Plating Precision', category: 'Culinary' },
    { id: 'gal_5', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1000&auto=format&fit=crop&q=80', caption: 'Artisanal Smoked Old Fashioned Cocktail', category: 'Wine & Bar' },
    { id: 'gal_6', image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1000&auto=format&fit=crop&q=80', caption: 'Private Dining Salon & Candlelight', category: 'Atmosphere' }
  ];

  for (const g of gallery) {
    db.run(`INSERT INTO gallery (id, image, caption, category) VALUES (?, ?, ?, ?)`, [g.id, g.image, g.caption, g.category]);
  }

  // 6. Reviews
  const reviews = [
    {
      id: 'rev_1',
      customer_name: 'Lord Harrison Vance',
      rating: 5,
      comment: 'An extraordinary dining experience in Mayfair. The Périgord Truffle Tagliolini and A5 Wagyu Ribcap were absolute perfection. The QR menu on our table was seamless and beautifully presented.',
      date: 'July 18, 2026',
      verified: 1,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
    },
    {
      id: 'rev_2',
      customer_name: 'Dr. Evelyn St. Claire',
      rating: 5,
      comment: 'Aurelia sets a new benchmark for luxury hospitality. From the Golden Osetra Caviar crudo to the 24K Gold Chocolate Sphere, every detail felt like art. Impeccable wine pairings by Head Sommelier Elena.',
      date: 'July 14, 2026',
      verified: 1,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
    },
    {
      id: 'rev_3',
      customer_name: 'Marcus & Sophia Sterling',
      rating: 5,
      comment: 'We celebrated our 10th anniversary at Aurelia. The ambiance, table side smoke presentation for cocktails, and attentive service made it unforgettable. Scanning the QR code gave us deep insight into every ingredient and allergen.',
      date: 'June 29, 2026',
      verified: 1,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
    }
  ];

  for (const r of reviews) {
    db.run(
      `INSERT INTO reviews (id, customer_name, rating, comment, date, verified, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [r.id, r.customer_name, r.rating, r.comment, r.date, r.verified, r.avatar]
    );
  }
}

export function saveDb() {
  if (dbInstance) {
    saveDatabase(dbInstance);
  }
}

// Data Access API Helpers
export async function getRestaurantInfo() {
  const db = await getDb();
  const res = db.exec("SELECT * FROM restaurant LIMIT 1");
  if (!res[0] || !res[0].values[0]) return null;
  const cols = res[0].columns;
  const vals = res[0].values[0];
  const obj: Record<string, any> = {};
  cols.forEach((col, idx) => {
    obj[col] = vals[idx];
  });
  return obj;
}

export async function updateRestaurantInfo(data: any) {
  const db = await getDb();
  db.run(
    `UPDATE restaurant SET
      name = ?, tagline = ?, description = ?, chef_name = ?, address = ?, phone = ?, whatsapp = ?, opening_hours = ?, logo_url = ?, hero_image_url = ?, instagram_url = ?, facebook_url = ?, map_latitude = ?, map_longitude = ?, map_embed_url = ?
     WHERE id = 'rest_1'`,
    [
      data.name,
      data.tagline,
      data.description,
      data.chef_name,
      data.address,
      data.phone,
      data.whatsapp,
      data.opening_hours,
      data.logo_url,
      data.hero_image_url,
      data.instagram_url,
      data.facebook_url,
      data.map_latitude || '51.5074',
      data.map_longitude || '-0.1278',
      data.map_embed_url || ''
    ]
  );
  saveDb();
}

export async function getCategories() {
  const db = await getDb();
  const res = db.exec("SELECT * FROM categories ORDER BY display_order ASC");
  if (!res[0]) return [];
  const cols = res[0].columns;
  return res[0].values.map(row => {
    const item: Record<string, any> = {};
    cols.forEach((col, idx) => (item[col] = row[idx]));
    return item;
  });
}

export async function createCategory(name: string, displayOrder: number, icon: string = 'Utensils') {
  const db = await getDb();
  const id = 'cat_' + Date.now();
  db.run(`INSERT INTO categories (id, name, display_order, icon) VALUES (?, ?, ?, ?)`, [id, name, displayOrder, icon]);
  saveDb();
  return id;
}

export async function updateCategory(id: string, name: string, displayOrder: number, icon: string) {
  const db = await getDb();
  db.run(`UPDATE categories SET name = ?, display_order = ?, icon = ? WHERE id = ?`, [name, displayOrder, icon, id]);
  saveDb();
}

export async function deleteCategory(id: string) {
  const db = await getDb();
  db.run(`DELETE FROM menu_items WHERE category_id = ?`, [id]);
  db.run(`DELETE FROM categories WHERE id = ?`, [id]);
  saveDb();
}

export async function getMenuItems() {
  const db = await getDb();
  const res = db.exec("SELECT * FROM menu_items");
  if (!res[0]) return [];
  const cols = res[0].columns;
  return res[0].values.map(row => {
    const item: Record<string, any> = {};
    cols.forEach((col, idx) => (item[col] = row[idx]));
    return item;
  });
}

export async function createMenuItem(data: any) {
  const db = await getDb();
  const id = 'item_' + Date.now();
  db.run(
    `INSERT INTO menu_items (
      id, category_id, name, description, price, image, ingredients, allergens, tags, spice_level, available, wine_pairing, calories
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.category_id,
      data.name,
      data.description,
      data.price,
      data.image,
      data.ingredients || '',
      data.allergens || '',
      data.tags || '',
      data.spice_level || 0,
      data.available ?? 1,
      data.wine_pairing || '',
      data.calories || null
    ]
  );
  saveDb();
  return id;
}

export async function updateMenuItem(id: string, data: any) {
  const db = await getDb();
  db.run(
    `UPDATE menu_items SET
      category_id = ?, name = ?, description = ?, price = ?, image = ?, ingredients = ?, allergens = ?, tags = ?, spice_level = ?, available = ?, wine_pairing = ?, calories = ?
     WHERE id = ?`,
    [
      data.category_id,
      data.name,
      data.description,
      data.price,
      data.image,
      data.ingredients || '',
      data.allergens || '',
      data.tags || '',
      data.spice_level || 0,
      data.available ?? 1,
      data.wine_pairing || '',
      data.calories || null,
      id
    ]
  );
  saveDb();
}

export async function deleteMenuItem(id: string) {
  const db = await getDb();
  db.run(`DELETE FROM menu_items WHERE id = ?`, [id]);
  saveDb();
}

export async function getPromotions() {
  const db = await getDb();
  const res = db.exec("SELECT * FROM promotions WHERE active = 1");
  if (!res[0]) return [];
  const cols = res[0].columns;
  return res[0].values.map(row => {
    const item: Record<string, any> = {};
    cols.forEach((col, idx) => (item[col] = row[idx]));
    return item;
  });
}

export async function getAllPromotions() {
  const db = await getDb();
  const res = db.exec("SELECT * FROM promotions");
  if (!res[0]) return [];
  const cols = res[0].columns;
  return res[0].values.map(row => {
    const item: Record<string, any> = {};
    cols.forEach((col, idx) => (item[col] = row[idx]));
    return item;
  });
}

export async function createPromotion(data: any) {
  const db = await getDb();
  const id = 'promo_' + Date.now();
  db.run(
    `INSERT INTO promotions (id, title, subtitle, description, image, discount_tag, active) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, data.title, data.subtitle || '', data.description || '', data.image || '', data.discount_tag || '', data.active ?? 1]
  );
  saveDb();
  return id;
}

export async function updatePromotion(id: string, data: any) {
  const db = await getDb();
  db.run(
    `UPDATE promotions SET title = ?, subtitle = ?, description = ?, image = ?, discount_tag = ?, active = ? WHERE id = ?`,
    [data.title, data.subtitle || '', data.description || '', data.image || '', data.discount_tag || '', data.active ?? 1, id]
  );
  saveDb();
}

export async function deletePromotion(id: string) {
  const db = await getDb();
  db.run(`DELETE FROM promotions WHERE id = ?`, [id]);
  saveDb();
}

export async function getGallery() {
  const db = await getDb();
  const res = db.exec("SELECT * FROM gallery");
  if (!res[0]) return [];
  const cols = res[0].columns;
  return res[0].values.map(row => {
    const item: Record<string, any> = {};
    cols.forEach((col, idx) => (item[col] = row[idx]));
    return item;
  });
}

export async function createGalleryItem(image: string, caption: string, category: string = 'Culinary') {
  const db = await getDb();
  const id = 'gal_' + Date.now();
  db.run(`INSERT INTO gallery (id, image, caption, category) VALUES (?, ?, ?, ?)`, [id, image, caption, category]);
  saveDb();
  return id;
}

export async function deleteGalleryItem(id: string) {
  const db = await getDb();
  db.run(`DELETE FROM gallery WHERE id = ?`, [id]);
  saveDb();
}

export async function getReviews() {
  const db = await getDb();
  const res = db.exec("SELECT * FROM reviews ORDER BY rowid DESC");
  if (!res[0]) return [];
  const cols = res[0].columns;
  return res[0].values.map(row => {
    const item: Record<string, any> = {};
    cols.forEach((col, idx) => (item[col] = row[idx]));
    return item;
  });
}

export async function createReview(customer_name: string, rating: number, comment: string, avatar?: string) {
  const db = await getDb();
  const id = 'rev_' + Date.now();
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const userAvatar = avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80`;
  db.run(
    `INSERT INTO reviews (id, customer_name, rating, comment, date, verified, avatar) VALUES (?, ?, ?, ?, ?, 1, ?)`,
    [id, customer_name, rating, comment, dateStr, userAvatar]
  );
  saveDb();
  return id;
}

export async function getReservations() {
  const db = await getDb();
  const res = db.exec("SELECT * FROM reservations ORDER BY rowid DESC");
  if (!res[0]) return [];
  const cols = res[0].columns;
  return res[0].values.map(row => {
    const item: Record<string, any> = {};
    cols.forEach((col, idx) => (item[col] = row[idx]));
    return item;
  });
}

export async function createReservation(data: any) {
  const db = await getDb();
  const id = 'res_' + Date.now();
  const createdAt = new Date().toISOString();
  db.run(
    `INSERT INTO reservations (id, guest_name, email, phone, date, time, guests, seating_area, special_requests, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.guest_name,
      data.email,
      data.phone,
      data.date,
      data.time,
      data.guests,
      data.seating_area || 'Main Dining Room',
      data.special_requests || '',
      createdAt
    ]
  );
  saveDb();
  return id;
}

export async function updateReservationStatus(id: string, status: string) {
  const db = await getDb();
  db.run(`UPDATE reservations SET status = ? WHERE id = ?`, [status, id]);
  saveDb();
}

export async function deleteReservation(id: string) {
  const db = await getDb();
  db.run(`DELETE FROM reservations WHERE id = ?`, [id]);
  saveDb();
}

export async function getTableOrders() {
  const db = await getDb();
  const res = db.exec("SELECT * FROM table_orders ORDER BY rowid DESC");
  if (!res[0]) return [];
  const cols = res[0].columns;
  return res[0].values.map(row => {
    const item: Record<string, any> = {};
    cols.forEach((col, idx) => (item[col] = row[idx]));
    try {
      if (typeof item.items === 'string') {
        item.items = JSON.parse(item.items);
      }
    } catch (e) {
      item.items = [];
    }
    return item;
  });
}

export async function createTableOrder(data: { table_number: string; customer_name: string; items: any[]; total_amount: number }) {
  const db = await getDb();
  const id = 'ord_' + Date.now();
  const createdAt = new Date().toISOString();
  const itemsJson = JSON.stringify(data.items || []);
  db.run(
    `INSERT INTO table_orders (id, table_number, customer_name, items, total_amount, status, created_at)
     VALUES (?, ?, ?, ?, ?, 'Pending', ?)`,
    [id, data.table_number, data.customer_name, itemsJson, data.total_amount, createdAt]
  );
  saveDb();
  return id;
}

export async function updateTableOrderStatus(id: string, status: string) {
  const db = await getDb();
  db.run(`UPDATE table_orders SET status = ? WHERE id = ?`, [status, id]);
  saveDb();
}

export async function deleteTableOrder(id: string) {
  const db = await getDb();
  db.run(`DELETE FROM table_orders WHERE id = ?`, [id]);
  saveDb();
}

export async function createServerCall(tableNumber: string, requestType: string) {
  const db = await getDb();
  const id = 'call_' + Date.now();
  const createdAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  db.run(
    `INSERT INTO server_calls (id, table_number, request_type, status, created_at) VALUES (?, ?, ?, 'Pending', ?)`,
    [id, tableNumber, requestType, createdAt]
  );
  saveDb();
  return id;
}

export async function getServerCalls() {
  const db = await getDb();
  const res = db.exec("SELECT * FROM server_calls ORDER BY rowid DESC");
  if (!res[0]) return [];
  const cols = res[0].columns;
  return res[0].values.map(row => {
    const item: Record<string, any> = {};
    cols.forEach((col, idx) => (item[col] = row[idx]));
    return item;
  });
}

export async function updateServerCallStatus(id: string, status: string) {
  const db = await getDb();
  db.run(`UPDATE server_calls SET status = ? WHERE id = ?`, [status, id]);
  saveDb();
}

export async function deleteServerCall(id: string) {
  const db = await getDb();
  db.run(`DELETE FROM server_calls WHERE id = ?`, [id]);
  saveDb();
}

export async function saveUploadedImageToDb(filename: string, mimeType: string, dataUrl: string) {
  const db = await getDb();
  const id = 'img_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const createdAt = new Date().toISOString();
  db.run(
    `INSERT INTO uploaded_images (id, filename, mime_type, data_url, created_at) VALUES (?, ?, ?, ?, ?)`,
    [id, filename, mimeType, dataUrl, createdAt]
  );
  saveDb();
  return { id, dataUrl };
}

export async function getUploadedImageFromDb(id: string) {
  const db = await getDb();
  const res = db.exec("SELECT * FROM uploaded_images WHERE id = ?", [id]);
  if (!res[0] || !res[0].values[0]) return null;
  const cols = res[0].columns;
  const item: Record<string, any> = {};
  cols.forEach((col, idx) => (item[col] = res[0].values[0][idx]));
  return item;
}

export async function getAdminUserByUsername(username: string) {
  const db = await getDb();
  const res = db.exec("SELECT * FROM admin_users WHERE username = ?", [username]);
  if (!res[0] || !res[0].values[0]) return null;
  const cols = res[0].columns;
  const item: Record<string, any> = {};
  cols.forEach((col, idx) => (item[col] = res[0].values[0][idx]));
  return item;
}

export async function verifyAdminCredentials(username: string, passwordInput: string) {
  const admin = await getAdminUserByUsername(username);
  if (!admin) return null;
  const isValid = verifyPassword(passwordInput, admin.password_hash, admin.salt);
  if (!isValid) return null;
  return {
    id: admin.id,
    username: admin.username,
    name: admin.name,
    role: admin.role
  };
}

export async function updateAdminCredentials(username: string, newPasswordInput?: string, newName?: string) {
  const db = await getDb();
  const admin = await getAdminUserByUsername(username);
  if (!admin) return false;

  if (newPasswordInput) {
    const newHash = hashPassword(newPasswordInput);
    db.run(
      `UPDATE admin_users SET password_hash = ?, salt = ?, name = COALESCE(?, name) WHERE username = ?`,
      [newHash.hash, newHash.salt, newName || null, username]
    );
  } else if (newName) {
    db.run(`UPDATE admin_users SET name = ? WHERE username = ?`, [newName, username]);
  }
  saveDb();
  return true;
}

export async function createSupportTicket(customer_name: string, email: string, phone: string, subject: string, message: string) {
  const db = await getDb();
  const id = 'ticket_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const createdAt = new Date().toISOString();
  db.run(
    `INSERT INTO support_tickets (id, customer_name, email, phone, subject, message, status, created_at) VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?)`,
    [id, customer_name, email, phone, subject, message, createdAt]
  );
  saveDb();
  return id;
}

export async function getSupportTickets() {
  const db = await getDb();
  const res = db.exec("SELECT * FROM support_tickets ORDER BY rowid DESC");
  if (!res[0]) return [];
  const cols = res[0].columns;
  return res[0].values.map(row => {
    const item: Record<string, any> = {};
    cols.forEach((col, idx) => (item[col] = row[idx]));
    return item;
  });
}

export async function replyToSupportTicket(id: string, reply: string) {
  const db = await getDb();
  const repliedAt = new Date().toISOString();
  db.run(
    `UPDATE support_tickets SET admin_reply = ?, replied_at = ?, status = 'Replied' WHERE id = ?`,
    [reply, repliedAt, id]
  );
  saveDb();
}

export async function deleteSupportTicket(id: string) {
  const db = await getDb();
  db.run(`DELETE FROM support_tickets WHERE id = ?`, [id]);
  saveDb();
}

