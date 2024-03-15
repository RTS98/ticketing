import request from "supertest";
import { app } from "../app";

export const getCookie = async () => {
  const user = await request(app)
    .post("/api/users/signup")
    .send({
      email: "rts@gmail.com",
      password: "password",
    })
    .expect(201);

  return user.get("Set-Cookie");
};
