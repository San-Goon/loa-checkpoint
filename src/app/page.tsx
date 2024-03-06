import TokenSection from "@/app/_component/TokenSection";
import LeftSection from "@/app/_component/LeftSection";
import VideoSection from "@/app/_component/VideoSection";
import ActionSection from "@/app/_component/ActionSection";
export default function Home() {
  return (
    <div className="p-6">
      <div className="flex w-full justify-between pb-6">
        <ActionSection />
        <TokenSection />
      </div>
      <div className="flex flex-col w-full items-center gap-2">
        <VideoSection />
        <LeftSection />
      </div>
    </div>
  );
}
