import type { Step3Props } from "../../types/stepTypes";

export default function Step3({ handleChange, submit }: Step3Props) {
  return (
    <div>
      <h2>Etapa 3</h2>

      <input
        type="password"
        name="password"
        placeholder="Senha"
        onChange={handleChange}
      />

      <button onClick={submit}>Cadastrar</button>
    </div>
  );
}