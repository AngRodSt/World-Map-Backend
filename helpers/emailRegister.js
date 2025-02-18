import nodemailer from "nodemailer";

const emailRegister = async (datos) => {
    var transporter  = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

    const {name, email, token} = datos;

    const mailOptions = {
        from: `"WorlsxMap" <${process.env.EMAIL_USER}>`, // sender address
        to: email, // list of receivers
        subject: 'Verify your account in WsxM',
        text: 'Verify your account in WsxM',
        html: `<p>Hello ${name}, please verify your account by clicking the following link: <a href="${process.env.FRONTEND_URL}/confirm/${token}">Verify Account</a></p>
        
        <p>If you didn't create this account, could ignore this message</p>
        `,
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
    });
    
}

export default emailRegister