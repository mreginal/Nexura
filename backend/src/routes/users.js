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
  },
})

const upload = multer({ storage })

// Buscar usuário por ID
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    const posts = await Post
      .find({ user: req.params.id })
      .sort({ createdAt: -1 })

    res.json({ user, posts })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Usuário logado
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId)

    const posts = await Post
      .find({ user: req.userId })
      .sort({ createdAt: -1 })

    res.json({ user, posts })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put("/update", authMiddleware, upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
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

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true }
      )

      res.json({ user: updatedUser })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default router