import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import http from "http"
import {Server} from "socket.io"

const app = express()
const server = http.createServer(app)
const io = new Server()

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);


io.on("connection", (socket) => {
    socket.on("")
})


app.use(express.json({ limit: "500kb" }));
app.use(express.urlencoded({ extended: true, limit: "500kb" }));
app.use(cookieParser())

export { server }