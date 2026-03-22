import nodemailer from "nodemailer"

export const sendResetEmail = async (to, link) => {
  try {
    console.log(process.env.EMAIL_USER)
    console.log(process.env.EMAIL_PASS)
    console.log("Enviando email para:", to)

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    await transporter.verify()

    const info = await transporter.sendMail({
      from: `"Nexura" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Recuperação de senha - Nexura",
      html: `
        <h2>Recuperação de senha</h2>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <a href="${link}">${link}</a>
        <p>Este link expira em 30 minutos.</p>
      `
    })

    console.log("Email enviado:", info.response)

  } catch (error) {
    throw new Error("Erro ao enviar email")
  }
}