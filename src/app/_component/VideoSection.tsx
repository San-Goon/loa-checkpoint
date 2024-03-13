"use client";

import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createScheduler, createWorker } from "tesseract.js";
import { useActionsStore } from "@/store/actions";
import AdjustDialog from "@/app/_component/AdjustDialog";
import { sectionAdjustStore } from "@/store/sectionAdjust";
import { useCharactersStore } from "@/store/characters";

export default function VideoSection() {
  const OCR = useActionsStore((state) => state.OCR);
  const setRecognized = useCharactersStore((state) => state.setRecognized);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const captureIntervalId = useRef<number | null>(null);
  const { left, top, width, height, gap } = sectionAdjustStore();

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState("");

  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);

  const rectangles = useMemo(
    () => [
      {
        left,
        top,
        width,
        height,
      },
      {
        left,
        top: top + gap,
        width,
        height,
      },
      {
        left,
        top: top + gap * 2,
        width,
        height,
      },
      {
        left,
        top: top + gap * 3,
        width,
        height,
      },
    ],
    [gap, height, left, top, width],
  );

  const captureVideo = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return "break";

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return "break";

    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
  }, []);

  const onClickOpenAdjust = useCallback(() => {
    if (captureVideo() === "break") return;
    canvasRef?.current?.toBlob((blob) => {
      if (blob) {
        const imageUrl = URL.createObjectURL(blob);
        setCapturedImage(imageUrl);
      }
    });
  }, [captureVideo]);

  const startCapture = useCallback(() => {
    if (captureVideo() === "break") return;
    setIsCapturing(true);

    captureIntervalId.current = window.setInterval(async () => {
      const scheduler = createScheduler();
      for (let i = 0; i < 4; i++) {
        // 신청칸이 4명까지이므로 4번 worker 생성
        // @ts-ignore
        const worker = await createWorker(["kor", "eng"]);
        scheduler.addWorker(worker);
      }
      captureVideo();
      const results = await Promise.all(
        rectangles.map((rectangle) =>
          scheduler.addJob(
            "recognize",
            canvasRef.current as HTMLCanvasElement,
            { rectangle },
          ),
        ),
      );
      console.log(
        "recognized texts: ",
        results.map((r) => r.data.text.trim()),
      );
      setRecognized(results.map((r) => r.data.text.trim()));
      await scheduler.terminate();
    }, 3000);
  }, [captureVideo, setRecognized, rectangles]);

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
    <div>
      <div className="flex justify-center relative">
        <video className="border-2" ref={videoRef} autoPlay muted />
        <canvas className="hidden" ref={canvasRef} />
        {!!left &&
          !!top &&
          rectangles.map(({ left, top, width, height }) => {
            const rect = videoRef.current!.getBoundingClientRect();
            const ratio = rect.width / videoRef.current!.videoWidth;
            return (
              <div
                key={top}
                className="border-2 border-emerald-400 absolute"
                style={{
                  left: left * ratio,
                  top: top * ratio,
                  width: width * ratio,
                  height: height * ratio,
                }}
              />
            );
          })}
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
          disabled={!isSharing || isCapturing}
        />
      </div>
    </div>
  );
}
