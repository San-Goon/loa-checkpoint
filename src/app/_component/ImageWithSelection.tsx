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

  const [isSelecting, setSelecting] = useState<boolean>(false);

  const [coords, setCoords] = useState<Coordinate>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });

  const mouseDownHandler = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!imageRef.current) {
        console.error("Image not loaded");
        return;
      }
      setSelecting(true);
      const rect = imageRef.current.getBoundingClientRect();
      const left =
        (e.clientX - rect.left) * (imageRef.current.naturalWidth / rect.width);
      const top =
        (e.clientY - rect.top) * (imageRef.current.naturalHeight / rect.height);
      setCoords({ ...coords, left: e.clientX, top: e.clientY });
      setRealCoords({ ...realCoords, left, top });
    },
    [coords, realCoords, setRealCoords],
  );

  const mouseMoveHandler = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!isSelecting) return;
      if (!imageRef.current) {
        console.error("Image not loaded");
        return;
      }
      const rect = imageRef.current.getBoundingClientRect();
      const width =
        (e.clientX - rect.left) * (imageRef.current.naturalWidth / rect.width);
      const height =
        (e.clientY - rect.top) * (imageRef.current.naturalHeight / rect.height);
      setCoords({
        ...coords,
        width: e.clientX - coords.left,
        height: e.clientY - coords.top,
      });
      setRealCoords({
        ...realCoords,
        width: width - realCoords.left,
        height: height - realCoords.top,
      });
    },
    [coords, isSelecting, realCoords, setRealCoords],
  );

  const mouseUpHandler = useCallback(() => {
    setSelecting(false);
  }, []);

  return (
    <div>
      {capturedImage && (
        <div
          className="w-full h-auto"
          onMouseDown={mouseDownHandler}
          onMouseMove={mouseMoveHandler}
          onMouseUp={mouseUpHandler}
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
        </div>
      )}
    </div>
  );
}
