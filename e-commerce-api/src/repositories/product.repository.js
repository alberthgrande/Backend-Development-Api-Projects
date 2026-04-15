export const getProducts = async (client) => {
  const { rows } = await client.query(`
    SELECT * FROM products
  `);

  return rows;
};

export const createProduct = async (client, { name, price, stock }) => {
  const { rows } = await client.query(
    `
    INSERT INTO products (name, price, stock)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [name, price, stock],
  );

  return rows[0];
};

export const findProductById = async (client, id) => {
  const { rows } = await client.query(`SELECT * FROM products WHERE id = $1`, [
    id,
  ]);

  return rows[0];
};

export const updateProduct = async (client, { id, name, price, stock }) => {
  const { rows } = await client.query(
    `UPDATE products
    SET name = $1, price = $2, stock = $3
    WHERE id = $4
    RETURNING *`,
    [name, price, stock, id],
  );

  return rows[0];
};

export const deleteProduct = async (client, id) => {
  const { rowCount } = await client.query(
    `DELETE FROM products WHERE id = $1`,
    [id],
  );

  return rowCount > 0;
};

export const updateStock = async (client, productId, newStock) => {
  await client.query(
    `
    UPDATE products SET stock = $1 WHERE id = $2
    RETURNING *`,
    [newStock, productId],
  );
};
