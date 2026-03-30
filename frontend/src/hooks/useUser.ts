import { useEffect, useState } from "react"
import api from "../services/api"
import type { IUser } from "../types/types"

export function useUser() {
  const [user, setUser] = useState<IUser | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)

  async function loadUser() {
    try {
      setLoadingUser(true)
      const response = await api.get("/me")
      setUser(response.data.user)
    } catch (error) {
      console.error("Erro ao buscar usuário:", error)
      setUser(null)
    } finally {
      setLoadingUser(false)
    }
  }

  useEffect(() => {
    loadUser()
  }, [])

  return {
    user,
    loadingUser,
    loadUser,
    setUser
  }
}