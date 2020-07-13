import express from "express"
import mongoose from "mongoose"
import apiRoutes from "./routes/api/api"
import notesRoutes from "./routes/api/notes/notes"

mongoose.connect("mongodb://127.0.0.1:27017/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", function () {
  console.log("Connected")
})

const app = express()
app.use(express.json())
app.use("/api", apiRoutes)

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`Listening on port ${port}..`))
