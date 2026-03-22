import type { Step2Props } from "../../../types/types";
import "./style.css"

export default function Step1({ next, handleChange, formData }: Step2Props) {
  return (
    <>
      <div className="subcontainer-register">
        <h2>Etapa 2 - Endereço</h2>

          <div className="formRegister2">
            <input type="text" name="cep" placeholder="CEP" value={formData.cep} onChange={handleChange} />
            <input type="text" name="endereco" placeholder="Endereço" value={formData.endereco} onChange={handleChange} />
            <input type="text" name="numero" placeholder="Nº" value={formData.numero} onChange={handleChange} />
            
            <input type="text" name="bairro" placeholder="Bairro" value={formData.bairro} onChange={handleChange} />
            <input type="text" name="cidade" placeholder="Cidade" value={formData.cidade} onChange={handleChange} />
            <input type="text" name="estado" placeholder="Estado" value={formData.estado} onChange={handleChange}/>
          </div>

        <button onClick={next}>Continuar</button>
      </div>
    </>
  )
}
