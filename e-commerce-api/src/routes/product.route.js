import express from "express";
import * as productController from "../controllers/product.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, requireAdmin, productController.getProducts);
router.post("/", authMiddleware, requireAdmin, productController.createProduct);
router.get(
  "/:id",
  authMiddleware,
  requireAdmin,
  productController.findProductById,
);
router.put(
  "/:id",
  authMiddleware,
  requireAdmin,
  productController.updateProduct,
);
router.delete(
  "/:id",
  authMiddleware,
  requireAdmin,
  productController.deleteProduct,
);

export default router;
