"use client";

import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useRef, useState } from "react";
import { createWorker } from "tesseract.js";

export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);

  const initializeTesseract = async (canvas: HTMLCanvasElement) => {
    // @ts-ignore
    const worker = await createWorker(["kor", "eng"]);
    const {
      data: { text },
    } = await worker.recognize(canvas);
    console.log(text);
    await worker.terminate();
  };

  const captureVideo = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    initializeTesseract(canvas);
  }, [videoRef, canvasRef]);

  const startVideo = useCallback(async () => {
    const mediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });
    setStream(mediaStream);
  }, []);

  const stopVideo = useCallback(() => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="w-4/12">
      <div className="flex justify-center">
        <video className="border-2" ref={videoRef} autoPlay muted />
        <canvas className="hidden" ref={canvasRef} />
      </div>
      <div className="flex justify-center gap-1 pt-2">
        <Button onClick={startVideo}>화면공유</Button>
        <Button onClick={stopVideo}>공유중단</Button>
        <Button onClick={captureVideo}>캡처</Button>
      </div>
    </div>
  );
}
