import express from "express"
import mongoose from "mongoose"
import apiRoutes from "./routes/api/api"
import * as dotenv from "dotenv"

dotenv.config()
const app = express()

mongoose.connect(process.env.DB_CONNECT!, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", function () {
  console.log("Connected to db")
})

app.use(express.json())
app.use("/api", apiRoutes)

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`Listening on port ${port}..`))
