import { Router } from "express"
import { verifyAuth } from "../../../middleware/verifyToken"
import { registerUser, verifyUser, loginUser } from "./user.handlers"
import { verifyCors } from "../../../middleware/corsMiddle"

const router = Router()

router.post("/register", verifyCors, registerUser)

router.post("/verify", verifyCors, verifyAuth, verifyUser)

router.post("/login", verifyCors, loginUser)

export default router
