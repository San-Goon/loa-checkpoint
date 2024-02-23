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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ResponseProcessor } from "@/lib/utils";

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

  const [token, setToken] = useState<string>(
    () => localStorage.getItem("token") || "",
  );
  const [name, setName] = useState<string>("");

  const [disableToken, setDisableToken] = useState<boolean>(
    () => !!localStorage.getItem("token"),
  );

  const [tableData, setTableData] = useState<any>([]);

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
      for (const data of tableData) {
        if (data.name === name) return;
      }
      const { data } = await query.refetch();
      if (data === null || data.ArmoryProfile.ItemAvgLevel < 1445) return;
      setTableData([...tableData, ResponseProcessor(data)]);
    },
    [query, tableData, name],
  );

  const onClickSaveToken = useCallback(() => {
    localStorage.setItem("token", token);
    setDisableToken(true);
  }, [token]);

  const onClickDelete = useCallback(
    (index: number) => () => {
      const tempData = [...tableData];
      tempData.splice(index, 1);
      setTableData(tempData);
    },
    [tableData],
  );

  const onClickEditToken = useCallback(() => {
    setDisableToken(false);
  }, []);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const initializeTesseract = async (canvas: HTMLCanvasElement) => {
    // @ts-ignore
    const worker = await createWorker(["kor", "eng"]);
    const {
      data: { text },
    } = await worker.recognize(canvas);
    console.log(text);
    await worker.terminate();
  };

  const onChangeToken = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
  }, []);

  const onChangeName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  console.log("tableData: ", tableData);

  return (
    <div className="p-6">
      <div className="w-full flex justify-end pb-6">
        <Input
          className="w-1/4"
          value={token}
          onChange={onChangeToken}
          placeholder="API KEY 를 입력해주세요."
          disabled={disableToken}
        />
        {disableToken ? (
          <Button onClick={onClickEditToken}>수정</Button>
        ) : (
          <Button onClick={onClickSaveToken}>저장</Button>
        )}
      </div>
      <div className="flex w-full">
        <div className="w-8/12">
          <div className="w-60">
            <form onSubmit={onSubmit}>
              <Input
                value={name}
                onChange={onChangeName}
                placeholder="캐릭터명 입력"
              />
            </form>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>캐릭명</TableHead>
                <TableHead>템렙</TableHead>
                <TableHead>원대렙</TableHead>
                <TableHead>직각</TableHead>
                <TableHead>각인</TableHead>
                <TableHead>특성합</TableHead>
                <TableHead>무기</TableHead>
                <TableHead>보석</TableHead>
                <TableHead>트포</TableHead>
                <TableHead>시너지</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((data: any, index: number) => {
                return (
                  <TableRow key={data.name}>
                    <TableCell>{data.name}</TableCell>
                    <TableCell>{data.itemLv}</TableCell>
                    <TableCell>{data.expLv}</TableCell>
                    <TableCell>{data.mainEng}</TableCell>
                    <TableCell>{data.eng}</TableCell>
                    <TableCell>{data.totalStats}</TableCell>
                    <TableCell>{data.weapon}</TableCell>
                    <TableCell>{`홍염:${data.gem.hong} 멸화:${data.gem.myul}`}</TableCell>
                    <TableCell>{data.tripod["5"]}</TableCell>
                    <TableCell>{data.synergy}</TableCell>
                    <TableCell onClick={onClickDelete(index)}>x</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
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
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <HomeBase />
    </QueryClientProvider>
  );
}
