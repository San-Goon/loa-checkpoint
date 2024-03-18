"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeEvent, useCallback, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useCutoffStore } from "@/store/cutoff";
export function SettingDialog() {
  const cutoffState = useCutoffStore();
  const [expLv, setExpLv] = useState<string>(() => cutoffState.expLv || "");
  const [damage, setDamage] = useState<string>(() => cutoffState.damage || "");

  const { toast } = useToast();

  const onChangeExpLv = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setExpLv(e.target.value);
  }, []);

  const onChangeDamage = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setDamage(e.target.value);
  }, []);

  const onClickSave = useCallback(() => {
    localStorage.setItem("cutoff", JSON.stringify({ expLv, damage }));
    cutoffState.setCutoff({ expLv, damage });
    toast({
      title: "저장되었습니다.",
    });
  }, [expLv, damage, cutoffState, toast]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>기준 설정</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>기준 설정</DialogTitle>
          <DialogDescription>
            군장 검사 합/불 여부의 기준을 설정합니다.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label>원정대 레벨</Label>
            <Input onChange={onChangeExpLv} value={expLv} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label>무기레벨</Label>
            <Input onChange={onChangeDamage} value={damage} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClickSave}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
