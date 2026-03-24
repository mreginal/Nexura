import express from "express"
import User from "../models/User.js"
import Post from "../models/Post.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"

const router = express.Router()

router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    const posts = await Post
      .find({ userId: req.params.id })
      .sort({ createdAt: -1 })
    res.json({ user, posts })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId)

    const posts = await Post
      .find({ userId: req.userId })
      .sort({ createdAt: -1 })

    res.json({ user, posts })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router