"use client";

import { TableBody } from "@/components/ui/table";
import { useCharactersStore } from "@/store/characters";
import TableRowSection from "@/app/_component/TableRowSection";

export default function TableBodySection() {
  const recognized = useCharactersStore((state) => state.recognized);
  const typed = useCharactersStore((state) => state.typed);

  return (
    <TableBody>
      {recognized.map((name) => (
        <TableRowSection key={name} name={name} />
      ))}
      {typed.map((name) => (
        <TableRowSection key={name} name={name} />
      ))}
    </TableBody>
  );
}
