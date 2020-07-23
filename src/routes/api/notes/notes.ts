import { Router } from "express"
import { verifyAuth } from "../../../middleware/verifyToken"
import {
  getNoteById,
  getAllNotes,
  updateAndDeleteNotes,
  deleteNotes,
  addNote,
} from "./notes.handlers"

const router = Router()

router.get("/", verifyAuth, getAllNotes)

router.get("/:id", verifyAuth, getNoteById)

router.post("/", verifyAuth, addNote)

router.put("/", verifyAuth, updateAndDeleteNotes)

router.delete("/", verifyAuth, deleteNotes)

export default router
