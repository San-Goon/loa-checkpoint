"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { useCharactersStore } from "@/store/characters";
import { useTokenStore } from "@/store/token";
import { useQuery } from "@tanstack/react-query";
import { getCharacterInfo } from "@/app/_lib/getCharacterInfo";
import { responseProcessor } from "@/lib/utils";
import Link from "next/link";
import { Fragment, useCallback } from "react";
import { Button } from "@/components/ui/button";

export default function TableRowSection({ name }: { name: string }) {
  const deleteName = useCharactersStore((state) => state.deleteName);
  const token = useTokenStore((state) => state.token);

  const query = useQuery({
    queryKey: ["info", name],
    queryFn: () => getCharacterInfo(name, token),
    staleTime: 1 * 30 * 1000, // 30초
    gcTime: 3 * 60 * 1000, // 60초
  });

  const onClickDelete = useCallback(() => {
    deleteName(name);
  }, [deleteName, name]);

  if (!query.data) {
    return null;
  }

  const data = responseProcessor(query.data);
  if (!data) return null;
  return (
    <TableRow key={data.name}>
      <TableCell>{data.name}</TableCell>
      <TableCell>{data.mainEngrave}</TableCell>
      <TableCell>
        <div>{data.itemLv}</div>
        <div>{data.elixir}</div>
        {data.transcendence.total ? (
          <>
            <div>{`초월합: ${data.transcendence.total}`}</div>
            <div>{`초월평균: ${data.transcendence.averageLevel}`}</div>
          </>
        ) : null}
      </TableCell>
      <TableCell>{data.expLv}</TableCell>
      <TableCell>
        {data.engrave.buff}
        <span className="text-red-600">{data.engrave.deBuff}</span>
      </TableCell>
      <TableCell>
        {data.stats.map((stat) => (
          <div key={stat[0]}>{stat[0] + stat[1]}</div>
        ))}
      </TableCell>
      <TableCell>
        <div>{data.weapon.level + "제"}</div>
        {"품질: " + data.weapon.quality}
      </TableCell>
      <TableCell>
        {GEM_MAP_ORDER.map((item) => {
          if (data.gem[item])
            return (
              <Fragment key={item}>
                {item}
                {data.gem[item]}개{" "}
              </Fragment>
            );
        })}
      </TableCell>
      <TableCell>
        {[5, 4, 3, 2, 1].map((item) => {
          if (data.tripod[item]) {
            return (
              <Fragment key={item + "tripod"}>
                {`Lv.${item}: ${data.tripod[item]}`}{" "}
              </Fragment>
            );
          }
        })}
      </TableCell>
      <TableCell>{data.cardSet || "노카드"}</TableCell>
      <TableCell>
        <Link
          href={`https://sasagefind.com/?who=${data.name}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          GO!
        </Link>
      </TableCell>
      <TableCell>
        <div onClick={onClickDelete} className="cursor-pointer">
          X
        </div>
      </TableCell>
    </TableRow>
  );
}

const GEM_MAP_ORDER = [
  "10멸",
  "9멸",
  "8멸",
  "7멸",
  "6멸",
  "5멸",
  "4멸",
  "3멸",
  "2멸",
  "1멸",
  "10홍",
  "9홍",
  "8홍",
  "7홍",
  "6홍",
  "5홍",
  "4홍",
  "3홍",
  "2홍",
  "1홍",
];
