import redis from "redis"

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
