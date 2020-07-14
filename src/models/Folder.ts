import mongoose from "mongoose"

export const folderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 3,
  },
  color: String,
  icon: String,
})

const Folder = mongoose.model("Folder", folderSchema)

export default Folder
