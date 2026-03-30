import express from "express"
import Post from "../models/Post.js"
import { deletePost, getSavedPosts, toggleLikePost, toggleSavePost, updatePost } from "../controllers/postController.js"
import {authMiddleware} from "../middlewares/authMiddleware.js"

const router = express.Router()

// Buscar todos os posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name profileImage")
      .sort({ createdAt: -1 })

    res.status(200).json(posts)
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar postagens", error })
  }
})

// Buscar um post por ID
router.get("/saved/me", authMiddleware, getSavedPosts)

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user", "name profileImage")

    if (!post) {
      return res.status(404).json({ message: "Post não encontrado" })
    }

    res.status(200).json(post)
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar postagem", error })
  }
})

// Criar post
router.post("/", async (req, res) => {
  try {
    const { content, image, userId } = req.body

    const newPost = new Post({
      content,
      image,
      user: userId,
    })

    const savedPost = await newPost.save()

    const populatedPost = await savedPost.populate("user", "name profileImage")

    res.status(201).json(populatedPost)
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar postagem", error })
  }
})

router.put("/:id", authMiddleware, updatePost)
router.delete("/:id", authMiddleware, deletePost)
router.patch("/:id/like", authMiddleware, toggleLikePost)
router.patch("/:id/save", authMiddleware, toggleSavePost)


export default router