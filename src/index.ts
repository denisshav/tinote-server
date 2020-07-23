import * as dotenv from "dotenv"
dotenv.config()

import fs from "fs"
import https from "https"
import http from "http"
import express from "express"
import bodyParser from "body-parser"
import cors from "cors"

import mongoose from "mongoose"
import apiRoutes from "./routes/api/api"

const privateKey = fs.readFileSync(__dirname + "/sslcert/server.key", "utf8")
const certificate = fs.readFileSync(__dirname + "/sslcert/server.cert", "utf8")
const credentials = { key: privateKey, cert: certificate }

// ============== mongoose ==========

if (!process.env.DB_CONNECT) {
  console.log("\x1b[31m%s\x1b[0m", "Wasn't provided DB_CONNECT env to mongoose")

  throw new Error("Wasn't provided DB_CONNECT env to mongoose")
}

mongoose.connect(process.env.DB_CONNECT!, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", function () {
  console.log("Connected to MongoDB")
})

// ============== /mongoose ==========

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use("/api", apiRoutes)
app.use(cors())
app.use("/static", express.static(__dirname + "/build/static"))
app.get("/", (req, res) => res.sendFile(__dirname + "/build/index.html"))
app.get("/tinote", (req, res) => res.sendFile(__dirname + "/build/index.html"))

const httpServer = http.createServer(app)
const httpsServer = https.createServer(credentials, app)

const port = process.env.PORT || 8080
httpServer.listen(port, () => console.log(`Listening http on port ${port}...`))
const portHttps = process.env.PORT_HTTPS || 8443
httpsServer.listen(portHttps, () =>
  console.log(`Listening https on port ${portHttps}...`)
)
