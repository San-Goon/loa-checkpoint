"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBlacklistStore } from "@/store/blacklist";
import React, { FormEvent, useCallback, useState } from "react";
import BlacklistPopover from "@/app/_component/BlacklistPopover";

export default function BlacklistDialog() {
  const blacklist = useBlacklistStore((state) => state.blacklist);
  const add = useBlacklistStore((state) => state.add);
  const [name, setName] = useState("");

  const onChangeName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length < 13) setName(e.target.value);
  }, []);

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (name) {
        add(name);
        setName("");
      }
    },
    [add, name],
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>블랙리스트 설정</Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>블랙리스트 설정</DialogTitle>
          <DialogDescription>
            블랙리스트 유저를 추가합니다. 블랙리스트에 추가된 유저의 본/부캐들은
            검사시 빨간색으로 표시됩니다.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <Input
            onChange={onChangeName}
            placeholder="캐릭터명을 입력해주세요."
            value={name}
          />
        </form>
        <div className="grid grid-cols-4 gap-4">
          {blacklist.map(({ name, memo }) => {
            return <BlacklistPopover key={name} name={name} memo={memo} />;
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
