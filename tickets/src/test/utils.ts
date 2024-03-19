import { sign } from "jsonwebtoken";

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
