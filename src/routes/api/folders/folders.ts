import { Router } from "express"
import { validateFolder } from "../../../validation"
import Folder from "../../../models/Folder"

const router = Router()

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

export default router
