import "./style.css"
import { useEffect, useState } from "react"
import { getImageUrl } from "../../utils/getImageUrl"
import type { FeedCenterProps, IPost, IUserPost } from "../../types/posts"
import CreatePost from "../Post/CreatePost"
import { FaImage } from "react-icons/fa"
import api from "../../services/api"
import PostCard from "../Post/PostCard"

export default function FeedCenter({ onPostCreated }: FeedCenterProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [user, setUser] = useState<IUserPost | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [posts, setPosts] = useState<IPost[]>([])

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
          posts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <p>Nenhum post encontrado.</p>
        )}
      </div>

      {isModalOpen && (
        <CreatePost
          userId={user._id}
          userName={user.name}
          userProfileImage={user.profileImage}
          onPostCreated={onPostCreated}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  )
}