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

  async deletePublication(req: Request, res: Response) {
    if (!login(res)) return;

    const user_id = res.locals.user._id;
    const publication_id = req.params.id;

    try {
      const publicationExist = await Publications.findById(publication_id);
      if(!publicationExist) {
        res.status(404).send({
          message: "publication not found"
        }).end();
        return;
      };
      if(publicationExist.user_id?.toString() !== user_id) {
        res.status(403).send({
          message: "you are not authorized to delete this publication"
        }).end();
        return;
      };

      await publicationExist.deleteOne();
      res.status(200).send({
        message: "publication deleted"
      }).end();
    }catch(error) {
      res.status(500).send({
        message: "error while deleting the publication"
      }).end();
      console.log(error);
    };
  };

  async updatePublication(req: Request, res: Response) {
    if (!login(res)) return;

    const user_id = res.locals.user._id;
    const publication_id = req.params.id;

    try {
      const publicationExist = await Publications.findById(publication_id);
      if(!publicationExist) {
        res.status(404).send({
          message: "publication not found"
        }).end();
        return;
      };

      if(publicationExist.user_id !== user_id) {
        res.status(403).send({
          message: "you are not authorized to update this publication"
        }).end();
        return;
      };

      const params = publiVal.parse(req.body);

      const updatedPublication = await Publications.findByIdAndUpdate(
        publication_id,
        params,
        { new: true }
      );

      res.status(200).send({
        message: "publication updated",
        publication: updatedPublication
      }).end();
    }catch(error) {
      res.status(500).send({
        message: "error while updating the publication"
      }).end();
      console.log(error);
    };
  };

  async getAllPublications(req: Request, res: Response) {
    if (!login(res)) return;

    try {
      const publications = await Publications.find({}).populate("user_id");

      res.status(200).send({
        message: "publications retrieved",
        publications
      }).end();
    }catch(error) {
      res.status(500).send({
        message: "error while retrieving publications"
      }).end();
      console.log(error);
    };
  };

  async getUserPublications(req: Request, res: Response) {
    if (!login(res)) return;

    const user_id = req.params.id;

    try {
      const publications = await Publications.find({ user_id });

      res.status(200).send({
        message: "user publications retrieved",
        publications
      }).end();
    }catch(error) {
      res.status(500).send({
        message: "error while retrieving user publications"
      }).end();
      console.log(error);
    };
  };
};

export default new publicationController();
