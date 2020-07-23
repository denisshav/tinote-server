import redis from "redis"

if (!process.env.REDIS_HOST) {
  console.log(
    "\x1b[33m%s\x1b[0m",
    "Wasn't provided REDIS_HOST env to redis-instance"
  )
}
if (!process.env.REDIS_PORT) {
  console.log(
    "\x1b[33m%s\x1b[0m",
    "Wasn't provided REDIS_PORT env to redis-instance"
  )
}
if (!process.env.REDIS_PASS) {
  console.log(
    "\x1b[33m%s\x1b[0m",
    "Wasn't provided REDIS_PASS env to redis-instance"
  )
}

const client = redis.createClient({
  host: process.env.REDIS_HOST!,
  port: +process.env.REDIS_PORT!,
})

client.auth(process.env.REDIS_PASS!)

client.on("error", function (error: any) {
  console.error(error)
})

client.once("ready", function () {
  console.log("Connected to Redis")
})

export default client
