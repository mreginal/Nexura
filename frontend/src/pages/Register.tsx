import { useState } from "react"
import Step1 from "../components/Register/Step1"
import Step2 from "../components/Register/Step2"
import Step3 from "../components/Register/Step3"
import { registerUser } from "../services/auth"

export default function Register() {
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    username: "",
    endereco: "",
    cidade: "",
    estado: "",
    password: ""
  })

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async () => {
    try {
      const res = await registerUser(formData)
      alert("Usuário criado com sucesso!")
      console.log(res)
    } catch (error: any) {
      alert(error.error || "Erro ao cadastrar.")
    }
  }

  return (
    <div>
      {step === 1 && (
        <Step1 next={nextStep} handleChange={handleChange} />
      )}

      {step === 2 && (
        <Step2
          next={nextStep}
          prev={prevStep}
          handleChange={handleChange}
        />
      )}

      {step === 3 && (
        <Step3
          handleChange={handleChange}
          submit={handleSubmit}
        />
      )}
    </div>
  )
}