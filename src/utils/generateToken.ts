import jwt from "jsonwebtoken";
import { IUser } from "../models/UserModel.js";

export default function generateToken(user: IUser): string{
  return jwt.sign({  name: user.name, email: user.email, surname: user.surname, picture: user.picture }, <any>process.env.JWT_SECRET, {
    expiresIn: "30d"
  });
};
