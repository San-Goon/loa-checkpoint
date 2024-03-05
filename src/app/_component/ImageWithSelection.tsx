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
  setRealCoords: Dispatch<SetStateAction<Coordinate>>;
};

export default function ImageWithSelection({
  capturedImage,
  setRealCoords,
}: Props) {
  const imageRef = useRef<HTMLImageElement>(null);

  const [coords, setCoords] = useState<Coordinate>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });

  const [gap, setGap] = useState<number>(0);

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
      setRealCoords({ left, top });
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
          {[0, 1, 2, 3].map((value) => (
            <div
              key={value}
              className="border-2 border-emerald-400 absolute"
              style={{
                left: coords.left,
                top: coords.top + gap * value,
                width: coords.width,
                height: coords.height,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
