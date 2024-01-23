import { Schema, model } from "mongoose"

export interface IUser {
  _id: string
  user_name: string
  password: string
  name: string
  token: string
}

export const userSchema = new Schema<IUser>({
  user_name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  token: { type: String, default: "" }
})

module.exports = model("User", userSchema)
