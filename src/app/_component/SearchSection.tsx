import { Input } from "@/components/ui/input";
import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { useCharactersStore } from "@/store/characters";

export default function SearchSection() {
  const setRecognized = useCharactersStore((state) => state.setRecognized);
  const [name, setName] = useState<string>("");

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setRecognized([name]);
    },
    [setRecognized, name],
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
          placeholder="캐릭터명 입력"
        />
      </form>
    </div>
  );
}
