import { pool } from "../config/db.js";

export const createUser = async ({ email, password }) => {
  const { rows } = await pool.query(
    `
    INSERT INTO users (email, password)
    VALUES ($1, $2)
    RETURNING id, email
    `,
    [email, password],
  );

  return rows[0];
};

export const findByEmail = async (email) => {
  const { rows } = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  return rows[0];
};

export const findById = async (userId) => {
  const { rows } = await pool.query(`SELECT * FROM users WHERE id = $1`, [
    userId,
  ]);

  return rows[0];
};

export const updateUser = async (userId, data) => {
  const { email, password } = data;

  const { rows } = await pool.query(
    `
    UPDATE users
    SET email = $1, password = $2
    WHERE id = $3
    RETURNING id, email
    `,
    [email, password, userId],
  );

  return rows[0];
};

export const deleteUser = async (userId) => {
  const { rowCount } = await pool.query(`DELETE FROM users WHERE id = $1`, [
    userId,
  ]);

  return rowCount > 0;
};
