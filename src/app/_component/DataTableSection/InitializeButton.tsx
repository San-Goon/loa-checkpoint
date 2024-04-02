import { Button } from "@/components/ui/button";
import { useCharactersStore } from "@/store/characters";

export default function InitializeButton() {
  const initialize = useCharactersStore((state) => state.initialize);
  return (
    <Button variant="outline" onClick={initialize}>
      초기화
    </Button>
  );
}
