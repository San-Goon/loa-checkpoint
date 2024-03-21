import { SettingDialog } from "@/app/_component/SettingDialog";
import OCRSwitch from "@/app/_component/OCRSwitch";
import BlacklistDialog from "@/app/_component/BlacklistDialog";

export default function ActionSection() {
  return (
    <div className="flex gap-2">
      {/*<SettingDialog />*/}
      <OCRSwitch />
      <BlacklistDialog />
    </div>
  );
}
