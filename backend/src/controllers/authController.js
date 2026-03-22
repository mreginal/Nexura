import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import { sendResetEmail } from "../services/emailSerivce.js"

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      cpf,
      username,
      cep,
      endereco,
      numero,
      bairro,
      cidade,
      estado,
      password
    } = req.body

    if (
      !name || !email || !cpf || !username ||
      !endereco || !bairro || !cidade || !estado || !password
    ) {
      return res.status(400).json({ error: "Preencha todos os campos" })
    }

    const userExists = await User.findOne({ email })

    if (userExists) {
      return res.status(400).json({
        error: "Email, CPF ou username já em uso"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      cpf,
      username,
      cep,
      endereco,
      numero,
      bairro,
      cidade,
      estado,
      password: hashedPassword
    })

    res.status(201).json({
      message: "Usuário criado com sucesso",
      user
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" })
    }

    const valid = await bcrypt.compare(password, user.password)

    if (!valid) {
      return res.status(401).json({ error: "Senha inválida" })
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    
    if (!email) {
      return res.status(400).json({ error: "Email obrigatório" })
    }

    const user = await User.findOne({ email })
    console.log("user:", user)

    if (!user) {
      return res.json({ message: "Usuário não encontrado" })
    }

    const token = crypto.randomBytes(32).toString("hex")
    console.log("Token gerado")

    user.resetPasswordToken = token

    if (!user.resetPasswordExpires && user.resetPasswordExpires !== null) {
      console.log("Algum campo pode estar errado no model")
    }

    user.resetPasswordExpires = Date.now() + 1800000

    await user.save()

    const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`

    await sendResetEmail(user.email, link)
    res.json({ message: "Email enviado com sucesso!" })

  } catch (err) {
    console.error("ERRO:", err)
    res.status(500).json({ error: err.message })
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({ message: "Token inválido ou expirado" })
    }

    const hashed = await bcrypt.hash(password, 10)

    user.password = hashed
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined

    await user.save()

    res.json({ message: "Senha atualizada com sucesso!" })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}