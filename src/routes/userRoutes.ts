import { Router } from "express";
import userController from "../controllers/userController.js";
import verifyTokenAuth from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uplaodPicture.js";
const userRouter = Router();

userRouter.get("/users/:page?", verifyTokenAuth, userController.listUsers);
userRouter.get("/me/:id?", verifyTokenAuth, userController.getMyUser);
userRouter.get("/pfp/:filename", verifyTokenAuth, userController.getUserPicutre);
userRouter.post("/" ,userController.createUser);
userRouter.post("/login", verifyTokenAuth, userController.loginUser);
userRouter.post("/upload", verifyTokenAuth, upload, userController.updatePicture);
userRouter.patch("/", verifyTokenAuth, userController.updateUser);
userRouter.delete("/", verifyTokenAuth, userController.deleteUser);

export default userRouter;
