"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useEffect, useState } from "react";

interface DiscoverySearchProps {
  countries: { code: string; name: string }[];
}

export function DiscoverySearch({ countries }: DiscoverySearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const debouncedQuery = useDebounce(query, 400);

  const currentCountry = searchParams.get("country") || "all";

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedQuery) {
      params.set("q", debouncedQuery);
    } else {
      params.delete("q");
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, [debouncedQuery, pathname, router, searchParams]);

  const handleCountryChange = (val: string) => {
    const params = new URLSearchParams(searchParams);
    if (val && val !== "all") {
      params.set("country", val);
    } else {
      params.delete("country");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 bg-muted/30 p-4 rounded-xl border">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search destinations..."
          className="pl-9 w-full bg-background"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="w-full sm:w-[200px]">
        <Select value={currentCountry} onValueChange={handleCountryChange}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="All Countries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {countries.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
