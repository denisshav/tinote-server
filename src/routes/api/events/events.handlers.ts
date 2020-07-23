import Emitter from "./Emitter"

export function subscribeOnEvent(req: any, res: any) {
  req.socket.setTimeout(999999999)

  const unsub = Emitter.subscribe(req.user._id, (data: any) => {
    res.write("id: " + 1 + "\n")
    res.write("data: " + JSON.stringify(data) + "\n\n") // Note the extra newline
  })

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
  })

  res.write("\n")

  req.on("close", function () {
    unsub()
  })
}
