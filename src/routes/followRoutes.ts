import { Router } from "express";
import verifyTokenAuth from "../middlewares/authMiddleware.js";
import followController from "../controllers/followController.js";

const followRouter = Router();

followRouter.get("/following/:id?/:page?", verifyTokenAuth, followController.listUserFollowing);
followRouter.get("/follower/:id?/:page?", verifyTokenAuth, followController.listUserFollowers);
followRouter.post("/:id", verifyTokenAuth, followController.followUser);
followRouter.delete("/:id", verifyTokenAuth, followController.unfollowUser);

export default followRouter;
