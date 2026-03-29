import { useEffect, useState } from "react"
import { IoCloseCircleOutline } from "react-icons/io5"
import "../style.css"

import api from "../../../services/api"
import { getImageUrl } from "../../../utils/getImageUrl"
import type { IComment, IPost } from "../../../types/types"

interface CommentsModalProps {
  post: IPost
  currentUserId: string
  isOpen: boolean
  onClose: () => void
  onCommentCountChange?: (delta: number) => void
}

export default function CommentsModal({
  post,
  currentUserId,
  isOpen,
  onClose,
  onCommentCountChange
}: CommentsModalProps) {
  const [comments, setComments] = useState<IComment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)

  async function loadComments() {
    try {
      const response = await api.get(`/posts/${post._id}/comments`)
      setComments(response.data)
    } catch (error) {
      console.error("Erro ao buscar comentários:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadComments()
    }
  }, [isOpen, post._id])

  async function handleCreateComment() {
    if (!newComment.trim()) return

    try {
      const response = await api.post(`/posts/${post._id}/comments`, {
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

  if (!isOpen) return null

  return (
    <div className="comments-modal-overlay" onClick={onClose}>
      <div className="comments-modal" onClick={(e) => e.stopPropagation()}>
        <div className="comments-modal-header">
          <h2>Comentários</h2>
          <button className="close" onClick={onClose}>
            <IoCloseCircleOutline/>
          </button>
        </div>

        <div className="comments-modal-body">
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
                  >
                    Apagar
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>Seja o primeiro a comentar.</p>
          )}
        </div>

      <div className="comments-modal-footer">
        <textarea
          placeholder="Escreva um comentário..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && newComment.trim()) {
              e.preventDefault()
              handleCreateComment()
            }
          }}
          rows={2}
        />
      </div>
      </div>
    </div>
  )
}