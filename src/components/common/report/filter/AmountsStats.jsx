"use client";

export default function AmountStats({ items = [], loading = false }) {
  return (
    <div className="rounded-[32px] border border-border bg-card p-6 shadow-sm">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="rounded-3xl border border-border bg-background p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <p className="mb-3 text-sm font-medium text-muted-foreground">{item.title}</p>

            {loading ? (
              <div className="h-8 w-24 animate-pulse rounded bg-muted" />
            ) : (
              <h3
                className={`
                  text-3xl font-bold tracking-tight
                  ${
                    item.color === "green"
                      ? "text-green-600"
                      : item.color === "red"
                        ? "text-red-500"
                        : item.color === "orange"
                          ? "text-orange-500"
                          : item.color === "blue"
                            ? "text-primary"
                            : "text-foreground"
                  }
                `}
              >
                {Number(item.value || 0).toFixed(2)}
              </h3>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
