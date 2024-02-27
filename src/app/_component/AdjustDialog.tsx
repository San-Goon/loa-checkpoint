import { useCallback, useRef, MouseEvent, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { imageAdjustStore } from "@/store/imageAdjust";
import Image from "next/image";

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
  const location = imageAdjustStore();

  const [left, setLeft] = useState<number>(0);
  const [top, setTop] = useState<number>(0);
  const imageRef = useRef<HTMLImageElement>(null);

  const onClickSave = useCallback(() => {
    location.setState({ left, top });
    toast({
      title: "저장되었습니다.",
    });
  }, [left, top, location, toast]);

  const onClickImage = useCallback(
    (event: MouseEvent) => {
      if (!imageRef.current) {
        console.error("Image not loaded");
        return;
      }
      const rect = imageRef.current.getBoundingClientRect();
      const x =
        (event.clientX - rect.left) *
        (imageRef.current.naturalWidth / rect.width);
      const y =
        (event.clientY - rect.top) *
        (imageRef.current.naturalHeight / rect.height);
      setLeft(x);
      setTop(y);
    },
    [imageRef],
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={onClickOpen} disabled={disabled}>
          위치 조절
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-max">
        <DialogHeader>
          <DialogTitle>위치 조절</DialogTitle>
          <DialogDescription>
            이미지 인식 위치를 조절합니다. 예시 이미지를 참조해서 조정해주세요.
          </DialogDescription>
        </DialogHeader>
        <div>
          {capturedImage && (
            <Image
              src={capturedImage}
              alt="capturedImage"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto"
              onClick={onClickImage}
              ref={imageRef}
            />
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClickSave}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
