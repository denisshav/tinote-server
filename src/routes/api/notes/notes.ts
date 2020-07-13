import { Router } from "express"
import Joi from "joi" //used for validation
import mongoose from "mongoose"
import { note, noteSchema } from "../../../types/note"

const router = Router()
const Note = mongoose.model("Note", noteSchema)

router.get("/", async (req, res) => {
  res.send(await Note.find({}))
})

router.get("/:id", async (req, res) => {
  console.log(req.params.id)
  res.send(await Note.findById({ _id: req.params.id }))
})

router.post("/", (req, res) => {
  const { error } = validateNote(req.body)
  if (error) {
    res.status(400).send(error.details[0].message)
    return
  }
  const note = new Note({
    title: req.body.title,
    content: req.body.content,
    folder: req.body.folder,
    date: req.body.date,
  })
  note.save((err, noteItem) => {
    if (err) {
      console.error(err)
      res.status(400).send(err.message)
    }
    res.send(noteItem)
  })
})

router.put("/:id", async (req, res) => {
  const { error } = validateNote(req.body)
  if (error) {
    res.status(400).send(error.details[0].message)
    return
  }

  const updateRes = await Note.update(
    { _id: req.params.id },
    { title: req.body.title }
  )

  res.send({
    modified: updateRes.nModified,
    matched: updateRes.n,
  })
})

router.delete("/:id", (req, res) => {
  console.log(req.params.id)
  Note.findOneAndRemove({ _id: req.params.id }, (error, docs) => {
    if (error) {
      res.status(400).send(error.message)
    } else {
      res.status(200).send(docs)
    }
  })
})

function validateNote(note: note) {
  const schema = {
    title: Joi.string().min(3).required(),
    content: Joi.string().min(0).required(),
    folder: Joi.string().min(1).required(),
    date: Joi.date().required(),
  }
  return Joi.validate(note, schema)
}

export default router
