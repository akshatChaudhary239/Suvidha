import rateLimit from "express-rate-limit";

// Rate limiter for requesting admin login OTP: 5 requests / 15 min per IP
export const otpRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many requests. Please try again later." },
});

// Rate limiter for OTP verification: 5 attempts / 15 min per IP
export const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many verification attempts. Please try again later." },
});

// Rate limiter for checkout submission: 10 orders / hour per IP
export const checkoutLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Order limit exceeded. Please try again later." },
});

// General public API rate limiter: 100 req/min
export const publicApiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Rate limit exceeded." },
});
