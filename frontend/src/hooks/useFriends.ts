import { useState } from "react"
import api from "../services/api"

export function useFriends() {
  const [loadingFriendAction, setLoadingFriendAction] = useState(false)

  //Enviar pedido de amizade
  async function sendRequest(userId: string) {
    try {
      setLoadingFriendAction(true)
      const response = await api.post(`/friends/request/${userId}`)
      return response.data
    } catch (error) {
      console.error("Erro ao enviar solicitação:", error)
      throw error
    } finally {
      setLoadingFriendAction(false)
    }
  }

  //Aceitar pedido de amizade
  async function acceptRequest(userId: string) {
    try {
      setLoadingFriendAction(true)
      const response = await api.patch(`/friends/accept/${userId}`)
      return response.data
    } catch (error) {
      console.error("Erro ao aceitar solicitação:", error)
      throw error
    } finally {
      setLoadingFriendAction(false)
    }
  }

  //Rejeitar pedido de amizade
  async function rejectRequest(userId: string) {
    try {
      setLoadingFriendAction(true)
      const response = await api.patch(`/friends/reject/${userId}`)
      return response.data
    } catch (error) {
      console.error("Erro ao recusar solicitação:", error)
      throw error
    } finally {
      setLoadingFriendAction(false)
    }
  }

  //Cancelar pedido de amizade
  async function cancelRequest(userId: string) {
    try {
      setLoadingFriendAction(true)
      const response = await api.patch(`/friends/cancel/${userId}`)
      return response.data
    } catch (error) {
      console.error("Erro ao cancelar solicitação:", error)
      throw error
    } finally {
      setLoadingFriendAction(false)
    }
  }

  //Remover amizade
  async function removeFriend(userId: string) {
    try {
      setLoadingFriendAction(true)
      const response = await api.delete(`/friends/${userId}`)
      return response.data
    } catch (error) {
      console.error("Erro ao remover amigo:", error)
      throw error
    } finally {
      setLoadingFriendAction(false)
    }
  }

  return {
    loadingFriendAction,
    sendRequest,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    removeFriend
  }
}