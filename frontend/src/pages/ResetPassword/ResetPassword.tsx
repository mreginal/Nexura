import { useSearchParams } from "react-router-dom"
import { useState } from "react"
import axios from "axios"

export default function ResetPassword() {
  const [params] = useSearchParams()
  const token = params.get("token")

  const [password, setPassword] = useState("")

  const handleReset = async () => {
    await axios.post("http://localhost:3000/api/auth/reset-password", {
      token,
      password
    })

    alert("Senha alterada!")
  }

  return (
    <div>
      <h2>Nova senha</h2>

      <input
        type="password"
        placeholder="Nova senha"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleReset}>Alterar senha</button>
    </div>
  )
}