import nodemailer from 'nodemailer';

const user = process.env.EMAIL_SERVER_USER;
const pass = process.env.EMAIL_SERVER_PASSWORD;

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user,
    pass,
  },
});

export const mailOptions = {
  from: process.env.EMAIL_FROM,
};
