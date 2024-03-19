import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { getCookie } from "../../test/utils";
import mongoose from "mongoose";

it("returns a 404 if the ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get(`/api/tickets/${id}`)
    .set("Cookie", getCookie())
    .send()
    .expect(404);
});
it("returns the ticket if the ticket is found", async () => {
  const title = "title";
  const price = 20;
  const ticket = Ticket.build({
    title,
    price,
    userId: "1",
  });

  const ticketDoc = await ticket.save();

  const response = await request(app)
    .get(`/api/tickets/${ticketDoc.id}`)
    .set("Cookie", getCookie())
    .send()
    .expect(200);

  expect(response.body.title).toEqual(title);
  expect(response.body.price).toEqual(price);
});
