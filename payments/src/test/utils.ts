import { sign } from "jsonwebtoken";
import mongoose from "mongoose";

export const getCookie = (id?: string) => {
  const payload = {
    id: id ?? new mongoose.Types.ObjectId().toHexString(),
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
