import express from "express"
import {authMiddleware} from "../middlewares/authMiddleware.js"
import { getCommentsByPost, createComment, deleteComment } from "../controllers/commentController.js"

const router = express.Router()

router.get("/:postId/comments", authMiddleware, getCommentsByPost) //Pegar comentários
router.post("/:postId/comments", authMiddleware, createComment) //Criar comentários
router.delete("/comments/:commentId", authMiddleware, deleteComment)//Deletar comentários

export default router