import mongoose from "mongoose"
import User from "../models/User.js"

// Enviar solicitação de amizade
export async function sendFriendRequest(req, res) {
  try {
    const currentUserId = req.userId
    const { targetUserId } = req.params

    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({ message: "ID inválido." })
    }

    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: "Você não pode adicionar a si mesmo." })
    }

    const currentUser = await User.findById(currentUserId)
    const targetUser = await User.findById(targetUserId)

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "Usuário não encontrado." })
    }

    // Garantir arrays
    currentUser.friends = currentUser.friends || []
    currentUser.friendRequestsSent = currentUser.friendRequestsSent || []
    currentUser.friendRequestsReceived = currentUser.friendRequestsReceived || []

    targetUser.friends = targetUser.friends || []
    targetUser.friendRequestsSent = targetUser.friendRequestsSent || []
    targetUser.friendRequestsReceived = targetUser.friendRequestsReceived || []

    const alreadyFriends = currentUser.friends.some(
      (id) => id.toString() === targetUserId
    )

    if (alreadyFriends) {
      return res.status(400).json({ message: "Vocês já são amigos." })
    }

    const alreadySent = currentUser.friendRequestsSent.some(
      (id) => id.toString() === targetUserId
    )

    if (alreadySent) {
      return res.status(400).json({ message: "Solicitação já enviada." })
    }

    const alreadyReceived = currentUser.friendRequestsReceived.some(
      (id) => id.toString() === targetUserId
    )

    if (alreadyReceived) {
      return res.status(400).json({
        message: "Esse usuário já te enviou uma solicitação."
      })
    }

    currentUser.friendRequestsSent.push(targetUser._id)
    targetUser.friendRequestsReceived.push(currentUser._id)

    await currentUser.save()
    await targetUser.save()

    return res.status(200).json({ message: "Solicitação enviada com sucesso." })
  } catch (error) {
    console.error("Erro ao enviar solicitação:", error)
    return res.status(500).json({
      message: "Erro interno do servidor.",
      error: error.message
    })
  }
}

// Aceitar solicitação
export async function acceptFriendRequest(req, res) {
  try {
    const currentUserId = req.userId
    const { requesterId } = req.params

    if (!mongoose.Types.ObjectId.isValid(requesterId)) {
      return res.status(400).json({ message: "ID inválido." })
    }

    const currentUser = await User.findById(currentUserId)
    const requesterUser = await User.findById(requesterId)

    if (!currentUser || !requesterUser) {
      return res.status(404).json({ message: "Usuário não encontrado." })
    }

    currentUser.friends = currentUser.friends || []
    currentUser.friendRequestsSent = currentUser.friendRequestsSent || []
    currentUser.friendRequestsReceived = currentUser.friendRequestsReceived || []

    requesterUser.friends = requesterUser.friends || []
    requesterUser.friendRequestsSent = requesterUser.friendRequestsSent || []
    requesterUser.friendRequestsReceived = requesterUser.friendRequestsReceived || []

    const hasRequest = currentUser.friendRequestsReceived.some(
      (id) => id.toString() === requesterId
    )

    if (!hasRequest) {
      return res.status(400).json({ message: "Solicitação não encontrada." })
    }

    currentUser.friendRequestsReceived = currentUser.friendRequestsReceived.filter(
      (id) => id.toString() !== requesterId
    )

    requesterUser.friendRequestsSent = requesterUser.friendRequestsSent.filter(
      (id) => id.toString() !== currentUserId
    )

    currentUser.friends.push(requesterUser._id)
    requesterUser.friends.push(currentUser._id)

    await currentUser.save()
    await requesterUser.save()

    return res.status(200).json({ message: "Amizade aceita com sucesso." })
  } catch (error) {
    console.error("Erro ao aceitar solicitação:", error)
    return res.status(500).json({ message: "Erro interno do servidor." })
  }
}

// Rejeitar solicitação
export async function rejectFriendRequest(req, res) {
  try {
    const currentUserId = req.userId
    const { requesterId } = req.params

    if (!mongoose.Types.ObjectId.isValid(requesterId)) {
      return res.status(400).json({ message: "ID inválido." })
    }

    const currentUser = await User.findById(currentUserId)
    const requesterUser = await User.findById(requesterId)

    if (!currentUser || !requesterUser) {
      return res.status(404).json({ message: "Usuário não encontrado." })
    }

    currentUser.friendRequestsReceived = (currentUser.friendRequestsReceived || []).filter(
      (id) => id.toString() !== requesterId
    )

    requesterUser.friendRequestsSent = (requesterUser.friendRequestsSent || []).filter(
      (id) => id.toString() !== currentUserId
    )

    await currentUser.save()
    await requesterUser.save()

    return res.status(200).json({ message: "Solicitação recusada." })
  } catch (error) {
    console.error("Erro ao recusar solicitação:", error)
    return res.status(500).json({ message: "Erro interno do servidor." })
  }
}

// Cancelar solicitação
export async function cancelFriendRequest(req, res) {
  try {
    const currentUserId = req.userId
    const { targetUserId } = req.params

    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({ message: "ID inválido." })
    }

    const currentUser = await User.findById(currentUserId)
    const targetUser = await User.findById(targetUserId)

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "Usuário não encontrado." })
    }

    currentUser.friendRequestsSent = (currentUser.friendRequestsSent || []).filter(
      (id) => id.toString() !== targetUserId
    )

    targetUser.friendRequestsReceived = (targetUser.friendRequestsReceived || []).filter(
      (id) => id.toString() !== currentUserId
    )

    await currentUser.save()
    await targetUser.save()

    return res.status(200).json({ message: "Solicitação cancelada." })
  } catch (error) {
    console.error("Erro ao cancelar solicitação:", error)
    return res.status(500).json({ message: "Erro interno do servidor." })
  }
}

// Remover amigo
export async function removeFriend(req, res) {
  try {
    const currentUserId = req.userId
    const { friendId } = req.params

    if (!mongoose.Types.ObjectId.isValid(friendId)) {
      return res.status(400).json({ message: "ID inválido." })
    }

    const currentUser = await User.findById(currentUserId)
    const friendUser = await User.findById(friendId)

    if (!currentUser || !friendUser) {
      return res.status(404).json({ message: "Usuário não encontrado." })
    }

    currentUser.friends = (currentUser.friends || []).filter(
      (id) => id.toString() !== friendId
    )

    friendUser.friends = (friendUser.friends || []).filter(
      (id) => id.toString() !== currentUserId
    )

    await currentUser.save()
    await friendUser.save()

    return res.status(200).json({ message: "Amigo removido com sucesso." })
  } catch (error) {
    console.error("Erro ao remover amigo:", error)
    return res.status(500).json({ message: "Erro interno do servidor." })
  }
}