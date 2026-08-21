import { Router, Request, Response } from "express";
import { prisma } from "@suvidha/db";
import { ProductSchema } from "@suvidha/types";
import { requireAdmin } from "../middleware/auth";
import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

const router = Router();

// PUBLIC: Get all active products with optional filters
router.get("/", async (req: Request, res: Response) => {
  try {
    const { category, featured, search } = req.query;

    const whereClause: any = {
      status: "ACTIVE",
    };

    if (category) {
      whereClause.category = String(category);
    }

    if (featured === "true") {
      whereClause.featured = true;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: String(search), mode: "insensitive" } },
        { description: { contains: String(search), mode: "insensitive" } },
      ];
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: { variants: true },
      orderBy: { createdAt: "desc" },
    });

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

    const { name, description, price, salePrice, category, coverImage, images, featured, status, variants } =
      parseResult.data;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        salePrice: salePrice || null,
        category,
        coverImage: coverImage || (images && images.length > 0 ? images[0] : null),
        images,
        featured,
        status,
        variants: {
          create: variants.map((v) => ({
            size: v.size,
            color: v.color,
            stock: v.stock,
          })),
        },
      },
      include: { variants: true },
    });

    return res.status(201).json({ success: true, data: product });
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

    const { name, description, price, salePrice, category, coverImage, images, featured, status, variants } =
      parseResult.data;

    // Delete existing variants and re-create updated ones
    await prisma.variant.deleteMany({ where: { productId: id } });

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        salePrice: salePrice || null,
        category,
        coverImage: coverImage || (images && images.length > 0 ? images[0] : null),
        images,
        featured,
        status,
        variants: {
          create: variants.map((v) => ({
            size: v.size,
            color: v.color,
            stock: v.stock,
          })),
        },
      },
      include: { variants: true },
    });

    return res.json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error("[Update Product Error]", error);
    return res.status(500).json({ success: false, error: "Failed to update product" });
  }
});

// ADMIN ONLY: Delete product
router.delete("/admin/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    return res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("[Delete Product Error]", error);
    return res.status(500).json({ success: false, error: "Failed to delete product" });
  }
});

// PUBLIC: Get single product by ID (Placed AFTER /admin routes to prevent collision)
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { variants: true },
    });

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
