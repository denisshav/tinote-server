import mongoose from "mongoose"

export const noteSchema = new mongoose.Schema({
  _id: String,
  title: String,
  content: String,
  folder: String,
  date: Date,
  userId: String
})

const Note = mongoose.model("Note", noteSchema)

export default Note
