import { Router, Request, Response } from "express";
import { ProductSchema } from "@suvidha/types";
import { requireAdmin } from "../middleware/auth";
import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env";
import {
  getAllProducts,
  saveProduct,
  updateProduct,
  deleteProduct,
  readLocalProducts,
} from "../services/store";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

const router = Router();

// PUBLIC: Get all active products with optional filters
router.get("/", async (req: Request, res: Response) => {
  try {
    const products = await getAllProducts(req.query);
    return res.json({ success: true, data: products });
  } catch (error) {
    console.error("[Get Products Error]", error);
    return res.status(500).json({ success: false, error: "Failed to fetch products" });
  }
});

// ADMIN ONLY: Cloudinary upload signature for client-side uploads
router.get("/admin/upload-signature", requireAdmin, (req: Request, res: Response) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder: "suvidha_products" },
      env.CLOUDINARY_API_SECRET
    );

    return res.json({
      success: true,
      timestamp,
      signature,
      cloudName: env.CLOUDINARY_CLOUD_NAME,
      apiKey: env.CLOUDINARY_API_KEY,
      folder: "suvidha_products",
    });
  } catch (error) {
    console.error("[Cloudinary Signature Error]", error);
    return res.status(500).json({ success: false, error: "Failed to generate upload signature" });
  }
});

// ADMIN ONLY: Create new product
router.post("/admin", requireAdmin, async (req: Request, res: Response) => {
  try {
    const parseResult = ProductSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ success: false, error: parseResult.error.flatten() });
    }

    const created = await saveProduct(parseResult.data);
    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error("[Create Product Error]", error);
    return res.status(500).json({ success: false, error: "Failed to create product" });
  }
});

// ADMIN ONLY: Update product
router.put("/admin/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parseResult = ProductSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ success: false, error: parseResult.error.flatten() });
    }

    const updated = await updateProduct(id, parseResult.data);
    return res.json({ success: true, data: updated });
  } catch (error) {
    console.error("[Update Product Error]", error);
    return res.status(500).json({ success: false, error: "Failed to update product" });
  }
});

// ADMIN ONLY: Delete product
router.delete("/admin/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteProduct(id);
    return res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("[Delete Product Error]", error);
    return res.status(500).json({ success: false, error: "Failed to delete product" });
  }
});

// PUBLIC: Get single product by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const products = readLocalProducts();
    const product = products.find((p) => p.id === id);

    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    return res.json({ success: true, data: product });
  } catch (error) {
    console.error("[Get Product Error]", error);
    return res.status(500).json({ success: false, error: "Failed to fetch product" });
  }
});

export default router;
