import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ResponseProcessor(res: any) {
  const name = res.ArmoryProfile.CharacterName;
  const itemLv = res.ArmoryProfile.ItemAvgLevel;
  const expLv = res.ArmoryProfile.ExpeditionLevel;
  const title = res.ArmoryProfile.Title;
  const mainEng = "undefined";
  const eng = "undefined";
  const totalStats = 2000;
  const weapon = res.ArmoryEquipment[0].Name;
  const gem: any = {};
  const tripod: any = {};
  const synergy = "undefined";

  // 보석 계산 로직
  for (const data of res.ArmoryGem.Effects) {
    if (data.Description[0] === "재") {
      gem.hong ? gem.hong++ : (gem.hong = 1);
    } else {
      gem.myul ? gem.myul++ : (gem.myul = 1);
    }
  }

  for (const data of res.ArmorySkills) {
    if (data.Level >= 4) {
      for (const tripodData of data.Tripods) {
        if (tripodData.IsSelected && tripodData.Level >= 2) {
          tripod[tripodData.Level]
            ? tripod[tripodData.Level]++
            : (tripod[tripodData.Level] = 1);
        }
      }
    }
  }

  // 트포 계산 로직
  return {
    name,
    itemLv,
    expLv,
    title,
    mainEng,
    eng,
    totalStats,
    weapon,
    gem,
    tripod,
    synergy,
  };
}
