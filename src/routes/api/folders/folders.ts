import { Router } from "express"
import { verifyAuth } from "../../../middleware/verifyToken"
import {
  getAllFolders,
  getFolderById,
  updateAndDeleteFolder,
  addFolder,
  deleteFolders,
} from "./folders.handlers"
import { verifyCors } from "../../../middleware/corsMiddle"

const router = Router()

router.get("/", verifyCors, verifyAuth, getAllFolders)

router.get("/:id", verifyCors, verifyAuth, getFolderById)

router.post("/", verifyCors, verifyAuth, addFolder)

router.put("/", verifyCors, verifyAuth, updateAndDeleteFolder)

router.delete("/", verifyCors, verifyAuth, deleteFolders)

export default router
