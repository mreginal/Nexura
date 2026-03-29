import type { ChangeEvent } from "react"

/* 
======================
      FORMULÁRIOS
====================== 
*/

export interface FormData {
  name: string
  email: string
  cpf: string
  username: string
  cep: string
  endereco: string
  numero: string
  bairro: string
  cidade: string
  estado: string
  password: string
}

export interface Step1Props {
  next: () => void
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
  formData: FormData
}

export interface Step2Props {
  next: () => void
  prev: () => void
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
  formData: FormData
}

export interface Step3Props {
  prev: () => void
  submit: () => void
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
  formData: FormData
  password: string
}

/* 
========================
   NAVEGAÇÃO / ROUTER
========================
*/

export interface LocationState {
  tab?: string
}

/* 
===============
   USUÁRIO
===============
 */

export interface IUser {
  _id: string
  name: string
  email: string
  profileImage?: string
  coverImage?: string
  bio?: string
}

//Usuário para postagens
export interface IUserPost {
  _id: string
  name: string
  profileImage?: string
}

//Usuário para comentários
export interface ICommentUser {
  _id: string
  name: string
  profileImage?: string
}

/* 
===========
   POSTS
===========
 */

export interface IPost {
  _id: string
  content: string
  image?: string
  createdAt: string
  likes: string[]
  commentsCount: number
  shares: number
  saves: number
  user: IUserPost
}

/* 
=================
   COMENTÁRIOS
=================
 */

export interface IComment {
  _id: string
  content: string
  user: ICommentUser
  post: string
  createdAt: string
  updatedAt: string
}


/* 
=============
    MODAIS
=============
*/

export interface ModalProps {
  user: IUser
  onClose: () => void
  onUpdate: (updatedUser: IUser) => void
}


export interface CommentsModalProps {
  post: IPost
  currentUserId: string
  isOpen: boolean
  onClose: () => void
  onCommentCountChange?: (delta: number) => void
}


/* 
==========================
   COMPONENTES / PROPS
==========================
 */

export interface CreatePostProps {
  userId: string
  userName: string
  userProfileImage?: string
  onPostCreated: (newPost: IPost) => void
}

export interface FeedCenterProps {
  onPostCreated: (newPost: IPost) => void
}

export interface PostCardProps {
  post: IPost
  currentUserId: string
  onEdit?: (postId: string, newContent: string) => Promise<void>
  onLike?: (postId: string) => void
  onDelete?: (postId: string) => void
  onCommentCountUpdate?: (postId: string, delta: number) => void
  isCommentsPage?: boolean
}