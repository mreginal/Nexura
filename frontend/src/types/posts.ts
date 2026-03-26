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
    likes: number,
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
  post: IPost
}

export type FeedCenterProps = {
    onPostCreated: (newPost: IPost) => void
}