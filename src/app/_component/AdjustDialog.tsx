import { useCallback } from "react";
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

export default function AdjustDialog() {
  const { toast } = useToast();
  const location = imageAdjustStore();

  const onClickSave = useCallback(() => {
    toast({
      title: "저장되었습니다.",
    });
  }, [toast]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>위치 조절</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>위치 조절</DialogTitle>
          <DialogDescription>이미지 인식 위치를 조절합니다.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClickSave}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
