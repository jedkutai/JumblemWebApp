export enum WordRarity {
    Legendary = "Legendary",
    Rare = "Rare",
    Uncommon = "Uncommon",
    Common = "Common",
  }
  
  export class WordFunctions {
    static getWordType(score: number): WordRarity {
      if (score == 4) {
        return WordRarity.Common;
      } else if (score == 3) {
        return WordRarity.Uncommon;
      } else if (score == 2) {
        return WordRarity.Rare;
      } else if (score == 1) {
        return WordRarity.Legendary;
      } else {
        return WordRarity.Common;
      }
    }
  }
  