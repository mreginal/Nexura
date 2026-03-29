import { useEffect, useState } from "react"
import api from "../../../services/api"
import { getImageUrl } from "../../../utils/getImageUrl"
import type { CommentsSectionProps, IComment } from "../../../types/types" 
import { FaTrash } from "react-icons/fa"

export default function CommentsSection({ postId, currentUserId, onCommentCountChange}: CommentsSectionProps) {
  const [comments, setComments] = useState<IComment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)

  async function loadComments() {
    try {
      const response = await api.get(`/posts/${postId}/comments`)
      setComments(response.data)
    } catch (error) {
      console.error("Erro ao buscar comentários:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadComments()
  }, [postId])

  async function handleCreateComment() {
    if (!newComment.trim()) return

    try {
      const response = await api.post(`/posts/${postId}/comments`, {
        content: newComment
      })

      setComments((prev) => [response.data.comment, ...prev])
      setNewComment("")
      onCommentCountChange?.(1)
    } catch (error) {
      console.error("Erro ao comentar:", error)
    }
  }

  async function handleDeleteComment(commentId: string) {
    try {
      await api.delete(`/posts/comment/${commentId}`)

      setComments((prev) => prev.filter((comment) => comment._id !== commentId))
      onCommentCountChange?.(-1)
    } catch (error) {
      console.error("Erro ao apagar comentário:", error)
    }
  }

  return (
    <div className="comments-section">
      <div className="comment-input-area">
        <input
          type="text"
          placeholder="Escreva um comentário..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleCreateComment}>Comentar</button>
      </div>

      {loading ? (
        <p>Carregando comentários...</p>
      ) : comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment._id} className="comment-card">
            <img
              src={getImageUrl(comment.user.profileImage)}
              alt={comment.user.name}
              className="comment-profile"
            />

            <div className="comment-content">
              <strong>{comment.user.name}</strong>
              <p>{comment.content}</p>
            </div>

            {comment.user._id === currentUserId && (
              <button
                className="delete-comment-btn"
                onClick={() => handleDeleteComment(comment._id)}
              ><FaTrash/></button>
            )}
          </div>
        ))
      ) : (
        <p>Nenhum comentário ainda.</p>
      )}
    </div>
  )
}