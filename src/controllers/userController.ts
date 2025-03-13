import User, { IUser } from "../models/UserModel.js";
import { Request, Response } from "express";
import registerVal from "../utils/registerValidation.js";

class userController {
  async createUser(req: Request, res: Response){
    try{
      const { name, email, password } = registerVal.parse(req.body);
      const userExist = await User.findOne({
        $or: [
          { email },
          { name }
        ]
      }).exec();

      if (userExist) {
        throw new Error("exist");
      }

      const newUser = await User.create({
        name,
        email,
        password,
        surname: req.body.surname || name,
        created_at: new Date()
      });

      res.status(201).send(newUser);
      res.end();
    }catch(error){
      const message = (<any>error).message;

      if(message === "exist"){
        res.status(409).json({
          message: "user with this name or email already exist"
        });
        return;
      };

      res.status(500).json({
        message: "unexpected error when creating the user, try later"
      });
    };
    return;
  };

  async deleteUser(){

  };

  async updateUser(){

  };

  async loginUser(){

  };

  async getMyUser(){

  };
};

export default new userController();
