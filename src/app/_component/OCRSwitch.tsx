"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useActionsStore } from "@/store/actions";
import { useEffect } from "react";

export default function OCRSwitch() {
  const actionsStore = useActionsStore();

  useEffect(() => {
    if (typeof window !== "undefined") {
      actionsStore.setOCR(localStorage.getItem("OCR") === "true");
    }
  }, []);

  return (
    <div className="flex items-center space-x-2">
      <Switch
        onCheckedChange={actionsStore.setOCR}
        checked={actionsStore.OCR}
      />
      <Label>영상 인식모드</Label>
    </div>
  );
}
