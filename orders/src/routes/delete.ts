import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@rstoia98/common";
import express, { NextFunction, Request, Response } from "express";
import { Order, OrderStatus } from "../models/order";
import { natsWrapper } from "../nats-wrapper";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";

const router = express.Router();

router.patch(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate("ticket");

    if (!order) {
      return next(new NotFoundError());
    }

    if (order.userId !== req.currentUser!.id) {
      return next(new NotAuthorizedError());
    }
    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
      version: 0,
    });

    return res.send(order);
  }
);

export { router as deleteOrderRouter };
