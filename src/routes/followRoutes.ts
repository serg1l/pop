import { Router } from "express";
import verifyTokenAuth from "../middlewares/authMiddleware.js";
import followController from "../controllers/followController.js";

const followRouter = Router();

followRouter.post("/:id", verifyTokenAuth, followController.followUser);
followRouter.delete("/:id", verifyTokenAuth, followController.unfollowUser);
export default followRouter;
