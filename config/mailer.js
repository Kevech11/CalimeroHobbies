import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: "kevcech@gmail.com",
    pass: "svtt dcdw exlt kmsh",
  },
})



export async function sendMail({ to, subject, html }) {
  const info = await transporter.sendMail({
    from: '"Calimero Hobbies" <calimerohobbies@ethereal.email>',
    to,
    subject,
    html,
  })

  return info
}
