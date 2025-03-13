import { Router } from "express";
import userController from "../controllers/userController.js";
const userRouter = Router();

userRouter.get("/");
userRouter.post("/" ,userController.createUser);
userRouter.put("/");
userRouter.delete("/");

export default userRouter;
