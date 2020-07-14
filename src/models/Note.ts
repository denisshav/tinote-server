import mongoose from "mongoose"

export const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  folder: String,
  date: Date,
})

const Note = mongoose.model("Note", noteSchema)

export default Note
