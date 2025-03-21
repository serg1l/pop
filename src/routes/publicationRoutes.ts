import { Router } from "express";
import verifyTokenAuth from "../middlewares/authMiddleware.js";
import PublicationModel from "../models/PublicationModel.js";
import publicationController from "../controllers/publicationController.js";

const publiRouter = Router();

publiRouter.post("/", verifyTokenAuth, publicationController.createPublication);

export default publiRouter;
