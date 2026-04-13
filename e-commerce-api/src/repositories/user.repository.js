import { pool } from "../config/db.js";

// create user
export const createUser = async ({ email, password }) => {
  const result = await pool.query(
    `
    INSERT INTO users (email, password)
    VALUES ($1, $2)
    RETURNING id, email
    `,
    [email, password],
  );

  return result.rows[0];
};

// find user by email
export const findByEmail = async (email) => {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  return result.rows[0];
};
// findById(userId)
// findByEmail(email)
// updateUser(userId, data)
// deleteUser(userId)
