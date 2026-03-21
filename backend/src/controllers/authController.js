import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      cpf,
      username,
      endereco,
      cidade,
      estado,
      password
    } = req.body

    if (
      !name || !email || !cpf || !username ||
      !endereco || !cidade || !estado || !password
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
      endereco,
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