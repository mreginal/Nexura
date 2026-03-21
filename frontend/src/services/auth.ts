import api from "./api"

export const registerUser = async (data:any) =>{
    try {
        const response = await api.post("/auth/register", data)
        return response.data
    } catch (error:any) {
        throw error.response?.data || {error: "Erro no servidor"}
    }
}

export const loginUser = async (data: any) => {
  try {
    const response = await api.post("/auth/login", data)

    const token = response.data.token

    localStorage.setItem("token", token)

    return response.data
  } catch (error: any) {
    throw error.response?.data
  }
}