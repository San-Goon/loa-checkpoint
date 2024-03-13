"use client";

import { Input } from "@/components/ui/input";
import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { useCharactersStore } from "@/store/characters";

export default function SearchSection() {
  const setTyped = useCharactersStore((state) => state.setTyped);
  const [name, setName] = useState<string>("");

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setTyped(name);
    },
    [setTyped, name],
  );

  const onChangeName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  return (
    <div className="w-60">
      <form onSubmit={onSubmit}>
        <Input
          value={name}
          onChange={onChangeName}
          placeholder="캐릭터 수동 검색"
        />
      </form>
    </div>
  );
}
