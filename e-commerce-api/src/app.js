import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

//
import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";
import productRoute from "./routes/product.route.js";
import orderRoute from "./routes/order.routes.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//
app.use("/users", userRoute);
app.use("/auth", authRoute);
app.use("/product", productRoute);
app.use("/order", orderRoute);

export default app;
