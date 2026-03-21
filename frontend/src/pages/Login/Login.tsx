import "./style.css"
import nexura from "../../assets/images/nexura-logo.png"
import { loginUser } from "../../services/auth"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Login() {

  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async() =>{
    try {
      await loginUser({email, password})
      console.log("Logado")
      navigate("/feed")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <div className="container-login">
        <div className="login-left">
            <header id="header-init">
              <h1>Nexura</h1>
              <h1 id="h1-line">|</h1>
              <h2>Login</h2>
            </header>

            <div className="subcontainer-login">
              <div className="header-left">
                <h3>Bem vindo(a) ao Nexura,</h3>
                <p>Onde cada interação vira progresso!</p>
              </div>

              <div className="form-login">
                <input type="email" placeholder="Email" onChange={(e)=>setEmail(e.target.value)}/>
                <input type="password" placeholder="Senha" onChange={(e)=>setPassword(e.target.value)}/>
                <div id="button-login-reset-password">
                  <button onClick={handleLogin}>Entrar</button>
                  <a href="/">Esqueceu a senha?</a>
                </div>
              </div>
            </div>

            <div className="register-login">
              <p>Não tem uma conta?</p>
              <a href="/register">Cadastre-se</a>
            </div>
        </div>
        <div className="login-right">
          <img src={nexura} alt="nexura-img" />
        </div>
      </div>
    </>
  )
}