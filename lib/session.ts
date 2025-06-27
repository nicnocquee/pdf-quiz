import { SessionOptions } from "iron-session";
import { SessionUser } from "@/lib/utils";

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_PASSWORD as string,
  cookieName: "ai_pdf_quiz_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production"
  }
};

declare module "iron-session" {
  interface IronSessionData {
    user?: SessionUser;
  }
}
