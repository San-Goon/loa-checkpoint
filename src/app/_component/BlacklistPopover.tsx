import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { useCallback, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useBlacklistStore } from "@/store/blacklist";
import { PopoverClose } from "@radix-ui/react-popover";
import { NotebookIcon, TrashIcon } from "lucide-react";

export default function BlacklistPopover({
  name,
  memo,
}: {
  name: string;
  memo: string;
}) {
  const remove = useBlacklistStore((state) => state.remove);
  const update = useBlacklistStore((state) => state.updateMemo);

  const [content, setContent] = useState(memo);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const onChangeContent = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
    },
    [],
  );

  const onClickSave = useCallback(() => {
    update(name, content);
  }, [content, name, update]);

  const onClickRemove = useCallback(() => {
    remove(name);
  }, [name, remove]);

  return (
    <Popover>
      <div className="flex w-56 h-6 align-middle justify-between">
        <span>{name}</span>
        <div className="flex">
          <PopoverTrigger>
            <NotebookIcon />
          </PopoverTrigger>
          <TrashIcon onClick={onClickRemove} className="cursor-pointer" />
        </div>
      </div>
      <PopoverContent className="flex flex-col items-end">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={onChangeContent}
        />
        <PopoverClose asChild>
          <Button className="mt-2" onClick={onClickSave}>
            저장
          </Button>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  );
}
