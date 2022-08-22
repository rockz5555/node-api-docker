import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "User must have a username"],
  },
  password: {
    type: String,
    required: [true, "User must have a password"],
  },
});

export const Auth = mongoose.model("Auth", authSchema);
