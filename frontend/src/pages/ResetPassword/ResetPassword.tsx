import { useNavigate, useSearchParams } from "react-router-dom"
import { useState } from "react"
import axios from "axios"
import "./style.css"
import Header from "../../components/Header/Header"

export default function ResetPassword() {
  const [params] = useSearchParams()
  const token = params.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const handleReset = async () => {
    await axios.post("http://localhost:3000/api/auth/reset-password", {
      token,
      password
    })

    alert("Senha alterada!")
    navigate("/login")
  }

  return (
    <>
      <div className="header-forgot-password">
        <Header title={"Redefinir Senha"}/>
        <button><a href="/register">Cadastro</a></button>
      </div>
      <div className="container-forgot-password">
        <div className="subcontainer-forgot-password">
          <h2>Cria uma nova senha</h2>
          <p>Crie uma nova senha para a sua conta.</p>
          <input type="password" placeholder="Nova senha" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <input type="password" placeholder="Confirmar nova senha" value={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value) ; setError("")}}/>

          {error && <p className="error-text">{error}</p>}

          <button onClick={handleReset}>Registrar</button>
        </div>
      </div>
    </>
  )
}