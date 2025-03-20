import { Schema, model, ObjectId } from "mongoose";

export interface IFollow{
  _id: ObjectId,
  follower_user_id: ObjectId,
  followed_user_id: ObjectId,
  followed_at: Date
};

const followModel = new Schema<IFollow>({
  follower_user_id: {
    type: Schema.ObjectId,
    required: true,
    ref: "User"
  },

  followed_user_id: {
    type: Schema.ObjectId,
    required :true,
    ref: "User"
  },

  followed_at: {
    type: Date,
    default: new Date()
  }
});

followModel.pre("save", async function (next) {
  console.log("hoal")
  next();
});

export default model<IFollow>("Follower", followModel, "follows");
