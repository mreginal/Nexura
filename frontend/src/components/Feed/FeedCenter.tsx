import "./style.css"
import { useEffect, useState } from "react"
import { getImageUrl } from "../../utils/getImageUrl"
import type { FeedCenterProps, IPost, IUserPost } from "../../types/posts"
import CreatePost from "../Post/CreatePost"
import { FaImage } from "react-icons/fa"
import api from "../../services/api"
import PostCard from "../Post/PostCard"
import EditPostModal from "../Post/EditPostModal"

export default function FeedCenter({ onPostCreated }: FeedCenterProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [user, setUser] = useState<IUserPost | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [posts, setPosts] = useState<IPost[]>([])
  const [editingPost, setEditingPost] = useState<IPost | null>(null)

  async function loadPosts() {
    try {
      const response = await api.get("/posts")
      setPosts(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await api.get("/me")
        setUser(response.data.user)
      } catch (error) {
        console.error(error)
      } finally {
        setLoadingUser(false)
      }
    }

    loadUser()
    loadPosts()
  }, [])

  async function handleDeletePost(postId: string) {
    try {
      await api.delete(`/posts/${postId}`)

      setPosts((prevPosts) =>
        prevPosts.filter((post) => post._id !== postId)
      )

      setEditingPost(null)
    } catch (error) {
      console.error("Erro ao apagar post:", error)
      alert("Não foi possível apagar o post.")
    }
  }

  function handleOpenEdit(post: IPost) {
    setEditingPost(post)
  }

  async function handleSaveEdit(postId: string, newContent: string) {
    try {
      const response = await api.put(`/posts/${postId}`, {
        content: newContent
      })

      const updatedPost = response.data.post

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? updatedPost : post
        )
      )

      setEditingPost(null)
    } catch (error) {
      console.error("Erro ao editar post:", error)
      alert("Não foi possível editar o post.")
    }
  }

  if (loadingUser) return <div>Carregando usuário...</div>
  if (!user) return <div>Usuário não encontrado.</div>

  return (
    <>
      <div className="container-feed-center">
        <div className="subcontainer-new-post" onClick={() => setIsModalOpen(true)}>
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
              onEdit={handleOpenEdit}
              currentUserId={user._id}
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
            setPosts((prevPosts) => [newPost, ...prevPosts])
            onPostCreated?.(newPost)
          }}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {editingPost && (
        <EditPostModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onSave={handleSaveEdit}
          onDelete={handleDeletePost}
        />
      )}
    </>
  )
}