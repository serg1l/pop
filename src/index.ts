import express from "express";
import { config } from "dotenv";

config({ path: "./.env" });
const PORT = process.env.PORT || 3000;
const app = express();

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
