import { Router } from "express"
import { validateNote } from "../../../validation"
import Note from "../../../models/Note"
import { verifyAuth } from "../user/verifyToken"

import Emitter from "../events/Emitter"

const router = Router()

router.get("/", verifyAuth, async (req: any, res) => {
  res.send(await Note.find({ userId: req.user._id }))
})

router.get("/:id", verifyAuth, async (req: any, res) => {
  res.send(await Note.findById({ _id: req.params.id, userId: req.user._id }))
})

router.post("/", verifyAuth, (req: any, res) => {
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
    userId: req.user._id,
  })
  note.save((err, noteItem) => {
    if (err) {
      console.error(err)
      res.status(400).send(err.message)
    }
    res.send(noteItem)
  })
})

router.put("/", verifyAuth, async (req: any, res) => {
  if (!Array.isArray(req.body.docs) || !Array.isArray(req.body.deletedIds)) {
    return res.status(400).send("Body args aren't arrays")
  }
  if (req.body.docs.length < 1 && req.body.deletedIds.length < 1) {
    return res.status(200).send("Body is empty")
  }
  try {
    let nMod = req.body.deletedIds.length
    req.body.docs.forEach(async (note: any) => {
      const { error } = validateNote(note)
      if (error) {
        console.log(error)
        return
      }
      nMod += await Note.updateOne(
        { _id: note._id, userId: req.user._id },
        {
          title: note.title,
          content: note.content,
          folder: note.folder,
          date: note.date,
        },
        { upsert: true }
      )
    }).nModified
    Note.deleteMany(
      {
        _id: {
          $in: req.body.deletedIds,
        },
        userId: req.user._id,
      },
      error => {
        if (error) {
          console.log(error)
          res.status(400).send(error.message)
        } else {
          if (nMod > 0) {
            Emitter.emit(req.user._id, { ...req.body, type: "notes" })
          }
          res.status(200).send("Yep")
        }
      }
    )
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.delete("/", verifyAuth, (req: any, res) => {
  if (!Array.isArray(req.body.ids)) {
    return res.status(400).send("Body arg 'ids' isn't array")
  }
  Note.deleteMany(
    {
      _id: {
        $in: req.body.ids,
      },
      userId: req.user._id,
    },
    error => {
      if (error) {
        res.status(400).send(error.message)
      } else {
        res.status(200).send("Yep")
      }
    }
  )
})

export default router
