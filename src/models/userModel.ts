import { Schema, model } from "mongoose";

const userModel = new Schema({
  name: {
    required: true,
    type: String
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
  },

  updated_at: {
    type: Date
  }
});

export default model("user", userModel, "users");
