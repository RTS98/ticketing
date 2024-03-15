import request from "supertest";
import { app } from "../../app";
import { getCookie } from "../../test/utils";

it("responds with details about current user", async () => {
  const cookie = await getCookie();

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual("rts@gmail.com");
});

it("responds with null if user is not authorized", async () => {
  const response = await request(app).get("/api/users/currentuser").expect(200);

  expect(response.body.currentUser).toBeNull();
});
