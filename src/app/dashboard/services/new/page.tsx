import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { NewServiceForm } from "@/components/dashboard/new-service-form";
import { createClient } from "@/lib/supabase/server";

export default async function NewServicePage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name");

  return (
    <div className="max-w-[680px] mx-auto px-6 py-10">
      {/* Back */}
      <Link
        href="/dashboard"
        className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ChevronLeft className="size-4" />
        Back to dashboard
      </Link>

      <h1 className="text-3xl font-extrabold tracking-tight mb-1">Post a service</h1>
      <p className="text-muted-foreground mb-8">
        Tell clients what you offer. You can edit this any time.
      </p>

      <NewServiceForm categories={categories ?? []} />
    </div>
  );
}
