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
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              
              <h1 style="color: #3C0059; font-size: 40px; margin-bottom: 10px;">
                Nexura
              </h1>

              <p style="font-size: 20px; color: #7C7C7C; font-weight: bold;">
                Recuperação de senha
              </p>

              <p style="margin: 20px 0;">
                Clique no botão abaixo para redefinir sua senha:
              </p>

              <a href="${link}" style="
                display: inline-block;
                padding: 12px 24px;
                text-decoration: none;
                font-weight: bold;
                margin-top: 10px;
                background-color: #3C0059;
                border-radius: 15px;
                color: #FFFFFF;
              ">
                Redefinir senha
              </a>

              <p style="
                font-size: 14px;
                color: #C2C2C2;
                margin-top: 30px;
              ">
                Este link expira em 30 minutos.
              </p>

              <div style="margin-top: 40px;">
                <img 
                  src="https://i.imgur.com/S0qfvwG.png"
                  alt="Nexura"
                  style="width: 100%; max-width: 500px; border-radius: 10px;"
                />
              </div>

            </div>
          `
    })

    console.log("Email enviado:", info.response)

  } catch (error) {
    throw new Error("Erro ao enviar email")
  }
}