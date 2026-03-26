import "./style.css"
import { useState } from "react"
import type { CreatePostProps} from "../../types/posts"
import api from "../../services/api"
import { getImageUrl } from "../../utils/getImageUrl"
import { IoCloseCircleOutline } from "react-icons/io5"

type CreatePostModalProps = CreatePostProps & {
  onClose: () => void
}

export default function CreatePost({
  userId,
  userName,
  userProfileImage,
  onPostCreated,
  onClose,
}: CreatePostModalProps) {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

const handleCreatePost = async () => {
  if (!content.trim()) return

  try {
    setLoading(true)

    console.log("Enviando post: ", {content, userId})

    const response = await api.post("/posts", {
      content,
      userId,
    })

    onPostCreated(response.data)
    setContent("")
    onClose()
  } catch (error) {
    console.error("Erro ao criar postagem:", error)
  } finally {
    setLoading(false)
  }
}

return (
<div className="modal-overlay">
  <div className="modal-create-post" onClick={(e) => e.stopPropagation()}>
    <div className="modal-header">
      <h2>Criar publicação</h2>
      <button id="close" onClick={onClose}><IoCloseCircleOutline/></button>
    </div>

    <div className="container-new-post">
      <div className="subcontainer-new-post">
        <img
          src={getImageUrl(userProfileImage)}
          alt={userName}
          id="new-post-profile"
        />
        <div className="post-user-info">
          <h4>{userName}</h4>
        </div>
      </div>

      <textarea
        placeholder="No que você está pensando?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="post-textarea"
      />

      <button
        className="publish-post-btn"
        onClick={handleCreatePost}
        disabled={loading || !content.trim()}
      >
      {loading ? "Publicando..." : "Publicar"}
    </button>
  </div>
</div>
</div>
)}