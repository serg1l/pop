import express, { Request, Response } from "express";
import { config } from "dotenv";
import connection from "./config/dbConnection.js";
import userRouter from "./routes/userRoutes.js";
import verifyTokenAuth from "./middlewares/authMiddleware.js";

config({ path: "./.env" });
const PORT = process.env.PORT || 3000;
const app = express();
connection();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", verifyTokenAuth, (req: Request, res: Response) => {
  if(!res.locals.user){
    res.redirect(301, "http://localhost:6700/login");
    res.end();
    return;
  };

  res.status(201).json({
    message: "ommiting password loggin, logged in with json web token",
    user: res.locals.user
  }).end();
  return;
});

app.get("/login", (req: Request, res: Response) => {
  res.status(201).send("please log");
  return;
});

app.use("/api/user", userRouter);
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
