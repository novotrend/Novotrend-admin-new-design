"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FormSelect({
  label,
  placeholder,
  options,
  value,
  onValueChange,
  disabled,
  name,
  error,
  ...props
}) {
  return (
    <div className="space-y-2.5">
      <label className="text-sm font-semibold tracking-tight text-foreground">
        {label}
      </label>

      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        name={name}
        {...props}
      >
        <SelectTrigger className="h-13 data-[size=default]:h-13 w-full rounded-2xl border border-border bg-muted/30 px-4 text-sm font-medium text-foreground shadow-sm outline-none transition-all duration-200 hover:border-primary/30 focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent className="z-[999] rounded-2xl border border-border bg-white p-2 shadow-2xl">
          {options?.map((option, index) => {
            const optionValue =
              typeof option === "object" && option !== null
                ? (option.value ?? option.label)
                : option;
            const optionLabel =
              typeof option === "object" && option !== null
                ? (option.label ?? option.value)
                : option;
            const optionKey = `${optionValue ?? optionLabel}-${index}`;

            return (
              <SelectItem
                key={optionKey}
                value={optionValue ?? optionLabel}
                className="rounded-xl px-3 py-3 text-sm font-medium outline-none transition-colors focus:bg-primary/10 focus:text-primary"
              >
                {optionLabel}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
