import { Router, Request, Response } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { prisma } from "@suvidha/db";
import { RequestOtpSchema, VerifyOtpSchema } from "@suvidha/types";
import { env } from "../config/env";
import { sendEmail } from "../services/gmail";
import { otpRequestLimiter, otpVerifyLimiter } from "../middleware/rateLimiter";

const router = Router();

// Helper to hash OTP code
function hashOtp(otp: string): string {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

// 1. Request OTP Code
router.post("/request-otp", otpRequestLimiter, async (req: Request, res: Response) => {
  try {
    const parseResult = RequestOtpSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ success: false, error: "Invalid email format" });
    }

    const { email } = parseResult.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Check allowlist strictly
    if (!env.ADMIN_ALLOWED_EMAILS.includes(normalizedEmail)) {
      // Return generic response to avoid leaking allowed emails
      return res.json({
        success: true,
        message: "If the email is authorized, an OTP code has been sent.",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes TTL

    // Invalidate existing OTP requests for this email
    await prisma.otpRequest.deleteMany({
      where: { email: normalizedEmail },
    });

    // Save new OTP request
    await prisma.otpRequest.create({
      data: {
        email: normalizedEmail,
        otpHash,
        expiresAt,
      },
    });

    // Send OTP via email
    await sendEmail({
      to: normalizedEmail,
      subject: "Your Suvidha Admin Passcode",
      html: `
        <div style="font-family: 'Georgia', serif; padding: 20px; background-color: #FAF3E7; color: #231A15;">
          <h2 style="color: #6B1E2A;">Suvidha Royal Admin Access</h2>
          <p>Your one-time security code is:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #0E4D3C; margin: 20px 0;">
            ${otp}
          </div>
          <p style="font-size: 13px; color: #666;">This code is valid for 5 minutes. If you did not request this code, please ignore this email.</p>
        </div>
      `,
      text: `Your Suvidha Admin Security Code is: ${otp}. Valid for 5 minutes.`,
    });

    return res.json({
      success: true,
      message:
        env.NODE_ENV === "development" || !env.GMAIL_CLIENT_ID
          ? `Passcode sent to authorized email address. (Dev Passcode: ${otp})`
          : "Passcode sent to authorized email address.",
      devOtp: env.NODE_ENV === "development" ? otp : undefined,
    });
  } catch (error) {
    console.error("[OTP Request Error]", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// 2. Verify OTP Code
router.post("/verify-otp", otpVerifyLimiter, async (req: Request, res: Response) => {
  try {
    const parseResult = VerifyOtpSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ success: false, error: "Invalid credentials format" });
    }

    const { email, otp } = parseResult.data;
    const normalizedEmail = email.toLowerCase().trim();

    if (!env.ADMIN_ALLOWED_EMAILS.includes(normalizedEmail)) {
      return res.status(401).json({ success: false, error: "Invalid email or OTP" });
    }

    const otpRecord = await prisma.otpRequest.findFirst({
      where: { email: normalizedEmail },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      return res.status(401).json({ success: false, error: "OTP expired or not requested" });
    }

    if (new Date() > otpRecord.expiresAt) {
      await prisma.otpRequest.delete({ where: { id: otpRecord.id } });
      return res.status(401).json({ success: false, error: "OTP code has expired" });
    }

    if (otpRecord.attempts >= 5) {
      await prisma.otpRequest.delete({ where: { id: otpRecord.id } });
      return res.status(429).json({ success: false, error: "Too many failed attempts. Request a new OTP." });
    }

    const submittedHash = hashOtp(otp);
    if (submittedHash !== otpRecord.otpHash) {
      await prisma.otpRequest.update({
        where: { id: otpRecord.id },
        data: { attempts: { increment: 1 } },
      });
      return res.status(401).json({ success: false, error: "Invalid OTP code" });
    }

    // OTP Verified! Delete used OTP
    await prisma.otpRequest.delete({ where: { id: otpRecord.id } });

    // Issue JWT session token (valid 24h)
    const token = jwt.sign({ email: normalizedEmail }, env.JWT_SECRET, { expiresIn: "24h" });

    // Set secure HTTP-only cookie
    res.cookie("suvidha_admin_session", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      token,
      email: normalizedEmail,
    });
  } catch (error) {
    console.error("[OTP Verification Error]", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// 3. Admin Logout
router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("suvidha_admin_session");
  return res.json({ success: true, message: "Logged out successfully" });
});

export default router;
