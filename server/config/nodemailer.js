import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.sendinblue.com", 
  port: 587,
  secure: false,
  auth: {
    user: "97e5ad001@smtp-brevo.com", 
    pass: process.env.SMTP_PASS,
  },
});

export default transporter;
