"use client";

import { useState } from "react";
import SearchSection from "@/app/_component/SearchSection";
import TableSection from "@/app/_component/TableSection";
import { CharacterInfo } from "@/model/CharacterInfo";
import { useActionsStore } from "@/store/actions";

export default function LeftSection() {
  const [tableData, setTableData] = useState<CharacterInfo[]>([]);
  const OCR = useActionsStore((state) => state.OCR);

  return (
    <div className={`${OCR ? "w-8/12" : "w-full"}`}>
      <SearchSection tableData={tableData} setTableData={setTableData} />
      <TableSection tableData={tableData} setTableData={setTableData} />
    </div>
  );
}
