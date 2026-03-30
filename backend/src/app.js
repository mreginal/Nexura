import express from "express"
import cors from "cors"
import dotenv from "dotenv"

//Rotas:
import authRoutes from "./routes/authRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import commentRoutes from "./routes/commentRoutes.js"
import profile from "./routes/userRoutes.js"
import friendRoutes from "./routes/friendRoutes.js"

dotenv.config()
const app = express()

//Configurações gerais das rotas da aplicação:

app.use(cors())
app.use(express.json())
app.use("/api", profile)
app.use("/api/auth", authRoutes)
app.use("/api/posts", postRoutes )
app.use("/api/posts", commentRoutes)
app.use("/api", friendRoutes)
app.use("/images", express.static("./images"))
app.use("/uploads", express.static("uploads"))


export default app