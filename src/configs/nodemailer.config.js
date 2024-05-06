import dotenv from "dotenv";

dotenv.config();

const configMailer = {
  EMAIL: "gmail",
  EMAIL_PORT: 587,
};

export const nodeMailerUser = process.env.USER_MAILER;
export const nodeMailerPassword = process.env.PASSWORD_MAILER;
export { configMailer };
