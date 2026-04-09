"use client";

import dynamic from "next/dynamic";
import { SearchSkeleton } from "@/components/home/skeleton/search-skeleton";

const SearchWrapper = dynamic(
  () => import("@/components/dashboard/customer/search-wrapper"),
  { ssr: false, loading: () => <SearchSkeleton /> }
);

export function SearchClient() {
  return <SearchWrapper />;
}
