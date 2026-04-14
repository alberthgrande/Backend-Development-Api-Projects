import * as productService from "../services/product.service.js";

export const getProducts = async (req, res) => {
  try {
    const products = await productService.getProducts();

    res.status(200).json({
      status: true,
      data: products,
      message: "Products fetched successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      error: error.message,
    });
  }
};

export const findProductById = async (req, res) => {
  try {
    const product = await productService.findProductById(req.params.id);

    res.status(200).json({
      status: true,
      data: product,
      message: "Products fetched successfully",
    });
  } catch (error) {
    res.status(error.status || 500).json({
      status: false,
      error: error.message || "Failed to find product",
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);

    res.status(201).json({
      status: true,
      data: product,
      message: "Product created successfully",
    });
  } catch (error) {
    res.status(error.status || 500).json({
      status: false,
      error: error.message || "Failed to create product",
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct({
      id: req.params.id,
      ...req.body,
    });

    res.status(200).json({
      status: true,
      data: product,
      message: "Product updated successfully",
    });
  } catch (error) {
    res.status(error.status || 500).json({
      status: false,
      error: error.message || "Failed to update product",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id);

    res.status(200).json({
      status: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(error.status || 500).json({
      status: false,
      error: error.message || "Failed to delete product",
    });
  }
};
