import { useState } from "react"
import type { IPost } from "../../types/posts"
import "./style.css"
import { FaTrash } from "react-icons/fa"

interface EditPostModalProps {
  post: IPost
  onClose: () => void
  onSave: (postId: string, newContent: string) => void
  onDelete: (postId: string) => void
}

export default function EditPostModal({
  post,
  onClose,
  onSave,
  onDelete
}: EditPostModalProps) {
  const [content, setContent] = useState(post.content)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave(post._id, content)
  }

  function handleDelete() {
    const confirmDelete = window.confirm("Tem certeza que deseja apagar esta postagem?")
    if (!confirmDelete) return

    onDelete(post._id)
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal" id="modal-edit-post">
        <h2>Editar postagem</h2>

        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
          />

          <div className="modal-actions" id="modal-actions-edit">
            <button type="button" onClick={handleDelete} id="delete-btn">
              <FaTrash/>
            </button>

            <div id="modal-actions-post-edit">
              <button type="button" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit">
                Salvar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}