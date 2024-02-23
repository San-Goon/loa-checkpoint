import TokenSection from "@/app/_component/TokenSection";
import LeftSection from "@/app/_component/LeftSection";
import VideoSection from "@/app/_component/VideoSection";
export default function Home() {
  return (
    <div className="p-6">
      <TokenSection />
      <div className="flex w-full">
        <LeftSection />
        <VideoSection />
      </div>
    </div>
  );
}
