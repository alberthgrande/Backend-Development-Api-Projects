export const createOrder = async (client, userId, totalPrice) => {
  const { rows } = await client.query(
    `INSERT INTO orders (user_id, total_price)
        VALUES ($1, $2)
        RETURNING *`,
    [userId, totalPrice],
  );

  return rows[0];
};

export const createOrderItem = async (client, orderId, productId, quantity) => {
  const { rows } = await client.query(
    `INSERT INTO order_items (order_id, product_id, quantity)
        VALUES ($1, $2, $3)
        RETURNING *`,
    [orderId, productId, quantity],
  );

  return rows[0];
};

export const getOrdersByUserId = async (client, userId) => {
  const { rows } = await client.query(
    `SELECT 
      o.id AS order_id,
      o.user_id,
      o.total_price,
      o.created_at,
      oi.id AS order_item_id,
      oi.product_id,
      oi.quantity,
      p.name AS product_name,
      p.price AS product_price
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = $1
    ORDER BY o.created_at DESC`,
    [userId],
  );

  return rows;
};
