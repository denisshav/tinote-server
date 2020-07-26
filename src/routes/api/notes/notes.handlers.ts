import Note from "../../../models/Note"
import { Response } from "express"
import { validateNote } from "../../../validation"

import Emitter from "../events/Emitter"

export const getNoteById = async (req: any, res: Response<any>) => {
  if (!req.params.id) {
    return res.status(400).send("No note id provided")
  }

  const note = await Note.find({ _id: req.params.id, userId: req.user._id })

  if (note && note.length !== 0) {
    return res.send(note)
  } else {
    return res.status(400).send("No note was found")
  }
}

export const getAllNotes = async (req: any, res: Response<any>) => {
  res.send(await Note.find({ userId: req.user._id }))
}

export const addNote = (req: any, res: Response<any>) => {
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
    } else {
      res.send(noteItem)
    }
  })
}

export const updateAndDeleteNotes = async (req: any, res: Response<any>) => {
  if (!Array.isArray(req.body.docs) || !Array.isArray(req.body.deletedIds)) {
    return res.status(400).send("Body args aren't arrays")
  }
  if (req.body.docs.length < 1 && req.body.deletedIds.length < 1) {
    return res.status(200).send("Body is empty")
  }

  try {
    let nUpdated = 0

    req.body.docs.forEach(async (note: any) => {
      const { error } = validateNote(note)
      if (error) {
        console.log(error)
        return
      }

      await Note.updateOne(
        { _id: note._id, userId: req.user._id },
        {
          title: note.title,
          content: note.content,
          folder: note.folder,
          date: note.date,
        },
        { upsert: true }
      )

      nUpdated += 1
    })

    const deleteRes = await Note.deleteMany({
      _id: {
        $in: req.body.deletedIds,
      },
      userId: req.user._id,
    })

    const nDeleted = deleteRes.deletedCount || 0

    if (nUpdated + nDeleted > 0) {
      Emitter.emit(req.user._id, { ...req.body, type: "notes" })
    }

    res.status(200).send({ nUpdated, nDeleted })
  } catch (error) {
    res.status(400).send(error.message)
  }
}

export const deleteNotes = async (req: any, res: Response<any>) => {
  if (!Array.isArray(req.body.ids)) {
    return res.status(400).send("Body arg 'ids' isn't array")
  }

  try {
    const deleteRes = await Note.deleteMany({
      _id: {
        $in: req.body.ids,
      },
      userId: req.user._id,
    })

    res.status(200).send({ nDeleted: deleteRes.deletedCount || 0 })
  } catch (error) {
    res.status(400).send(error.message)
  }
}
