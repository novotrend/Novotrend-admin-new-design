"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function TruncatedCell({ text, maxLength = 50, className = "" }) {
  if (!text) return <span className={className}>-</span>;

  const displayText = String(text);
  const isTruncated = displayText.length > maxLength;
  const truncatedText = isTruncated ? displayText.substring(0, maxLength) + "..." : displayText;

  if (!isTruncated) {
    return <span className={className}>{displayText}</span>;
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`cursor-help ${className}`}>{truncatedText}</span>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="break-words">{displayText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
