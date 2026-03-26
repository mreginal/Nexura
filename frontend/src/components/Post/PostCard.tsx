import { FaBookmark, FaHeart, FaShare, FaTrash, FaEdit } from "react-icons/fa"
import type { PostCardProps } from "../../types/posts"
import { getImageUrl } from "../../utils/getImageUrl"
import { TbMessageCircleFilled } from "react-icons/tb"

export default function PostCard({ post, onEdit, currentUserId }: PostCardProps) {
  const isOwner = post.user._id === currentUserId

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

        {isOwner && (
          <div>
            <button onClick={() => onEdit(post)} title="Editar post" id="edit-post-btn">
              <FaEdit />
            </button>
            
          </div>
        )}
      </div>

      <p className="post-content">{post.content}</p>

      {post.image && (
        <img
          src={getImageUrl(post.image)}
          alt="Imagem do post"
          className="post-image"
        />
      )}

      <div className="post-actions">
        <div id="post-actions-right">
          <span><FaHeart /> {post.likes}</span>
          <span><TbMessageCircleFilled /> {post.commentsCount}</span>
          <span><FaShare /> {post.shares}</span>
        </div>
        <div>
          <span><FaBookmark /> {post.saves}</span>
        </div>
      </div>
    </div>
  )
}