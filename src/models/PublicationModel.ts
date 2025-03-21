import { Schema, model } from "mongoose";

const publicationModel = new Schema({

  content: {
    required: true,
    type: String
  },

  created_at: {
    type: Date,
    default: new Date()
  },

  user_id: {
    type: Schema.ObjectId,
    ref: "User"
  },

  updated_at: {
    type: Date
  },

  files: [
    {type: String}
  ]
});

export default model("Publication", publicationModel, "publications")
