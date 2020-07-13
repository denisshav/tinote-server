import mongoose from "mongoose"

export type note = {
  id: string
  title: string
  content: string
  folder: string
  date: Date
}

export const noteSchema = new mongoose.Schema({
  title: String,
    content: String,
    folder: String,
    date: Date,
});
