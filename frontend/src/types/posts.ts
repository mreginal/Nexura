export interface IUserPost {
    _id: string,
    name: string,
    profileImage? : string
}

export interface IPost{
    _id: string,
    content: string,
    image?:string,
    createdAt: string,
    likes: string[],
    commentsCount: number,
    shares: number,
    saves: number,
    user: IUserPost
}

export interface CreatePostProps{
    userId: string,
    userName: string,
    userProfileImage?: string,
    onPostCreated: (newPost: IPost) => void
}

export interface PostCardProps{
  post: IPost,
  currentUserId: string,
  onEdit: (postId: IPost) => void,
  onLike: (postId: string) => void
}

export type FeedCenterProps = {
    onPostCreated: (newPost: IPost) => void
}