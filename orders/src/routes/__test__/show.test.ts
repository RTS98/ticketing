import request from "supertest";
import { app } from "../../app";
import { buildTicket, getCookie, getCookieOne } from "../../test/utils";

it("return a 401 if the user tries to fetch another users order", async () => {
  const ticket = await buildTicket();
  await ticket.save();

  const user = getCookie();
  const userOne = getCookieOne();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", userOne)
    .send()
    .expect(401);
});

it("fetches the order", async () => {
  const ticket = await buildTicket();
  await ticket.save();

  const user = getCookie();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});
