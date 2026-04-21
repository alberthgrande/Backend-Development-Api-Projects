# order.repository.js

```
export const getOrdersByUserId = async (userId) => {
  const { rows } = await pool.query(
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
    [userId]
  );

  return rows;
};
```

### Explanation of the Query:

- **orders o**: Alias for the **orders** table.
- **order_items oi**: Alias for the **order_items table**, joined with **orders** by **order_id**.
- **products p**: Alias for the **products** table, joined with **order_items** by product_id.
- The query fetches the **order_id**, **user_id**, **total_price**, **created_at** from the orders table, and the **product_name**, **product_price**, **quantity** from the **order_items** and **products** tables.
