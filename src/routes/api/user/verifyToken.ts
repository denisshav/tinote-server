import jwt from "jsonwebtoken"

export const verifyAuth = (req: any, res: any, next: any) => {
  const { auth } = req.query
  if (!auth) {
    return res.status(401).send("Access Denied")
  }

  try {
    const verified = jwt.verify(auth, process.env.TOKEN_SECRET!)
    req.user = verified
    next()
  } catch (error) {
    res.status(401).send("Access Denied")
  }
}
