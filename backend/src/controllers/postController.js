import Post from "../models/Post.js"

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.userId

    const post = await Post.findById(id)

    if (!post) {
      return res.status(404).json({ message: "Post não encontrado." })
    }

    if (post.user.toString() !== userId) {
      return res.status(403).json({ message: "Você não pode apagar este post." })
    }

    await Post.findByIdAndDelete(id)

    return res.status(200).json({ message: "Post apagado com sucesso." })
  } catch (error) {
    console.error("Erro ao apagar post:", error)
    return res.status(500).json({ message: "Erro ao apagar post." })
  }
}

export const updatePost = async (req,res) =>{
  try {
    const {id} = req.params
    const {content} = req.body
    const userId = req.userId
    
    const post = await Post.findById(id)

    if(!post){
      return res.status(404).json({message: "Post não encontrado"})
    }


    post.content = content ?? post.content

    await post.save()

    const updatedPost = await Post.findById(id).populate("user", "name profileImage")

    return res.status(200).json({message: "Post atualizado: ", updatedPost})
  } catch (error) {
    console.error(error)
  }
}

export const toggleLikePost = async(req,res)=>{
  try {
    const {id} = req.params
    const userId = req.userId

    const post = await Post.findById(id)
    if(!post){
      return res.status(404).json({message:"Post não encontrado!"})
    }

    const alreadyLiked = post.likes.some((likeUserId) => likeUserId.toString() === userId)
    if(alreadyLiked){
      post.likes = post.likes.filter((likeUserId) => likeUserId.toString() !== userId)
    }else{
      post.likes.push(userId)
    }

    await post.save()

    const updatedPost = await Post.findById(id).populate(
      "user", "name profileImage"
    )

    return res.status(200).json({message: alreadyLiked? "Like removido" : "Post curtido", post: updatedPost})
  } catch (error) {
    return res.status(500).json({message: `Erro no servidor ao curtir postagem: ${error}`})
  }
}

export async function toggleSavePost(req, res) {
  try {
    const postId = req.params.id
    const userId = req.userId

    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" })
    }

    const post = await Post.findById(postId)

    if (!post) {
      return res.status(404).json({ message: "Post não encontrado" })
    }

    if (!Array.isArray(post.saves)) {
      post.saves = []
    }

    const alreadySaved = post.saves.some(
      (id) => id.toString() === userId.toString()
    )

    if (alreadySaved) {
      post.saves = post.saves.filter(
        (id) => id.toString() !== userId.toString()
      )
    } else {
      post.saves.push(userId)
    }

    await post.save()

    const updatedPost = await Post.findById(postId)
      .populate("user", "name profileImage")

    res.status(200).json({ post: updatedPost })
  } catch (error) {
    console.error("ERRO AO SALVAR POST:", error)
    res.status(500).json({
      message: "Erro ao salvar post",
      error: error.message
    })
  }
}

export async function getSavedPosts(req, res) {
  try {
    const userId = req.userId

    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" })
    }

    const savedPosts = await Post.find({
      saves: userId
    })
      .populate("user", "name profileImage")
      .sort({ createdAt: -1 })

    res.status(200).json(savedPosts)
  } catch (error) {
    console.error("ERRO AO BUSCAR POSTS SALVOS:", error)
    res.status(500).json({
      message: "Erro ao buscar posts salvos",
      error: error.message
    })
  }
}