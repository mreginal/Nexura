import { useState } from "react"
import axios from "axios"
import "./style.css"
import Header from "../../components/Header/Header"
import { FaEnvelope } from "react-icons/fa"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")

  const handleSubmit = async () => {
    await axios.post("http://localhost:3000/api/auth/forgot-password", {
      email
    })

    alert("Se o email existir, você receberá um link.");
  }

  return (
    <>
      <div className="header-forgot-password">
        <Header title={"Redefinir Senha"}/>
        <button><a href="/register">Cadastro</a></button>
      </div>
      <div className="container-forgot-password">
        <div className="subcontainer-forgot-password">
          <h2>Esqueceu sua senha?</h2>
          <p>Digite abaixo o email que você utilizou para criar sua conta, que nós te enviaremos as instruções para redefinir a sua senha.</p>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
          <button onClick={handleSubmit}>Enviar</button>
        </div>
      </div>
    </>
  )
}