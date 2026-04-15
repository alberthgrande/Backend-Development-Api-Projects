import { pool } from "../config/db.js";

export const withTransaction = async (callback) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await callback(client);

    await client.query("COMMIT");
    return result;
  } catch (err) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackErr) {
      console.error("Rollback failed:", rollbackErr);
    }
    throw err;
  } finally {
    client.release();
  }
};

export const withClient = async (callback) => {
  const client = await pool.connect();
  try {
    return await callback(client);
  } finally {
    client.release();
  }
};
