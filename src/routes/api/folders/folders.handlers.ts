import { Response } from "express"
import { validateFolder } from "../../../validation"
import Folder from "../../../models/Folder"
import Emitter from "../events/Emitter"

export const getFolderById = async (req: any, res: Response<any>) => {
  res.send(await Folder.find({ userId: req.user._id }))
}

export const getAllFolders = async (req: any, res: Response<any>) => {
  res.send(await Folder.findById({ _id: req.params.id, userId: req.user._id }))
}

export const addFolder = (req: any, res: Response<any>) => {
  const { error } = validateFolder(req.body)
  if (error) {
    res.status(400).send(error.details[0].message)
    return
  }

  const folder = new Folder({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
    userId: req.user._id,
  })

  folder.save((err, folderItem) => {
    if (err) {
      console.error(err)
      res.status(400).send(err.message)
    }
    res.send(folderItem)
  })
}

export const updateAndDeleteFolder = async (req: any, res: Response<any>) => {
  if (!Array.isArray(req.body.docs) || !Array.isArray(req.body.deletedIds)) {
    return res.status(400).send("Body args aren't arrays")
  }
  if (req.body.docs.length < 1 && req.body.deletedIds.length < 1) {
    return res.status(200).send("Body is empty")
  }

  try {
    let nUpdated = 0

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
      nUpdated += 1
    })

    const deleteRes = await Folder.deleteMany({
      _id: {
        $in: req.body.deletedIds,
      },
      userId: req.user._id,
    })

    const nDeleted = deleteRes.deletedCount || 0

    if (nUpdated + nDeleted > 0) {
      Emitter.emit(req.user._id, { ...req.body, type: "folders" })
    }

    res.status(200).send({ nUpdated, nDeleted })
  } catch (error) {
    res.status(400).send(error.message)
  }
}

export const deleteFolders = async (req: any, res: Response<any>) => {
  if (!Array.isArray(req.body.ids)) {
    return res.status(400).send("Body arg 'ids' isn't array")
  }

  try {
    const deleteRes = await Folder.deleteMany({
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
