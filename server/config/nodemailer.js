import nodemailer from 'nodemailer';

const transporter=nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth:{
    user:process.env.SMTP_USER,
    pass:process.env.SMTP_PASS
  },
   tls: {
    rejectUnauthorized: false    // 👈 this fixes self-signed cert error
  }
});


export default transporter;