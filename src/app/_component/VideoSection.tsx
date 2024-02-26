"use client";

import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useRef, useState } from "react";
import { createWorker } from "tesseract.js";
import { useActionsStore } from "@/store/actions";
import AdjustDialog from "@/app/_component/AdjustDialog";

export default function VideoSection() {
  const OCR = useActionsStore((state) => state.OCR);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [image, setImage] = useState("");

  const [recognized, setRecognized] = useState<string[]>([]);
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

  const onClickTest = async () => {
    const value = [];
    // @ts-ignore
    const worker = await createWorker(["kor", "eng"]);
    const rectangle = {
      left: 1275,
      top: 388,
      width: 180,
      height: 285,
    };
    const {
      data: { text },
    } = await worker.recognize(image, { rectangle });
    const splicedText = text.split("\n");
    for (let i = 0; i < splicedText.length; i += 6) {
      value.push(splicedText[i]);
    }
    setRecognized(value);
    await worker.terminate();
  };

  const onChangeImage = (e: any) => {
    let reader = new FileReader();
    reader.onloadend = () => {
      // @ts-ignore
      setImage(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  if (!OCR) return null;

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
        <AdjustDialog />
        <Button onClick={onClickTest}>이미지테스트</Button>
        <div>
          {" "}
          이미지업로드
          <input
            type="file"
            accept="image/jpg,impge/png,image/jpeg,image/gif"
            name="profile_img"
            onChange={onChangeImage}
          />
        </div>
      </div>
    </div>
  );
}
