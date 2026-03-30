import { useState } from "react"
import { IoCloseCircleOutline } from "react-icons/io5"
import "../style.css"
import api from "../../../services/api"
import type { CommentsModalProps, IComment } from "../../../types/types"

export default function CommentsModal({
  post,
  isOpen,
  onClose,
  onCommentCountChange
}: CommentsModalProps) {
  const [comments, setComments] = useState<IComment[]>([])
  const [newComment, setNewComment] = useState("")

  async function handleCreateComment() {
    if (!newComment.trim()) return

    try {
      const response = await api.post(`/posts/${post._id}/comments`, {
        content: newComment
      })

      setComments((prev) => [response.data.comment, ...prev])
      setNewComment("")
      onCommentCountChange?.(1)
      onClose?.()

      console.log(comments)

      window.location.reload()
    } catch (error) {
      console.error("Erro ao comentar:", error)
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

        <div className="comments-modal-text">
          <textarea
            placeholder="Escreva um comentário"
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