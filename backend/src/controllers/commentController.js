import mongoose from "mongoose"
import Comment from "../models/Comments.js"
import Post from "../models/Post.js"

//Pegar todos os comentários de uma postagem
export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "ID do post inválido." })
    }

    const comments = await Comment.find({ post: postId })
      .populate("user", "name profileImage")
      .sort({ createdAt: -1 })

    return res.status(200).json(comments)
  } catch (error) {
    console.error("Erro ao buscar comentários:", error)
    return res.status(500).json({ message: "Erro interno no servidor." })
  }
}

//Criar comentário em uma postagem
export const createComment = async (req, res) => {
  try {
    const { postId } = req.params
    const { content } = req.body
    const userId = req.userId

    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado." })
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "ID do post inválido." })
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Comentário não pode estar vazio." })
    }

    const post = await Post.findById(postId)

    if (!post) {
      return res.status(404).json({ message: "Post não encontrado." })
    }

    const newComment = await Comment.create({
      post: postId,
      user: userId,
      content: content.trim()
    })

    post.commentsCount += 1
    await post.save()

    const populatedComment = await Comment.findById(newComment._id)
      .populate("user", "name profileImage")

    return res.status(201).json({
      message: "Comentário criado com sucesso.",
      comment: populatedComment
    })
  } catch (error) {
    console.error("Erro ao criar comentário:", error)
    return res.status(500).json({ message: "Erro interno no servidor." })
  }
}

//Deletar comentário de uma postagem
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params
    const userId = req.userId

    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado." })
    }

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "ID do comentário inválido." })
    }

    const comment = await Comment.findById(commentId)

    if (!comment) {
      return res.status(404).json({ message: "Comentário não encontrado." })
    }

    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Você não pode apagar esse comentário." })
    }

    await Comment.findByIdAndDelete(commentId)

    await Post.findByIdAndUpdate(comment.post, {
      $inc: { commentsCount: -1 }
    })

    return res.status(200).json({
      message: "Comentário removido com sucesso."
    })
  } catch (error) {
    console.error("Erro ao deletar comentário:", error)
    return res.status(500).json({ message: "Erro interno no servidor." })
  }
}