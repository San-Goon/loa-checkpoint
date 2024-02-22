"use client"

import {useCallback, useEffect, useRef, useState} from "react";
import {Button} from "@/components/ui/button";

export default function Home() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

  const startVideo = useCallback(async () => {
    const mediaStream =  await navigator.mediaDevices.getDisplayMedia({video: true})
      setStream(mediaStream);
  }, [])

    const stopVideo = useCallback(() => {
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            setStream(null)
        }
    }, [stream])

    useEffect(() => {
        if(stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [stream])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
          <video ref={videoRef} autoPlay muted />
          <Button onClick={startVideo}>화면공유</Button>
          <Button onClick={stopVideo}>공유중단</Button>
      </div>
    </main>
  );
}
