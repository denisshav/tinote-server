import mongoose from "mongoose"

export const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  password: {
    type: String,
    required: true,
    max: 1024,
  },
})

const User = mongoose.model("User", userSchema)

export default User
