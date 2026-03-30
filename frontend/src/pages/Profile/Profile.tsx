import "./style.css"
import { useEffect, useMemo, useState } from "react"
import { Link, useLocation, useParams } from "react-router-dom"
import { FaEdit, FaSearchPlus, FaUserClock, FaUserEdit, FaUserMinus, FaUserPlus } from "react-icons/fa"
import type { LocationState, IPost, IUser } from "../../types/types"

// Componentes
import Nav from "../../components/Navs/NavLeft/Nav"
import NavRight from "../../components/Navs/NavRight/NavRight"
import EditProfileModal from "../../components/EditProfileModal/EditProfileModal"
import PostCard from "../../components/Posts/Post/PostCard"
import EditPostModal from "../../components/Posts/Post/EditPostModal"
import SavedPosts from "../Post/SavedPosts"

// Hooks
import { getImageUrl } from "../../utils/getImageUrl"
import { useUser } from "../../hooks/useUser"
import { usePosts } from "../../hooks/usePosts"
import { useFriends } from "../../hooks/useFriends"

type FriendStatus = "friend" | "sent" | "received" | "none"

export default function Profile() {
  const { userId } = useParams()

  // Usuário visitado
  const { user: profileUser, loadingUser } = useUser(userId)

  // Usuário logado
  const { user: loggedUser, loadingUser: loadingLoggedUser } = useUser()

  const location = useLocation()
  const state = location.state as LocationState | undefined
  const defaultTab = state?.tab || "posts"

  const [activeTab, setActiveTab] = useState(defaultTab)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<IPost | null>(null)
  const [friendStatus, setFriendStatus] = useState<FriendStatus>("none")
  const [friendActionLoading, setFriendActionLoading] = useState(false)

  const {
    posts,
    loadingPosts,
    deletePost,
    updatePost,
    toggleLikePost,
    toggleSavePost
  } = usePosts()

  const {
    sendRequest,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    removeFriend
  } = useFriends()

  // Posts do usuário visitado
  const userPosts = useMemo(() => {
    if (!profileUser) return []
    return posts.filter((post) => post.user._id === profileUser._id)
  }, [posts, profileUser])

  // Detecta status inicial de amizade
  useEffect(() => {
    if (!profileUser || !loggedUser) return

    const isFriend = loggedUser.friends?.some(
      (friend: IUser) => friend._id === profileUser._id
    )

    const sentRequest = loggedUser.friendRequestsSent?.some(
      (user: IUser) => user._id === profileUser._id
    )

    const receivedRequest = loggedUser.friendRequestsReceived?.some(
      (user: IUser) => user._id === profileUser._id
    )

    if (isFriend) {
      setFriendStatus("friend")
    } else if (receivedRequest) {
      setFriendStatus("received")
    } else if (sentRequest) {
      setFriendStatus("sent")
    } else {
      setFriendStatus("none")
    }
  }, [loggedUser, profileUser])

  if (loadingUser || loadingLoggedUser || loadingPosts) {
    return <p>Carregando...</p>
  }

  if (!profileUser || !loggedUser) {
    return <p>Erro ao carregar perfil</p>
  }

  const safeProfileUser = profileUser
  const safeLoggedUser = loggedUser

  const profileFriends = safeProfileUser.friends || []

  const currentUserId = safeLoggedUser._id
  const isOwnProfile = safeLoggedUser._id === profileUser._id

  // Posts
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

  // Amizade

  async function runFriendAction(
    action: () => Promise<unknown>,
    nextStatus: FriendStatus,
    errorMessage: string
  ) {
    try {
      setFriendActionLoading(true)
      await action()
      setFriendStatus(nextStatus)
    } catch (error) {
      console.error(errorMessage, error)
      alert(errorMessage)
    } finally {
      setFriendActionLoading(false)
    }
  }

  async function handleSendFriendRequest() {
    await runFriendAction(
      () => sendRequest(safeProfileUser._id),
      "sent",
      "Não foi possível enviar a solicitação."
    )
  }

  async function handleAcceptFriendRequest() {
    await runFriendAction(
      () => acceptRequest(safeProfileUser._id),
      "friend",
      "Não foi possível aceitar a solicitação."
    )
  }

  async function handleRejectFriendRequest() {
    await runFriendAction(
      () => rejectRequest(safeProfileUser._id),
      "none",
      "Não foi possível recusar a solicitação."
    )
  }

  async function handleCancelFriendRequest() {
    await runFriendAction(
      () => cancelRequest(safeProfileUser._id),
      "none",
      "Não foi possível cancelar a solicitação."
    )
  }

  async function handleRemoveFriend() {
    const confirmRemove = window.confirm("Deseja remover este amigo?")
    if (!confirmRemove) return

    await runFriendAction(
      () => removeFriend(safeProfileUser._id),
      "none",
      "Não foi possível remover o amigo."
    )
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

            <div className="profile-actions">
              {isOwnProfile ? (
                <button
                  className="profile-actions-btn"
                  onClick={() => setModalOpen(true)}
                >
                  <FaEdit />
                </button>
              ) : friendStatus === "friend" ? (
                <button
                  onClick={handleRemoveFriend}
                  disabled={friendActionLoading}
                  className="profile-actions-btn"
                  id="remove-friend"
                >
                  {friendActionLoading ? <FaUserEdit/> : <FaUserMinus/>}
                </button>
              ) : friendStatus === "received" ? (
                <div className="friend-request-actions">
                  <button
                    onClick={handleAcceptFriendRequest}
                    disabled={friendActionLoading}
                  >
                    {friendActionLoading ? <FaUserClock/> : "Aceitar amizade"}
                  </button>

                  <button
                    onClick={handleRejectFriendRequest}
                    disabled={friendActionLoading}
                  >
                    Recusar
                  </button>
                </div>
              ) : friendStatus === "sent" ? (
                <button
                  onClick={handleCancelFriendRequest}
                  disabled={friendActionLoading}
                  className="profile-actions-btn"
                  id="remove-friend"
                  title="Cancelar solicitação"
                >
                  <FaUserClock />
                </button>
              ) : (
                <button
                  onClick={handleSendFriendRequest}
                  disabled={friendActionLoading}
                  className="profile-actions-btn"
                  id="add-friend"
                  title="Adicionar amigo"
                >
                  <FaUserPlus />
                </button>
              )}
            </div>
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
              {profileFriends.length === 0? (
                <p>Não há ninguém para mostrar</p>
              ):(
                profileFriends.map((friend) => (
                  <div className="friend-card" key={friend._id}>
                      <div className="profile-friend">
                        <img src={getImageUrl(friend.profileImage)} alt={"Foto de Perfil"}/>
                        <div id="friend-card-infos">
                          <Link to={`/profile/${friend._id}`} id="find"> 
                            <h3>{friend.name}</h3>
                          </Link>
                          <p>{friend.username}</p>
                      </div>
                    </div>
                    <Link to={`/profile/${friend._id}`} id="find"> <FaSearchPlus/></Link>
                  </div>
                ))
              )
              }
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
          onUpdate={() => {}}
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