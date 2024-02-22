"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { createWorker } from "tesseract.js";
import { Input } from "@/components/ui/input";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

const queryClient = new QueryClient();
async function getCharacterInfo(token: string, name: string) {
  const response = await fetch(
    `https://developer-lostark.game.onstove.com/armories/characters/${name}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },
    },
  );

  return await response.json();
}

function HomeBase() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);

  const [token, setToken] = useState<string>("");
  const [name, setName] = useState<string>("");

  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["info"],
    queryFn: () => getCharacterInfo(token, name),
    enabled: false,
  });

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

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await query.refetch();
    },
    [query],
  );

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    console.log("!!!!!!!!", query?.data);
  }, [query]);

  const initializeTesseract = async (canvas: HTMLCanvasElement) => {
    // @ts-ignore
    const worker = await createWorker(["kor", "eng"]);
    const {
      data: { text },
    } = await worker.recognize(canvas);
    console.log(text);
    await worker.terminate();
  };

  const onChangeApi = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
  }, []);

  const onChangeName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <Input
          value={token}
          onChange={onChangeApi}
          placeholder="API KEY 를 입력해주세요."
        />
      </div>
      <div>
        <video ref={videoRef} autoPlay muted />
        <canvas className="none" ref={canvasRef} />
        <Button onClick={startVideo}>화면공유</Button>
        <Button onClick={stopVideo}>공유중단</Button>
        <Button onClick={captureVideo}>캡처</Button>
      </div>
      <div>
        <form onSubmit={onSubmit}>
          <Input
            value={name}
            onChange={onChangeName}
            placeholder="캐릭터명 입력"
          />
        </form>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <HomeBase />
    </QueryClientProvider>
  );
}
