"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useActionsStore } from "@/store/actions";

export default function ActionSection() {
  const actionsStore = useActionsStore();
  return (
    <div className="flex">
      <div className="flex items-center space-x-2">
        <Switch
          onCheckedChange={actionsStore.setOCR}
          checked={actionsStore.OCR}
        />
        <Label>영상 인식모드</Label>
      </div>
    </div>
  );
}
