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