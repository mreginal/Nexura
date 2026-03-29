import { useEffect, useState } from "react"
import api from "../services/api"
import type { IPost } from "../types/types"

export function usePosts() {
  const [posts, setPosts] = useState<IPost[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [loadingPost, setLoadingPost] = useState(false)

  async function loadPosts() {
    try {
      setLoadingPosts(true)
      const response = await api.get("/posts")
      setPosts(response.data)
    } catch (error) {
      console.error("Erro ao buscar posts:", error)
    } finally {
      setLoadingPosts(false)
    }
  }

  async function getPostById(postId: string) {
    try {
      setLoadingPost(true)
      const response = await api.get(`/posts/${postId}`)
      return response.data
    } catch (error) {
      console.error("Erro ao buscar post:", error)
      return null
    } finally {
      setLoadingPost(false)
    }
  }

  async function deletePost(postId: string) {
    try {
      await api.delete(`/posts/${postId}`)

      setPosts((prevPosts) =>
        prevPosts.filter((post) => post._id !== postId)
      )

      return true
    } catch (error) {
      console.error("Erro ao apagar post:", error)
      return false
    }
  }

  async function updatePost(postId: string, newContent: string) {
    try {
      const response = await api.put(`/posts/${postId}`, {
        content: newContent
      })

      const updatedPost = response.data.post

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? updatedPost : post
        )
      )

      return updatedPost
    } catch (error) {
      console.error("Erro ao editar post:", error)
      return null
    }
  }

  async function toggleLikePost(postId: string) {
    try {
      const response = await api.patch(`/posts/${postId}/like`)
      const updatedPost = response.data.post

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? updatedPost : post
        )
      )

      return updatedPost
    } catch (error) {
      console.error("Erro ao curtir post:", error)
      return null
    }
  }

  function updateCommentCount(postId: string, delta: number) {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId
          ? {
              ...post,
              commentsCount: Math.max(0, post.commentsCount + delta)
            }
          : post
      )
    )
  }

  function addNewPost(newPost: IPost) {
    setPosts((prevPosts) => [newPost, ...prevPosts])
  }

  useEffect(() => {
    loadPosts()
  }, [])

  return {
    posts,
    loadingPosts,
    loadingPost,
    loadPosts,
    getPostById,
    deletePost,
    updatePost,
    toggleLikePost,
    updateCommentCount,
    addNewPost
  }
}