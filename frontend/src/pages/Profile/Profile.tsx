import "./style.css"
import Nav from "../../components/Navs/NavLeft/Nav"
import NavRight from "../../components/Navs/NavRight/NavRight"
import { useEffect, useMemo, useState } from "react"
import { useLocation } from "react-router-dom"
import type { LocationState } from "../../types/types"
import type { IPost } from "../../types/types"
import EditProfileModal from "../../components/EditProfileModal/EditProfileModal"
import { FaEdit } from "react-icons/fa"
import { getImageUrl } from "../../utils/getImageUrl"
import PostCard from "../../components/Posts/Post/PostCard"
import EditPostModal from "../../components/Posts/Post/EditPostModal"
import { useUser } from "../../hooks/useUser"
import { usePosts } from "../../hooks/usePosts"
import SavedPosts from "../Post/SavedPosts"

export default function Profile() {
  const { user, loadingUser, loadUser } = useUser()
  const location = useLocation()
  const state = location.state as LocationState | undefined
  const defaultTab = state?.tab || "posts"
  const [post, setPost] = useState<IPost | null>(null)
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<IPost | null>(null)

  const {
    posts,
    loadingPosts,
    loadPosts,
    deletePost,
    updatePost,
    toggleLikePost,
    toggleSavePost
  } = usePosts()

  useEffect(() => {
    loadUser()
    loadPosts()
  }, [])

  const userPosts = useMemo(() => {
    console.log(post)
    if (!user) return []
    return posts.filter((post) => post.user._id === user._id)
  }, [posts, user])

  if (loadingUser || loadingPosts) return <p>Carregando...</p>
  if (!user) return <p>Erro ao carregar perfil</p>

  const currentUserId = user._id

  async function handleDeletePost(postId: string) {
    const confirmDelete = window.confirm("Tem certeza que deseja apagar este post?")
    if (!confirmDelete) return

    const success = await deletePost(postId)

    if (!success) {
      alert("Não foi possível apagar o post.")
    }
  }

    async function handleEdit(postId: string, newContent: string) {
    try {
      const updatedPost = await updatePost(postId, newContent)

      if (updatedPost) {
        setPost(updatedPost)
        setEditingPost(null)
      }
    } catch (error) {
      console.error("Erro ao editar post:", error)
    }
  }

  async function handleToggleLike(postId: string) {
    await toggleLikePost(postId)
  }

  async function handleSave(postId: string) {
  try {
    const updatedPost = await toggleSavePost(postId)

    if (updatedPost) {
      setPost(updatedPost)
    }
  } catch (error) {
    console.error("Erro ao salvar/desalvar post:", error)
  }
}
  return (
    <div className="container-profile">
      <Nav />

      <div className="subcontainer-profile">
        <div
          className="cover-profile"
          style={{ backgroundImage: `url(${getImageUrl(user.coverImage)})` }}
        ></div>

        <div className="profile-infos">
          <div className="infos">
            <img
              src={getImageUrl(user.profileImage)}
              alt="Foto de Perfil"
              className="avatar"
            />
            <h2>{user.name}</h2>
          </div>

          <div className="infos">
            <p>{user.bio || `Biografia de ${user.name}`}</p>
            <div className="progress-bar"></div>

            <button
              id="button-edit-profile"
              onClick={() => setModalOpen(true)}
            >
              <FaEdit />
            </button>
          </div>
        </div>

        <div className="tabs-container">
          <button
            className={activeTab === "posts" ? "tab active" : "tab"}
            onClick={() => setActiveTab("posts")}
          >
            Postagens
          </button>

          <button
            className={activeTab === "about" ? "tab active" : "tab"}
            onClick={() => setActiveTab("about")}>
            Sobre
          </button>

          <button
            className={activeTab === "friends" ? "tab active" : "tab"}
            onClick={() => setActiveTab("friends")}>
            Amigos
          </button>

          <button
            className={activeTab === "saves" ? "tab active" : "tab"}
            onClick={() => setActiveTab("saves")}>
            Salvos
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "posts" && (
            <div className="posts">
              {userPosts.length === 0 ? (
                <p id="notpost">Não há nenhuma postagem</p>
              ) : (
                userPosts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    onDelete={handleDeletePost}
                    onEdit={handleEdit}
                    onSave={handleSave}
                    onLike={handleToggleLike}
                    currentUserId={currentUserId}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === "about" && (
            <div className="about">
              <p>{user.bio || `Biografia de ${user.name}`}</p>
            </div>
          )}

          {activeTab === "friends" && (
            <div className="friends">
              <p>Lista de amigos (em breve)</p>
            </div>
          )}

          {activeTab === "saves" && (
            <div className="saves">
              <SavedPosts currentUserId={currentUserId}/>
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setModalOpen(false)}
          onUpdate={loadUser}
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

      <NavRight />
    </div>
  )
}