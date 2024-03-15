import request from "supertest";
import { app } from "../../app";

it("returns 201 on successfull signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("returns 400 with invalid email", () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "rtsgmail.com",
      password: "password",
    })
    .expect(400);
});

it("returns 400 with invalid password length", () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "rts@gmail.com",
      password: "12",
    })
    .expect(400);
});

it("returns 400 with missing email and password", () => {
  return request(app).post("/api/users/signup").send({}).expect(400);
});

it("returns 400 when signing up with same email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "rts@gmail.com",
      password: "password",
    })
    .expect(201);

  return request(app)
    .post("/api/users/signup")
    .send({
      email: "rts@gmail.com",
      password: "password",
    })
    .expect(400);
});

it("sets a cookie after successfull signup", async () => {
  const response = await request(app).post("/api/users/signup").send({
    email: "rts@gmail.com",
    password: "password",
  });

  expect(response.get("Set-Cookie")).toBeDefined();
});
