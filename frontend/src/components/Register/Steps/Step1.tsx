import type { Step1Props } from "../../../types/types";
import "./style.css"

export default function Step1({ next, handleChange, formData }: Step1Props) {
  return (
    <>
      <div className="subcontainer-register">
        <h2>Etapa 1 - Identificação</h2>

          <div className="formRegister1">
            <input type="text" name="name" placeholder="Nome Completo" value={formData.name} onChange={handleChange}/>
            <input type="text" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
            
            <input type="text" name="cpf" placeholder="CPF" value={formData.cpf} onChange={handleChange} />
            <input type="text" name="username" placeholder="Nome de Usuário" value={formData.username} onChange={handleChange}/>
          </div>

        <button onClick={next}>Continuar</button>
      </div>
    </>
  )
}
