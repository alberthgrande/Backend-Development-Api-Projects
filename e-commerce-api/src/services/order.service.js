import { withTransaction, withClient } from "../utils/transaction.utils.js";
import * as productRepo from "../repositories/product.repository.js";
import * as orderRepo from "../repositories/order.repository.js";

export const createOrder = async (userId, items) => {
  withTransaction(async (client) => {
    const products = await Promise.all(
      items.map((item) => productRepo.findProductById(client, item.productId)),
    );

    const totalPrice = items.reduce((acc, item, index) => {
      const product = products[index];

      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Not enough stock for ${product.name}`);
      }

      return acc + product.price * item.quantity;
    }, 0);

    const order = await orderRepo.createOrder(client, userId, totalPrice);

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);

      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      await orderRepo.createOrderItem(
        client,
        order.id,
        item.productId,
        item.quantity,
      );
      await productRepo.updateStock(
        client,
        item.productId,
        product.stock - item.quantity,
      );
    }

    return order;
  });
};

export const getUserOrders = async (userId) => {
  return withClient(async (client) => {
    // Fetch orders from the repository layer
    const orders = await orderRepo.getOrdersByUserId(client, userId);

    // If no orders are found
    if (!orders || orders.length === 0) {
      throw new Error("No orders found for this user.");
    }

    // Format orders and return the structured data
    return formatOrders(orders);
  });
};

// Helper function to group order items by order
const formatOrders = (orders) => {
  const groupedOrders = [];

  orders.forEach((order) => {
    // Check if the order already exists in the grouped array
    let existingOrder = groupedOrders.find(
      (o) => o.order_id === order.order_id,
    );

    // If the order doesn't exist, create a new entry for it
    if (!existingOrder) {
      existingOrder = {
        order_id: order.order_id,
        user_id: order.user_id,
        total_price: order.total_price,
        created_at: order.created_at,
        items: [],
      };
      groupedOrders.push(existingOrder);
    }

    // Add the item to the order's items list
    existingOrder.items.push({
      order_item_id: order.order_item_id,
      product_id: order.product_id,
      product_name: order.product_name,
      product_price: order.product_price,
      quantity: order.quantity,
    });
  });

  return groupedOrders;
};
