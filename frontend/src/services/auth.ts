import api from "./api"

export const registerUser = async (data:any) =>{
    try {
        const response = await api.post("/auth/register", data)
        return response.data
    } catch (error:any) {
        throw error.response?.data || {error: "Erro no servidor"}
    }
}

export const loginUser = async (data: {email: string, password: string}) => {
  try {
    const response = await api.post("/auth/login", data)

    localStorage.setItem("token", response.data.token)
    localStorage.setItem("userId", response.data.user.id)

    return response.data
  } catch (error: any) {
    throw error.response?.data
  }
}