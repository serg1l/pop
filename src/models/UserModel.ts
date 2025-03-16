import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser{
  _id: string;
  name: string;
  surname: string;
  created_at: Date;
  updated_at?: Date;
  role: string;
  picture: string;
  email: string;
  password: string;
};

const userModel = new Schema<IUser>({
  name: {
    required: true,
    type: String,
    unique: true
  },

  surname: {
    type: String,
  },

  created_at: {
    default: new Date(),
    type: Date
  },

  picture: {
    type: String,
    default: "default.png"
  },

  password: {
    required: true,
    type: String
  },

  role: {
    required: true,
    default: "user",
    type: String,
    enum: ["user", "admin", "owner", "superadmin"]
  },

  email: {
    required: true,
    type: String,
    unique: true,
    lowercase: true
  },

  updated_at: {
    type: Date
  }
});

userModel.pre("save", async function(next){
  if(!this.isModified("password")){
    return next();
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export async function comparePassword(candidatePassword: string, hashedPassword: string ){
  return bcrypt.compare(candidatePassword, hashedPassword)
};

const User = model<IUser>("user", userModel, "users");
export default User;
