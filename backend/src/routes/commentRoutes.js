import express from "express"
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { getCommentsByPost, createComment, deleteComment } from "../controllers/commentController.js"

const router = express.Router()

router.get("/:postId/comments", authMiddleware, getCommentsByPost)
router.post("/:postId/comments", authMiddleware, createComment)
router.delete("/comments/:commentId", authMiddleware, deleteComment)

export default router