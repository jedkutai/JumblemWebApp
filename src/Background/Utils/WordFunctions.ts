export enum WordRarity {
    Legendary = "Legendary",
    Rare = "Rare",
    Uncommon = "Uncommon",
    Common = "Common",
  }
  
  export class WordFunctions {
    static getWordType(score: number): WordRarity {
      if (score >= 3469832) {
        return WordRarity.Common;
      } else if (score >= 433133) {
        return WordRarity.Uncommon;
      } else if (score >= 94965) {
        return WordRarity.Rare;
      } else {
        return WordRarity.Legendary;
      }
    }
  }
  