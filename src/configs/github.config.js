import dotenv from "dotenv";

dotenv.config();

export const ghClientId = process.env.GH_CLIENT_ID;
export const ghClientSecret = process.env.GH_CLIENT_SECRET;
