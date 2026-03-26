import "./style.css"
import Nav from "../../components/Navs/NavLeft/Nav"
import NavRight from "../../components/Navs/NavRight/NavRight"
import { useEffect, useState } from "react"
import api from "../../services/api"
import { useLocation } from "react-router-dom"
import type { LocationState } from "../../types/types"
import EditProfileModal from "../../components/EditProfileModal/EditProfileModal"
import { FaEdit } from "react-icons/fa"
import { getImageUrl } from "../../utils/getImageUrl"
import PostCard from "../../components/Post/PostCard"

export default function Profile() {
  const [user, setUser] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const state = location.state as LocationState | undefined
  const defaultTab = location.state?.tab || "posts"
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await api.get("/me")
        setUser(response.data.user)
        setPosts(response.data.posts)
      } catch (error) {
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  async function handleDeletePost(postId: string) {
    const confirmDelete = window.confirm("Tem certeza que deseja apagar este post?")
    if (!confirmDelete) return

    try {
      await api.delete(`/posts/${postId}`)

      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId))
    } catch (error) {
      console.error("Erro ao apagar post:", error)
      alert("Não foi possível apagar o post.")
    }
  }

  if (loading) return <p>Carregando...</p>

  if (!user) return <p>Erro ao carregar perfil</p>

  const currentUserId = user._id

  return (
    <>
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
              <button id="button-edit-profile" onClick={() => setModalOpen(true)}>
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
          </div>

          <div className="tab-content">
            {activeTab === "posts" && (
              <div className="posts">
                {posts.length === 0 ? (
                  <p id="notpost">Não há nenhuma postagem</p>
                ) : (
                  posts.map((post) => (
                    <PostCard
                      key={post._id}
                      post={{
                        ...post,
                        user: {
                          _id: user._id,
                          name: user.name,
                          profileImage: user.profileImage,
                        },
                      }}
                      onDelete={handleDeletePost}
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
          </div>
        </div>

        {modalOpen && (
          <EditProfileModal
            user={user}
            onClose={() => setModalOpen(false)}
            onUpdate={(updatedUser) => setUser(updatedUser)}
          />
        )}

        <NavRight />
      </div>
    </>
  )
}