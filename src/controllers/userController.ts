import User, { comparePassword, IUser } from "../models/UserModel.js";
import { request, Request, Response } from "express";
import registerVal from "../utils/registerValidation.js";
import loginVal from "../utils/loginValidation.js";
import generateToken from "../utils/generateToken.js";
import login from "../utils/loginRedirection.js";
import updateVal from "../utils/updateValidation.js";
import bcrypt from "bcryptjs";
import { parse } from "dotenv";

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

  async deleteUser(req: Request, res: Response) {
    if (!login(res)) return;

    try {

    } catch (error) {

    };

  };

  async updateUser(req: Request, res: Response) {
    if (!login(res)) return;

    const updateValues = req.body;
    const user = res.locals.user;

    try {
      if (!Object.keys(updateValues)) throw new Error("empty");

      const parsedValues = updateVal.parse(updateValues);
      const userExist = await User.findOne({ $or: [{ name: parsedValues.name }, { email: parsedValues.email }] });

      if (userExist && (user.name !== userExist.name || user.email !== userExist.email)) {
        throw new Error("exist");
      };

      if(parsedValues.password){
        const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash(parsedValues.password, salt);
        parsedValues.password = hash;
      };

      const updated = await User.findByIdAndUpdate({ _id: user._id }, parsedValues, { new: true });
      res.status(201).send({
        message: "updated successfully",
        newUser: updated
      });

    } catch (error) {
      const message = (<any>error).message;

      if ( message === "empty") {
        res.status(401).send({
          message: "nothing sent to change"
        }).end();
        return;
      };

      if( message === "exist"){
        res.status(405).send({
          message: "this user exist, try other name/email"
        }).end();
        return;
      };

      res.status(500).send({
        message: "failed to update user, please try again later"
      });
      console.log(error);
    };
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
    if (!login(res)) return;

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

  async listUsers(req: Request, res: Response) {
    if (!login(res)) return;

    const page = parseInt(req.params.page, 10) || 0;
    const perPage = 4;
    const query = { $ne: res.locals.user._id };

    try {
      const [count, users] = await Promise.all([

        User.find({ _id: query })
          .estimatedDocumentCount(),

        User.find({ _id: query })
          .sort({ name: "asc" })
          .limit(perPage)
          .skip(perPage * page)
          .exec()
      ]);

      res.status(201).send({
        users: users,
        message: "users sended.",
        pages: Math.ceil(count / perPage)
      }).end();
    } catch (error) {
      res.status(500).send({
        message: "failed to fetch user from the database, please try later"
      }).end();
    };
    return;
  };
};

export default new userController();
