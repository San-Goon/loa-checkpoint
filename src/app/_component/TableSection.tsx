import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dispatch, SetStateAction, useCallback } from "react";
import { CharacterInfo } from "@/model/CharacterInfo";

type Props = {
  tableData: CharacterInfo[];
  setTableData: Dispatch<SetStateAction<CharacterInfo[]>>;
};

export default function TableSection({ tableData, setTableData }: Props) {
  const onClickDelete = useCallback(
    (index: number) => () => {
      const tempData = [...tableData];
      tempData.splice(index, 1);
      setTableData(tempData);
    },
    [tableData, setTableData],
  );
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>캐릭명</TableHead>
          <TableHead>템렙</TableHead>
          <TableHead>원대렙</TableHead>
          <TableHead>직각</TableHead>
          <TableHead>각인</TableHead>
          <TableHead>특성합</TableHead>
          <TableHead>무기</TableHead>
          <TableHead>보석</TableHead>
          <TableHead>트포</TableHead>
          <TableHead>시너지</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableData.map((data: any, index: number) => {
          return (
            <TableRow key={data.name}>
              <TableCell>{data.name}</TableCell>
              <TableCell>{data.itemLv}</TableCell>
              <TableCell>{data.expLv}</TableCell>
              <TableCell>{data.mainEng}</TableCell>
              <TableCell>{data.eng}</TableCell>
              <TableCell>{data.totalStats}</TableCell>
              <TableCell>{data.weapon}</TableCell>
              <TableCell>{`홍염:${data.gem.hong} 멸화:${data.gem.myul}`}</TableCell>
              <TableCell>{data.tripod["5"]}</TableCell>
              <TableCell>{data.synergy}</TableCell>
              <TableCell onClick={onClickDelete(index)}>x</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}