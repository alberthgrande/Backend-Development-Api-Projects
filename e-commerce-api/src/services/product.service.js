import { withTransaction, withClient } from "../utils/transaction.utils.js";
import * as productRepo from "../repositories/product.repository.js";

export const getProducts = async () => {
  return withClient(async (client) => {
    const products = await productRepo.getProducts(client);

    if (products.length === 0) {
      throw new Error("No products available");
    }

    return products;
  });
};

export const createProduct = async ({ name, price, stock }) => {
  return withTransaction(async (client) => {
    if (price < 0 || stock < 0) {
      const error = new Error("Price and stock must be non-negative");
      error.status = 400;
      throw error;
    }

    return productRepo.createProduct(client, { name, price, stock });
  });
};

export const findProductById = async (id) => {
  return withClient(async (client) => {
    const product = await productRepo.findProductById(client, Number(id));

    if (!product) {
      const error = new Error("Product not found");
      error.status = 400;
      throw error;
    }

    return product;
  });
};

// export const updateProduct = async ({ id, name, price, stock }) => {
//   return withTransaction(async (client) => {
//     if (!name || price == null || stock == null) {
//       const error = new Error("Missing required fields: name, price, stock");
//       error.status = 400;
//       throw error;
//     }

//     if (typeof name !== "string") {
//       const error = new Error("Name must be a string");
//       error.status = 400;
//       throw error;
//     }

//     if (typeof price !== "number" || price < 0) {
//       const error = new Error("Price must be a non-negative number");
//       error.status = 400;
//       throw error;
//     }

//     if (!Number.isInteger(stock) || stock < 0) {
//       const error = new Error("Stock must be a non-negative integer");
//       error.status = 400;
//       throw error;
//     }

//     const product = await productRepo.updateProduct(client, {
//       id: Number(id),
//       name,
//       price,
//       stock,
//     });

//     if (!product) {
//       const error = new Error("Product not found");
//       error.status = 404;
//       throw error;
//     }

//     return product;
//   });
// };

export const updateProduct = async ({ id, name, price, stock }) => {
  return withTransaction(async (client) => {
    if (!id) {
      const error = new Error("Product id is required");
      error.status = 400;
      throw error;
    }

    const fields = [];
    const values = [];
    let i = 1;

    if (name !== undefined) {
      if (typeof name !== "string") {
        const error = new Error("Name must be a string");
        error.status = 400;
        throw error;
      }
      fields.push(`name = $${i++}`);
      values.push(name);
    }

    if (price !== undefined) {
      if (typeof price !== "number" || price < 0) {
        const error = new Error("Price must be a non-negative number");
        error.status = 400;
        throw error;
      }
      fields.push(`price = $${i++}`);
      values.push(price);
    }

    if (stock !== undefined) {
      if (!Number.isInteger(stock) || stock < 0) {
        const error = new Error("Stock must be a non-negative integer");
        error.status = 400;
        throw error;
      }
      fields.push(`stock = $${i++}`);
      values.push(stock);
    }

    if (fields.length === 0) {
      const error = new Error("No fields to update");
      error.status = 400;
      throw error;
    }

    values.push(Number(id));

    const query = `
      UPDATE products
      SET ${fields.join(", ")},
          updated_at = NOW()
      WHERE id = $${i}
      RETURNING *
    `;

    const result = await client.query(query, values);

    if (result.rowCount === 0) {
      const error = new Error("Product not found");
      error.status = 404;
      throw error;
    }

    return result.rows[0];
  });
};

export const deleteProduct = async (id) => {
  return withTransaction(async (client) => {
    const deleted = await productRepo.deleteProduct(client, Number(id));

    if (!deleted) {
      const error = new Error("Product not found");
      error.status = 404;
      throw error;
    }

    return true;
  });
};
