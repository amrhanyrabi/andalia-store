"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  Languages,
  LockKeyhole,
  PackagePlus,
  Pencil,
  RefreshCcw,
  Save,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  emptyProductForm,
  fallbackProducts,
  formatPrice,
  getProductTitle,
  Language,
  normalizeProduct,
  Product,
  ProductFormData,
} from "@/lib/catalog";

const dictionary = {
  en: {
    addProduct: "Add product",
    adminDashboard: "Admin Dashboard",
    adminLogin: "Admin Login",
    affiliateLink: "Affiliate link",
    becomeAdmin: "Create first admin",
    cancel: "Cancel",
    categoryAr: "Category Arabic",
    categoryEn: "Category English",
    delete: "Delete",
    descriptionAr: "Description Arabic",
    descriptionEn: "Description English",
    edit: "Edit",
    email: "Email",
    imageUrl: "Image URL",
    language: "Language",
    login: "Sign in",
    logout: "Sign out",
    password: "Password",
    price: "Price",
    products: "Products",
    refresh: "Refresh",
    save: "Save product",
    setupHint:
      "If no admin exists yet, sign up here and create the first protected admin account.",
    signUpHint:
      "Already created an admin? Use the same email and password to sign in.",
    storefront: "Storefront",
    titleAr: "Title Arabic",
    titleEn: "Title English",
    totalProducts: "Total products",
    categories: "Categories",
    lowestPrice: "Lowest price",
    protectedWrites: "Protected writes",
    updated: "Catalog updated",
    requiredFields: "Please fill all fields with valid URLs and price.",
    notAdmin: "This account is not an admin. Create the first admin if setup is still open.",
  },
  ar: {
    addProduct: "إضافة منتج",
    adminDashboard: "لوحة الإدارة",
    adminLogin: "تسجيل دخول الإدارة",
    affiliateLink: "رابط الأفلييت",
    becomeAdmin: "إنشاء أول مدير",
    cancel: "إلغاء",
    categoryAr: "الفئة بالعربية",
    categoryEn: "الفئة بالإنجليزية",
    delete: "حذف",
    descriptionAr: "الوصف بالعربية",
    descriptionEn: "الوصف بالإنجليزية",
    edit: "تعديل",
    email: "البريد الإلكتروني",
    imageUrl: "رابط الصورة",
    language: "اللغة",
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    password: "كلمة المرور",
    price: "السعر",
    products: "المنتجات",
    refresh: "تحديث",
    save: "حفظ المنتج",
    setupHint:
      "إذا لم يوجد مدير بعد، يمكنك إنشاء أول حساب إدارة محمي من هنا.",
    signUpHint:
      "إذا أنشأت حساب الإدارة سابقا، استخدم نفس البريد وكلمة المرور لتسجيل الدخول.",
    storefront: "المتجر",
    titleAr: "العنوان بالعربية",
    titleEn: "العنوان بالإنجليزية",
    totalProducts: "إجمالي المنتجات",
    categories: "الفئات",
    lowestPrice: "أقل سعر",
    protectedWrites: "تعديلات محمية",
    updated: "تم تحديث الكتالوج",
    requiredFields: "يرجى تعبئة كل الحقول بروابط صحيحة وسعر صحيح.",
    notAdmin: "هذا الحساب ليس مديراً. أنشئ أول مدير إذا كان الإعداد لا يزال مفتوحاً.",
  },
} as const;

export default function AdminPage() {
  const [language, setLanguage] = useState<Language>("en");
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [form, setForm] = useState<ProductFormData>(emptyProductForm);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasAdmin, setHasAdmin] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  const t = dictionary[language];
  const isArabic = language === "ar";

  async function loadAdminState() {
    try {
      const response = await fetch("/api/auth/status");
      const data = await response.json();
      setIsAuthenticated(data.isAuthenticated);
      setIsAdmin(data.isAdmin);
      setHasAdmin(data.hasAdmin);
    } catch (error) {
      console.error("Auth status error:", error);
    }
  }

  async function loadProducts() {
    try {
      const response = await fetch("/api/products", { cache: "no-store" });
      const payload = await response.json();
      if (payload.products) {
        setProducts(payload.products.map((product: any) => normalizeProduct(product as Product)));
      }
    } catch (error) {
      console.error("Load products error:", error);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function initialize() {
      setIsLoading(true);
      await Promise.all([loadAdminState(), loadProducts()]);
      if (isMounted) setIsLoading(false);
    }

    initialize();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const categories = new Set(products.map((product) => product.category_en));
    const minimumPrice = products.length
      ? Math.min(...products.map((product) => Number(product.price) || 0))
      : 0;

    return {
      totalProducts: products.length,
      categories: categories.size,
      minimumPrice,
    };
  }, [products]);

  function updateForm(field: keyof ProductFormData, value: string) {
    setForm((current) => ({
      ...current,
      [field]: field === "price" ? Number(value) : value,
    }));
  }

  function validateForm() {
    const fields = [
      form.title_ar,
      form.title_en,
      form.description_ar,
      form.description_en,
      form.image_url,
      form.affiliate_link,
      form.category_ar,
      form.category_en,
    ];

    return (
      fields.every((field) => field.trim().length > 0) &&
      Number(form.price) >= 0 &&
      isHttpUrl(form.image_url) &&
      isHttpUrl(form.affiliate_link)
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!isAdmin || !validateForm()) {
      setMessage(t.requiredFields);
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
    };

    const url = "/api/products";
    const method = editingProductId ? "PUT" : "POST";
    const body = editingProductId ? { ...payload, id: editingProductId } : payload;

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (result.error) {
      setMessage(result.error);
      return;
    }

    setForm(emptyProductForm);
    setEditingProductId(null);
    setMessage(t.updated);
    await loadProducts();
  }

  async function handleDelete(productId: any) {
    setMessage("");
    const response = await fetch(`/api/products?id=${productId}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (result.error) {
      setMessage(result.error);
      return;
    }

    setMessage(t.updated);
    await loadProducts();
  }

  function handleEdit(product: Product) {
    setEditingProductId(product.id);
    setForm({
      title_ar: product.title_ar,
      title_en: product.title_en,
      description_ar: product.description_ar,
      description_en: product.description_en,
      price: Number(product.price),
      image_url: product.image_url,
      affiliate_link: product.affiliate_link,
      category_ar: product.category_ar,
      category_en: product.category_en,
    });
  }

  function resetForm() {
    setEditingProductId(null);
    setForm(emptyProductForm);
    setMessage("");
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (result.error) {
      setMessage(result.error);
      return;
    }

    await loadAdminState();
  }

  async function handleCreateFirstAdmin() {
    setMessage("");

    if (!email || password.length < 6) {
      setMessage("Use a valid email and a password with at least 6 characters.");
      return;
    }

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (result.error) {
      setMessage(result.error);
      return;
    }

    await loadAdminState();
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setIsAuthenticated(false);
    setIsAdmin(false);
    setMessage("");
  }

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-background bg-[radial-gradient(circle_at_top_right,rgba(255,71,71,0.14),transparent_30rem)]"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-3xl border bg-card/85 p-4 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#232f3e] text-white shadow-sm">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t.products}</p>
              <h1 className="text-xl font-bold tracking-tight">{t.adminDashboard}</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
              <SelectTrigger className="w-[150px] rounded-full">
                <Languages className="h-4 w-4" />
                <SelectValue aria-label={t.language} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
              </SelectContent>
            </Select>
            <ThemeToggle />
            <Button asChild variant="outline" className="rounded-full">
              <a href="/">
                <ArrowLeft className="h-4 w-4" />
                Andalia Store
              </a>
            </Button>
            {isAuthenticated && (
              <Button variant="secondary" className="rounded-full" onClick={handleLogout}>
                {t.logout}
              </Button>
            )}
          </div>
        </header>

        {!isAuthenticated || !isAdmin ? (
          <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <Card className="rounded-[2rem]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <LockKeyhole className="h-5 w-5 text-[#ff4747]" />
                  {t.adminLogin}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="grid gap-4" onSubmit={handleLogin}>
                  <Field label={t.email}>
                    <Input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </Field>
                  <Field label={t.password}>
                    <Input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      minLength={6}
                      required
                    />
                  </Field>
                  <Button className="h-11 rounded-2xl bg-[#ff4747] text-white hover:bg-[#e63e3e]">
                    {t.login}
                  </Button>
                </form>

                {!hasAdmin && (
                  <div className="mt-5 rounded-3xl border border-[#ff4747]/25 bg-[#ff4747]/10 p-4">
                    <p className="text-sm leading-6 text-muted-foreground">{t.setupHint}</p>
                    <Button
                      type="button"
                      className="mt-4 w-full rounded-2xl bg-[#232f3e] text-white hover:bg-[#1d2835]"
                      onClick={handleCreateFirstAdmin}
                    >
                      <ShieldCheck className="h-4 w-4" />
                      {t.becomeAdmin}
                    </Button>
                  </div>
                )}

                {isAuthenticated && !isAdmin && hasAdmin && (
                  <p className="mt-4 rounded-2xl border border-destructive/25 bg-destructive/10 p-3 text-sm text-destructive">
                    {t.notAdmin}
                  </p>
                )}

                {message && <p className="mt-4 rounded-2xl border bg-muted p-3 text-sm">{message}</p>}
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] bg-[#232f3e] text-white">
              <CardContent className="p-6 sm:p-8">
                <Badge className="mb-5 bg-white text-[#232f3e] hover:bg-white">
                  {t.protectedWrites}
                </Badge>
                <h2 className="text-3xl font-black tracking-tight">
                  {isArabic ? "إدارة آمنة بدون تسجيل مستخدمين للمتجر" : "Secure management without storefront accounts"}
                </h2>
                <p className="mt-4 leading-7 text-white/70">{t.signUpHint}</p>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <DarkStat label={t.totalProducts} value={stats.totalProducts.toString()} />
                  <DarkStat label={t.categories} value={stats.categories.toString()} />
                  <DarkStat label={t.lowestPrice} value={formatPrice(stats.minimumPrice, language)} />
                </div>
              </CardContent>
            </Card>
          </section>
        ) : (
          <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr] xl:items-start">
            <div className="grid gap-6">
              <div className="grid gap-3 sm:grid-cols-3">
                <StatCard label={t.totalProducts} value={stats.totalProducts.toString()} />
                <StatCard label={t.categories} value={stats.categories.toString()} />
                <StatCard label={t.lowestPrice} value={formatPrice(stats.minimumPrice, language)} />
              </div>

              <Card className="rounded-[2rem]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <PackagePlus className="h-5 w-5 text-[#ff4747]" />
                    {editingProductId ? t.edit : t.addProduct}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="grid gap-4" onSubmit={handleSubmit}>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label={t.titleEn}>
                        <Input value={form.title_en} onChange={(event) => updateForm("title_en", event.target.value)} required />
                      </Field>
                      <Field label={t.titleAr}>
                        <Input dir="rtl" value={form.title_ar} onChange={(event) => updateForm("title_ar", event.target.value)} required />
                      </Field>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label={t.descriptionEn}>
                        <Textarea value={form.description_en} onChange={(event) => updateForm("description_en", event.target.value)} required />
                      </Field>
                      <Field label={t.descriptionAr}>
                        <Textarea dir="rtl" value={form.description_ar} onChange={(event) => updateForm("description_ar", event.target.value)} required />
                      </Field>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <Field label={t.price}>
                        <Input type="number" min="0" step="0.01" value={form.price} onChange={(event) => updateForm("price", event.target.value)} required />
                      </Field>
                      <Field label={t.categoryEn}>
                        <Input value={form.category_en} onChange={(event) => updateForm("category_en", event.target.value)} required />
                      </Field>
                      <Field label={t.categoryAr}>
                        <Input dir="rtl" value={form.category_ar} onChange={(event) => updateForm("category_ar", event.target.value)} required />
                      </Field>
                    </div>
                    <Field label={t.imageUrl}>
                      <Input type="url" value={form.image_url} onChange={(event) => updateForm("image_url", event.target.value)} required />
                    </Field>
                    <Field label={t.affiliateLink}>
                      <Input type="url" value={form.affiliate_link} onChange={(event) => updateForm("affiliate_link", event.target.value)} required />
                    </Field>
                    <div className="flex flex-wrap gap-2">
                      <Button className="h-11 rounded-2xl bg-[#ff4747] text-white hover:bg-[#e63e3e]">
                        <Save className="h-4 w-4" />
                        {t.save}
                      </Button>
                      {editingProductId && (
                        <Button type="button" variant="outline" className="h-11 rounded-2xl" onClick={resetForm}>
                          {t.cancel}
                        </Button>
                      )}
                    </div>
                    {message && <p className="rounded-2xl border bg-muted p-3 text-sm">{message}</p>}
                  </form>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-[2rem]">
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                <CardTitle className="text-2xl">{t.products}</CardTitle>
                <Button variant="outline" className="rounded-2xl" onClick={loadProducts} disabled={isLoading}>
                  <RefreshCcw className="h-4 w-4" />
                  {t.refresh}
                </Button>
              </CardHeader>
              <CardContent className="grid gap-4">
                {products.map((product) => (
                  <article key={product.id} className="grid gap-4 rounded-3xl border bg-background p-4 sm:grid-cols-[96px_1fr]">
                    <img
                      src={product.image_url}
                      alt={getProductTitle(product, language)}
                      className="h-24 w-24 rounded-2xl object-cover"
                    />
                    <div className="min-w-0">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <Badge variant="secondary" className="mb-2">
                            {language === "ar" ? product.category_ar : product.category_en}
                          </Badge>
                          <h3 className="font-bold leading-6">{getProductTitle(product, language)}</h3>
                          <p className="mt-1 text-sm font-semibold text-[#ff4747]">
                            {formatPrice(product.price, language)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="rounded-xl" onClick={() => handleEdit(product)}>
                            <Pencil className="h-4 w-4" />
                            {t.edit}
                          </Button>
                          <Button variant="destructive" size="sm" className="rounded-xl" onClick={() => handleDelete(product.id)}>
                            <Trash2 className="h-4 w-4" />
                            {t.delete}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="rounded-3xl">
      <CardContent className="p-5">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-2 text-2xl font-black tracking-tight">{value}</p>
      </CardContent>
    </Card>
  );
}

function DarkStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white/10 p-4">
      <p className="text-sm text-white/60">{label}</p>
      <p className="mt-2 text-2xl font-black tracking-tight">{value}</p>
    </div>
  );
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
