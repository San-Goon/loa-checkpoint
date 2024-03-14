"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Fragment } from "react";
import Link from "next/link";
import RemoveButton from "@/app/_component/DataTableSection/RemoveButton";

export type Info = {
  name: string;
  mainEngraving: string;
  equipment: {
    level: string;
    elixir: string;
    transcendence: {
      total: number;
      averageLevel: number;
    };
  };
  expLv: string;
  engraving: {
    buff: string;
    deBuff: string;
  };
  stats: string[][];
  weapon: {
    level: string;
    quality: string;
  };
  gems: { [key: string]: number };
  tripods: { [key: string]: number };
};

export const columns: ColumnDef<Info>[] = [
  {
    accessorKey: "name",
    header: "이름",
  },
  {
    accessorKey: "mainEngraving",
    header: "직각",
  },
  {
    accessorKey: "equipment",
    header: "장비",
    cell: ({ row }) => {
      const equipment: {
        itemLv: string;
        elixir: string;
        transcendence: {
          total: number;
          averageLevel: number;
        };
      } = row.getValue("equipment");
      return (
        <>
          <div>{equipment.itemLv}</div>
          <div>{equipment.elixir}</div>
          {equipment.transcendence.total ? (
            <>
              <div>{`초월합: ${equipment.transcendence.total}`}</div>
              <div>{`초월평균: ${equipment.transcendence.averageLevel}`}</div>
            </>
          ) : null}
        </>
      );
    },
  },
  {
    accessorKey: "expLv",
    header: "원대렙",
  },
  {
    accessorKey: "engraving",
    header: "각인",
    cell: ({ row }) => {
      const engraving: {
        buff: string;
        deBuff: string;
      } = row.getValue("engraving");
      return (
        <>
          {engraving.buff}
          <span className="text-red-600">{engraving.deBuff}</span>
        </>
      );
    },
  },
  {
    accessorKey: "stats",
    header: "특성",
    cell: ({ row }) => {
      const stats: string[][] = row.getValue("stats");
      return (
        <>
          {stats.map((stat) => (
            <div key={stat[0]}>{stat[0] + stat[1]}</div>
          ))}
        </>
      );
    },
  },
  {
    accessorKey: "weapon",
    header: "무기",
    cell: ({ row }) => {
      const weapon: {
        level: string;
        quality: string;
      } = row.getValue("weapon");
      return (
        <>
          <div>{weapon.level + "제"}</div>
          {"품질: " + weapon.quality}
        </>
      );
    },
  },
  {
    accessorKey: "gems",
    header: "보석",
    cell: ({ row }) => {
      const gems: { [key: string]: number } = row.getValue("gems");
      return (
        <>
          {GEM_MAP_ORDER.map((item) => {
            if (gems[item])
              return (
                <Fragment key={item}>
                  {item}
                  {gems[item]}개{" "}
                </Fragment>
              );
          })}
        </>
      );
    },
  },
  {
    accessorKey: "tripods",
    header: "트포",
    cell: ({ row }) => {
      const tripods: { [key: string]: number } = row.getValue("tripods");
      return (
        <>
          {[5, 4, 3, 2, 1].map((item) => {
            if (tripods[item]) {
              return (
                <Fragment key={item + "tripod"}>
                  {`Lv.${item}: ${tripods[item]}`}{" "}
                </Fragment>
              );
            }
          })}
        </>
      );
    },
  },
  {
    accessorKey: "cardSet",
    header: "카드",
  },
  {
    accessorKey: "issues",
    header: "사사게",
    cell: ({ row }) => {
      const name = row.getValue("name");
      return (
        <Link
          href={`https://sasagefind.com/?who=${name}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          GO!
        </Link>
      );
    },
  },
  {
    accessorKey: "remove",
    header: "",
    cell: ({ row }) => {
      return <RemoveButton name={row.getValue("name")} />;
    },
  },
];

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
