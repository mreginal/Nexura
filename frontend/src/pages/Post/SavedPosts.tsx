import { useEffect } from "react"
import { usePosts } from "../../hooks/usePosts"
import PostCard from "../../components/Posts/Post/PostCard"
import type { SavedPostsProps } from "../../types/types"

function SavedPosts({ currentUserId }: SavedPostsProps) {
  console.log(currentUserId)
  const {
    savedPosts,
    loadingSavedPosts,
    loadSavedPosts,
    toggleLikePost,
    toggleSavePost,
    updatePost,
    deletePost
  } = usePosts()

  useEffect(() => {
    loadSavedPosts()
  }, [])

  if (loadingSavedPosts) {
    return <p>Carregando posts salvos...</p>
  }

  if (savedPosts.length === 0) {
    return <p>Você ainda não salvou nenhum post.</p>
  }

  return (
    <div>
      {savedPosts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          currentUserId={currentUserId}
          onLike={toggleLikePost}
          onSave={toggleSavePost}
          onEdit={updatePost}
          onDelete={deletePost}
        />
      ))}
    </div>
  )
}

export default SavedPosts