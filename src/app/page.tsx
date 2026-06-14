import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/search/hero-section";
import { CategoryCarousel } from "@/components/services/category-carousel";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type Category = Database["public"]["Tables"]["categories"]["Row"];
type Service = Database["public"]["Tables"]["services"]["Row"];

export default async function Home() {
  const supabase = await createClient();

  const [{ data: categories }, { data: services }] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase.from("services").select("*").order("created_at"),
  ]);

  const categoryList: Category[] = categories ?? [];
  const serviceList: Service[] = services ?? [];

  const servicesByCategory = new Map<string, Service[]>();
  for (const service of serviceList) {
    const existing = servicesByCategory.get(service.category_id) ?? [];
    existing.push(service);
    servicesByCategory.set(service.category_id, existing);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-20">
        <HeroSection />

        {/* Category Discovery Sections */}
        <div className="max-w-[1280px] mx-auto px-6 lg:px-20 py-12">
          <CategoryCarousel
            categories={categoryList}
            servicesByCategory={Object.fromEntries(servicesByCategory)}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
