import { Router } from "express"
import notesRoutes from "./notes/notes"
import foldersRoutes from "./folders/folders"

const router = Router()

router.use("/notes", notesRoutes)
router.use("/folders", foldersRoutes)

export default router
