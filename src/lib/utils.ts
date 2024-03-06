import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { GemType } from "@/model/GemType";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function htmlToStr(html: string) {
  let parser = new DOMParser();
  let doc = parser.parseFromString(html, "text/html");
  return doc.body.textContent || "";
}
export function responseProcessor(res: any) {
  if (!res) return null;
  const name = res.ArmoryProfile.CharacterName;
  const itemLv = res.ArmoryProfile.ItemAvgLevel;
  const expLv = res.ArmoryProfile.ExpeditionLevel;
  const title = res.ArmoryProfile.Title;
  const engrave = {
    buff: "",
    deBuff: "",
  };
  const stats = [];
  const tooltip = JSON.parse(res.ArmoryEquipment[0].Tooltip).Element_001.value;
  const weapon = {
    level: htmlToStr(tooltip.leftStr2).split(" ")[2],
    quality: tooltip.qualityValue,
  };
  let cardSet = "";

  for (const { Type, Value } of res.ArmoryProfile.Stats) {
    if ((Type === "치명" || Type === "특화" || Type === "신속") && Value >= 200)
      stats.push([Type, Value]);
  }

  stats.sort((a, b) => b[1] - a[1]);

  const gem: GemType = {
    "10멸": 0,
    "9멸": 0,
    "8멸": 0,
    "7멸": 0,
    "6멸": 0,
    "5멸": 0,
    "4멸": 0,
    "3멸": 0,
    "2멸": 0,
    "1멸": 0,
    "10홍": 0,
    "9홍": 0,
    "8홍": 0,
    "7홍": 0,
    "6홍": 0,
    "5홍": 0,
    "4홍": 0,
    "3홍": 0,
    "2홍": 0,
    "1홍": 0,
  };

  const tripod: { [key: string]: number } = {};

  // 각인 로직
  for (const { Name } of res.ArmoryEngraving.Effects) {
    const separatedName = Name.split(" ");
    const level = separatedName.at(-1);
    if (separatedName[1] === "감소") engrave.deBuff += level;
    else engrave.buff += level;
  }

  // 카드 로직
  for (const { Items } of res.ArmoryCard.Effects) {
    switch (Items.at(-1).Name) {
      case "너는 계획이 다 있구나 6세트 (12각성합계)":
        cardSet = "너계+12";
        break;
      case "너는 계획이 다 있구나 6세트 (18각성합계)":
        cardSet = "너계+18";
        break;
      case "너는 계획이 다 있구나 6세트 (30각성합계)":
        cardSet = "너계+30";
        break;
      case "남겨진 바람의 절벽 6세트 (30각성합계)":
        cardSet = "남바+30";
        break;
      case "창의 달인 6세트 (30각성합계)":
        cardSet = "창달+30";
        break;
      case "알고 보면 6세트 (12각성합계)":
        cardSet = "알고+12";
        break;
      case "알고 보면 6세트 (18각성합계)":
        cardSet = "알고+18";
        break;
      case "알고 보면 6세트 (30각성합계)":
        cardSet = "알고+30";
        break;
      case "세상을 구하는 빛 6세트 (18각성합계)":
        cardSet = "세구+18";
        break;
      case "세상을 구하는 빛 6세트 (30각성합계)":
        cardSet = "세구+30";
        break;
      case "카제로스의 군단장 6세트 (18각성합계)":
        cardSet = "암구+18";
        break;
      case "카제로스의 군단장 6세트 (30각성합계)":
        cardSet = "암구+30";
        break;
      case "세 우마르가 오리라 3세트 (15각성합계)":
        cardSet += "세우";
        break;
      case "플라티나의 주민들 3세트 (15각성합계)":
        cardSet += "플라";
        break;
      case "라제니스의 운명 2세트 (10각성합계)":
        cardSet += "라제";
        break;
      case "삼두정치 (15각성합계)":
        cardSet += "삼두";
        break;
      case "부르는 소리 있도다 (15각성합계)":
        cardSet += "부소";
    }
  }

  // 보석 계산 로직
  for (const { Name } of res.ArmoryGem.Gems) {
    const doc = htmlToStr(Name);
    if (doc[1] === "레") {
      const gemName = doc[4];
      const gemLv = doc[0];
      const str = gemLv + gemName;
      gem[str]++;
    } else {
      const gemName = doc[5];
      const gemLv = "10";
      const str = gemLv + gemName;
      gem[str]++;
    }
  }

  // 트포 계산 로직
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
  return {
    name,
    itemLv,
    expLv,
    title,
    engrave,
    stats,
    weapon,
    gem,
    tripod,
    cardSet,
  };
}
