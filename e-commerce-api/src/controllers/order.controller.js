import * as orderService from "../services/order.service.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items } = req.body;

    const order = await orderService.createOrder(userId, items);

    res.status(201).json({
      status: true,
      data: order,
      message: "Order created successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      error: error.message,
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id; // Get userId from JWT token (set by authMiddleware)

    // Call the service to get the orders for the user
    const orders = await orderService.getUserOrders(userId);

    res.status(200).json({
      status: true,
      message: "Orders fetched successfully.",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message || "Something went wrong",
    });
  }
};
