import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import http from "http"
import { Server } from "socket.io"
import { FormValues, scrappLinkedinLead } from "./utils/scrap_web"
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: "" });

const app = express()
const server = http.createServer(app)

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser())



const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
    },
});

const waitFor = (ms: any) => new Promise((res) => setTimeout(res, ms));

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    socket.on("extract_link", async (data: FormValues) => {
      

        try {
            await scrappLinkedinLead(socket, data)
        } catch (error) {
            console.log("Error fetching")
        }


    })

    socket.on("chat_gen_ai", async (prompt) => {
        try {
            console.log("Received prompt:", prompt);

            const aiPromise  = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: String(prompt),
            });


            const timeout = waitFor(15000).then(() => "TIMEOUT");

            const result = await Promise.race([aiPromise , timeout]);

            if (result === "TIMEOUT") {
                socket.emit("gen_ai_response", "Assistant took too long. Please try again!");
                return;
            }

            const text = aiPromise.text || ""
            if (!text.trim()) {
                socket.emit("gen_ai_response", "Assistant is unable to respond right now. Please try again later!");
                return;
            }

            socket.emit("gen_ai_response", text);

        } catch (error) {
            console.error("AI Error:", error);
            socket.emit("gen_ai_response", "Assistant is unable to respond right now. Please try again later!");
        }
    })
})


app.get("/health", (req, res) => {
    res.status(200).json({ message: "OK" })
})

export { server }