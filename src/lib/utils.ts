import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { MAIN_ENGRAVE_LIST } from "@/lib/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function htmlToStr(html: string) {
  let parser = new DOMParser();
  let doc = parser.parseFromString(html, "text/html");
  return doc.body.textContent || "";
}
export function responseProcessor(
  res: any,
  blacklist: { name: string; memo: string }[],
) {
  try {
    const name = res.ArmoryProfile.CharacterName;
    let mainEngraving = "";
    const equipment = {
      itemLv: res.ArmoryProfile.ItemAvgLevel,
      elixir: "",
      transcendence: {
        averageLevel: 0,
        total: 0,
      },
    };

    const expLv = res.ArmoryProfile.ExpeditionLevel;
    const characterLv = "Lv." + res.ArmoryProfile.CharacterLevel;
    const title = res.ArmoryProfile.Title;
    const engraving = {
      buff: "",
      deBuff: "",
    };
    const stats = [];
    const tooltip = JSON.parse(res.ArmoryEquipment[0].Tooltip).Element_001
      .value;
    const weapon = {
      level: htmlToStr(tooltip.leftStr2).split(" ")[2],
      quality: tooltip.qualityValue,
    };
    let cardSet = "";

    let isBanned = blacklist.find((item) => res.siblings.includes(item.name));

    for (const { Type, Value } of res.ArmoryProfile.Stats) {
      if (
        (Type === "치명" || Type === "특화" || Type === "신속") &&
        Value >= 200
      )
        stats.push([Type, Value]);
    }

    stats.sort((a, b) => b[1] - a[1]);

    const gems: {
      annihilation: { [key: string]: number };
      crimsonFlame: { [key: string]: number };
    } = {
      annihilation: {
        "Lv.10": 0,
        "Lv.9": 0,
        "Lv.8": 0,
        "Lv.7": 0,
        "Lv.6": 0,
        "Lv.5": 0,
        "Lv.4": 0,
        "Lv.3": 0,
        "Lv.2": 0,
        "Lv.1": 0,
      },
      crimsonFlame: {
        "Lv.10": 0,
        "Lv.9": 0,
        "Lv.8": 0,
        "Lv.7": 0,
        "Lv.6": 0,
        "Lv.5": 0,
        "Lv.4": 0,
        "Lv.3": 0,
        "Lv.2": 0,
        "Lv.1": 0,
      },
    };

    const tripods: { [key: string]: number } = {};

    // 초월 및 엘릭서 로직
    for (let i = 1; i <= 5; i++) {
      const indentStringGroup = []; // 초월, 엘릭서, 세트렙 정보가 담깁니다.
      const tooltip = JSON.parse(res.ArmoryEquipment[i].Tooltip);
      for (const key in tooltip) {
        if (tooltip[key].type === "IndentStringGroup") {
          indentStringGroup.push(tooltip[key].value);
        }
      }
      // 엘릭서 로직
      if (i === 1) {
        for (const { Element_000 } of indentStringGroup) {
          const splittedStr = htmlToStr(Element_000.topStr).split(" ");
          if (
            splittedStr[0] === "연성" &&
            splittedStr[1] === "추가" &&
            splittedStr.length === 4
          ) {
            equipment.elixir += splittedStr[2].substring(2);
            if (splittedStr[3] === "(1단계)") {
              equipment.elixir += "35+";
            } else if (splittedStr[3] === "(2단계)") {
              equipment.elixir += "40+";
            }
          }
        }
      }
      // 초월 로직
      for (const { Element_000 } of indentStringGroup) {
        const splittedStr = htmlToStr(Element_000.topStr).split(" ");
        if (splittedStr[0] === "[초월]") {
          equipment.transcendence.averageLevel += Number(splittedStr[1][0]);
          equipment.transcendence.total += Number(splittedStr[2]);
        }
      }
    }
    equipment.transcendence.averageLevel /= 5;

    // 각인 로직
    for (const { Name } of res.ArmoryEngraving.Effects) {
      const [name, level]: string[] = Name.split(" Lv. ");
      if (mainEngraving === "" && name in MAIN_ENGRAVE_LIST) {
        mainEngraving = MAIN_ENGRAVE_LIST[name];
      }
      if (
        name === "공격력 감소" ||
        name === "방어력 감소" ||
        name === "이동속도 감소"
      )
        engraving.deBuff += level;
      else engraving.buff += level;
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
    if (res.ArmoryGem?.Gems) {
      for (const { Name } of res.ArmoryGem.Gems) {
        const doc = htmlToStr(Name);
        if (doc[1] === "레") {
          const gemName = doc[4];
          const gemLv = "Lv." + doc[0];
          if (gemName === "멸") gems.annihilation[gemLv]++;
          else gems.crimsonFlame[gemLv]++;
        } else {
          const gemName = doc[5];
          const gemLv = "Lv.10";
          if (gemName === "멸") gems.annihilation[gemLv]++;
          else gems.crimsonFlame[gemLv]++;
        }
      }
    }

    // 트포 계산 로직
    for (const data of res.ArmorySkills) {
      if (data.Level >= 4) {
        for (const tripodData of data.Tripods) {
          if (tripodData.IsSelected && tripodData.Level >= 2) {
            tripods[tripodData.Level]
              ? tripods[tripodData.Level]++
              : (tripods[tripodData.Level] = 1);
          }
        }
      }
    }

    return {
      name,
      mainEngraving,
      equipment,
      expLv,
      characterLv,
      title,
      engraving,
      stats,
      weapon,
      gems,
      tripods,
      cardSet,
      isBanned,
    };
  } catch (e) {
    return res?.name || "인식불가";
  }
}

export function getRestCoords(width: number) {
  if (width >= 2560) {
    return {
      width: 245,
      height: 30,
      gap: 116,
    };
  }
  if (width >= 1920) {
    return {
      width: 175,
      height: 22,
      gap: 87,
    };
  }
  if (width >= 1680) {
    return {
      width: 155,
      height: 20,
      gap: 78,
    };
  }
  if (width >= 1600) {
    return {
      width: 140,
      height: 18,
      gap: 73,
    };
  }
  if (width >= 1440) {
    return {
      width: 130,
      height: 17,
      gap: 66,
    };
  }
  if (width >= 1360) {
    return {
      width: 122,
      height: 17,
      gap: 62,
    };
  } else {
    return {
      width: 115,
      height: 17,
      gap: 59,
    };
  }
}
