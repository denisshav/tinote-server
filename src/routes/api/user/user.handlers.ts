import User from "../../../models/User"
import { registerValidation, loginValidation } from "../../../validation"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { Response } from "express"

export const registerUser = async (req: any, res: Response<any>) => {
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
}

export const loginUser = async (req: any, res: Response<any>) => {
  const { error } = loginValidation(req.body)
  if (error) {
    console.log("login request error")
    console.log(req.body)
    console.log(error.details[0].message)
    return res.status(400).send(error.details[0].message)
  }

  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    console.log("login request error")
    console.log("invalid email")
    console.log(req.body)
    return res.status(400).send("Email or password is wrong")
  }

  const validPass = await bcrypt.compare(
    req.body.password,
    user.get("password")
  )
  if (!validPass) {
    console.log("login request error")
    console.log("invalid password")
    console.log(req.body)
    return res.status(400).send("Email or password is wrong")
  }

  const token = await jwt.sign(
    { _id: user.get("_id") },
    process.env.TOKEN_SECRET!
  )
  res.header("auth-token", token).send(token)
}

export const verifyUser = async (_: any, res: Response<any>) => {
  res.status(200).send({ verified: true })
}
