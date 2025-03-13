import express from "express";
import { config } from "dotenv";
import connection from "./config/dbConnection.js";
import userRouter from "./routes/userRoutes.js";

config({ path: "./.env" });
const PORT = process.env.PORT || 3000;
const app = express();
connection();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user", userRouter);
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
