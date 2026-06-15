import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";
import type { Database } from "@/types/database";

type Service = Database["public"]["Tables"]["services"]["Row"];

export function ServiceCard({ service, className }: { service: Service; className?: string }) {
  const imageUrl =
    service.image_url ??
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600";

  return (
    <Link href={`/services/${service.id}`} className={cn("flex-none w-72 group cursor-pointer", className)}>
      <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3">
        <div
          className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
          style={{ backgroundImage: `url('${imageUrl}')` }}
        />
      </div>
      <h4 className="font-bold text-base">{service.title}</h4>
      <p className="text-muted-foreground text-sm mb-1">{service.location}</p>
      <p className="text-sm font-medium">
        {service.price_type === "quote" ? (
          <>
            Project based <span className="font-bold">Quotes</span>
          </>
        ) : (
          <>
            Starting from{" "}
            <span className="font-bold">
              {service.price_starting
                ? formatPrice(service.price_starting)
                : "N/A"}
            </span>
          </>
        )}
      </p>
    </Link>
  );
}
