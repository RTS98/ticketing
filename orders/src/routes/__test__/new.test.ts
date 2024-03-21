import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { getCookie } from "../../test/utils";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("returns an error if the ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", getCookie())
    .send({ ticketId })
    .expect(404);
});
it("returns an error if the ticket does not exist", async () => {
  const ticket = Ticket.build({
    title: "Concert",
    price: 20,
  });
  await ticket.save();

  const order = Order.build({
    userId: "asfds",
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  });

  await request(app)
    .post("/api/orders")
    .set("Cookie", getCookie())
    .send(order)
    .expect(400);
});
it("reserves a ticket", async () => {
  const ticket = Ticket.build({
    title: "Concert",
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", getCookie())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it("emits event", async () => {
  const ticket = Ticket.build({
    title: "Concert",
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", getCookie())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
