import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
  try {
    const res = await pool.query("SELECT 1");
    console.log("✅ DB Connected:", res.rows);
  } catch (err) {
    console.error("❌ DB Connection Error:", err.message);
  }
}

// Run only in development
if (process.env.NODE_ENV !== "production") {
  testConnection();
}

// Graceful shutdown (ONLY place where pool.end is allowed)
process.on("SIGINT", async () => {
  console.log("🛑 Closing DB pool...");
  await pool.end();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("🛑 Closing DB pool...");
  await pool.end();
  process.exit(0);
});
