import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@rstoia98/common";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-update-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title must be defined"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return next(new NotFoundError());
    }

    if (ticket.userId !== req.currentUser!.id) {
      return next(new NotAuthorizedError());
    }

    if (ticket.orderId) {
      return next(new BadRequestError("Ticket is already reserved"));
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });
    await ticket.save();
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    return res.send(ticket);
  }
);

export { router as updateTicketRouter };
