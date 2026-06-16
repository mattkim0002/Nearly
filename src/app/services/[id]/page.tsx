import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ServiceGallery } from "@/components/services/service-gallery";
import { BookingWidget } from "@/components/services/booking-widget";
import { BioSection } from "@/components/services/bio-section";
import { ServiceCard } from "@/components/services/service-card";
import { InquiryForm } from "@/components/pro/inquiry-form";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Star, MapPin, Share2, Heart, ShieldCheck, CalendarDays, Award } from "lucide-react";
import type { Database } from "@/types/database";

type Service = Database["public"]["Tables"]["services"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: service, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .single<Service>();

  if (error || !service) notFound();

  const [{ data: profile }, { data: relatedRaw }] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("id", service.provider_id)
      .single<Profile>(),
    supabase
      .from("services")
      .select("*")
      .eq("provider_id", service.provider_id)
      .neq("id", service.id)
      .limit(4),
  ]);

  const relatedServices: Service[] = relatedRaw ?? [];
  const proName = profile?.full_name ?? "the Pro";
  const proFirstName = proName.split(" ")[0];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-20 pb-24 lg:pb-0">
        <div className="max-w-[1120px] mx-auto px-4 md:px-8 py-8">

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight mb-3">
              {service.title}
            </h1>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-sm font-medium flex-wrap">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Star className="size-3.5 fill-primary text-primary" />
                  <span>New</span>
                </span>
                <span className="text-border">·</span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <ShieldCheck className="size-3.5" />
                  Verified Pro
                </span>
                <span className="text-border">·</span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="size-3.5" />
                  {service.location}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 text-sm font-semibold underline hover:bg-accent px-2 py-1.5 rounded-lg transition-colors">
                  <Share2 className="size-4" />
                  Share
                </button>
                <button className="flex items-center gap-1.5 text-sm font-semibold underline hover:bg-accent px-2 py-1.5 rounded-lg transition-colors">
                  <Heart className="size-4" />
                  Save
                </button>
              </div>
            </div>
          </div>

          {/* Photo Gallery */}
          <ServiceGallery
            images={service.images}
            imageUrl={service.image_url}
            title={service.title}
          />

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Left column */}
            <div className="lg:col-span-2 space-y-0">

              {/* Pro header */}
              <div className="flex items-center gap-5 pb-8 border-b border-border">
                {profile?.avatar_url && (
                  <Link href={`/pro/${profile.id}`} className="flex-shrink-0">
                    <div
                      className="size-20 rounded-full bg-cover bg-center ring-2 ring-primary ring-offset-2 hover:opacity-90 transition-opacity"
                      style={{ backgroundImage: `url('${profile.avatar_url}')` }}
                      role="img"
                      aria-label={`${proName}'s profile photo`}
                    />
                  </Link>
                )}
                <div className="min-w-0">
                  <Link href={`/pro/${profile?.id}`} className="hover:underline">
                    <h2 className="text-xl font-bold leading-tight">{proName}</h2>
                  </Link>
                  {profile?.location && (
                    <p className="text-muted-foreground text-sm mt-0.5">{profile.location}</p>
                  )}
                  {profile?.bio && (
                    <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
                      {profile.bio}
                    </p>
                  )}
                </div>
              </div>

              {/* Trust signals */}
              <div className="space-y-5 py-8 border-b border-border">
                <div className="flex gap-4">
                  <ShieldCheck className="size-6 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold">Verified Professional</h3>
                    <p className="text-muted-foreground text-sm">
                      Makevo has verified this pro&apos;s identity and credentials.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CalendarDays className="size-6 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold">Flexible scheduling</h3>
                    <p className="text-muted-foreground text-sm">
                      Get a full refund if you cancel at least 48 hours before the project starts.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Award className="size-6 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold">Trusted Pro</h3>
                    <p className="text-muted-foreground text-sm">
                      {proFirstName} is committed to delivering quality work and a great client experience.
                    </p>
                  </div>
                </div>
              </div>

              {/* About the Pro (bio with show more) */}
              <BioSection name={profile?.full_name ?? null} bio={profile?.bio ?? null} />

              {/* About this service */}
              {service.description && (
                <div className="py-8 border-b border-border">
                  <h2 className="text-xl font-bold mb-4">About this service</h2>
                  <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                </div>
              )}

              {/* Inquiry form */}
              <InquiryForm
                proFirstName={proFirstName}
                serviceTitle={service.title}
              />

              {/* More from this Pro */}
              {relatedServices.length > 0 && (
                <div className="py-8">
                  <h2 className="text-xl font-bold mb-6">
                    More from {proFirstName}
                  </h2>
                  <div className="flex gap-5 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
                    {relatedServices.map((s) => (
                      <ServiceCard key={s.id} service={s} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right column — booking widget */}
            <div className="lg:col-span-1">
              <BookingWidget service={service} />
            </div>
          </div>

          {/* Location section */}
          <div className="mt-12 pt-10 border-t border-border">
            <h2 className="text-2xl font-bold mb-6">Where we work</h2>
            <div className="w-full h-[280px] rounded-2xl bg-muted flex flex-col items-center justify-center gap-3 border border-border">
              <MapPin className="size-10 text-primary" />
              <p className="font-bold text-lg">{service.location}</p>
              <p className="text-muted-foreground text-sm">
                Exact location shared after booking.
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
