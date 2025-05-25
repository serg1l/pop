import mongoose from "mongoose";
const developer = Number(process.env.DEVELOPER);
import { config } from "dotenv";

config({ path: "./.env" });
const mongo_key = developer ? "mongodb://localhost:27017/" : process.env.MONGO_URI;


export default async function connection(){
  await mongoose.connect(<any>mongo_key, {
    dbName: "pop",
  });

  console.log("connection stablished");
};
