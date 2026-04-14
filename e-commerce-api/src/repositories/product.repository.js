import { pool } from "../config/db.js";

export const getProducts = async () => {
  const { rows } = await pool.query(`
    SELECT * FROM products
  `);

  return rows;
};

export const createProduct = async ({ name, price, stock }) => {
  const { rows } = await pool.query(
    `
    INSERT INTO products (name, price, stock)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [name, price, stock],
  );

  return rows[0];
};

export const findProductById = async (id) => {
  const { rows } = await pool.query(`SELECT * FROM products WHERE id = $1`, [
    id,
  ]);

  return rows[0];
};

export const updateProduct = async ({ id, name, price, stock }) => {
  const { rows } = await pool.query(
    `UPDATE products
    SET name = $1, price = $2, stock = $3
    WHERE id = $4
    RETURNING *`,
    [name, price, stock, id],
  );

  return rows[0];
};

export const deleteProduct = async (id) => {
  const { rowCount } = await pool.query(`DELETE FROM products WHERE id = $1`, [
    id,
  ]);

  return rowCount > 0;
};
