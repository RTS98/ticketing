import { NotFoundError, requireAuth } from "@rstoia98/common";
import express, { NextFunction, Request, Response } from "express";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get(
  "/api/tickets/:id",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return next(new NotFoundError());
    }

    return res.send(ticket);
  }
);

export { router as showTicketRouter };
