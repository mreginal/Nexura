import "./style.css"
import Nav from "../../components/Navs/NavLeft/Nav"
import NavRight from "../../components/Navs/NavRight/NavRight"
import { useMemo, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import type { LocationState, IPost } from "../../types/types"
import EditProfileModal from "../../components/EditProfileModal/EditProfileModal"
import { FaEdit } from "react-icons/fa"
import { getImageUrl } from "../../utils/getImageUrl"
import PostCard from "../../components/Posts/Post/PostCard"
import EditPostModal from "../../components/Posts/Post/EditPostModal"
import { useUser } from "../../hooks/useUser"
import { usePosts } from "../../hooks/usePosts"
import SavedPosts from "../Post/SavedPosts"

export default function Profile() {
  const { userId } = useParams()

  // Usuário que foi visitado
  const { user: profileUser, loadingUser, loadUser } = useUser(userId)

  // Usuário logado
  const { user: loggedUser, loadingUser: loadingLoggedUser } = useUser()

  const location = useLocation()
  const state = location.state as LocationState | undefined
  const defaultTab = state?.tab || "posts"
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<IPost | null>(null)

  const {
    posts,
    loadingPosts,
    deletePost,
    updatePost,
    toggleLikePost,
    toggleSavePost
  } = usePosts()

  const userPosts = useMemo(() => {
    if (!profileUser) return []
    return posts.filter((post) => post.user._id === profileUser._id)
  }, [posts, profileUser])

  if (loadingUser || loadingLoggedUser || loadingPosts) {
    return <p>Carregando...</p>
  }

  if (!profileUser || !loggedUser) {
    return <p>Erro ao carregar perfil</p>
  }

  const currentUserId = loggedUser._id
  const isOwnProfile = loggedUser._id === profileUser._id

  async function handleDeletePost(postId: string) {
    const confirmDelete = window.confirm("Tem certeza que deseja apagar este post?")
    if (!confirmDelete) return

    const success = await deletePost(postId)

    if (!success) {
      alert("Não foi possível apagar o post.")
    }
  }

  async function handleToggleLike(postId: string) {
    await toggleLikePost(postId)
  }

  async function handleEdit(postId: string, newContent: string) {
    try {
      const updatedPost = await updatePost(postId, newContent)

      if (updatedPost) {
        setEditingPost(null)
      }
    } catch (error) {
      console.error("Erro ao editar post:", error)
    }
  }

  async function handleSave(postId: string) {
    try {
      await toggleSavePost(postId)
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
          style={{
            backgroundImage: `url(${getImageUrl(profileUser.coverImage)})`
          }}
        ></div>

        <div className="profile-infos">
          <div className="infos">
            <img
              src={getImageUrl(profileUser.profileImage)}
              alt="Foto de Perfil"
              className="avatar"
            />
            <h2>{profileUser.name}</h2>
          </div>

          <div className="infos">
            <p>{profileUser.bio || `Biografia de ${profileUser.name}`}</p>
            <div className="progress-bar"></div>

            {isOwnProfile && (
              <button
                id="button-edit-profile"
                onClick={() => setModalOpen(true)}
              >
                <FaEdit />
              </button>
            )}
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
            onClick={() => setActiveTab("about")}
          >
            Sobre
          </button>

          <button
            className={activeTab === "friends" ? "tab active" : "tab"}
            onClick={() => setActiveTab("friends")}
          >
            Amigos
          </button>

          {isOwnProfile && (
            <button
              className={activeTab === "saves" ? "tab active" : "tab"}
              onClick={() => setActiveTab("saves")}
            >
              Salvos
            </button>
          )}
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
              <p>{profileUser.bio || `Biografia de ${profileUser.name}`}</p>
            </div>
          )}

          {activeTab === "friends" && (
            <div className="friends">
              <p>Lista de amigos (em breve)</p>
            </div>
          )}

          {activeTab === "saves" && isOwnProfile && (
            <div className="saves">
              <SavedPosts currentUserId={currentUserId} />
            </div>
          )}
        </div>
      </div>

      {modalOpen && isOwnProfile && (
        <EditProfileModal
          user={profileUser}
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