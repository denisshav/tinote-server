import jwt from "jsonwebtoken"

export const auth = (req: any, _: any, next: any) => {
  const token = req.header("auth-token")
  if (!token) {
    return req.status(401).send("Access Denied")
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET!)
    req.user = verified
    next()
  } catch (error) {
    req.status(400).send("Invalid Token")
  }
}
