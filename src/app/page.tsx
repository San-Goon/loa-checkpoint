import TokenSection from "@/app/_component/TokenSection";
import VideoSection from "@/app/_component/VideoSection";
import ActionSection from "@/app/_component/ActionSection";
import DataTableSection from "@/app/_component/DataTableSection";

export default function Home() {
  return (
    <div className="p-6">
      <div className="flex w-full justify-between pb-6">
        <ActionSection />
        <TokenSection />
      </div>
      <div className="flex flex-col w-full items-center gap-2">
        <VideoSection />
        <DataTableSection />
      </div>
    </div>
  );
}
