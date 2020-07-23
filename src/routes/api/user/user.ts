import { Router } from "express"
import { verifyAuth } from "../../../middleware/verifyToken"
import { registerUser, verifyUser, loginUser } from "./user.handlers"

const router = Router()

router.post("/register", registerUser)

router.post("/verify", verifyAuth, verifyUser)

router.post("/login", loginUser)

export default router
