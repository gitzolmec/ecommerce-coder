import nodemailer from "nodemailer";
import {
  nodeMailerUser,
  nodeMailerPassword,
  configMailer,
} from "../configs/nodemailer.config.js";

const transporter = nodemailer.createTransport({
  service: configMailer.EMAIL,
  port: configMailer.EMAIL_PORT,
  auth: {
    user: nodeMailerUser,
    pass: nodeMailerPassword,
  },
});
export { transporter };
