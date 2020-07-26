import { Router } from "express"
import { verifyAuth } from "../../../middleware/verifyToken"
import { subscribeOnEvent } from "./events.handlers"
import { verifyCors } from "../../../middleware/corsMiddle"

const router = Router()

router.get("/", verifyCors, verifyAuth, subscribeOnEvent)

export default router
