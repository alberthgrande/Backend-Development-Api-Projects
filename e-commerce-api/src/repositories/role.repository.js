import { pool } from "../config/db.js";

export const getRoleById = async (id) => {
  const { rows } = await pool.query(`SELECT * FROM roles WHERE id = $1`, [id]);

  return rows[0];
};
