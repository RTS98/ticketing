import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("returns a list of tickets", async () => {
  const firstTicket = Ticket.build({
    title: "title",
    price: 20,
    userId: "1",
  });
  const secondTicket = Ticket.build({
    title: "another ticket",
    price: 30,
    userId: "2",
  });

  await Ticket.bulkSave([firstTicket, secondTicket]);

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(2);
});
