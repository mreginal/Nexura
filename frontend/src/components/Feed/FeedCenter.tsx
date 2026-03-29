import "./style.css"
import { useState } from "react"
import { getImageUrl } from "../../utils/getImageUrl"
import type { FeedCenterProps, IPost } from "../../types/types"
import CreatePost from "../Posts/Post/CreatePost"
import { FaImage } from "react-icons/fa"
import PostCard from "../Posts/Post/PostCard"
import EditPostModal from "../Posts/Post/EditPostModal"
import { usePosts } from "../../hooks/usePosts"
import { useUser } from "../../hooks/useUser"

export default function FeedCenter({ onPostCreated }: FeedCenterProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [post, setPost] = useState()
  const { user, loadingUser } = useUser()
  const [editingPost, setEditingPost] = useState<IPost | null>(null)

  const {
    posts,
    loadingPosts,
    deletePost,
    updatePost,
    toggleLikePost,
    updateCommentCount,
    addNewPost
  } = usePosts()

    async function handleEdit(postId: string, newContent: string) {
    try {
      const updatedPost = await updatePost(postId, newContent)

      if (updatedPost) {
        console.log(post)
        setPost(updatedPost)
        setEditingPost(null)
      }
    } catch (error) {
      console.error("Erro ao editar post:", error)
    }
  }

  async function handleDeletePost(postId: string) {
    const success = await deletePost(postId)

    if (success) {
      setEditingPost(null)
    } else {
      alert("Não foi possível apagar o post.")
    }
  }

  if (loadingUser || loadingPosts) return <div>Carregando...</div>
  if (!user) return <div>Usuário não encontrado.</div>

  return (
    <>
      <div className="container-feed-center">
        <div
          className="subcontainer-new-post"
          onClick={() => setIsModalOpen(true)}
        >
          <button className="open-create-post-btn">
            <div id="button-new-post">
              <img
                src={getImageUrl(user.profileImage)}
                alt={user.name}
                className="feed-center-profile"
              />
              No que você está pensando?
            </div>
            <FaImage />
          </button>
        </div>

        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onEdit={handleEdit}
              onDelete={handleDeletePost}
              currentUserId={user._id}
              onLike={toggleLikePost}
              onCommentCountUpdate={updateCommentCount}
            />
          ))
        ) : (
          <p>Nenhum post encontrado.</p>
        )}
      </div>

      {isModalOpen && (
        <CreatePost
          userId={user._id}
          userName={user.name}
          userProfileImage={user.profileImage}
          onPostCreated={(newPost) => {
            addNewPost(newPost)
            onPostCreated?.(newPost)
          }}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {editingPost && (
        <EditPostModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onSave={handleEdit}
          onDelete={handleDeletePost}
        />
      )}
    </>
  )
}