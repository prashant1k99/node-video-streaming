const express = require('express')
const fs = require('fs')
const app = express()

app.get("/video", function (req, res) {
  const range = req.headers.range
  if (!range)
    return res.status(400).send("Please send the Range in the Request Header")
  
  const sizeOfVideo = fs.statSync("bunny.mp4").size
  const CHUNK_SIZE = 10 ** 6,
    start = Number(range.replace(/\D/g, "")),
    end = Math.min(start + CHUNK_SIZE, sizeOfVideo - 1)

  const contentLength = end - start + 1,
    contentHeader = {
      "Content-Range": `bytes ${start}-${end}/${sizeOfVideo}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4"
    }

  res.writeHead(206, contentHeader)
  const videoStream = fs.createReadStream('./bunny.mp4', { start, end })
  videoStream.pipe(res)
})

app.get("/non-processed", function (req, res) {
  res.sendFile(__dirname + "/no-processed.html")
})

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html")
})

app.listen(5000, () => {
  console.log('Server running on PORT: http://localhost:5000')
})