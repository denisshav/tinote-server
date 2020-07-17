import mongoose, { Query } from "mongoose"
import Emitter from "../routes/api/events/Emitter"

export const noteSchema = new mongoose.Schema({
  _id: String,
  title: String,
  content: String,
  folder: String,
  date: Date,
  userId: String,
})

// noteSchema.pre("deleteMany", function (next) {
//   // Emitter.emit()
//   console.log(typeof this)

//   console.log((this as Query<any>).getQuery().userId)
//   Emitter.emit((this as Query<any>).getQuery().userId, "deleting")

//   next()
// })

const Note = mongoose.model("Note", noteSchema)

export default Note
