import type { Step2Props } from "../../types/stepTypes";

export default function Step1({ next, handleChange }: Step2Props) {
  return (
    <div>
      <h2>Etapa 2</h2>

      <input name="name" onChange={handleChange} />
      <input name="email" onChange={handleChange} />

      <button onClick={next}>Continuar</button>
    </div>
  );
}
