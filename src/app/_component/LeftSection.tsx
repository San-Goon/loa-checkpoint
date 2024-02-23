"use client";

import { useState } from "react";
import SearchSection from "@/app/_component/SearchSection";
import TableSection from "@/app/_component/TableSection";
import { CharacterInfo } from "@/model/CharacterInfo";

export default function LeftSection() {
  const [tableData, setTableData] = useState<CharacterInfo[]>([]);

  return (
    <div className="w-8/12">
      <SearchSection tableData={tableData} setTableData={setTableData} />
      <TableSection tableData={tableData} setTableData={setTableData} />
    </div>
  );
}
