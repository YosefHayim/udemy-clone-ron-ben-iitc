import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.GMAIL_APP_KEY,
  },
});

const sendEmail = (mailOptions: any) => {
  transporter.sendMail(mailOptions, function (error) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent");
    }
  });
};

export default sendEmail;
