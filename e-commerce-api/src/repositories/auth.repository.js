import { pool } from "../config/db.js";

export const saveRefreshToken = async (client, userId, token, expiresAt) => {
  await client.query(
    `INSERT INTO refresh_tokens (user_id, token, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, token, expiresAt],
  );
};

export const findRefreshToken = async (client, token) => {
  const { rows } = await client.query(
    `SELECT * FROM refresh_tokens WHERE token = $1`,
    [token],
  );
  return rows[0];
};

export const deleteRefreshToken = async (client, token) => {
  await client.query(`DELETE FROM refresh_tokens WHERE token = $1`, [token]);
};

export const deleteUserTokens = async (client, userId) => {
  await client.query(`DELETE FROM refresh_tokens WHERE user_id = $1`, [userId]);
};
