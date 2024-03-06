import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import TableBodySection from "@/app/_component/TableBodySection";

export default function TableSection() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>캐릭명</TableHead>
          <TableHead>템렙</TableHead>
          <TableHead>원대렙</TableHead>
          <TableHead>각인</TableHead>
          <TableHead>특성합</TableHead>
          <TableHead>무기렙/무품</TableHead>
          <TableHead>보석</TableHead>
          <TableHead>트포</TableHead>
          <TableHead>카드</TableHead>
          <TableHead>사사게검색</TableHead>
        </TableRow>
      </TableHeader>
      <TableBodySection />
    </Table>
  );
}
