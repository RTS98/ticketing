import request from "supertest";
import { app } from "../../app";
import { getCookie } from "../../test/utils";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@rstoia98/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

jest.mock("../../stripe");

it("throws 404 when purchasing an order that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", getCookie())
    .send({
      token: "da",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});
it("throws 401 when purchasing an order that does not belong to user", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: "adfs",
    price: 20,
    status: OrderStatus.Created,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", getCookie())
    .send({
      token: "da",
      orderId: order.id,
    })
    .expect(401);
});
it("throws 400 when purchasing a cancelled order", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: "adfs",
    price: 20,
    status: OrderStatus.Cancelled,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", getCookie(order.userId))
    .send({
      token: "da",
      orderId: order.id,
    })
    .expect(400);
});

it("returns a 201 with valid inputs", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: "adfs",
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", getCookie(order.userId))
    .send({
      token: "da",
      orderId: order.id,
    })
    .expect(201);

  const paymentIntentsOptions = (stripe.paymentIntents.create as jest.Mock).mock
    .calls[0][0];

  expect(paymentIntentsOptions.currency).toEqual("usd");
  expect(paymentIntentsOptions.amount).toEqual(2000);
  expect(paymentIntentsOptions.payment_method).toEqual("card");
});

it("saves the payment in database", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: "adfs",
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", getCookie(order.userId))
    .send({
      token: "da",
      orderId: order.id,
    })
    .expect(201);

  const payment = await Payment.find({ orderId: order.id });
  expect(payment).toBeDefined();
});
