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
  return { ...data, name };
};
