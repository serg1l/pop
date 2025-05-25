import { Router } from "express";
import verifyTokenAuth from "../middlewares/authMiddleware.js";
import publicationController from "../controllers/publicationController.js";

const publiRouter = Router();

publiRouter.get("/", verifyTokenAuth, publicationController.getAllPublications);
publiRouter.get("/:user", verifyTokenAuth, publicationController.getUserPublications);
publiRouter.post("/", verifyTokenAuth, publicationController.createPublication);
publiRouter.delete("/:id", verifyTokenAuth, publicationController.deletePublication);
export default publiRouter;
