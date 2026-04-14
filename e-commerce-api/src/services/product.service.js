import * as productRepo from "../repositories/product.repository.js";

export const getProducts = async () => {
  return productRepo.getProducts();
};

export const createProduct = async ({ name, price, stock }) => {
  if (price < 0 || stock < 0) {
    const error = new Error("Price and stock must be non-negative");
    error.status = 400;
    throw error;
  }

  return productRepo.createProduct({ name, price, stock });
};

export const findProductById = async (id) => {
  const product = await productRepo.findProductById(id);

  if (!product) {
    const error = new Error("Product not found");
    error.status = 400;
    throw error;
  }

  return product;
};

export const updateProduct = async ({ id, name, price, stock }) => {
  if (!name || price == null || stock == null) {
    const error = new Error("Missing required fields: name, price, stock");
    error.status = 400;
    throw error;
  }

  if (typeof name !== "string") {
    const error = new Error("Name must be a string");
    error.status = 400;
    throw error;
  }

  if (typeof price !== "number" || price < 0) {
    const error = new Error("Price must be a non-negative number");
    error.status = 400;
    throw error;
  }

  if (!Number.isInteger(stock) || stock < 0) {
    const error = new Error("Stock must be a non-negative integer");
    error.status = 400;
    throw error;
  }

  const product = await productRepo.updateProduct({ id, name, price, stock });

  if (!product) {
    const error = new Error("Product not found");
    error.status = 404;
    throw error;
  }

  return product;
};

export const deleteProduct = async (id) => {
  const deleted = await productRepo.deleteProduct(id);

  if (!deleted) {
    const error = new Error("Product not found");
    error.status = 404;
    throw error;
  }

  return true;
};
