import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export default function verifyTokenAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      console.log("new login");
      next();
      return;
    };

    const payload = jwt.verify(<string>token, <string>process.env.JWT_SECRET);
    const timestamp = (<JwtPayload>payload).exp;

    res.locals.user = payload;
    next();
    return;

  } catch (error) {
    console.log((<any>error).message);
    next();
  };
};
