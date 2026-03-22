import { useState } from "react"
import axios from "axios"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")

  const handleSubmit = async () => {
    await axios.post("http://localhost:3000/api/auth/forgot-password", {
      email
    })

    alert("Se o email existir, você receberá um link.");
  }

  return (
    <div>
      <h2>Esqueceu a senha</h2>

      <input
        type="email"
        placeholder="Digite seu email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={handleSubmit}>Enviar</button>
    </div>
  )
}