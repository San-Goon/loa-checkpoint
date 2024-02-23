"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useActionsStore } from "@/store/actions";
import { Button } from "@/components/ui/button";

export default function ActionSection() {
  const actionsStore = useActionsStore();
  return (
    <div className="flex gap-2">
      <Button>기준 설정</Button>
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
