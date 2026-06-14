import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BioSection } from "@/components/services/bio-section";
import { ServiceCard } from "@/components/services/service-card";
import { InquiryWidget } from "@/components/pro/inquiry-widget";
import { createClient } from "@/lib/supabase/server";
import { MapPin, ShieldCheck, CalendarDays, Share2 } from "lucide-react";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Service = Database["public"]["Tables"]["services"]["Row"];
type Category = Database["public"]["Tables"]["categories"]["Row"];

export default async function ProProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single<Profile>();

  if (error || !profile) notFound();

  const [{ data: servicesRaw }, { data: categoriesRaw }] = await Promise.all([
    supabase
      .from("services")
      .select("*")
      .eq("provider_id", id)
      .order("created_at", { ascending: false }),
    supabase.from("categories").select("*"),
  ]);

  const services: Service[] = servicesRaw ?? [];
  const allCategories: Category[] = categoriesRaw ?? [];

  // Derive which category slugs/names this Pro covers
  const categoryIds = [...new Set(services.map((s) => s.category_id))];
  const proCategories = allCategories.filter((c) => categoryIds.includes(c.id));

  const proName = profile.full_name ?? "Pro";
  const proFirstName = proName.split(" ")[0];

  const memberSince = new Date(profile.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-20 pb-24 lg:pb-0">
        <div className="max-w-[1120px] mx-auto px-4 md:px-8 py-8">

          {/* Page header actions */}
          <div className="flex justify-end mb-6">
            <button className="flex items-center gap-1.5 text-sm font-semibold underline hover:bg-accent px-2 py-1.5 rounded-lg transition-colors">
              <Share2 className="size-4" />
              Share
            </button>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Left column */}
            <div className="lg:col-span-2 space-y-0">

              {/* Pro hero */}
              <div className="flex items-start gap-6 pb-8 border-b border-border">
                {profile.avatar_url ? (
                  <div
                    className="size-28 rounded-full bg-cover bg-center ring-2 ring-primary ring-offset-2 flex-shrink-0"
                    style={{ backgroundImage: `url('${profile.avatar_url}')` }}
                    role="img"
                    aria-label={`${proName}'s profile photo`}
                  />
                ) : (
                  <div className="size-28 rounded-full bg-muted flex items-center justify-center flex-shrink-0 text-3xl font-bold text-muted-foreground">
                    {proFirstName[0]}
                  </div>
                )}

                <div className="min-w-0 pt-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-3xl font-extrabold tracking-tight">{proName}</h1>
                    <span className="flex items-center gap-1 text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      <ShieldCheck className="size-3" />
                      Verified Pro
                    </span>
                  </div>

                  {profile.location && (
                    <p className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
                      <MapPin className="size-3.5" />
                      {profile.location}
                    </p>
                  )}

                  {/* Craft badges */}
                  {proCategories.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {proCategories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/search?category=${cat.slug}`}
                          className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted hover:bg-accent transition-colors border border-border"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarDays className="size-3.5" />
                    Member since {memberSince}
                    <span className="mx-1 text-border">·</span>
                    {services.length} service{services.length !== 1 ? "s" : ""} listed
                  </div>
                </div>
              </div>

              {/* About */}
              <BioSection name={profile.full_name} bio={profile.bio} />

              {/* Services */}
              {services.length > 0 && (
                <div className="py-8 border-b border-border">
                  <h2 className="text-xl font-bold mb-6">
                    Services by {proFirstName}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                    {services.map((s) => (
                      <ServiceCard key={s.id} service={s} className="w-full flex-none" />
                    ))}
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="py-8">
                <h2 className="text-xl font-bold mb-4">Location</h2>
                <div className="w-full h-[220px] rounded-2xl bg-muted flex flex-col items-center justify-center gap-3 border border-border">
                  <MapPin className="size-9 text-primary" />
                  <p className="font-bold">{profile.location ?? "Location not specified"}</p>
                  <p className="text-muted-foreground text-sm">
                    Exact address shared after confirmed inquiry
                  </p>
                </div>
              </div>
            </div>

            {/* Right column — inquiry widget */}
            <div className="lg:col-span-1">
              <InquiryWidget proName={proName} proFirstName={proFirstName} />
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
