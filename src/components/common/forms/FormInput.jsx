"use client";

export default function FormInput({
  label,
  type = "text",
  placeholder,
  className = "",
  error,
  value,
  rightElement,
  ...props
}) {
  return (
    <div className="space-y-2.5">
      <label className="text-sm font-semibold tracking-tight text-foreground">
        {label}
      </label>

      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          {...props}
          className={`h-13 w-full rounded-2xl border border-border bg-muted/30 px-4 text-sm font-medium text-foreground shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/70 hover:border-primary/30 focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10 ${rightElement ? "pr-12" : ""} ${className}`}
        />

        {rightElement && (
          <div className="absolute inset-y-0 right-3 flex items-center">{rightElement}</div>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
