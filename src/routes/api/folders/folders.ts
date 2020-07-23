import { Router } from "express"
import { verifyAuth } from "../../../middleware/verifyToken"
import {
  getAllFolders,
  getFolderById,
  updateAndDeleteFolder,
  addFolder,
  deleteFolders,
} from "./folders.handlers"

const router = Router()

router.get("/", verifyAuth, getAllFolders)

router.get("/:id", verifyAuth, getFolderById)

router.post("/", verifyAuth, addFolder)

router.put("/", verifyAuth, updateAndDeleteFolder)

router.delete("/", verifyAuth, deleteFolders)

export default router
