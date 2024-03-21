import request from "supertest";
import { app } from "../../app";
import { buildTicket, getCookie } from "../../test/utils";
import { OrderStatus } from "@rstoia98/common";
import { natsWrapper } from "../../nats-wrapper";

it("marks an order as cancelled", async () => {
  const ticket = await buildTicket();
  await ticket.save();

  const user = getCookie();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const response = await request(app)
    .patch(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(200);

  expect(response.body.status).toEqual(OrderStatus.Cancelled);
});

it("emits an order event", async () => {
  const ticket = await buildTicket();
  await ticket.save();

  const user = getCookie();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const response = await request(app)
    .patch(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
