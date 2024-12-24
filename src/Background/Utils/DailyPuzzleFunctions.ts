import { GridSpotModel } from "../Models/GridSpotModel";
import { GridSpot } from "../Extends/GridSpot";
import { WordModel } from "../Models/WordModel";
// import { WordService } from "../Service/WordService";
import { WordBankFunctions } from "./WordBankFunctions";

export class DailyPuzzleFunctions {
  static validSquare(spot: GridSpotModel, grid: GridSpotModel[][]): boolean {
    const directions = ["north", "south", "east", "west"] as const;
    for (const dir of directions) {
      const coordinates = spot[dir];
      if (coordinates) {
        const [r, c] = this.getCoordinateInts(coordinates);
        if (grid[r][c].letter) {
          return true;
        }
      }
    }
    return false;
  }

  static getCoordinateInts(coordinates: string): [number, number] {
    const split = coordinates.split(",");
    if (split.length === 2) {
      const r = parseInt(split[0], 10);
      const c = parseInt(split[1], 10);
      return [r, c];
    }
    return [-1, -1];
  }

  static getScore(correctWords: Record<string, [WordModel, number]>): number {
    let score = 0;

    for (const value of Object.values(correctWords)) {
      const [wordModel, count] = value;
      if (wordModel.score >= 3469832) {
        score += count * 25;
      } else if (wordModel.score >= 433133) {
        score += count * 50;
      } else if (wordModel.score >= 94965) {
        score += count * 75;
      } else {
        score += count * 100;
      }
    }

    return score;
  }

  static indexToCoordinates(index: number): string {
    const r = index % 7;
    const c = Math.floor(index / 7);
    return `${r},${c}`;
  }

  static signatureToGridDict(signature: string): Record<string, GridSpotModel> {
    const gridDict: Record<string, GridSpotModel> = {};
    const grid = GridSpot.grid; // Assuming GridSpotModel.grid provides the grid structure.

    for (const row of grid) {
      for (const spot of row) {
        gridDict[spot.id] = { ...spot };
      }
    }

    Array.from(signature).forEach((letter, index) => {
      const coordinates = this.indexToCoordinates(index);
      if (letter !== "0") {
        gridDict[coordinates].letter = letter;
      }
    });

    return gridDict;
  }

  static checkDirection(
    startingSpot: GridSpotModel,
    gridDict: Record<string, GridSpotModel>,
    direction1: keyof GridSpotModel,
    direction2: keyof GridSpotModel
  ): [string, string[]] {
    let consecutiveLetters = "";
    let consecutiveCoordinates: string[] = [];
    let currentCoordinates: string | null | undefined = startingSpot.id;



    while (currentCoordinates) {
      const spot: GridSpotModel = gridDict[currentCoordinates];
      if (!spot?.letter) break;

      consecutiveLetters = spot.letter + consecutiveLetters;
      consecutiveCoordinates.unshift(currentCoordinates);
      currentCoordinates = spot[direction1];
    }

    currentCoordinates = startingSpot[direction2];

    while (currentCoordinates) {
      const spot = gridDict[currentCoordinates];
      if (!spot?.letter) break;

      consecutiveLetters += spot.letter;
      consecutiveCoordinates.push(currentCoordinates);
      currentCoordinates = spot[direction2];
    }

    return [consecutiveLetters.toLowerCase(), consecutiveCoordinates];
  }

  static getWordsToCheck(
    startingSpot: GridSpotModel,
    gridDict: Record<string, GridSpotModel>
  ): [string, string[]][] {
    const directions = [
      ["north", "south"],
      ["west", "east"],
      ["northWest", "southEast"],
      ["southWest", "northEast"],
    ] as const;

    const words: [string, string[]][] = [];

    for (const [dir1, dir2] of directions) {
      const word = this.checkDirection(startingSpot, gridDict, dir1, dir2);
      words.push(...this.chopString(word));
    }

    return words;
  }

  static chopString(consecutive: [string, string[]]): [string, string[]][] {
    const potentialWords: [string, string[]][] = [];
    const wordLen = consecutive[0].length;
    const ranges = [4, 5, 6, 7]; // Desired lengths of substrings

    for (const length of ranges) {
      if (wordLen >= length) {
        for (let i = 0; i <= wordLen - length; i++) {
          const sub = consecutive[0].substring(i, i + length);
          const reversedSub = sub.split("").reverse().join("");

          const subCoordinates = consecutive[1].slice(i, i + length);
          const reversedSubCoordinates = [...subCoordinates].reverse();

          potentialWords.push([sub, subCoordinates]);
          potentialWords.push([reversedSub, reversedSubCoordinates]);
        }
      }
    }

    return potentialWords;
  }

  static async checkWords(
    startingSpot: GridSpotModel,
    gridDict: Record<string, GridSpotModel>,
    wordBankDict: Record<string, string[]>
  ): Promise<[WordModel, string[]][]> {
    const wordsToCheck = this.getWordsToCheck(startingSpot, gridDict);
    const wordDict: Record<string, string[]> = {};
    const wordBank: string[] = [];

    for (const [word, coordinates] of wordsToCheck) {
      if (wordDict[word]) {
        wordDict[word].push(...coordinates.filter((coord) => !wordDict[word].includes(coord)));
      } else {
        wordDict[word] = coordinates;
        wordBank.push(word);
      }
    }

    // const validWords: WordModel[] = await WordService.checkWords(wordBank);
    const validWords = WordBankFunctions.checkWords(wordBank, wordBankDict);
    return validWords.map((word) => [word, wordDict[word.word]]);
  }
}
