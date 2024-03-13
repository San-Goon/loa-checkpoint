import { useCallback, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { sectionAdjustStore } from "@/store/sectionAdjust";
import ImageWithSelection from "@/app/_component/ImageWithSelection";
import { Coordinate } from "@/model/Coordinate";

type Props = {
  onClickOpen: () => void;
  capturedImage: string;
  disabled: boolean;
};

export default function AdjustDialog({
  onClickOpen,
  capturedImage,
  disabled,
}: Props) {
  const { toast } = useToast();
  const imageAdjustState = sectionAdjustStore();

  const [realCoords, setRealCoords] = useState<Coordinate>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    gap: 0,
  });

  const onClickSave = useCallback(() => {
    imageAdjustState.setState({ ...realCoords });
    toast({
      title: "저장되었습니다.",
    });
  }, [imageAdjustState, realCoords, toast]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={onClickOpen} disabled={disabled}>
          위치 조절
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-max w-11/12">
        <DialogHeader>
          <DialogTitle>위치 조절</DialogTitle>
          <DialogDescription>
            이미지 인식 위치를 조절합니다. 예시 이미지를 참조해서 조정해주세요.
          </DialogDescription>
        </DialogHeader>
        <ImageWithSelection
          capturedImage={capturedImage}
          setRealCoords={setRealCoords}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={onClickSave}>저장</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
