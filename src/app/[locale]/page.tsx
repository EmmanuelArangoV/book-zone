import { getTranslations } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCatalog from "@/components/ProductCatalog";
import { getAllProducts } from "@/services/productService";
import { Product } from "@/types";

export default async function HomePage() {
  const t = await getTranslations("home");

  const raw = await getAllProducts();
  const products: Product[] = JSON.parse(JSON.stringify(raw));

  const authors = [...new Set(products.map(p => p.author))].sort();

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 border-b-4 border-[#1c1410] pb-4">
          <h1 className="text-3xl font-black uppercase tracking-widest text-[#1c1410]">
            {t('catalogTitle')}
          </h1>
          <p className="text-sm text-[#5c3d2e] mt-1 italic">{t('catalogSubtitle')}</p>
        </div>
        <ProductCatalog products={products} authors={authors} />
      </main>
      <Footer />
    </>
  );
}
