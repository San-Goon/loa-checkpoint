"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Fragment } from "react";
import Link from "next/link";
import RemoveButton from "@/app/_component/DataTableSection/RemoveButton";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type Info = {
  name: string;
  characterLv: string;
  title: string;
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
  isBanned: {
    name: string;
    memo: string;
  };
};

export const columns: ColumnDef<Info>[] = [
  {
    accessorKey: "name",
    header: "이름",
    cell: ({ row }) => {
      if (row.original.isBanned) {
        return (
          <TooltipProvider>
            <Tooltip>
              <p>{row.original.characterLv}</p>
              {row.original.title ? (
                <strong className="mb-2">{row.original.title}</strong>
              ) : null}
              <TooltipTrigger asChild>
                <p className="font-bold text-red-600">{row.original.name}</p>
              </TooltipTrigger>
              <TooltipContent>
                <p>차단된 캐릭터명:{row.original.isBanned.name}</p>
                <p>사유:{row.original.isBanned.memo}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }
      return (
        <div>
          <p>{row.original.characterLv}</p>
          {row.original.title ? (
            <strong className="mb-2">{row.original.title}</strong>
          ) : null}
          <p>{row.original.name}</p>
        </div>
      );
    },
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
      const {
        annihilation,
        crimsonFlame,
      }: {
        annihilation: { [key: string]: number };
        crimsonFlame: { [key: string]: number };
      } = row.getValue("gems");

      const allZero = (obj: { [key: string]: number }) => {
        return Object.values(obj).every((x) => x === 0);
      };

      return (
        <div className="flex gap-2">
          {!allZero(annihilation) && (
            <div>
              <div>
                <p>멸화</p>
                {Object.entries(annihilation).map(([key, value]) => {
                  if (value)
                    return (
                      <div key={key}>
                        {key}: {value}개
                      </div>
                    );
                })}
              </div>
            </div>
          )}
          {!allZero(crimsonFlame) && (
            <div>
              <div>
                <p>홍염</p>
                {Object.entries(crimsonFlame).map(([key, value]) => {
                  if (value)
                    return (
                      <div key={key}>
                        {key}: {value}개
                      </div>
                    );
                })}
              </div>
            </div>
          )}
        </div>
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
