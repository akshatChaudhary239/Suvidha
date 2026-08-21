"use client";
import { API_URL } from "../../lib/config";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ImageFileUpload from "@/components/ImageFileUpload";
import {
  Package,
  ShoppingBag,
  LogOut,
  Plus,
  RefreshCw,
  Edit,
  Trash2,
  CheckCircle,
  Truck,
  AlertCircle,
  Upload,
  CreditCard,
  Banknote,
  Image as ImageIcon,
  X,
  Lock,
} from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  totalAmount: number;
  paymentMethod: "RAZORPAY" | "COD";
  paymentStatus: "UNPAID" | "PAID" | "FAILED";
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
  items: any[];
}

export default function OwnerDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"ORDERS" | "PRODUCTS">("ORDERS");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [sseConnected, setSseConnected] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Product state
  const [products, setProducts] = useState<any[]>([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    salePrice: "",
    category: "Anarkali Suits",
    coverImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    size: "M",
    color: "Peacock Green",
    stock: "10",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const getAuthHeader = () => {
    let token = typeof window !== "undefined" ? localStorage.getItem("suvidha_admin_token") : "";
    if (process.env.NODE_ENV === "development" && !token) {
      token = "dev_admin_token";
    }
    return { Authorization: `Bearer ${token}` };
  };

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/orders/admin`, {
        headers: getAuthHeader(),
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("suvidha_admin_token");
      if (process.env.NODE_ENV !== "development" && !token) {
        router.push("/suvidha-owner-gate");
        return;
      }
    }

    fetchOrders();
    fetchProducts();

    // 1. Setup 3-second Auto-Polling Backup
    const pollInterval = setInterval(() => {
      fetchOrders();
    }, 3000);

    // 2. Setup SSE Real-time Order Stream
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource(`${API_URL}/api/orders/admin/stream`);

      eventSource.onopen = () => {
        setSseConnected(true);
      };

      eventSource.addEventListener("new_order", (event) => {
        const newOrder = JSON.parse(event.data);
        setOrders((prev) => {
          if (prev.some((o) => o.id === newOrder.id)) return prev;
          return [newOrder, ...prev];
        });
      });

      eventSource.addEventListener("order_updated", (event) => {
        const updatedOrder = JSON.parse(event.data);
        setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
      });

      eventSource.onerror = () => {
        setSseConnected(false);
      };
    } catch (err) {
      console.warn("SSE fallback to polling mode");
    }

    return () => {
      clearInterval(pollInterval);
      if (eventSource) eventSource.close();
    };
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/admin/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.data : o)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      description: "",
      price: "",
      salePrice: "",
      category: "Anarkali Suits",
      coverImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
      size: "M",
      color: "Peacock Green",
      stock: "10",
    });
    setFormError(null);
    setFormSuccess(null);
    setShowProductModal(true);
  };

  const openEditProductModal = (prod: any) => {
    setEditingProduct(prod);
    const firstVariant = prod.variants?.[0] || {};
    setProductForm({
      name: prod.name || "",
      description: prod.description || "",
      price: prod.price ? String(prod.price) : "",
      salePrice: prod.salePrice ? String(prod.salePrice) : "",
      category: prod.category || "Anarkali Suits",
      coverImage: prod.coverImage || prod.images?.[0] || "",
      size: firstVariant.size || "M",
      color: firstVariant.color || "Peacock Green",
      stock: firstVariant.stock ? String(firstVariant.stock) : "10",
    });
    setFormError(null);
    setFormSuccess(null);
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    try {
      const payload = {
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        salePrice: productForm.salePrice ? parseFloat(productForm.salePrice) : null,
        category: productForm.category,
        coverImage: productForm.coverImage,
        images: [productForm.coverImage].filter(Boolean),
        featured: true,
        status: "ACTIVE",
        variants: [
          {
            size: productForm.size,
            color: productForm.color,
            stock: parseInt(productForm.stock, 10),
          },
        ],
      };

      const isEdit = !!editingProduct;
      const url = isEdit
        ? `${API_URL}/api/products/admin/${editingProduct.id}`
        : `${API_URL}/api/products/admin`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`API server unreachable or returned HTML (${res.status}). Please check API server connection.`);
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        const errorMsg = typeof data.error === "string" ? data.error : JSON.stringify(data.error) || "Failed to save product";
        throw new Error(errorMsg);
      }

      setFormSuccess(isEdit ? "Product updated successfully!" : "Product added successfully!");
      fetchProducts();
      setTimeout(() => setShowProductModal(false), 800);
    } catch (err: any) {
      setFormError(err.message || "Failed to save product");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`${API_URL}/api/products/admin/${id}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredOrders =
    statusFilter === "ALL" ? orders : orders.filter((o) => o.status === statusFilter);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Owner Top Navbar */}
      <header className="bg-ink text-base px-6 py-4 flex items-center justify-between border-b border-accent/40">
        <div className="flex items-center gap-3">
          <span className="font-serif text-2xl tracking-widest text-accent font-bold">FASHIONSK</span>
          <span className="text-xs uppercase tracking-wider text-base/80 bg-white/10 px-2.5 py-0.5 rounded font-semibold flex items-center gap-1">
            <Lock className="w-3 h-3 text-accent" /> Private Owner Portal
          </span>
          <span
            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
              sseConnected ? "bg-green-900 text-green-300" : "bg-yellow-900 text-yellow-300"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                sseConnected ? "bg-green-400 animate-pulse" : "bg-yellow-400"
              }`}
            />
            {sseConnected ? "Live Stream Connected" : "Auto Polling (3s)"}
          </span>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("suvidha_admin_token");
            router.push("/suvidha-owner-gate");
          }}
          className="text-xs text-accent hover:text-white flex items-center gap-1.5 font-semibold bg-white/5 px-3 py-1.5 rounded border border-accent/30 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Secure Logout
        </button>
      </header>

      {/* Main Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("ORDERS")}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm flex items-center gap-2 ${
                activeTab === "ORDERS"
                  ? "bg-ink text-accent shadow"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ShoppingBag className="w-4 h-4" /> Orders Stream ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab("PRODUCTS")}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm flex items-center gap-2 ${
                activeTab === "PRODUCTS"
                  ? "bg-ink text-accent shadow"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Package className="w-4 h-4" /> Product Catalog ({products.length})
            </button>
          </div>

          {activeTab === "PRODUCTS" && (
            <button
              onClick={openAddProductModal}
              className="px-4 py-2 bg-royal text-base text-xs font-semibold uppercase tracking-wider rounded-sm flex items-center gap-1.5 hover:bg-ink transition-colors shadow"
            >
              <Plus className="w-4 h-4" /> Add New Product
            </button>
          )}
        </div>

        {/* ORDERS TAB */}
        {activeTab === "ORDERS" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded shadow-sm border border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-600">Filter Status:</span>
                {["ALL", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 text-[11px] font-semibold rounded ${
                      statusFilter === st
                        ? "bg-ink text-accent"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
              <button
                onClick={fetchOrders}
                className="p-1.5 text-gray-500 hover:text-ink transition-colors flex items-center gap-1 text-xs font-semibold"
                title="Refresh List"
              >
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 font-semibold border-b">
                    <th className="p-3">Order Number</th>
                    <th className="p-3">Customer Info</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Payment Method</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Update Pipeline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-gray-500">
                        No orders recorded yet. Place an order on the storefront to test!
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="p-3 font-mono font-bold text-ink">{order.orderNumber}</td>
                        <td className="p-3">
                          <div className="font-semibold text-gray-900">{order.customerName}</div>
                          <div className="text-[10px] text-gray-500">{order.email} | {order.phone}</div>
                        </td>
                        <td className="p-3 font-bold text-gray-900">₹{order.totalAmount.toFixed(2)}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            {order.paymentMethod === "RAZORPAY" ? (
                              <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-300 inline-flex items-center gap-1">
                                <CreditCard className="w-3 h-3" /> ONLINE (RAZORPAY)
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-1">
                                <Banknote className="w-3 h-3" /> CASH ON DELIVERY (COD)
                              </span>
                            )}
                            <span className="text-[9px] uppercase text-gray-500">({order.paymentStatus})</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                              order.status === "CONFIRMED"
                                ? "bg-green-100 text-green-800 border border-green-300"
                                : order.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                                : order.status === "SHIPPED"
                                ? "bg-blue-100 text-blue-800 border border-blue-300"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-semibold focus:outline-none focus:border-ink"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === "PRODUCTS" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((prod) => (
              <div key={prod.id} className="bg-white rounded p-4 border border-gray-200 shadow-sm flex flex-col justify-between overflow-hidden">
                <div>
                  <div className="relative h-48 w-full bg-gray-100 rounded overflow-hidden mb-3 border">
                    <Image
                      src={prod.coverImage || prod.images?.[0] || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"}
                      alt={prod.name}
                      fill
                      className="object-cover"
                      unoptimized={(prod.coverImage || prod.images?.[0] || "").startsWith("data:")}
                    />
                    <span className="absolute top-2 left-2 bg-ink text-accent text-[9px] uppercase px-2 py-0.5 rounded font-bold">
                      Cover Image
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-ink">{prod.name}</h3>
                  <p className="text-xs text-accent font-semibold">{prod.category}</p>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">{prod.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t flex justify-between items-center text-xs">
                  <div className="font-bold text-gray-900">
                    <span>₹{prod.price}</span>
                    {prod.salePrice && <span className="text-green-700 ml-2">Sale: ₹{prod.salePrice}</span>}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditProductModal(prod)}
                      className="px-2.5 py-1 bg-amber-500 text-white rounded text-[11px] font-semibold flex items-center gap-1 hover:bg-amber-600 shadow"
                    >
                      <Edit className="w-3 h-3" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="px-2 py-1 bg-red-600 text-white rounded text-[11px] font-semibold hover:bg-red-700 shadow"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ADD & EDIT PRODUCT MODAL */}
        {showProductModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-sm shadow-xl max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto relative">
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="font-serif text-2xl font-bold text-ink flex items-center gap-2">
                {editingProduct ? <Edit className="w-5 h-5 text-amber-500" /> : <Plus className="w-5 h-5 text-accent" />}
                {editingProduct ? "Edit Product Details" : "Add New Product"}
              </h2>

              {formError && (
                <div className="p-3 bg-red-100 text-red-800 text-xs rounded border border-red-200">
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div className="p-3 bg-green-100 text-green-800 text-xs rounded border border-green-200">
                  {formSuccess}
                </div>
              )}

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full p-2.5 border rounded focus:border-ink focus:outline-none"
                    placeholder="e.g. Maharani Crimson Silk Anarkali"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full p-2.5 border rounded focus:border-ink focus:outline-none"
                    placeholder="Handcrafted silk suit set with fine embroidery."
                  />
                </div>

                <ImageFileUpload
                  label="Product Cover Image File *"
                  defaultImage={productForm.coverImage}
                  onImageUploaded={(url) =>
                    setProductForm((prev) => ({ ...prev, coverImage: url }))
                  }
                />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-gray-700">Regular Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="w-full p-2.5 border rounded focus:border-ink focus:outline-none"
                      placeholder="4999"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-gray-700">Discounted Price (₹)</label>
                    <input
                      type="number"
                      value={productForm.salePrice}
                      onChange={(e) => setProductForm({ ...productForm, salePrice: e.target.value })}
                      className="w-full p-2.5 border rounded focus:border-ink focus:outline-none"
                      placeholder="4299 (Optional)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-gray-700">Category *</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full p-2.5 border rounded focus:border-ink focus:outline-none bg-white"
                    >
                      <option value="Anarkali Suits">Anarkali Suits</option>
                      <option value="Palazzo Suits">Palazzo Suits</option>
                      <option value="Sharara Sets">Sharara Sets</option>
                      <option value="Straight/A-Line Suits">Straight/A-Line Suits</option>
                      <option value="Kurta Sets">Kurta Sets</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-gray-700">Stock Quantity *</label>
                    <input
                      type="number"
                      required
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      className="w-full p-2.5 border rounded focus:border-ink focus:outline-none"
                      placeholder="10"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="px-4 py-2.5 border rounded text-gray-600 font-semibold"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2.5 bg-ink text-accent rounded font-bold shadow hover:bg-royal transition-colors">
                    {editingProduct ? "Update Product" : "Save Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
