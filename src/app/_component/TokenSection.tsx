"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useTokenStore } from "@/store/token";

export default function TokenSection() {
  const { token, setToken } = useTokenStore();

  const [disableToken, setDisableToken] = useState<boolean>(false);

  const onClickSaveToken = useCallback(() => {
    localStorage.setItem("token", token);
    setDisableToken(true);
  }, [token]);

  const onClickEditToken = useCallback(() => {
    setDisableToken(false);
  }, []);

  const onChangeToken = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setToken(e.target.value);
    },
    [setToken],
  );

  useEffect(() => {
    if (localStorage.getItem("token")) setDisableToken(true);
  }, []);

  return (
    <div className="flex">
      <Input
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
