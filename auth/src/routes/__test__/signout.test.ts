import request from "supertest";
import { app } from "../../app";

it("clears the cookie after signing out", async () => {
  const response = await request(app)
    .post("/api/users/signout")
    .send({})
    .expect(200);

  expect(response.body).toEqual({});
  expect(response.get("Set-Cookie")).toBeDefined();
});
