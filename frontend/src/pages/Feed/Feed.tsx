import "./style.css"
import Nav from "../../components/Navs/NavLeft/Nav";
import NavRight from "../../components/Navs/NavRight/NavRight";
export default function Feed(){
return(
  <div className="container-feed">
      <Nav/>
      <div className="subcontainer-feed"></div>
      <NavRight/>
  </div>
)
}
