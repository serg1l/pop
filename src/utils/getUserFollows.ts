import { ObjectId } from "mongoose";
import Followers from "../models/FollowModel.js";

export default async function getAllUserFollows(userId: ObjectId){

  const [FOLLOWING, FOLLOWERS] = await Promise.all([
    Followers.find({ follower_user_id: userId })
      .select({followed_user_id: 1, _id: 0})
      .exec(),

    Followers.find({ followed_user_id: userId })
      .select({ follower_user_id: 1, _id: 0 })
      .exec()
  ]);

  return {
    following: FOLLOWING.map(followed => followed.followed_user_id),
    followers: FOLLOWERS.map(follower => follower.follower_user_id)
  };
};
