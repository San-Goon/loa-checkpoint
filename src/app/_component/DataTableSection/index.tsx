"use client";

import DataTable from "./DataTable";
import { columns } from "./Column";
import { useCharactersStore } from "@/store/characters";
import { useTokenStore } from "@/store/token";
import { useQueries } from "@tanstack/react-query";
import { getCharacterInfo } from "@/app/_lib/getCharacterInfo";
import { responseProcessor } from "@/lib/utils";

export default function DataTableSection() {
  const recognized = useCharactersStore((state) => state.recognized);
  const typed = useCharactersStore((state) => state.typed);
  const token = useTokenStore((state) => state.token);

  const recognizedQueries = useQueries({
    queries: recognized.map((name) => ({
      queryKey: ["info", name],
      queryFn: () => getCharacterInfo(name, token),
      staleTime: 1 * 30 * 1000, // 30초
      gcTime: 3 * 60 * 1000, // 60초
    })),
  });

  const typedQueries = useQueries({
    queries: typed.map((name) => ({
      queryKey: ["info", name],
      queryFn: () => getCharacterInfo(name, token),
      staleTime: 1 * 30 * 1000, // 30초
      gcTime: 3 * 60 * 1000, // 60초
    })),
  });

  const data = [...recognizedQueries, ...typedQueries].map((query) => {
    if (query.isLoading) return "loading";
    return responseProcessor(query.data);
  });

  return (
    <div className="w-full">
      <DataTable data={data} columns={columns} />
    </div>
  );
}
