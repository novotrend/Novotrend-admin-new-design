"use client";

import { useMemo, useState } from "react";

const normalizeSearchValue = value => {
  if (value === undefined || value === null) return "";
  if (typeof value === "object") return Object.values(value).join(" ");
  return String(value);
};

export const useClientPagination = (items = [], defaultLimit = 10, search = "", extraSearchValues) => {
  const [limit, setLimit] = useState(defaultLimit);
  const [offset, setOffset] = useState(0);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return items;

    return items.filter(item => {
      const extraValues =
        typeof extraSearchValues === "function" ? extraSearchValues(item) : extraSearchValues;
      const searchableText = [
        ...Object.values(item || {}),
        ...(Array.isArray(extraValues) ? extraValues : []),
      ]
        .map(normalizeSearchValue)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [items, search, extraSearchValues]);

  const paginatedItems = useMemo(
    () => filteredItems.slice(offset, offset + limit),
    [filteredItems, limit, offset]
  );

  return {
    limit,
    setLimit,
    offset,
    setOffset,
    total: filteredItems.length,
    paginatedItems,
  };
};
