import "./style.css"
import { useState, type ChangeEvent } from "react";
import type { ModalProps } from "../../types/types";
import api from "../../services/api";

export default function EditProfileModal({ user, onClose, onUpdate }: ModalProps) {
  const [name, setName] = useState(user.name)
  const [bio, setBio] = useState(user.bio || "")
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    const formData = new FormData()
    formData.append("name", name)
    formData.append("bio", bio)

    if (profileImage) formData.append("profileImage", profileImage)
    if (coverImage) formData.append("coverImage", coverImage)

    try {
      const response = await api.put("/update", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      onUpdate(response.data.user)
      onClose()
    } catch (error) {
      console.error(error)
      alert("Erro ao atualizar perfil")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Editar Perfil</h2>

        <label>
          Nome:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label>
          Biografia:
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </label>

        <label>
          Foto de Perfil:
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => handleFileChange(e, setProfileImage)}
          />
        </label>

        <label>
          Foto de Capa:
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => handleFileChange(e, setCoverImage)}
          />
        </label>

        <div className="modal-actions">
          <button onClick={onClose} disabled={loading}>Cancelar</button>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  )
}