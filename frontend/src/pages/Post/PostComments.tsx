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
import CommentsModal from "../../components/Posts/Comments/CommentsModal"
import { getImageUrl } from "../../utils/getImageUrl"
import { FaRegSmile, FaTrash } from "react-icons/fa"

export default function PostCommentsPage() {
  const { postId } = useParams()
  const { user } = useUser()
  const currentUserId = user?._id || ""

  const [post, setPost] = useState<IPost | null>(null)

  const { getPostById, loadingPost, toggleLikePost, updatePost } = usePosts()
  const { comments, loadingComments, deleteComment} = useComments(postId)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    async function loadPost() {
      if (!postId) return

      const postData = await getPostById(postId)
      setPost(postData)
    }

    loadPost()
  }, [postId])

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
  
  async function handleDeleteComment(commentId:string) {
    const confirmDelete = window.confirm("Quer mesmo apagar este comentário?")
    if(!confirmDelete) return
    
    try {
      await deleteComment(commentId)

      setPost((prev)=>{
        if (!prev) return prev
        return{
          ...prev,
          commentsCount: (prev.commentsCount || 1) - 1
        }

        window.location.reload()

      })
    } catch (error) {
      console.error("Erro ao apagar comentário: ", error)
    }
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
            <button className="new-comment-btn" onClick={() => setIsModalOpen(true)}>
              <div className="comment-left">
                <img src={getImageUrl(post.user.profileImage || "")} alt="Foto do Perfil" />
                <div className="add-comment">
                  <p>Adicionar comentário</p>
                  <label>Deixe uma mensagem nesta postagem.</label>
                </div>
              </div>
              <FaRegSmile id="smile"/>
            </button>
          </div>

          <div className="comments-list">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="comment-card">
                  <img
                    src={getImageUrl(comment.user.profileImage || "")}
                    alt={comment.user.name}
                    className="comment-profile"
                  />

                  <div className="comment-content">
                    <div id="username-date-comment">
                      <strong>{comment.user.name}</strong>
                      <span>{comment.createdAt}</span>
                    </div>
                    <p>{comment.content}</p>
                  </div>

                  {comment.user._id === currentUserId && (
                    <button
                      className="delete-comment-btn"
                      onClick={() => handleDeleteComment(comment._id)}
                    >
                      <FaTrash/>
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="no-comments">Seja o primeiro a comentar.</p>
            )}
          </div>
        </div>

        {post &&(
          <CommentsModal 
          post={post}
          currentUserId={currentUserId}
          isOpen={isModalOpen}
          onClose={()=>setIsModalOpen(false)}
          onCommentCountChange={(delta) =>{
            setPost((prev)=>{
              if(!prev) return prev
              return{
                ...prev,
                commentsCount: (prev.commentsCount || 0) + delta
              }
            })
          }}
          />
        )

        }
      </div>

      <NavRight />
    </div>
  )
}