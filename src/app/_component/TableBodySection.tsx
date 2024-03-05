import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useCharactersStore } from "@/store/characters";
import { useTokenStore } from "@/store/token";
import { useQueries } from "@tanstack/react-query";
import { getCharacterInfo } from "@/app/_lib/getCharacterInfo";
import { useCallback, useEffect, useState } from "react";
import { ResponseProcessor } from "@/lib/utils";

export default function TableBodySection() {
  const added = useCharactersStore((state) => state.added);
  const token = useTokenStore((state) => state.token);

  const [tableData, setTableData] = useState<any>([]);
  const queries = useQueries({
    queries: added.map((name) => ({
      queryKey: ["info", name],
      queryFn: () => getCharacterInfo(name, token),
    })),
  });

  console.log("tableData", queries);

  const onClickDelete = useCallback(
    (index: number) => () => {
      const tempData = [...tableData];
      tempData.splice(index, 1);
      setTableData(tempData);
    },
    [tableData, setTableData],
  );
  return (
    <TableBody>
      {/*<TableRow key={data.name}>*/}
      {/*  <TableCell>{data.name}</TableCell>*/}
      {/*  <TableCell>{data.itemLv}</TableCell>*/}
      {/*  <TableCell>{data.expLv}</TableCell>*/}
      {/*  <TableCell>{data.mainEng}</TableCell>*/}
      {/*  <TableCell>{data.eng}</TableCell>*/}
      {/*  <TableCell>{data.totalStats}</TableCell>*/}
      {/*  <TableCell>{data.weapon}</TableCell>*/}
      {/*  <TableCell>{`홍염:${data.gem.hong} 멸화:${data.gem.myul}`}</TableCell>*/}
      {/*  <TableCell>{data.tripod["5"]}</TableCell>*/}
      {/*  <TableCell>{data.synergy}</TableCell>*/}
      {/*  <TableCell onClick={onClickDelete(index)}>x</TableCell>*/}
      {/*</TableRow>*/}
    </TableBody>
  );
}
