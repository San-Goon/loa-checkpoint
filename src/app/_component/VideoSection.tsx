"use client";

import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useRef, useState } from "react";
import { createWorker } from "tesseract.js";
import { useActionsStore } from "@/store/actions";
import AdjustDialog from "@/app/_component/AdjustDialog";
import { sectionAdjustStore } from "@/store/sectionAdjust";

export default function VideoSection() {
  const OCR = useActionsStore((state) => state.OCR);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const captureIntervalId = useRef<number | null>(null);
  const location = sectionAdjustStore();

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState("");

  const [recognized, setRecognized] = useState<string[]>([]);

  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);

  const onClickOpenAdjust = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    canvas.toBlob((blob) => {
      if (blob) {
        const imageUrl = URL.createObjectURL(blob);
        setCapturedImage(imageUrl);
      }
    });
  }, [videoRef, canvasRef]);

  const startCapture = useCallback(() => {
    setIsCapturing(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    const rectangle = {
      left: location.left,
      top: location.top,
      width: location.width,
      height: location.height,
    };

    captureIntervalId.current = window.setInterval(async () => {
      const value = [];
      // @ts-ignore
      const worker = await createWorker(["kor", "eng"]);
      const {
        data: { text },
      } = await worker.recognize(canvas, { rectangle });
      // const splicedText = text.split("\n");
      // for (let i = 0; i < splicedText.length; i += 6) {
      //   value.push(splicedText[i]);
      // }
      // setRecognized(value);
      console.log("value: ", text);
      await worker.terminate();
    }, 5000);
  }, [location, videoRef, canvasRef]);

  const stopCapture = useCallback(() => {
    setIsCapturing(false);
    if (captureIntervalId.current) {
      window.clearInterval(captureIntervalId.current);
      captureIntervalId.current = null;
    }
  }, [captureIntervalId]);

  const startVideo = useCallback(async () => {
    const mediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });
    mediaStream.getTracks().forEach((track) => {
      track.onended = () => {
        setIsSharing(false);
        setIsCapturing(false);
      };
    });
    setStream(mediaStream);
    setIsSharing(true);
  }, []);

  const stopVideo = useCallback(() => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      setStream(null);
    }
    stopCapture();
    setIsSharing(false);
    setIsCapturing(false);
  }, [stream, stopCapture]);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!OCR) return null;

  return (
    <div className="w-4/12">
      <div className="flex justify-center">
        <video className="border-2" ref={videoRef} autoPlay muted />
        <canvas className="hidden" ref={canvasRef} />
      </div>
      <div className="flex justify-center gap-1 pt-2">
        {isSharing ? (
          <Button onClick={stopVideo}>공유중단</Button>
        ) : (
          <Button onClick={startVideo}>화면공유</Button>
        )}
        {isCapturing ? (
          <Button onClick={stopCapture}>캡처중단</Button>
        ) : (
          <Button onClick={startCapture} disabled={!isSharing}>
            캡처시작
          </Button>
        )}
        <AdjustDialog
          onClickOpen={onClickOpenAdjust}
          capturedImage={capturedImage}
          disabled={!isSharing}
        />
      </div>
    </div>
  );
}
