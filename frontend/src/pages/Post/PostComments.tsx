import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import type { IPost } from "../../types/types"
import "./style.css"
import Nav from "../../components/Navs/NavLeft/Nav"
import NavRight from "../../components/Navs/NavRight/NavRight"
import { useComments } from "../../hooks/useComments"
import { usePosts } from "../../hooks/usePosts"
import PostCard from "../../components/Posts/Post/PostCard"
import { useUser } from "../../hooks/useUser"

export default function PostCommentsPage() {
  const { postId } = useParams()
  const { user } = useUser()
  const currentUserId = user?._id || ""

  const [post, setPost] = useState<IPost | null>(null)
  const [newComment, setNewComment] = useState("")

  const { getPostById, loadingPost, toggleLikePost, updatePost } = usePosts()
  const { comments, loadingComments, createComment, deleteComment} = useComments(postId)

  useEffect(() => {
    async function loadPost() {
      if (!postId) return

      const postData = await getPostById(postId)
      setPost(postData)
    }

    loadPost()
  }, [postId])

  async function handleCreateComment() {
    if (!newComment.trim()) return

    await createComment(newComment)
    setNewComment("")
  }

  async function handleLike(postId: string) {
    try {
      await toggleLikePost(postId)

      setPost((prev) => {
        if (!prev) return prev

        const alreadyLiked = prev.likes.includes(currentUserId)

        return {
          ...prev,
          likes: alreadyLiked
            ? prev.likes.filter((id) => id !== currentUserId)
            : [...prev.likes, currentUserId]
        }
      })
    } catch (error) {
      console.error("Erro ao curtir/descurtir post:", error)
    }
  }

  async function handleEdit(postId: string, newContent: string) {
    try {
      const updatedPost = await updatePost(postId, newContent)

      if (updatedPost) {
        setPost(updatedPost)
      }
    } catch (error) {
      console.error("Erro ao editar post:", error)
    }
  }

  if (loadingPost || loadingComments) {
    return <p className="comments-page-loading">Carregando...</p>
  }

  if (!post) {
    return <p className="comments-page-loading">Post não encontrado.</p>
  }

  return (
    <div className="container-comments">
      <Nav />

      <div className="subcontainer-comment">
        <div className="comments-page-content">
          <PostCard
            post={post}
            currentUserId={currentUserId}
            onLike={handleLike}
            onEdit={handleEdit}
            isCommentsPage
          />

          <div className="new-comment">
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

          <div className="comments-list">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="comment-card">
                  <img
                    src={comment.user.profileImage || ""}
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
                      onClick={() => deleteComment(comment._id)}
                    >
                      Apagar
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="no-comments">Seja o primeiro a comentar.</p>
            )}
          </div>
        </div>
      </div>

      <NavRight />
    </div>
  )
}