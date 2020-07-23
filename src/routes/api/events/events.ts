import { Router } from "express"
import { verifyAuth } from "../../../middleware/verifyToken"
import { subscribeOnEvent } from "./events.handlers"

const router = Router()

router.get("/", verifyAuth, subscribeOnEvent)

export default router
