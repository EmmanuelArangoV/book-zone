import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductActions from "@/components/ProductActions";
import { connectDB } from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import { Product } from "@/types";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, id } = await params;
  const t = await getTranslations("product");

  await connectDB();
  const raw = await ProductModel.findById(id)
    .select("+description +stock +specifications")
    .lean();
  if (!raw) notFound();

  const product: Product = JSON.parse(JSON.stringify(raw));

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#5c3d2e] hover:text-[#c8860a] transition-colors mb-8"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t("backToHome")}
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Cover image */}
          <div className="flex justify-center">
            <div className="relative w-[280px] h-[400px] border-2 border-[#1c1410] overflow-hidden bg-[#e8e0cc] flex-shrink-0">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="280px"
                priority
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-start">
            <div className="border-b-4 border-[#1c1410] pb-4 mb-4">
              <h1 className="text-3xl font-black text-[#1c1410] uppercase tracking-wide mb-2">
                {product.name}
              </h1>
              <p className="text-[#5c3d2e]">
                <span className="text-xs font-black uppercase tracking-widest text-[#1c1410]">{t("author")}:</span>{" "}
                <span className="italic">{product.author}</span>
              </p>
            </div>

            {product.stock !== undefined && (
              <p className="text-xs font-bold uppercase tracking-widest text-[#c8860a] mb-4 border border-[#c8860a] inline-block px-3 py-1 self-start">
                {t("stock")}: {product.stock}
              </p>
            )}

            <p className="text-4xl font-black text-[#1c1410] mb-6">
              $ {product.price.toFixed(2)}
            </p>

            {product.description && (
              <div className="mb-6 bg-[#fefcf5] border-2 border-[#1c1410] p-4">
                <h2 className="text-xs font-black uppercase tracking-widest text-[#1c1410] mb-3">
                  {t("description")}
                </h2>
                <p className="text-[#5c3d2e] leading-relaxed text-sm italic">
                  {product.description}
                </p>
              </div>
            )}

            <ProductActions productId={product._id} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
