import express from "express"
import { register, login, resetPassword, forgotPassword } from "../controllers/authController.js"

const router = express.Router()

router.post("/register", register) //Registrar usuário
router.post("/login", login) // Login usuário
router.post("/forgot-password", forgotPassword) // Esqueceu a senha
router.post("/reset-password", resetPassword) // Resetar a senha

export default router