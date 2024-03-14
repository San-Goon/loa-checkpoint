import { useCharactersStore } from "@/store/characters";
import { useCallback } from "react";

export default function RemoveButton({ name }: { name: string }) {
  const deleteName = useCharactersStore((state) => state.deleteName);
  const onClickDelete = useCallback(() => {
    deleteName(name);
  }, [deleteName, name]);
  return (
    <div onClick={onClickDelete} className="cursor-pointer">
      X
    </div>
  );
}
