import User, { comparePassword, IUser } from "../models/UserModel.js";
import { request, Request, Response } from "express";
import registerVal from "../utils/registerValidation.js";
import loginVal from "../utils/loginValidation.js";
import generateToken from "../utils/generateToken.js";
import login from "../utils/loginRedirection.js";
import updateVal from "../utils/updateValidation.js";
import bcrypt from "bcryptjs";
import fs from "fs/promises";
import path from "path";
import PublicationModel from "../models/PublicationModel.js";
import FollowModel from "../models/FollowModel.js";

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

  async deleteUser(_req: Request, res: Response) {
    if (!login(res)) return;

    try {
      const userId = res.locals.user._id;

      // Get user data before deletion to access profile picture
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("user_not_found");
      }

      // Delete user profile picture if it's not the default
      if (user.picture && user.picture !== "default.png") {
        try {
          const picturePath = path.resolve(`./pfp/${user.picture}`);
          await fs.unlink(picturePath);
        } catch (fileError) {
          // Log error but don't stop the deletion process
          console.log(`Warning: Could not delete profile picture ${user.picture}:`, fileError);
        }
      }

      // Delete all publications by the user
      await PublicationModel.deleteMany({ user_id: userId });

      // Delete all follow relationships where user is either follower or followed
      await FollowModel.deleteMany({
        $or: [
          { follower_user_id: userId },
          { followed_user_id: userId }
        ]
      });

      // Delete the user
      await User.findByIdAndDelete(userId);

      res.status(200).json({
        message: "User and all associated data deleted successfully"
      });

    } catch (error) {
      const message = (<any>error).message;

      if (message === "user_not_found") {
        res.status(404).json({
          message: "User not found"
        });
        return;
      }

      res.status(500).json({
        message: "Error deleting user, please try again later"
      });
      console.log(error);
    }
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
      const id = Number(req.params.id) || res.locals.user._id;
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

  async updatePicture(req: Request, res: Response){
    if (!login(res)) return;

    try{
      if (!req.file?.path) throw new Error("file");

      const user = await User.findByIdAndUpdate({ _id: res.locals.user._id }, { picture: req.file.filename }, {new: true});
      if (user === null) throw new Error("null");

      res.status(201).send({
        message: "picture updated",
        user
      });
    }catch(error){
      const message = (<any>error).message;

      if(message === "file"){
        res.status(404).send({
          message: "empty field."
        }).end();
        return;
      };

      if(message === "null"){
        res.status(404).send({
          message: "user not found"
        })
        return;
      }
      res.status(500);
    };
    return
  };

  async getUserPicutre(req: Request, res: Response){
    if (!login(res)) return;
    const file = `./pfp/${req.params.filename}`;
    try{
      const filePath = await fs.stat(file);
      if (!filePath) throw new Error("exist");
      res.status(201).sendFile(path.resolve(file));
    }catch(error){
      res.status(500).send({
        message: "an error occurred, try again"
      }).end();
    };
    return;
  };
};

export default new userController();
