import Link from "next/link";
import { PlusCircle, ArrowRight, MessageSquare, Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { DEMO_PRO, DEMO_INQUIRIES } from "@/lib/demo"; // REMOVE in Sprint 2
import { formatPrice } from "@/lib/utils";
import type { Database } from "@/types/database";

type Service = Database["public"]["Tables"]["services"]["Row"];
type Category = Database["public"]["Tables"]["categories"]["Row"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default async function DashboardPage() {
  const supabase = await createClient();

  // REMOVE in Sprint 2 — replace DEMO_PRO.id with real session user ID
  const [{ data: servicesRaw }, { data: categoriesRaw }] = await Promise.all([
    supabase
      .from("services")
      .select("*")
      .eq("provider_id", DEMO_PRO.id)
      .order("created_at", { ascending: false }),
    supabase.from("categories").select("id, name"),
  ]);

  const services: Service[] = servicesRaw ?? [];
  const categoryMap = new Map(
    (categoriesRaw as Pick<Category, "id" | "name">[] ?? []).map((c) => [c.id, c.name])
  );

  return (
    <div className="max-w-[900px] mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight mb-1">
          Welcome back, {DEMO_PRO.firstName}
        </h1>
        <p className="text-muted-foreground">{DEMO_PRO.location}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-sm font-semibold text-muted-foreground mb-3">Services listed</p>
          <p className="text-3xl font-extrabold">{services.length}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-muted-foreground">Inquiries</p>
            <MessageSquare className="size-4 text-muted-foreground" />
          </div>
          <p className="text-3xl font-extrabold">{DEMO_INQUIRIES.length}</p>
          <p className="text-xs text-primary font-semibold mt-1">
            {DEMO_INQUIRIES.filter((i) => i.isNew).length} new
          </p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-muted-foreground">Profile views</p>
            <Eye className="size-4 text-muted-foreground" />
          </div>
          <p className="text-3xl font-extrabold">—</p>
          <p className="text-xs text-muted-foreground mt-1">Available after launch</p>
        </div>
      </div>

      {/* My Services */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">My Services</h2>
          <Button asChild size="sm" variant="outline">
            <Link href="/dashboard/services/new">
              <PlusCircle className="size-3.5 mr-1.5" />
              Add service
            </Link>
          </Button>
        </div>

        {services.length === 0 ? (
          <div className="border border-dashed border-border rounded-2xl p-12 flex flex-col items-center text-center">
            <p className="text-muted-foreground text-sm mb-4">No services listed yet.</p>
            <Button asChild>
              <Link href="/dashboard/services/new">
                <PlusCircle className="size-4 mr-2" />
                Post a service
              </Link>
            </Button>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
            {services.map((s) => (
              <div key={s.id} className="flex items-center gap-4 px-5 py-4">
                {/* Thumbnail */}
                <div
                  className="size-12 rounded-lg bg-muted bg-cover bg-center shrink-0"
                  style={s.image_url ? { backgroundImage: `url('${s.image_url}')` } : undefined}
                />
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{s.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {categoryMap.get(s.category_id) ?? "—"} · {s.location}
                  </p>
                </div>
                {/* Price */}
                <div className="text-sm font-semibold shrink-0 hidden sm:block">
                  {s.price_type === "quote"
                    ? "Quote"
                    : s.price_starting
                    ? `${formatPrice(s.price_starting)}+`
                    : "—"}
                </div>
                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/services/${s.id}`}
                    className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    View
                  </Link>
                  <button className="flex items-center gap-1 text-xs font-semibold border border-border rounded-lg px-2.5 py-1.5 hover:bg-accent transition-colors">
                    <Pencil className="size-3" />
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inquiries */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Recent Inquiries</h2>
          <Link
            href="/dashboard/inquiries"
            className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
          {DEMO_INQUIRIES.map((inq) => (
            <div key={inq.id} className="flex items-start gap-4 px-5 py-4">
              {/* Avatar */}
              <div className="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                {inq.clientInitial}
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-sm">{inq.clientName}</p>
                  {inq.isNew && (
                    <span className="text-[10px] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                      New
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground ml-auto shrink-0">
                    {formatDate(inq.date)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">Re: {inq.serviceTitle}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{inq.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
