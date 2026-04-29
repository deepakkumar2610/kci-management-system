import mongoose, { Schema, models, model } from "mongoose";

const AdminSchema = new Schema({
  username: String,
  password: String,
});

export default models.Admin || model("Admin", AdminSchema);
