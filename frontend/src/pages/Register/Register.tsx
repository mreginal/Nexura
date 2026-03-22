import "./style.css";
import { useState } from "react";
import { registerUser } from "../../services/auth";
import { useNavigate, useSearchParams } from "react-router-dom";

import Step1 from "../../components/Register/Steps/Step1";
import Step2 from "../../components/Register/Steps/Step2";
import Step3 from "../../components/Register/Steps/Step3";
import Header from "../../components/Header/Header";
import Stepper from "../../components/Register/Stepper/Stepper";

export default function Register() {
  const [searchParams, setSearchParams] = useSearchParams();
  const step = Number(searchParams.get("step")) || 1;
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    username: "",
    cep: "",
    endereco: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    password: "",
  });

  const nextStep = () => {
    console.log(formData)
    setSearchParams({ step: String(step + 1) })
  };
  const prevStep = () => setSearchParams({ step: String(step - 1) });

  const handleChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      return;
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        cpf: formData.cpf,
        username: formData.username,
        cep: formData.cep,
        endereco: formData.endereco,
        numero: formData.numero,
        bairro: formData.bairro,
        cidade: formData.cidade,
        estado: formData.estado,
        password: formData.password,
      };

      console.log("ENVIANDO:", userData);

      const res = await registerUser(userData);

      alert("Usuário criado com sucesso!");
      console.log(res);
      navigate("/login")
    } catch (error: any) {
      console.error(error);
      alert(error.error || "Erro ao cadastrar.");
    }
  };

  return (
    <div className="container-register">
      <Header title={"Cadastro"} />

      <Stepper step={step} />

      {step === 1 && (
        <Step1 next={nextStep} handleChange={handleChange} formData={formData} />
      )}

      {step === 2 && (
        <Step2
          next={nextStep}
          prev={prevStep}
          handleChange={handleChange}
          formData={formData}
        />
      )}

      {step === 3 && (
        <Step3
          handleChange={handleChange}
          submit={handleSubmit}
          password={formData.password}
          prev={prevStep}
          formData={formData}
        />
      )}
    </div>
  );
}