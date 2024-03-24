import { sign } from "jsonwebtoken";
import { Ticket } from "../models/ticket";
import mongoose from "mongoose";

export const getCookie = () => {
  const payload = {
    id: "12",
    email: "test@gmail.com",
  };

  const token = sign(payload, process.env.JWT_KEY!);

  const session = {
    jwt: token,
  };

  const sessionJSON = JSON.stringify(session);
  const base64 = Buffer.from(sessionJSON).toString("base64");

  return [`session=${base64}`];
};

export const getCookieOne = () => {
  const payload = {
    id: "13",
    email: "test2@gmail.com",
  };

  const token = sign(payload, process.env.JWT_KEY!);

  const session = {
    jwt: token,
  };

  const sessionJSON = JSON.stringify(session);
  const base64 = Buffer.from(sessionJSON).toString("base64");

  return [`session=${base64}`];
};

export const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Concert",
    price: 20,
  });
  await ticket.save();

  return ticket;
};
