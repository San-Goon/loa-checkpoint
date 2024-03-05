import Image from "next/image";
import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from "react";
import { Coordinate } from "@/model/Coordinate";

type Props = {
  capturedImage: string;
  realCoords: Coordinate;
  setRealCoords: Dispatch<SetStateAction<Coordinate>>;
};

export default function ImageWithSelection({
  capturedImage,
  realCoords,
  setRealCoords,
}: Props) {
  const imageRef = useRef<HTMLImageElement>(null);

  // const [isSelecting, setSelecting] = useState<boolean>(false);

  const [coords, setCoords] = useState<Coordinate>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });

  const [gap, setGap] = useState<number>(0);

  // const mouseDownHandler = useCallback(
  //   (e: MouseEvent<HTMLDivElement>) => {
  //     if (!imageRef.current) {
  //       console.error("Image not loaded");
  //       return;
  //     }
  //     if (!(e.target instanceof Element)) {
  //       console.error("Invalid event target");
  //       return;
  //     }
  //     // setSelecting(true);
  //     const rect = imageRef.current.getBoundingClientRect();
  //     const left =
  //       (e.clientX - rect.left - 1) *
  //       (imageRef.current.naturalWidth / rect.width);
  //     const top =
  //       (e.clientY - rect.top - 3) *
  //       (imageRef.current.naturalHeight / rect.height);
  //     setCoords({
  //       left: e.clientX - rect.left - 1,
  //       top: e.clientY - rect.top - 3,
  //       width: 0,
  //       height: 0,
  //     });
  //     setRealCoords({ ...realCoords, left, top });
  //   },
  //   [realCoords, setRealCoords],
  // );
  //
  // const mouseMoveHandler = useCallback(
  //   (e: MouseEvent<HTMLDivElement>) => {
  //     if (!isSelecting) return;
  //     if (!imageRef.current) {
  //       console.error("Image not loaded");
  //       return;
  //     }
  //     const rect = imageRef.current.getBoundingClientRect();
  //     const width =
  //       (e.clientX - rect.left - 1) *
  //       (imageRef.current.naturalWidth / rect.width);
  //     const height =
  //       (e.clientY - rect.top - 3) *
  //       (imageRef.current.naturalHeight / rect.height);
  //     setCoords({
  //       ...coords,
  //       width: e.clientX - rect.left - 1 - coords.left,
  //       height: e.clientY - rect.top - 3 - coords.top,
  //     });
  //     setRealCoords({
  //       ...realCoords,
  //       width: width - realCoords.left,
  //       height: height - realCoords.top,
  //     });
  //   },
  //   [coords, isSelecting, realCoords, setRealCoords],
  // );
  //
  // const mouseUpHandler = useCallback(() => {
  //   setSelecting(false);
  // }, []);

  const onClickSection = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!imageRef.current) {
        console.error("Image not loaded");
        return;
      }
      if (!(e.target instanceof Element)) {
        console.error("Invalid event target");
        return;
      }
      const rect = imageRef.current.getBoundingClientRect();
      const left =
        (e.clientX - rect.left - 1) *
        (imageRef.current.naturalWidth / rect.width);
      const top =
        (e.clientY - rect.top - 3) *
        (imageRef.current.naturalHeight / rect.height);
      setCoords({
        left: e.clientX - rect.left - 1,
        top: e.clientY - rect.top - 3,
        width: 175 * (rect.width / imageRef.current.naturalWidth),
        height: 22 * (rect.height / imageRef.current.naturalHeight),
      });
      setGap(87 * (rect.height / imageRef.current.naturalHeight));
      setRealCoords({ left, top, width: 175, height: 22 });
    },
    [setRealCoords],
  );

  return (
    <div>
      {capturedImage && (
        <div
          className="w-full h-full relative"
          onClick={onClickSection}
          draggable={false}
        >
          <Image
            src={capturedImage}
            alt="capturedImage"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto"
            ref={imageRef}
            draggable={false}
          />
          <div
            className="border-2 border-emerald-400 absolute"
            style={{
              left: coords.left,
              top: coords.top,
              width: coords.width,
              height: coords.height,
            }}
          />
          <div
            className="border-2 border-emerald-400 absolute"
            style={{
              left: coords.left,
              top: coords.top + gap,
              width: coords.width,
              height: coords.height,
            }}
          />
          <div
            className="border-2 border-emerald-400 absolute"
            style={{
              left: coords.left,
              top: coords.top + gap * 2,
              width: coords.width,
              height: coords.height,
            }}
          />
          <div
            className="border-2 border-emerald-400 absolute"
            style={{
              left: coords.left,
              top: coords.top + gap * 3,
              width: coords.width,
              height: coords.height,
            }}
          />
        </div>
      )}
    </div>
  );
}
