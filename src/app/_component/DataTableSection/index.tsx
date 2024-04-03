"use client";

import DataTable from "./DataTable";
import { columns } from "./Column";
import { useCharactersStore } from "@/store/characters";
import { useTokenStore } from "@/store/token";
import { useQueries } from "@tanstack/react-query";
import { getCharacterInfo } from "@/app/_lib/getCharacterInfo";
import { responseProcessor } from "@/lib/utils";
import { useBlacklistStore } from "@/store/blacklist";
import { useToast } from "@/components/ui/use-toast";

export default function DataTableSection() {
  const blacklist = useBlacklistStore((state) => state.blacklist);
  const recognized = useCharactersStore((state) => state.recognized);
  const typed = useCharactersStore((state) => state.typed);
  const deleteName = useCharactersStore((state) => state.deleteName);
  const token = useTokenStore((state) => state.token);

  const { toast } = useToast();

  const recognizedQueries = useQueries({
    queries: recognized.map((name) => ({
      queryKey: ["info", name],
      queryFn: () => getCharacterInfo(name, token),
      staleTime: 1 * 15 * 1000, // 15초
      gcTime: 3 * 60 * 1000, // 60초
    })),
  });

  const typedQueries = useQueries({
    queries: typed.map((name) => ({
      queryKey: ["info", name],
      queryFn: () => getCharacterInfo(name, token),
      staleTime: 1 * 15 * 1000, // 15초
      gcTime: 3 * 60 * 1000, // 60초
    })),
  });

  const data = [...recognizedQueries, ...typedQueries].map((query) => {
    if (query.isLoading) return "loading";
    if (query.data.error) {
      deleteName(query.data.name);
      if (query.data.error === "Unauthorized") {
        toast({
          variant: "destructive",
          title: "API 키가 잘못되었습니다.",
          description: "API 키를 확인 후 재시도해주세요.",
        });
      }
      if (query.data.error === "Rate Limit Exceeded") {
        toast({
          variant: "destructive",
          title: "API 요청 횟수가 초과되었습니다.",
          description: "잠시후에 다시 시도해주세요.",
        });
      }
      if (query.data.error === "Service Unavailable") {
        toast({
          variant: "destructive",
          title: "로스트아크 서버가 점검 중입니다.",
          description: "점검 후에 이용해주세요.",
        });
      }
      if (query.data.error === "Unknown") {
        toast({
          variant: "destructive",
          title: "API 요청 중 알 수 없는 에러가 발생했습니다.",
          description:
            "잠시후에 다시 시도해주세요. 지속적으로 발생한다면 관리자에게 문의해주세요.",
        });
      }
    }
    return responseProcessor(query.data, blacklist);
  });

  return (
    <div className="w-full">
      <DataTable data={data} columns={columns} />
    </div>
  );
}
