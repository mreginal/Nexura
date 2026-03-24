import { BsPersonHeart } from "react-icons/bs"
import "./style.css"
import { Link } from "react-router-dom"
import { FaRankingStar, FaUserGroup } from "react-icons/fa6"

export default function NavRight(){
    return (
        <div>
        <nav className="nav-right">
            <div className="nav-friends">
                <h2> <BsPersonHeart/> Amigos</h2>
                <div className="list-friends">
                    <li>Amigo 1</li>
                    <li>Amigo 2</li>
                    <li>Amigo 3</li>
                </div>
                <Link to={"/profile/friends"} className="nav-link">Ver todos</Link>
            </div>
            <div className="nav-groups">
                <h2> <FaUserGroup/> Grupos</h2>
                <div className="list-groups">
                    <li>Grupo 1</li>
                    <li>Grupo 2</li>
                    <li>Grupo 3</li>
                </div>
                <Link to={"/profile/groups"} className="nav-link">Ver todos</Link>
            </div>
            <div className="nav-ranking">
                <h2> <FaRankingStar/> Ranking</h2>
                <div className="list-ranking">
                    <li>Pessoa 1</li>
                    <li>Pessoa 2</li>
                    <li>Pessoa 3</li>
                </div>
            </div>
        </nav>
        </div>
    )
}
