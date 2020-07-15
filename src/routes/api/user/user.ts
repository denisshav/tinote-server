import { Router } from "express"
import User from "../../../models/User"
import { registerValidation, loginValidation } from "../../../validation"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
const router = Router()

router.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body)
  if (error) {
    return res.status(400).send(error.details[0].message)
  }

  const emailExist = await User.findOne({ email: req.body.email })
  if (emailExist) {
    return res.status(400).send("Email already exists")
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)

  const user = new User({
    email: req.body.email,
    password: hashedPassword,
  })

  try {
    const savedUser = await user.save()
    const token = jwt.sign(
      { _id: savedUser.get("_id") },
      process.env.TOKEN_SECRET!
    )
    res.header("auth-token", token).send(token)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.post("/login", async (req, res) => {
  console.log("login request")
  const { error } = loginValidation(req.body)
  console.log(req.body)
  if (error) {
    console.log("login request error")
    console.log(req.body)
    console.log(error.details[0].message)
    return res.status(400).send(error.details[0].message)
  }

  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    console.log("no user")
    return res.status(400).send("Email or password is wrong")
  }
  const validPass = await bcrypt.compare(
    req.body.password,
    user.get("password")
  )
  if (!validPass) {
    console.log("no valid pass")
    return res.status(400).send("Email or password is wrong")
  }

  const token = jwt.sign({ _id: user.get("_id") }, process.env.TOKEN_SECRET!)
  res.header("auth-token", token).send(token)
})

export default router
