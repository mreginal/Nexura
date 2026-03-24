import "./style.css"
import Nav from "../../components/Navs/NavLeft/Nav";
import NavRight from "../../components/Navs/NavRight/NavRight";
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Profile(){
  const [user, setUser] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading ] = useState(true)
  const [activeTab, setActiveTab] = useState("posts")
  
  useEffect(()=>{
    async function  loadProfile() {
      try {
        const response = await api.get("/me")
        
        console.log(response.data.user)

        setUser(response.data.user)
        setPosts(response.data.posts)
      } catch (error) {
        console.error("Erro ao carregar perfil")
      } finally{
        setLoading(false)
      }
    }
    loadProfile()
  },[])

  if(loading) return <p>Carregando...</p>

  if(!user) return <p>Erro ao carregar perfil</p>


  return (
    <>
        <div className="container-profile">
            <Nav/>
            <div className="subcontainer-profile">
              <div className="cover-profile" style={{backgroundImage: `url(${user.coverImage})`}}></div>
              <div className="profile-infos">
                <div className="infos">
                  <img src={user.profileImage} alt="Foto de Perfil" className="avatar"/>
                  <h2>{user.name}</h2>
                </div>
                <p>{user.bio || `"Biografia de ${user.name}"`}</p>
              </div>
              <div className="tabs-container">
                <button className={activeTab === "posts" ? "tab active" : "tab"} onClick={() => setActiveTab("posts")}>
                  Postagens
                </button>

                <button className={activeTab === "about" ? "tab active" : "tab"} onClick={() => setActiveTab("about")}>
                  Sobre
                </button>

                <button className={activeTab === "friends" ? "tab active" : "tab"} onClick={() => setActiveTab("friends")}>
                  Amigos
                </button>
              </div>
              <div className="tab-content">
                {activeTab === "posts" && (
                  <div className="posts">
                    {posts.length === 0 ? (
                      <p id="notpost">Não há nenhuma postagem</p>
                    ) : (
                      posts.map(post => (
                        <div key={post._id} className="post">
                          <p>{post.content}</p>
                          {post.image && <img src={post.image} />}
                        </div>
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
            <NavRight/>
        </div>
    </>
  )
}


