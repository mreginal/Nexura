export type FormData = {
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

export type Step1Props = {
  next: () => void
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  formData: FormData
}

export type Step2Props = {
  next: () => void
  prev: () => void
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  formData: FormData
}

export type Step3Props = {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  submit: () => void
  prev: () => void
  formData: FormData
  password: string
}

export type LocationState ={
  tab?: String
}

export interface IUser {
  _id: string
  name: string
  email: string
  profileImage?: string
  coverImage?: string
  bio?: string
}

export type ModalProps ={
  user:IUser,
  onClose: () => void,
  onUpdate: (user: any) => void
}
