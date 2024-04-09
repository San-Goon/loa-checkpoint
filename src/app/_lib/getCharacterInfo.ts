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
  const siblingsData = await siblingsResponse.json();
  // 에러 처리
  if (!response.ok || !siblingsResponse.ok) {
    if (response.status === 401 || siblingsResponse.status === 401) {
      return {
        name,
        error: "Unauthorized",
      };
    }
    if (response.status === 429 || siblingsResponse.status === 429) {
      return {
        name,
        error: "Rate Limit Exceeded",
      };
    }
    if (response.status === 503 || siblingsResponse.status === 503) {
      return {
        name,
        error: "Service Unavailable",
      };
    }
    return {
      name,
      error: "Unknown",
    };
  }
  return {
    ...data,
    name,
    siblings: siblingsData.map(({ CharacterName }: any) => CharacterName),
  };
};
