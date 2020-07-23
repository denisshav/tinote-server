import jwt from "jsonwebtoken"


if (!process.env.DB_CONNECT) {
  console.log("\x1b[31m%s\x1b[0m", "Wasn't provided TOKEN_SECRET env to redis-instance")

  throw new Error("Wasn't provided TOKEN_SECRET env to redis-instance")
}

if (!process.env.TOKEN_SECRET) {
  throw new Error("Wasn't provided TOKEN_SECRET env to redis-instance")
} 

export const verifyAuth = (req: any, res: any, next: any) => {
  const { auth } = req.query
  if (!auth) {
    return res.status(401).write("Access Denied")
  }

  try {
    const verified = jwt.verify(auth, process.env.TOKEN_SECRET!)
    req.user = verified
    next()
  } catch (error) {
    res.status(401).write("Access Denied")
  }
}
