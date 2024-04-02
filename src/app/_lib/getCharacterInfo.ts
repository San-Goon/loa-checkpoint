export const getCharacterInfo = async (name: string, token: string) => {
  const response = await fetch(
    `https://developer-lostark.game.onstove.com/armories/characters/${name}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },

      next: {
        tags: ["character"],
      },
      cache: "no-store",
    },
  );
  // 에러처리
  if (response.status === 401) {
    return {
      name,
      error: "Unauthorized",
    };
  }
  if (response.status === 429) {
    return {
      name,
      error: "Rate Limit Exceeded",
    };
  }
  const data = await response.json();
  const siblingsResponse = await fetch(
    `https://developer-lostark.game.onstove.com/characters/${name}/siblings`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },

      next: {
        tags: ["character"],
      },
      cache: "no-store",
    },
  );
  if (siblingsResponse.status === 429) {
    return {
      name,
      error: "Rate Limit Exceeded",
    };
  }
  const siblingsData = await siblingsResponse.json();
  return {
    ...data,
    name,
    siblings: siblingsData.map(({ CharacterName }: any) => CharacterName),
  };
};
