import { Router } from "express"
import { verifyAuth } from "../../../middleware/verifyToken"
import {
  getNoteById,
  getAllNotes,
  updateAndDeleteNotes,
  deleteNotes,
  addNote,
} from "./notes.handlers"
import { verifyCors } from "../../../middleware/corsMiddle"

const router = Router()

router.get("/", verifyCors, verifyAuth, getAllNotes)

router.get("/:id", verifyCors, verifyAuth, getNoteById)

router.post("/", verifyCors, verifyAuth, addNote)

router.put("/", verifyCors, verifyAuth, updateAndDeleteNotes)

router.delete("/", verifyCors, verifyAuth, deleteNotes)

export default router
