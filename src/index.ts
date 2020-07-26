console.clear()

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

const mode = process.env.SERVER_MODE || "development"

console.log("\x1b[33m%s%s%s\x1b[0m", "[Server] Server run in ", mode, " mode")

configMongoose()
const app = configExpress()
const httpServer = configAndRunHttpServer(app)

if (mode == "production") {
  const httpsServer = configAndRunHttpsServer(app)
}

function configMongoose() {
  if (!process.env.DB_CONNECT) {
    console.log(
      "\x1b[31m%s\x1b[0m",
      "[Server] Wasn't provided DB_CONNECT env to mongoose"
    )

    throw new Error("Wasn't provided DB_CONNECT env to mongoose")
  }

  mongoose.connect(process.env.DB_CONNECT!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  const db = mongoose.connection
  db.on("error", console.error.bind(console, "connection error:"))
  db.once("open", function () {
    console.log("[Server] Connected to MongoDB")
  })

  return db
}

function configExpress() {
  const app = express()
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())

  app.options("*", (req, res) => {
    res.set("Access-Control-Allow-Origin", "*")
    res.set("Access-Control-Allow-Methods", "GET, OPTIONS, POST, PUT")
    res.set("Access-Control-Allow-Headers", "Content-Type")

    res.send()
  })

  app.use("/api", apiRoutes)
  app.use(cors())
  app.use("/static", express.static(__dirname + "/build/static"))
  app.get("/", (req, res) => res.sendFile(__dirname + "/build/index.html"))
  app.get("/tinote", (req, res) =>
    res.sendFile(__dirname + "/build/index.html")
  )

  return app
}

function configAndRunHttpServer(app: any) {
  const httpServer = http.createServer(app)

  const port = process.env.PORT || 8080
  httpServer.listen(port, () =>
    console.log(`[Server] Listening http on port ${port}...`)
  )

  return httpServer
}

function configAndRunHttpsServer(app: any) {
  const privateKey = fs.readFileSync(__dirname + "/sslcert/s.key", "utf8")
  const certificate = fs.readFileSync(__dirname + "/sslcert/s.cert", "utf8")
  const credentials = { key: privateKey, cert: certificate }

  const httpsServer = https.createServer(credentials, app)

  const portHttps = process.env.PORT_HTTPS || 8443
  httpsServer.listen(portHttps, () =>
    console.log(`[Server] Listening https on port ${portHttps}...`)
  )

  return httpsServer
}
