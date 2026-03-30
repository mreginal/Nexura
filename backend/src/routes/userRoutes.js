import express from "express"
import User from "../models/User.js"
import Post from "../models/Post.js"
import fs from "fs"
import multer from "multer"
import path from "path"
import { authMiddleware } from "../middlewares/authMiddleware.js"

const router = express.Router()

const uploadPath = path.resolve("uploads")

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname)
    cb(null, fileName)
  }
})

const upload = multer({ storage })

// Buscar usuário por ID
router.get("/users/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("friends", "name profileImage username")
      .populate("friendRequestsSent", "name profileImage username")
      .populate("friendRequestsReceived", "name profileImage username")

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" })
    }

    const posts = await Post.find({ user: req.params.id }).sort({ createdAt: -1 })

    res.json({ user, posts })
  } catch (err) {
    console.error("Erro em /users/:id:", err)
    res.status(500).json({ error: err.message })
  }
})

// Usuário logado
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate("friends", "name profileImage username")
      .populate("friendRequestsSent", "name profileImage username")
      .populate("friendRequestsReceived", "name profileImage username")

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" })
    }

    const posts = await Post.find({ user: req.userId }).sort({ createdAt: -1 })

    res.json({ user, posts })
  } catch (err) {
    console.error("Erro em /me:", err)
    res.status(500).json({ error: err.message })
  }
})

router.put(
  "/update",
  authMiddleware,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const userId = req.userId
      const { name, bio } = req.body

      const updateData = {}

      if (name) updateData.name = name
      if (bio) updateData.bio = bio

      if (req.files?.profileImage?.length > 0) {
        updateData.profileImage =
          "/uploads/" + req.files.profileImage[0].filename
      }

      if (req.files?.coverImage?.length > 0) {
        updateData.coverImage =
          "/uploads/" + req.files.coverImage[0].filename
      }

      const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
        new: true
      })
        .populate("friends", "name profileImage username")
        .populate("friendRequestsSent", "name profileImage username")
        .populate("friendRequestsReceived", "name profileImage username")

      res.json({ user: updatedUser })
    } catch (error) {
      console.error("Erro em /update:", error)
      res.status(500).json({ error: error.message })
    }
  }
)

export default router