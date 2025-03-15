import nodemailer from "nodemailer";

const emailResetPassword = async (datos) => {
  var transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const { email, token } = datos;

  const mailOptions = {
    from: `"WorlsxMap" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset your password',
    text: 'Reset your password',
    html: `<p>Hello, please reset your password by clicking the following link: <a href="${process.env.FRONTEND_URL}/resetpassword/${token}">Reset Password</a></p>
        
        <p>If you didn't create this account, could ignore this message</p>
        `,
  }

  transporter.sendMail(mailOptions)
    .then(info => console.log('Message sent:', info.messageId))
    .catch(error => console.error('Error sending email:', error));

}

export default emailResetPassword
