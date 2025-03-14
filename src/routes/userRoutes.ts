import { Router } from "express";
import userController from "../controllers/userController.js";
import verifyTokenAuth from "../middlewares/authMiddleware.js";
const userRouter = Router();

userRouter.get("/me/:id", verifyTokenAuth, userController.getMyUser);
userRouter.post("/" ,userController.createUser);
userRouter.post("/login", verifyTokenAuth, userController.loginUser);
userRouter.put("/");
userRouter.delete("/");

export default userRouter;
