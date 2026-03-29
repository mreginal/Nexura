import "./style.css"
import Nav from "../../components/Navs/NavLeft/Nav";
import NavRight from "../../components/Navs/NavRight/NavRight"
import FeedCenter from "../../components/Feed/FeedCenter"
import type { IPost } from "../../types/types"

export default function Feed(){
  const handlePostCreated = (newPost: IPost) => {
    console.log("Novo post criado:", newPost)
  }
return(
  <div className="container-feed">
      <Nav/>
      <FeedCenter onPostCreated={handlePostCreated}/>
      <NavRight/>
  </div>
)
}
