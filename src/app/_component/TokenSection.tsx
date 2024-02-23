"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useTokenStore } from "@/store/token";

export default function TokenSection() {
  const setTokenZ = useTokenStore((state) => state.setToken);
  const [token, setToken] = useState<string>(
    () => localStorage.getItem("token") || "",
  );

  const [disableToken, setDisableToken] = useState<boolean>(
    () => !!localStorage.getItem("token"),
  );

  const onClickSaveToken = useCallback(() => {
    localStorage.setItem("token", token);
    setTokenZ(token);
    setDisableToken(true);
  }, [setTokenZ, token]);

  const onClickEditToken = useCallback(() => {
    setDisableToken(false);
  }, []);

  const onChangeToken = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
  }, []);

  useEffect(() => {
    setTokenZ(token);
  }, []);

  return (
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
  );
}
