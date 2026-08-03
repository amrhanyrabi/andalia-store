"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Languages, Search, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fallbackProducts,
  formatPrice,
  getProductCategory,
  getProductDescription,
  getProductTitle,
  Language,
  normalizeProduct,
  Product,
  translations,
} from "@/lib/catalog";

export default function StorefrontPage() {
  const [language, setLanguage] = useState<Language>("en");
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const t = translations[language];
  const isArabic = language === "ar";

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      setIsLoading(true);

      try {
        const response = await fetch("/api/products", { cache: "no-store" });
        const payload = (await response.json()) as { products?: Product[] };

        if (isMounted && payload.products && payload.products.length > 0) {
          setProducts(payload.products.map((product) => normalizeProduct(product)));
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = new Map<string, string>();

    products.forEach((product) => {
      const key = product.category_en || product.category_ar;
      uniqueCategories.set(key, getProductCategory(product, language));
    });

    return Array.from(uniqueCategories.entries()).map(([value, label]) => ({ value, label }));
  }, [language, products]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || product.category_en === selectedCategory;
      const haystack = [
        product.title_ar,
        product.title_en,
        product.description_ar,
        product.description_en,
        product.category_ar,
        product.category_en,
      ]
        .join(" ")
        .toLowerCase();
      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [products, query, selectedCategory]);

  const minimumPrice = products.length
    ? Math.min(...products.map((product) => Number(product.price) || 0))
    : 0;

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-background bg-[radial-gradient(circle_at_top_left,rgba(255,71,71,0.16),transparent_32rem)]"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-3xl border bg-card/85 p-4 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ff4747] font-bold text-white shadow-sm">
              AX
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t.storefront}</p>
              <h1 className="text-xl font-bold tracking-tight">{t.featured}</h1>
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
              <a href="/admin">
                <ShieldCheck className="h-4 w-4" />
                {t.admin}
              </a>
            </Button>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
          <div className="rounded-[2rem] border bg-card p-6 shadow-sm sm:p-8">
            <Badge className="mb-5 bg-[#ff4747] text-white hover:bg-[#ff4747]">
              {t.noCart}
            </Badge>
            <h2 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              {t.heroTitle}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              {t.heroSubtitle}
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <StatTile label={t.totalProducts} value={products.length.toString()} />
              <StatTile label={t.uniqueCategories} value={categories.length.toString()} />
              <StatTile label={t.startingAt} value={formatPrice(minimumPrice, language)} />
            </div>
          </div>

          <Card className="overflow-hidden rounded-[2rem] border-[#ff4747]/20 bg-[#232f3e] text-white shadow-sm">
            <CardContent className="flex h-full flex-col justify-between gap-8 p-6 sm:p-8">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-white/60">{t.directDeals}</p>
                <h3 className="mt-4 text-3xl font-black tracking-tight">
                  {isArabic ? "روابط أفلييت مباشرة لكل منتج" : "Direct affiliate links for every product"}
                </h3>
                <p className="mt-4 leading-7 text-white/70">
                  {isArabic
                    ? "كل بطاقة منتج تفتح رابط الأفلييت في تبويب جديد بدون تسجيل مستخدمين أو سلة مشتريات."
                    : "Every product card opens the affiliate deal in a new tab without user accounts, carts, or checkout steps."}
                </p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5">
                <div className="mb-4 h-2 w-28 rounded-full bg-[#ff4747]" />
                <div className="grid gap-3 text-sm text-white/80">
                  <div className="flex items-center justify-between gap-4">
                    <span>{isArabic ? "دعم العربية" : "Arabic support"}</span>
                    <span>RTL</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>{isArabic ? "دعم الإنجليزية" : "English support"}</span>
                    <span>LTR</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>{isArabic ? "إدارة المنتجات" : "Product management"}</span>
                    <span>{isArabic ? "محمية" : "Protected"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="rounded-[2rem] border bg-card p-4 shadow-sm sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
            <label className="relative block">
              <span className="sr-only">{t.search}</span>
              <Search className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground ${isArabic ? "right-4" : "left-4"}`} />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.searchPlaceholder}
                className={`h-12 rounded-2xl bg-background text-base ${isArabic ? "pr-12" : "pl-12"}`}
              />
            </label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-12 rounded-2xl bg-background">
                <SlidersHorizontal className="h-4 w-4" />
                <SelectValue aria-label={t.categories} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.all}</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} language={language} />
          ))}
        </section>

        {!isLoading && filteredProducts.length === 0 && (
          <div className="rounded-[2rem] border border-dashed bg-card p-12 text-center text-muted-foreground">
            {t.noProducts}
          </div>
        )}
      </div>
    </main>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border bg-background/70 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-black tracking-tight">{value}</p>
    </div>
  );
}

function ProductCard({ product, language }: { product: Product; language: Language }) {
  const t = translations[language];
  const title = getProductTitle(product, language);
  const description = getProductDescription(product, language);
  const category = getProductCategory(product, language);

  return (
    <Card className="group overflow-hidden rounded-[1.75rem] transition duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={product.image_url}
          alt={title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <CardContent className="flex min-h-[270px] flex-col p-5">
        <Badge variant="secondary" className="mb-3 w-fit">
          {category}
        </Badge>
        <h3 className="line-clamp-2 text-lg font-bold leading-6">{title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
        <div className="mt-auto pt-5">
          <div className="mb-4 flex items-end justify-between gap-3">
            <span className="text-sm text-muted-foreground">{t.price}</span>
            <span className="text-2xl font-black text-[#ff4747]">
              {formatPrice(product.price, language)}
            </span>
          </div>
          <Button asChild className="h-11 w-full rounded-2xl bg-[#ff4747] text-white hover:bg-[#e63e3e]">
            <a href={product.affiliate_link} target="_blank" rel="noopener noreferrer sponsored">
              {t.buyNow}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
