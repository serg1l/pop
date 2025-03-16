import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export default function verifyTokenAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;

  try {
    if (!token) {
      console.log("no token");
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
