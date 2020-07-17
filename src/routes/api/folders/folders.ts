import { Router } from "express"
import { validateFolder } from "../../../validation"
import Folder from "../../../models/Folder"
import { verifyAuth } from "../user/verifyToken"
import Emitter from "../events/Emitter"

const router = Router()

router.get("/", verifyAuth, async (req: any, res) => {
  res.send(await Folder.find({ userId: req.user._id }))
})

router.get("/:id", verifyAuth, async (req: any, res) => {
  res.send(await Folder.findById({ _id: req.params.id, userId: req.user._id }))
})

router.post("/", verifyAuth, (req: any, res) => {
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
  try {
    req.body.docs.forEach(async (folder: any) => {
      const { error } = validateFolder(folder)
      if (error) {
        console.log(error)
        return
      }
      await Folder.updateOne(
        { _id: folder._id, userId: req.user._id },
        {
          name: folder.name,
          color: folder.color,
          icon: folder.icon,
        },
        { upsert: true }
      )
    })
    Folder.deleteMany(
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
          Emitter.emit(req.user._id, {...req.body, type: "folders"})
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
  Folder.deleteMany(
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
