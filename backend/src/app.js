import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes.js"
import profile from "./routes/profile.js"

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())
app.use("/api/auth", authRoutes)
app.use("/api", profile)
app.use("/images", express.static("./images"))

export default app;