import { Request, Response } from "express";
import Followers, { IFollow } from "../models/FollowModel.js";
import login from "../utils/loginRedirection.js";
import User from "../models/UserModel.js";
import FollowModel from "../models/FollowModel.js";

class followController{
  async followUser(req: Request ,res: Response){
    if (!login(res)) return;

    try{
      const FOLLOWER_USER_ID = res.locals.user._id;
      const FOLLOWED_USER_ID = req.params.id;

      if (FOLLOWED_USER_ID === FOLLOWER_USER_ID) throw new Error("same");

      const [newFollower, userFollowed] = await Promise.all([
        Followers.create({
          followed_at: new Date(),
          follower_user_id: FOLLOWER_USER_ID,
          followed_user_id: FOLLOWED_USER_ID
        }),
        User.findById({ _id: FOLLOWED_USER_ID })
      ]);

      res.status(201).send({
        message: `followed ${userFollowed?.name}`,
        newFollower
      }).end();

    }catch(error){
      const message = (<any>error).message;

      if(message === "same"){
        res.status(401).send({
          message: "you can't follow yourself bitch"
        }).end();
        return;
      };

      res.status(500).send({
        message: "an error ocurred while following, please try again"
      }).end();
      console.log(error);
    };
    return;
  };

  async unfollowUser(req: Request, res: Response){
    if (!login(res)) return;
    const [UNFOLLOWER_USER_ID, UNFOLLOWED_USER_ID] = [res.locals.user._id, req.params.id];

    try{
      if (UNFOLLOWED_USER_ID === UNFOLLOWER_USER_ID) throw new Error("same");

      const unfollow = await FollowModel.findOneAndDelete({
        $and: [
          { follower_user_id: UNFOLLOWER_USER_ID },
          { followed_user_id: UNFOLLOWED_USER_ID }
        ]
      });

      if (unfollow === null) throw new Error("unfollow");
      res.status(201).send({
        message: `unfollowed`,
        unfollow
      }).end();
    }catch(error){
      const message = (<any>error).message;

      if(message === "same"){
        res.status(401).send({
          message: "you can't unfollow yourself"
        }).end();
        return;
      };

      if(message === "unfollow"){
        res.status(401).send({
          message: "you can't unfollow someone you don't follow"
        }).end();
        return;
      };

      res.status(500).send({
        message: "error while unfollowing, try again later"
      }).end();
    };
    return;
  };
};

export default new followController();
