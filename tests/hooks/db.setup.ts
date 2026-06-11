import * as mysql2 from 'mysql2/promise'
import type { Connection } from 'mysql2/promise'
import * as dotenv from 'dotenv'

dotenv.config()

// ─── Seed payloads ────────────────────────────────────────────────────────────
// Must stay in sync with seed.sql so both paths produce identical state.

const CATEGORIES = [
  { name: 'Tropical',    parent_id: null },
  { name: 'Desert',      parent_id: null },
  { name: 'Cacti',       parent_id: 2 },
  { name: 'Palms',       parent_id: 1 },
  { name: 'Orchids',     parent_id: 1 },
  { name: 'Bromeliad',   parent_id: 1 },
  { name: 'Succulent',   parent_id: 2 },
  { name: 'Medicinal',   parent_id: null },
]

const PLANTS = [
  { name: 'Peace Lily',    price: 22.00, quantity: 50,  category_id: 5 },
  { name: 'Barrel Cactus', price: 18.50, quantity: 70,  category_id: 3 },
  { name: 'Areca Palm',    price: 40.00, quantity: 20,  category_id: 4 },
  { name: 'Neoregelia',    price: 28.00, quantity: 35,  category_id: 6 },
  { name: 'Haworthia',     price: 14.00, quantity: 90,  category_id: 7 },
  { name: 'Hibiscus',      price: 25.00, quantity: 60,  category_id: 1 },
  { name: 'Bougainvillea', price: 32.00, quantity: 45,  category_id: 1 },
  { name: 'Prickly Pear',  price: 12.00, quantity: 110, category_id: 3 },
  { name: 'Aloe Vera',     price: 17.50, quantity: 85,  category_id: 7 },
  { name: 'Phalaenopsis',  price: 38.00, quantity: 25,  category_id: 5 },
]

const SALES = [
  { plant_id: 1,  quantity: 3, total_price: 66.00,  sold_at: '2026-06-01 09:00:00' },
  { plant_id: 2,  quantity: 2, total_price: 37.00,  sold_at: '2026-06-01 09:15:00' },
  { plant_id: 3,  quantity: 1, total_price: 40.00,  sold_at: '2026-06-01 09:30:00' },
  { plant_id: 4,  quantity: 4, total_price: 112.00, sold_at: '2026-06-01 10:00:00' },
  { plant_id: 5,  quantity: 5, total_price: 70.00,  sold_at: '2026-06-01 10:20:00' },
  { plant_id: 6,  quantity: 2, total_price: 50.00,  sold_at: '2026-06-01 10:45:00' },
  { plant_id: 7,  quantity: 3, total_price: 96.00,  sold_at: '2026-06-01 11:00:00' },
  { plant_id: 8,  quantity: 6, total_price: 72.00,  sold_at: '2026-06-01 11:30:00' },
  { plant_id: 9,  quantity: 4, total_price: 70.00,  sold_at: '2026-06-01 12:00:00' },
  { plant_id: 10, quantity: 2, total_price: 76.00,  sold_at: '2026-06-01 12:30:00' },
  { plant_id: 1,  quantity: 1, total_price: 22.00,  sold_at: '2026-06-02 08:45:00' },
  { plant_id: 2,  quantity: 3, total_price: 55.50,  sold_at: '2026-06-02 09:10:00' },
  { plant_id: 5,  quantity: 2, total_price: 28.00,  sold_at: '2026-06-02 09:50:00' },
  { plant_id: 9,  quantity: 1, total_price: 17.50,  sold_at: '2026-06-02 10:15:00' },
  { plant_id: 10, quantity: 3, total_price: 114.00, sold_at: '2026-06-02 11:00:00' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getCount(conn: Connection, table: string): Promise<number> {
  const [rows] = await conn.execute<mysql2.RowDataPacket[]>(
    `SELECT COUNT(*) AS cnt FROM \`${table}\``
  )
  return rows[0].cnt as number
}

async function seedCategories(conn: Connection): Promise<void> {
  for (const cat of CATEGORIES) {
    await conn.execute(
      'INSERT INTO categories (name, parent_id) VALUES (?, ?)',
      [cat.name, cat.parent_id]
    )
  }
}

async function seedPlants(conn: Connection): Promise<void> {
  for (const plant of PLANTS) {
    await conn.execute(
      'INSERT INTO plants (name, price, quantity, category_id) VALUES (?, ?, ?, ?)',
      [plant.name, plant.price, plant.quantity, plant.category_id]
    )
  }
}

async function seedSales(conn: Connection): Promise<void> {
  for (const sale of SALES) {
    await conn.execute(
      'INSERT INTO sales (plant_id, quantity, total_price, sold_at) VALUES (?, ?, ?, ?)',
      [sale.plant_id, sale.quantity, sale.total_price, sale.sold_at]
    )
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Called from the Cucumber BeforeAll hook in hooks.ts.
 * Connects to the database and seeds all tables when they are empty.
 * Skips seeding if data already exists to avoid duplicating records across runs.
 */
export async function ensureSeedData(): Promise<void> {
  let conn: Connection | null = null

  try {
    conn = await mysql2.createConnection({
      host:     process.env.DB_HOST     ?? 'localhost',
      port:     parseInt(process.env.DB_PORT ?? '3306', 10),
      user:     process.env.DB_USER     ?? 'root',
      password: process.env.DB_PASSWORD ?? '',
      database: process.env.DB_NAME     ?? 'qa_training',
    })

    const categoryCount = await getCount(conn, 'categories')
    const plantCount    = await getCount(conn, 'plants')
    const salesCount    = await getCount(conn, 'sales')

    if (categoryCount === 0 || plantCount === 0) {
      console.log('[db.setup] Tables are empty — seeding test data...')
      await seedCategories(conn)
      await seedPlants(conn)
      if (salesCount === 0) await seedSales(conn)
      console.log('[db.setup] Seeding complete.')
    } else {
      console.log(
        `[db.setup] Data already present — categories: ${categoryCount}, plants: ${plantCount}, sales: ${salesCount}. Skipping seed.`
      )
    }
  } catch (err) {
    console.error('[db.setup] Failed to verify/seed database:', err)
    throw err
  } finally {
    await conn?.end()
  }
}

/**
 * Hard-resets all tables and re-seeds from scratch.
 * Use this only when a test has dirtied shared state and you need a clean slate.
 * Not called automatically — invoke explicitly from a specific BeforeAll if needed.
 */
export async function resetAndSeed(): Promise<void> {
  let conn: Connection | null = null

  try {
    conn = await mysql2.createConnection({
      host:     process.env.DB_HOST     ?? 'localhost',
      port:     parseInt(process.env.DB_PORT ?? '3306', 10),
      user:     process.env.DB_USER     ?? 'root',
      password: process.env.DB_PASSWORD ?? '',
      database: process.env.DB_NAME     ?? 'qa_training',
    })

    console.log('[db.setup] Hard-resetting tables...')
    await conn.execute('SET FOREIGN_KEY_CHECKS = 0')
    await conn.execute('TRUNCATE TABLE inventory')
    await conn.execute('TRUNCATE TABLE sales')
    await conn.execute('TRUNCATE TABLE plants')
    await conn.execute('TRUNCATE TABLE categories')
    await conn.execute('SET FOREIGN_KEY_CHECKS = 1')

    await seedCategories(conn)
    await seedPlants(conn)
    await seedSales(conn)
    console.log('[db.setup] Reset and re-seed complete.')
  } catch (err) {
    console.error('[db.setup] Failed to reset database:', err)
    throw err
  } finally {
    await conn?.end()
  }
}
