import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import profile from "./routes/users.js"

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())
app.use("/api", profile)
app.use("/api/auth", authRoutes)
app.use("/api/posts", postRoutes )

app.use("/images", express.static("./images"))
app.use("/uploads", express.static("uploads"))

export default app