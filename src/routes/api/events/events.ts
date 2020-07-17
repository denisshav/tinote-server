import { Router } from "express"
import { verifyAuth } from "../user/verifyToken"
import { subscribeOnEvent } from "./eventsSender"

const router = Router()

router.get("/", verifyAuth, subscribeOnEvent)

export default router
