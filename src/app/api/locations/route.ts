import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";

  if (q.length < 2) {
    return NextResponse.json([]);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("location")
    .ilike("location", `%${q}%`)
    .limit(20);

  if (error || !data) {
    return NextResponse.json([]);
  }

  const locations = [
    ...new Set(
      (data as { location: string | null }[]).map((r) => r.location).filter((l): l is string => !!l)
    ),
  ].sort();
  return NextResponse.json(locations);
}
