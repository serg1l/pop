import User, { comparePassword, IUser } from "../models/UserModel.js";
import { Request, Response } from "express";
import registerVal from "../utils/registerValidation.js";
import loginVal from "../utils/loginValidation.js";
import generateToken from "../utils/generateToken.js";

class userController {
  async createUser(req: Request, res: Response) {
    try {
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
        created_at: new Date(),
        picture: req.body.picture
      });

      res.status(201).send({
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          surname: newUser.surname
        }
      })
        .end();
    } catch (error) {
      const message = (<any>error).message;

      if (message === "exist") {
        res.status(409).json({
          message: "user with this name or email already exist"
        });
        return;
      };

      res.status(500).json({
        message: "unexpected error when creating the user, try later"
      });
      console.log(error)
    };
    return;
  };

  async deleteUser() {

  };

  async updateUser() {

  };

  async loginUser(req: Request, res: Response) {

    if (res.locals.user) {
      res.status(201).json({
        message: "logged in via json web token!",
        user: res.locals.user
      }).end();
      return;
    };

    try {
      const { password, email, name } = loginVal.parse(req.body);
      const userExist = await User.findOne({
        $or: [
          { name },
          { email }
        ]
      })
        .exec();

      if (!userExist) throw new Error("existn't");

      const passwordValidation = await comparePassword(password, userExist.password);
      if (!passwordValidation) throw new Error("password");

      const token = generateToken(userExist);

      res.status(201).json({
        logged: {
          _id: userExist._id,
          name: userExist.name,
          surname: userExist.surname,
          email: userExist.email,
          token: token,
          picture: userExist.picture
        }
      }).end();
    } catch (error) {
      const message = (<any>error).message;

      if (message === "existn't") {
        res.status(404).json({
          message: "user doesn't exist"
        }).end();
        return;
      };

      if (message === "password") {
        res.status(401).json({
          message: "incorrect password"
        }).end();
        return;
      };

      res.status(500).json({
        message: "unexpected error when login, try later"
      }).end();
      console.log(error)
    };
    return;
  };

  async getMyUser(req: Request, res: Response) {

    if (!res.locals.user) {
      res.status(401).json({
        message: "log in first to get your information."
      }).end();
      return;
    };

    try {
      const id = req.params.id;
      const user = await User.findById(id)
        .select({
          password: 0,
          role: 0,
          __v: 0,
          _id: 0
        }).exec();

      res.status(201).json({
        message: "here's your info",
        user: user
      });

    } catch (error) {
      res.status(500).json({
        message: "error fetching user data from the database, please try again later"
      });
    };
    return;
  };
};

export default new userController();
