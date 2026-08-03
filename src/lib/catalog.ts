export type Language = "en" | "ar";

export type Product = {
  id: number;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  price: number;
  image_url: string;
  affiliate_link: string;
  category_ar: string;
  category_en: string;
  created_at: string;
  updated_at: string;
};

export type ProductFormData = Omit<Product, "id" | "created_at" | "updated_at">;

export const emptyProductForm: ProductFormData = {
  title_ar: "",
  title_en: "",
  description_ar: "",
  description_en: "",
  price: 0,
  image_url: "",
  affiliate_link: "",
  category_ar: "عام",
  category_en: "General",
};

export const fallbackProducts: Product[] = [
  {
    id: 1,
    title_ar: "ساعة ذكية مقاومة للماء",
    title_en: "Waterproof Smart Watch",
    description_ar:
      "ساعة أنيقة لتتبع النشاط، قياس النبض، والتنبيهات اليومية مع بطارية طويلة العمر.",
    description_en:
      "A sleek watch for activity tracking, heart-rate monitoring, daily alerts, and long battery life.",
    price: 24.99,
    image_url:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    affiliate_link: "https://www.aliexpress.com/",
    category_ar: "إلكترونيات",
    category_en: "Electronics",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    title_ar: "حامل هاتف مغناطيسي للسيارة",
    title_en: "Magnetic Car Phone Mount",
    description_ar:
      "حامل ثابت وسهل التركيب للملاحة والمكالمات أثناء القيادة، مع دوران مرن.",
    description_en:
      "A stable, easy-to-install mount for navigation and calls while driving, with flexible rotation.",
    price: 7.49,
    image_url:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80",
    affiliate_link: "https://www.aliexpress.com/",
    category_ar: "إكسسوارات",
    category_en: "Accessories",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    title_ar: "حقيبة سفر منظمة",
    title_en: "Travel Organizer Bag",
    description_ar:
      "حقيبة خفيفة متعددة الجيوب لحفظ الكابلات، الأدوات الصغيرة، ومستحضرات السفر.",
    description_en:
      "A lightweight multi-pocket bag for cables, small gadgets, and travel essentials.",
    price: 12.99,
    image_url:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
    affiliate_link: "https://www.aliexpress.com/",
    category_ar: "سفر",
    category_en: "Travel",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    title_ar: "مصباح مكتب LED قابل للتعديل",
    title_en: "Adjustable LED Desk Lamp",
    description_ar:
      "إضاءة مريحة للعمل والدراسة مع مستويات سطوع متعددة وتصميم موفر للمساحة.",
    description_en:
      "Comfortable lighting for work and study with multiple brightness levels and a space-saving design.",
    price: 18.5,
    image_url:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
    affiliate_link: "https://www.aliexpress.com/",
    category_ar: "منزل",
    category_en: "Home",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const translations = {
  en: {
    admin: "Admin",
    all: "All",
    buyNow: "Buy Now",
    categories: "Categories",
    featured: "Featured AliExpress Finds",
    heroTitle: "Bilingual affiliate catalog for smart shopping",
    heroSubtitle:
      "Browse curated products, search by keyword, filter by category, and open affiliate deals directly in a new tab.",
    language: "Language",
    noProducts: "No products match your filters.",
    price: "Price",
    products: "Products",
    search: "Search products",
    searchPlaceholder: "Search watches, travel, home...",
    storefront: "Storefront",
    totalProducts: "Total products",
    uniqueCategories: "Categories",
    startingAt: "Starting at",
    directDeals: "Direct deals",
    noCart: "No cart or checkout",
    refresh: "Refresh",
  },
  ar: {
    admin: "الإدارة",
    all: "الكل",
    buyNow: "اشتر الآن",
    categories: "الفئات",
    featured: "مختارات مميزة من علي إكسبريس",
    heroTitle: "كتالوج أفلييت ثنائي اللغة للتسوق الذكي",
    heroSubtitle:
      "تصفح منتجات مختارة، ابحث بالكلمات، صف حسب الفئة، وافتح عروض الأفلييت مباشرة في تبويب جديد.",
    language: "اللغة",
    noProducts: "لا توجد منتجات تطابق عوامل التصفية.",
    price: "السعر",
    products: "المنتجات",
    search: "بحث المنتجات",
    searchPlaceholder: "ابحث عن ساعات، سفر، منزل...",
    storefront: "المتجر",
    totalProducts: "إجمالي المنتجات",
    uniqueCategories: "الفئات",
    startingAt: "تبدأ من",
    directDeals: "روابط مباشرة",
    noCart: "بدون سلة أو دفع",
    refresh: "تحديث",
  },
} as const;

export function formatPrice(price: number, language: Language) {
  return new Intl.NumberFormat(language === "ar" ? "ar" : "en", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(price) || 0);
}

export function getProductTitle(product: Product, language: Language) {
  return language === "ar" ? product.title_ar : product.title_en;
}

export function getProductDescription(product: Product, language: Language) {
  return language === "ar" ? product.description_ar : product.description_en;
}

export function getProductCategory(product: Product, language: Language) {
  return language === "ar" ? product.category_ar : product.category_en;
}

export function normalizeProduct(row: Product): Product {
  return {
    ...row,
    price: Number(row.price),
  };
}
