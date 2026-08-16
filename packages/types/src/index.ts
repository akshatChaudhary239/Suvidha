import { z } from "zod";

export const SuitCategoryEnum = z.enum([
  "Anarkali Suits",
  "Palazzo Suits",
  "Sharara Sets",
  "Straight/A-Line Suits",
  "Kurta Sets"
]);
export type SuitCategory = z.infer<typeof SuitCategoryEnum>;

export const SuitSizeEnum = z.enum(["XS", "S", "M", "L", "XL", "XXL", "Free Size"]);
export type SuitSize = z.infer<typeof SuitSizeEnum>;

export const VariantSchema = z.object({
  id: z.string().optional(),
  size: SuitSizeEnum,
  color: z.string().min(1, "Color is required"),
  stock: z.number().int().min(0, "Stock cannot be negative")
});
export type VariantInput = z.infer<typeof VariantSchema>;

export const ProductSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be positive"),
  salePrice: z.number().positive("Sale price must be positive").optional().nullable(),
  category: SuitCategoryEnum,
  coverImage: z.string().min(1, "Cover image is required").optional().nullable(),
  images: z.array(z.string().min(1, "Image string required")).min(1, "At least one image is required"),
  featured: z.boolean().default(false),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).default("ACTIVE"),
  variants: z.array(VariantSchema).min(1, "At least one variant is required")
});
export type ProductInput = z.infer<typeof ProductSchema>;

export const ShippingAddressSchema = z.object({
  street: z.string().min(3, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(4, "Postal code is required"),
  country: z.string().default("India")
});
export type ShippingAddress = z.infer<typeof ShippingAddressSchema>;

export const CartItemSchema = z.object({
  productId: z.string(),
  variantId: z.string(),
  quantity: z.number().int().positive()
});
export type CartItem = z.infer<typeof CartItemSchema>;

export const CheckoutSchema = z.object({
  customerName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  shippingAddress: ShippingAddressSchema,
  items: z.array(CartItemSchema).min(1, "Cart cannot be empty"),
  paymentMethod: z.enum(["RAZORPAY", "COD"])
});
export type CheckoutInput = z.infer<typeof CheckoutSchema>;

export const VerifyRazorpayPaymentSchema = z.object({
  orderId: z.string(),
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string()
});
export type VerifyRazorpayPaymentInput = z.infer<typeof VerifyRazorpayPaymentSchema>;

export const RequestOtpSchema = z.object({
  email: z.string().email("Invalid email address")
});

export const VerifyOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits")
});

export const OrderStatusEnum = z.enum([
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED"
]);
export type OrderStatus = z.infer<typeof OrderStatusEnum>;

export const UpdateOrderStatusSchema = z.object({
  status: OrderStatusEnum
});
