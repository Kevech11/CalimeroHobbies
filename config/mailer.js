import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: "kevcech@gmail.com",
    pass: "svtt dcdw exlt kmsh",
  },
})

// async..await is not allowed in global scope, must use a wrapper
export async function sendMail({ to, subject, html }) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Calimero Hobbies" <calimerohobbies@ethereal.email>', // sender address
    to,
    subject,
    html,
  })
}
