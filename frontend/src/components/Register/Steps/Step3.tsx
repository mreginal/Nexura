import { useState } from "react";
import type { Step3Props } from "../../../types/types";

export default function Step3({handleChange, submit, formData}: Step3Props) {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!formData.password) {
      setError("Preencha a senha!");
      return;
    }

    if (confirmPassword !== formData.password) {
      setError("As senhas não coincidem!");
      return;
    }

    setError("");
    submit();
  };

  return (
    <div className="subcontainer-register">
      <h2>Etapa 3</h2>

      <div className="formRegister3">
        <input type="password" name="password" placeholder="Senha" value={formData.password} onChange={handleChange}/>

        <input type="password" placeholder="Confirmar senha" onChange={(e) => {setConfirmPassword(e.target.value); setError("");}}/>
      </div>

      {error && <span className="error-text">{error}</span>}

      <button onClick={handleSubmit}>Cadastrar</button>
    </div>
  );
}