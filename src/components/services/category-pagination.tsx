import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function CategoryPagination({
  currentPage,
  totalPages,
  baseUrl,
}: {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}) {
  if (totalPages <= 1) return null;

  function pageUrl(page: number) {
    const url = new URL(baseUrl, "http://x");
    url.searchParams.set("page", String(page));
    return `${url.pathname}?${url.searchParams.toString()}`;
  }

  // Build visible page numbers (max 5 with ellipsis)
  function getPages(): (number | "...")[] {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  }

  const pages = getPages();
  const linkBase = "flex items-center justify-center size-9 rounded-full text-sm font-semibold transition-colors";
  const activeClass = "bg-primary text-white";
  const inactiveClass = "hover:bg-accent text-foreground";
  const disabledClass = "text-muted-foreground pointer-events-none";

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 py-8">
      {currentPage > 1 ? (
        <Link href={pageUrl(currentPage - 1)} className={`${linkBase} ${inactiveClass}`} aria-label="Previous page">
          <ChevronLeft className="size-4" />
        </Link>
      ) : (
        <span className={`${linkBase} ${disabledClass}`} aria-disabled="true">
          <ChevronLeft className="size-4" />
        </span>
      )}

      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`ellipsis-${i}`} className={`${linkBase} ${disabledClass}`}>
            …
          </span>
        ) : (
          <Link
            key={page}
            href={pageUrl(page)}
            className={`${linkBase} ${page === currentPage ? activeClass : inactiveClass}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link href={pageUrl(currentPage + 1)} className={`${linkBase} ${inactiveClass}`} aria-label="Next page">
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span className={`${linkBase} ${disabledClass}`} aria-disabled="true">
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
