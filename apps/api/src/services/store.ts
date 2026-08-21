import fs from "fs";
import path from "path";
import { prisma } from "@suvidha/db";

const DATA_DIR = path.resolve(__dirname, "../../data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");

// Initial Seed Products using real assets
const INITIAL_PRODUCTS: any[] = [];

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

// Timeout helper to prevent Prisma from hanging for 30s when port 5432 is blocked
const withTimeout = <T>(promise: Promise<T>, ms = 1500): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("DB Timeout")), ms)),
  ]);
};

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
    // Attempt Prisma DB query with timeout
    const dbProducts = await withTimeout(
      prisma.product.findMany({
        include: { variants: true },
        orderBy: { createdAt: "desc" },
      })
    );

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

  // 1. Try saving to PostgreSQL DB with timeout
  try {
    const dbCreated = await withTimeout(
      prisma.product.create({
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
      })
    );
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

  // 1. Try updating PostgreSQL DB with timeout
  try {
    await withTimeout(prisma.variant.deleteMany({ where: { productId: id } }));
    updatedProduct = await withTimeout(
      prisma.product.update({
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
      })
    );
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
    await withTimeout(prisma.product.delete({ where: { id } }));
  } catch (dbErr) {
    console.warn("[Store Service] PostgreSQL DB delete bypassed, deleted from local persistent storage");
  }

  const current = readLocalProducts();
  const updated = current.filter((p) => p.id !== id);
  writeLocalProducts(updated);
  return { success: true };
}
