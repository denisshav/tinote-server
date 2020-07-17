import { Router } from "express"
import notesRoutes from "./notes/notes"
import foldersRoutes from "./folders/folders"
import userRoutes from "./user/user"
import eventsRoutes from "./events/events"

const router = Router()

router.use("/events", eventsRoutes)
router.use("/notes", notesRoutes)
router.use("/folders", foldersRoutes)
router.use("/user", userRoutes)

export default router
