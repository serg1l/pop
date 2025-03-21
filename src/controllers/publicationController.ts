import { Request, Response } from "express";
import Publications from "../models/PublicationModel.js";
import login from "../utils/loginRedirection.js";
import publiVal from "../utils/publicationValidation.js";

class publicationController {
  async createPublication(req: Request, res: Response){
    if (!login(res)) return;

    try{
      const params = publiVal.parse(req.body);

      const publication = await Publications.create({
        ...params,
        user_id: res.locals.user._id
      });

      res.status(201).send({
        message: "publication created",
        publication
      }).end();
    }catch(error){
      res.status(500).send({
        message: "error while creating the publication"
      }).end();
      console.log(error);
    };
    return;
  };
};

export default new publicationController();
