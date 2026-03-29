import { memo } from "react"
import { useState } from "react"
import { FaHeart, FaRegHeart, FaEdit } from "react-icons/fa"
import type { PostCardProps } from "../../../types/types"
import "../style.css"
import { getImageUrl } from "../../../utils/getImageUrl"
import { useNavigate } from "react-router-dom"
import EditPostModal from "./EditPostModal"
import { IoChatbubbleOutline, IoChatbubbleSharp } from "react-icons/io5"

function PostCard({
  post,
  currentUserId,
  onEdit,
  onLike,
  onDelete,
  isCommentsPage
}: PostCardProps) {
  const isOwner = post.user._id === currentUserId
  const likedByUser = post.likes?.includes(currentUserId) ?? false
  const [isAnimating, setIsAnimating] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const navigate = useNavigate()

  function handleLikeClick() {
    if (!likedByUser) setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)
    onLike?.(post._id)
  }

  function handleCloseModal() {
    setIsEditModalOpen(false)
  }

  async function handleSave(postId: string, newContent: string) {
    await onEdit?.(postId, newContent)
    setIsEditModalOpen(false)
  }

  function handleDelete(postId: string) {
    onDelete?.(postId)
    setIsEditModalOpen(false)
  }

  return (
    <div className="post">
      <div className="post-header">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src={getImageUrl(post.user.profileImage || "")}
            alt={post.user.name}
            className="post-user-image"
          />
          <div>
            <strong>{post.user.name}</strong>
            <p>{new Date(post.createdAt).toLocaleString()}</p>
          </div>
        </div>

        {isOwner && (onEdit || onDelete) && (
          <button
            onClick={() => setIsEditModalOpen(true)}
            title="Editar post"
            id="edit-post-btn"
          >
            <FaEdit />
          </button>
        )}
      </div>

      <p className="post-content">{post.content}</p>

      {post.image && (
        <img src={getImageUrl(post.image)} alt="Post" className="post-image" />
      )}

      <div className="post-actions">
        <div id="post-actions-left">
          <button className="like-btn" onClick={handleLikeClick} disabled={!onLike}>
            <span className={`heart-icon ${likedByUser ? "liked" : ""} ${isAnimating ? "animate-like" : ""}`}>
              {likedByUser ? <FaHeart /> : <FaRegHeart />}
            </span>
            <span className={`like-count ${isAnimating ? "count-bounce" : ""}`}>{post.likes?.length ?? 0}</span>
          </button>
          <button
            className={`comment-btn ${isCommentsPage ? "active" : ""}`}
            onClick={() => navigate(`/posts/${post._id}/comments`)}
          >
            {isCommentsPage? <IoChatbubbleSharp/> : <IoChatbubbleOutline/>}
            <span>{post.commentsCount}</span>
          </button>
          <button>{post.shares}</button>
        </div>
        
        <button>{post.saves}</button>
      </div>

      {isEditModalOpen && (
        <EditPostModal
          post={post}
          onClose={handleCloseModal}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

export default memo(PostCard)