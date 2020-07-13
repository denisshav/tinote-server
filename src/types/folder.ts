import mongoose from "mongoose"
export type folder = {
  name: string
  color: string
  id: string
  icon: string
}

export const folderSchema = new mongoose.Schema({
  name: String,
  color: String,
  icon: String,
})
