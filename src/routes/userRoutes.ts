import { Router } from "express";
import userController from "../controllers/userController.js";
import verifyTokenAuth from "../middlewares/authMiddleware.js";
const userRouter = Router();

userRouter.get("/users/:page?", verifyTokenAuth, userController.listUsers);
userRouter.get("/me/:id", verifyTokenAuth, userController.getMyUser);
userRouter.post("/" ,userController.createUser);
userRouter.post("/login", verifyTokenAuth, userController.loginUser);
userRouter.put("/", verifyTokenAuth);
userRouter.delete("/", verifyTokenAuth);

export default userRouter;
