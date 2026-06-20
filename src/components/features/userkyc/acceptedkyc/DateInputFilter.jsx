"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

export default function DateInputFilter({ onSubmit, onClear, isLoading = false }) {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const isFutureDate = date => date > today;
  const isInvalidRange = startDate && endDate && endDate < startDate;
  const isSubmitDisabled = !startDate || !endDate || isInvalidRange;

  const handleStartDateSelect = date => {
    setStartDate(date);

    if (date && endDate && endDate < date) {
      setEndDate(undefined);
    }
  };

  const handleSubmit = () => {
    if (isSubmitDisabled) {
      return;
    }

    onSubmit?.({
      sdate: startDate ? format(startDate, "yyyy-MM-dd") : "",
      edate: endDate ? format(endDate, "yyyy-MM-dd") : "",
    });
  };

  const handleClear = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    onClear?.();
  };

  return (
    <div className="rounded-3xl border border-border bg-background p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <label className="mb-3 block text-sm font-semibold text-foreground">Start Date</label>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-14 w-full justify-between rounded-2xl border-border bg-muted/40 px-5 text-sm font-medium text-foreground hover:bg-background"
              >
                {startDate ? format(startDate, "dd-MM-yyyy") : "dd-mm-yyyy"}

                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              align="start"
              className="w-auto rounded-3xl border border-border p-0 shadow-2xl"
            >
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleStartDateSelect}
                disabled={isFutureDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="mb-3 block text-sm font-semibold text-foreground">End Date</label>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-14 w-full justify-between rounded-2xl border-border bg-muted/40 px-5 text-sm font-medium text-foreground hover:bg-background"
              >
                {endDate ? format(endDate, "dd-MM-yyyy") : "dd-mm-yyyy"}

                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              align="start"
              className="w-auto rounded-3xl border border-border p-0 shadow-2xl"
            >
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                disabled={date => isFutureDate(date) || (startDate ? date < startDate : false)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {isInvalidRange && (
        <p className="mt-3 text-sm font-medium text-red-500">
          End date start date se chhoti nahi ho sakti.
        </p>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleClear}
          disabled={isLoading}
          className="flex h-12 items-center justify-center rounded-2xl border border-border bg-background px-8 text-sm font-semibold text-foreground transition-all hover:bg-muted"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitDisabled || isLoading}
          className="flex h-12 items-center justify-center rounded-2xl bg-primary px-8 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Loading..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
