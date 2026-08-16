import { google } from "googleapis";
import nodemailer from "nodemailer";
import { env } from "../config/env";

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  try {
    if (env.GMAIL_CLIENT_ID && env.GMAIL_CLIENT_SECRET && env.GMAIL_REFRESH_TOKEN) {
      const OAuth2 = google.auth.OAuth2;
      const oauth2Client = new OAuth2(
        env.GMAIL_CLIENT_ID,
        env.GMAIL_CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
      );

      oauth2Client.setCredentials({
        refresh_token: env.GMAIL_REFRESH_TOKEN,
      });

      const accessTokenRes = await oauth2Client.getAccessToken();
      const accessToken = accessTokenRes.token;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: env.GMAIL_SENDER_EMAIL,
          clientId: env.GMAIL_CLIENT_ID,
          clientSecret: env.GMAIL_CLIENT_SECRET,
          refreshToken: env.GMAIL_REFRESH_TOKEN,
          accessToken: accessToken || "",
        },
      });

      const info = await transporter.sendMail({
        from: `"Suvidha Royal Clothing" <${env.GMAIL_SENDER_EMAIL}>`,
        to,
        subject,
        html,
        text,
      });

      console.log(`[Email Service] Sent email to ${to}. MessageId: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } else {
      console.log(`[Email Service Mock - No OAuth setup] To: ${to} | Subject: ${subject}`);
      console.log(`Content:\n${text || html.replace(/<[^>]*>?/gm, "")}`);
      return { success: true, mock: true };
    }
  } catch (error) {
    console.error("[Email Service Error]", error);
    throw error;
  }
}
