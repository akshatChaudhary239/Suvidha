import fs from "fs";
import path from "path";
import { prisma } from "@suvidha/db";

const DATA_DIR = path.resolve(__dirname, "../../data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");

// Initial Seed Products using real assets
const INITIAL_PRODUCTS = [
  {
    id: "prod-real-1",
    name: "Lavender Floral Chiffon Suit Set",
    description: "Soft lilac pastel suit set with fine floral embroidery and matching chiffon dupatta.",
    price: 4999,
    salePrice: 4299,
    category: "Anarkali Suits",
    coverImage: "/products/prod-real-1.png",
    images: ["/products/prod-real-1.png"],
    featured: true,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    variants: [
      { id: "v1-m", productId: "prod-real-1", size: "M", color: "Soft Lavender", stock: 10 },
      { id: "v1-l", productId: "prod-real-1", size: "L", color: "Soft Lavender", stock: 5 },
    ],
  },
  {
    id: "prod-real-2",
    name: "Ivory Resham Threadwork Ensemble",
    description: "Cream gold handcrafted suit set with delicate floral thread embroidery and matching dupatta.",
    price: 3899,
    salePrice: 3399,
    category: "Straight/A-Line Suits",
    coverImage: "/products/prod-real-2.png",
    images: ["/products/prod-real-2.png"],
    featured: true,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    variants: [
      { id: "v2-s", productId: "prod-real-2", size: "S", color: "Cream Gold", stock: 8 },
      { id: "v2-m", productId: "prod-real-2", size: "M", color: "Cream Gold", stock: 12 },
    ],
  },
  {
    id: "prod-real-3",
    name: "Dusty Rose Heritage Silk Suit",
    description: "Rich dusty rose silk suit set with intricate paisley motifs and heavy organza dupatta.",
    price: 5499,
    salePrice: 4799,
    category: "Palazzo Suits",
    coverImage: "/products/prod-real-3.png",
    images: ["/products/prod-real-3.png"],
    featured: true,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    variants: [{ id: "v3-l", productId: "prod-real-3", size: "L", color: "Dusty Rose", stock: 6 }],
  },
  {
    id: "prod-real-4",
    name: "Sky Blue Botanical Silk Set",
    description: "Serene sky blue printed silk suit set with scalloped cuffs and matching printed dupatta.",
    price: 3999,
    salePrice: 3499,
    category: "Kurta Sets",
    coverImage: "/products/prod-real-4.png",
    images: ["/products/prod-real-4.png"],
    featured: true,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    variants: [{ id: "v4-xl", productId: "prod-real-4", size: "XL", color: "Sky Blue", stock: 15 }],
  },
  {
    id: "prod-real-5",
    name: "Mustard Gold Royal Zari Ensemble",
    description: "Mustard gold traditional suit set with heavy resham neckwork and matching dupatta.",
    price: 5999,
    salePrice: 5199,
    category: "Sharara Sets",
    coverImage: "/products/prod-real-5.png",
    images: ["/products/prod-real-5.png"],
    featured: true,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    variants: [{ id: "v5-m", productId: "prod-real-5", size: "M", color: "Mustard Gold", stock: 10 }],
  },
];

function ensureStorageFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(PRODUCTS_FILE)) {
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(INITIAL_PRODUCTS, null, 2));
    }
  } catch (err) {
    console.error("[Store Service] Error ensuring storage file:", err);
  }
}

export function readLocalProducts(): any[] {
  ensureStorageFile();
  try {
    const raw = fs.readFileSync(PRODUCTS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("[Store Service] Error reading products file:", err);
    return INITIAL_PRODUCTS;
  }
}

export function writeLocalProducts(products: any[]) {
  ensureStorageFile();
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
  } catch (err) {
    console.error("[Store Service] Error writing products file:", err);
  }
}

export async function getAllProducts(queryFilters?: any) {
  try {
    // Attempt Prisma DB query
    const dbProducts = await prisma.product.findMany({
      include: { variants: true },
      orderBy: { createdAt: "desc" },
    });

    if (dbProducts && dbProducts.length > 0) {
      writeLocalProducts(dbProducts);
      return dbProducts;
    }
  } catch (dbErr) {
    console.warn("[Store Service] PostgreSQL DB query unreachable, using local persistent fallback");
  }

  // Fallback to persistent storage
  let products = readLocalProducts();
  if (queryFilters) {
    if (queryFilters.category) {
      products = products.filter((p) => p.category === String(queryFilters.category));
    }
    if (queryFilters.featured === "true") {
      products = products.filter((p) => p.featured);
    }
    if (queryFilters.search) {
      const q = String(queryFilters.search).toLowerCase();
      products = products.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
  }
  return products;
}

export async function saveProduct(data: any) {
  const newProduct = {
    id: `prod-${Date.now()}`,
    name: data.name,
    description: data.description,
    price: data.price,
    salePrice: data.salePrice || null,
    category: data.category,
    coverImage: data.coverImage || (data.images && data.images[0]) || "/products/prod-real-1.png",
    images: data.images && data.images.length > 0 ? data.images : [data.coverImage || "/products/prod-real-1.png"],
    featured: data.featured ?? true,
    status: data.status || "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    variants: (data.variants || []).map((v: any, idx: number) => ({
      id: `var-${Date.now()}-${idx}`,
      productId: `prod-${Date.now()}`,
      size: v.size || "M",
      color: v.color || "Standard",
      stock: v.stock ?? 10,
    })),
  };

  // 1. Try saving to PostgreSQL DB
  try {
    const dbCreated = await prisma.product.create({
      data: {
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        salePrice: newProduct.salePrice,
        category: newProduct.category,
        coverImage: newProduct.coverImage,
        images: newProduct.images,
        featured: newProduct.featured,
        status: newProduct.status as any,
        variants: {
          create: newProduct.variants.map((v: any) => ({
            size: v.size,
            color: v.color,
            stock: v.stock,
          })),
        },
      },
      include: { variants: true },
    });
    newProduct.id = dbCreated.id;
  } catch (dbErr) {
    console.warn("[Store Service] PostgreSQL DB create bypassed, saved to local persistent storage");
  }

  // 2. Always write to local persistent storage
  const current = readLocalProducts();
  const updated = [newProduct, ...current];
  writeLocalProducts(updated);

  return newProduct;
}

export async function updateProduct(id: string, data: any) {
  let updatedProduct: any = null;

  // 1. Try updating PostgreSQL DB
  try {
    await prisma.variant.deleteMany({ where: { productId: id } });
    updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        salePrice: data.salePrice,
        category: data.category,
        coverImage: data.coverImage,
        images: data.images,
        featured: data.featured,
        status: data.status,
        variants: {
          create: (data.variants || []).map((v: any) => ({
            size: v.size,
            color: v.color,
            stock: v.stock,
          })),
        },
      },
      include: { variants: true },
    });
  } catch (dbErr) {
    console.warn("[Store Service] PostgreSQL DB update bypassed, updated local persistent storage");
  }

  // 2. Update local persistent storage
  const current = readLocalProducts();
  const idx = current.findIndex((p) => p.id === id);
  if (idx !== -1) {
    current[idx] = {
      ...current[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    if (!updatedProduct) updatedProduct = current[idx];
  } else {
    current.unshift({ id, ...data });
    if (!updatedProduct) updatedProduct = current[0];
  }
  writeLocalProducts(current);

  return updatedProduct;
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } });
  } catch (dbErr) {
    console.warn("[Store Service] PostgreSQL DB delete bypassed, deleted from local persistent storage");
  }

  const current = readLocalProducts();
  const updated = current.filter((p) => p.id !== id);
  writeLocalProducts(updated);
  return { success: true };
}
