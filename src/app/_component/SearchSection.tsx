import { Input } from "@/components/ui/input";
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import { ResponseProcessor } from "@/lib/utils";
import { getCharacterInfo } from "@/app/_lib/getCharacterInfo";
import { useQuery } from "@tanstack/react-query";
import { CharacterInfo } from "@/model/CharacterInfo";
import { useTokenStore } from "@/store/token";

type Props = {
  tableData: CharacterInfo[];
  setTableData: Dispatch<SetStateAction<CharacterInfo[]>>;
};
export default function SearchSection({ tableData, setTableData }: Props) {
  const token = useTokenStore((state) => state.token);
  const [name, setName] = useState<string>("");

  const query = useQuery<any>({
    queryKey: ["info", name],
    queryFn: () => getCharacterInfo(name, token),
    enabled: false,
  });

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      for (const data of tableData) {
        if (data.name === name) return;
      }
      const { data } = await query.refetch();
      if (data === null || data.ArmoryProfile.ItemAvgLevel < 1445) return;
      setTableData([...tableData, ResponseProcessor(data)]);
    },
    [query, setTableData, tableData, name],
  );

  const onChangeName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  return (
    <div className="w-60">
      <form onSubmit={onSubmit}>
        <Input
          value={name}
          onChange={onChangeName}
          placeholder="캐릭터명 입력"
        />
      </form>
    </div>
  );
}
