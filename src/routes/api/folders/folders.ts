import { Router } from "express"
import Joi from "joi" //used for validation
import mongoose from "mongoose"
import { folder, folderSchema } from "../../../types/folder"

const router = Router()
const Folder = mongoose.model("Folder", folderSchema)

router.get("/", async (req, res) => {
  res.send(await Folder.find({}))
})

router.get("/:id", async (req, res) => {
  res.send(await Folder.findById({ _id: req.params.id }))
})

router.post("/", (req, res) => {
  const { error } = validateFolder(req.body)
  if (error) {
    res.status(400).send(error.details[0].message)
    return
  }
  const note = new Folder({
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
  const { error } = validateFolder(req.body)
  if (error) {
    res.status(400).send(error.details[0].message)
    return
  }

  const updateRes = await Folder.update(
    { _id: req.params.id },
    { title: req.body.title }
  )

  res.send({
    modified: updateRes.nModified,
    matched: updateRes.n,
  })
})

router.delete("/:id", (req, res) => {
  Folder.findOneAndRemove({ _id: req.params.id }, (error, docs) => {
    if (error) {
      res.status(400).send(error.message)
    } else {
      res.status(200).send(docs)
    }
  })
})

function validateFolder(folder: folder) {
  const schema = {
    namer: Joi.string().min(3).required(),
    color: Joi.string().min(0).required(),
    icon: Joi.string().min(1).required(),
  }
  return Joi.validate(folder, schema)
}

export default router
