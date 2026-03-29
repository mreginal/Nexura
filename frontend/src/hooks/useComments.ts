import { useEffect, useState } from "react"
import api from "../services/api"
import type { IComment } from "../types/types"

export function useComments(postId?: string) {
  const [comments, setComments] = useState<IComment[]>([])
  const [loadingComments, setLoadingComments] = useState(true)

  async function loadComments() {
    if (!postId) return

    try {
      setLoadingComments(true)
      const response = await api.get(`/posts/${postId}/comments`)
      setComments(response.data)
    } catch (error) {
      console.error("Erro ao buscar comentários:", error)
    } finally {
      setLoadingComments(false)
    }
  }

  async function createComment(content: string) {
    if (!postId || !content.trim()) return

    try {
      const response = await api.post(`/posts/${postId}/comments`, {
        content
      })

      setComments((prev) => [response.data.comment, ...prev])
      return response.data.comment
    } catch (error) {
      console.error("Erro ao comentar:", error)
    }
  }

  async function deleteComment(commentId: string) {
    try {
      await api.delete(`/posts/comment/${commentId}`)
      setComments((prev) => prev.filter((comment) => comment._id !== commentId))
    } catch (error) {
      console.error("Erro ao apagar comentário:", error)
    }
  }

  useEffect(() => {
    if (postId) {
      loadComments()
    }
  }, [postId])

  return {
    comments,
    loadingComments,
    loadComments,
    createComment,
    deleteComment
  }
}