"use client";

export default function TableFooter({ limit, setLimit, offset, setOffset, total }) {
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);
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

  return (
    <div className="flex flex-col gap-4 border-t border-border px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-muted-foreground">Show</span>

        <select
          value={limit}
          onChange={e => changeLimit(e.target.value)}
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

      <div className="flex items-center gap-2">
        <button
          onClick={previous}
          disabled={offset === 0}
          className={`h-10 w-10 rounded-2xl border border-border bg-background text-sm transition ${
            offset === 0
              ? "cursor-not-allowed opacity-50"
              : "hover:border-primary hover:text-foreground"
          }`}
        >
          ←
        </button>
        <div className="rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white">
          {currentPage}
        </div>
        <button
          onClick={next}
          disabled={offset + limit >= total}
          className={`h-10 w-10 rounded-2xl border border-border bg-background text-sm transition ${
            offset + limit >= total
              ? "cursor-not-allowed opacity-50"
              : "hover:border-primary hover:text-foreground"
          }`}
        >
          →
        </button>
      </div>
    </div>
  );
}
