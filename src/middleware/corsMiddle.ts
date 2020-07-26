// const ALLOWED_ORIGINS = [
//   // 'http://home.com',
//   "http://localhost:3000",
// ]

export const verifyCors = (req: any, res: any, next: any) => {
  //   if (ALLOWED_ORIGINS.indexOf(req.headers.origin) > -1) {
  //     // res.set('Access-Control-Allow-Credentials', 'true')
  //     res.set("Access-Control-Allow-Origin", req.headers.origin)
  //     next()
  //   } else {
  //     // разрешить другим источникам отправлять неподтвержденные запросы CORS
  //     // res.set('Access-Control-Allow-Origin', '*')
  //     return res.status(400).send("not alowed cors")
  //   }

  res.set("Access-Control-Allow-Origin", "*")
  //   res.set("Access-Control-Allow-Methods", "GET, OPTIONS, PUT")
  //   res.set("Access-Control-Allow-Headers", "Content-Type")
  next()
}
