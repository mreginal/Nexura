import "./style.css"
import { BsPersonFill } from 'react-icons/bs'
import { FaSearch } from 'react-icons/fa'
import { FaBell, FaNewspaper } from 'react-icons/fa6'
import { RiLogoutBoxRFill } from 'react-icons/ri'
import { useLocation, useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom"

export default function Nav(){
    const location = useLocation()
    const navigate = useNavigate()

    const handleLogout = () =>{
    localStorage.removeItem("token")
    navigate("/login")
    }

    return (
        <div>
        <nav className="nav">
            <div className="nav-top">
                <a href="/feed" id="logotipo">Nexura</a>
                <Link to={"/feed"} className={`item-nav ${location.pathname === "/feed"? "active": ""}`}> <FaNewspaper/> Feed</Link>
                <Link to={"/explorer"} className={`item-nav ${location.pathname === "/explorer"? "active": ""}`}> <FaSearch/> Explorar</Link>
                <Link to={"/"} className={`item-nav ${location.pathname === "/notifications"? "active": ""}`}> <FaBell/> Notificações</Link>
            </div>
            <div className="nav-bottom">
                <Link to={"/profile"} className={`item-nav ${location.pathname === "/profile"? "active": ""}`}> <BsPersonFill/> Perfil </Link>
                <button className="item-nav" onClick={handleLogout}> <RiLogoutBoxRFill/> Sair</button>
            </div>
        </nav>
        </div>
    )
}
