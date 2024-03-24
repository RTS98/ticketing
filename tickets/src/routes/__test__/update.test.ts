import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { getCookie } from "../../test/utils";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("returns a 404 if the provided id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  return request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", getCookie())
    .send({
      title: "title",
      price: 20,
    })
    .expect(404);
});
it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  return request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "title",
      price: 20,
    })
    .expect(401);
});
it("returns a 401 if the user does not own the ticket", async () => {
  const ticket = Ticket.build({
    title: "title",
    price: 10,
    userId: "1",
  });

  await ticket.save();

  return request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set("Cookie", getCookie())
    .send({
      title: "title",
      price: 20,
    })
    .expect(401);
});
it("returns a 400 if the user provides an invalid title or price", async () => {
  const ticket = Ticket.build({
    title: "title",
    price: 10,
    userId: "12",
  });

  await ticket.save();

  return request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set("Cookie", getCookie())
    .send({
      title: "",
      price: 20,
    })
    .expect(400);
});
it("updates the ticket with provided input", async () => {
  const ticket = Ticket.build({
    title: "title",
    price: 10,
    userId: "12",
  });

  await ticket.save();

  const response = await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set("Cookie", getCookie())
    .send({
      title: "new title",
      price: 20,
    })
    .expect(200);

  expect(response.body.title).toEqual("new title");
  expect(response.body.price).toEqual(20);
});

it("publishes an event", async () => {
  const ticket = Ticket.build({
    title: "title",
    price: 10,
    userId: "12",
  });

  await ticket.save();

  await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set("Cookie", getCookie())
    .send({
      title: "new title",
      price: 20,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("rejects updates if the ticket is reserved", async () => {
  const ticket = Ticket.build({
    title: "title",
    price: 10,
    userId: "12",
  });

  ticket.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket.save();

  await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set("Cookie", getCookie())
    .send({
      title: "new title",
      price: 20,
    })
    .expect(400);
});
