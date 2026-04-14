import express from "express";
import * as userController from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", userController.createUser);

router.put("/update/:id", userController.updatedUser);
router.delete("/delete/:id", userController.deleteUser);

export default router;
