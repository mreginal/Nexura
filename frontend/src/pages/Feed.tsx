import { useNavigate } from "react-router-dom"

export default function Feed(){
  const navigate = useNavigate()
  
  const handleLogout = () =>{
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <div>
      FEED
      <button onClick={handleLogout}>Sair</button>
    </div>
  )
}
