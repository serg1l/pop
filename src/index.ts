import express, { Request, Response } from "express";
import { config } from "dotenv";
import connection from "./config/dbConnection.js";
import userRouter from "./routes/userRoutes.js";
import verifyTokenAuth from "./middlewares/authMiddleware.js";
import followController from "./controllers/followController.js";
import followRouter from "./routes/followRoutes.js";
import publiRouter from "./routes/publicationRoutes.js";

config({ path: "./.env" });
const PORT = process.env.PORT || 3000;
const app = express();
connection();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/login", (req: Request, res: Response) => {
  res.status(201).send("please log");
  return;
});

app.use("/api/user", userRouter);
app.use("/api/follow", followRouter);
app.use("/api/publication", publiRouter);
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
