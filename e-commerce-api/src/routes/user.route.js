import express from "express";
import * as userController from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.post("/register", userController.createUser);

// Protected
router.put("/update/:id", authMiddleware, userController.updatedUser);
router.delete("/delete/:id", authMiddleware, userController.deleteUser);

export default router;
