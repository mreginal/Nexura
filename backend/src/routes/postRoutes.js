import express from "express"
import Post from "../models/Post.js"
import { deletePost, updatePost } from "../controllers/postController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"

const router = express.Router()

router.get("/", async(req,res)=>{
    try {
        const posts = await Post.find()
            .populate("user", "name profileImage")
            .sort({createdAt: -1})

        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({message: "Erro ao buscar postagens: ", error})
    }
})

router.post("/", async (req,res)=>{
    try {
        const {content, image, userId} = req.body

        const newPost = new Post({
            content, image, user: userId,
        })

        const savedPost = await newPost.save()

        const popularedPost = await savedPost.populate("user", "name profileImage")

        res.status(201).json(popularedPost)
    } catch (error) {
        res.status(500).json({message: "Erro ao criar postagem: ", error})
    }
})

router.put("/:id", authMiddleware, updatePost)
router.delete("/:id", authMiddleware, deletePost)

export default router