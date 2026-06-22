"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

const getVisiblePages = (currentPage, totalPages) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 5) {
    return [1, 2, 3, 4, 5, "end-ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 4) {
    return [
      1,
      "start-ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "start-ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "end-ellipsis",
    totalPages,
  ];
};

export default function TableFooter({ limit, setLimit, offset, setOffset, total }) {
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const visiblePages = getVisiblePages(currentPage, totalPages);
  const start = total === 0 ? 0 : offset + 1;
  const end = Math.min(offset + limit, total);

  const changeLimit = value => {
    setLimit(Number(value));
    setOffset(0);
  };

  const previous = () => {
    if (offset >= limit) {
      setOffset(offset - limit);
    }
  };

  const next = () => {
    if (offset + limit < total) {
      setOffset(offset + limit);
    }
  };

  const goToPage = page => {
    setOffset((page - 1) * limit);
  };

  return (
    <div className="flex flex-col gap-4 border-t border-border px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-muted-foreground">Show</span>

        <select
          value={limit}
          onChange={event => changeLimit(event.target.value)}
          className="h-10 rounded-2xl border border-border bg-background px-3 text-sm"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>

        <span className="text-sm text-muted-foreground">entries</span>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {start} to {end} of {total} entries
      </p>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          onClick={previous}
          disabled={offset === 0}
          aria-label="Previous page"
          className={`flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-background text-sm transition ${
            offset === 0
              ? "cursor-not-allowed opacity-50"
              : "hover:border-primary hover:text-foreground"
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {visiblePages.map(page =>
          typeof page === "number" ? (
            <button
              key={page}
              type="button"
              onClick={() => goToPage(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={`h-10 min-w-10 rounded-2xl px-3 text-sm font-semibold transition ${
                page === currentPage
                  ? "bg-primary text-white"
                  : "border border-border bg-background text-muted-foreground hover:border-primary hover:text-foreground"
              }`}
            >
              {page}
            </button>
          ) : (
            <span
              key={page}
              className="flex h-10 min-w-8 items-center justify-center text-sm font-semibold text-muted-foreground"
            >
              ...
            </span>
          )
        )}

        <button
          type="button"
          onClick={next}
          disabled={offset + limit >= total}
          aria-label="Next page"
          className={`flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-background text-sm transition ${
            offset + limit >= total
              ? "cursor-not-allowed opacity-50"
              : "hover:border-primary hover:text-foreground"
          }`}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
