import mongoose from "mongoose"

export const folderSchema = new mongoose.Schema({
  _id: String,
  name: {
    type: String,
    required: true,
    min: 3,
  },
  color: String,
  icon: String,
  userId: String
})

const Folder = mongoose.model("Folder", folderSchema)

export default Folder
