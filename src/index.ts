import express from "express";
import { config } from "dotenv";
import connection from "./config/dbConnection.js";

config({ path: "./.env" });
const PORT = process.env.PORT || 3000;
const app = express();
connection();

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
