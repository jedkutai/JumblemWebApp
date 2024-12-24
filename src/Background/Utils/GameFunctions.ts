import { GridFunctions } from "./GridFunctions";
import { WordModel } from "../Models/WordModel";
import { MoveModel } from "../Models/MoveModel";
import { WordBankFunctions } from "./WordBankFunctions";

export class GameFunctions {
  static letters(): string[] {
    const result: string[] = [];

    const local: Record<string, number> = {
      A: 85,
      B: 21,
      C: 45,
      D: 34,
      E: 112,
      F: 18,
      G: 25,
      H: 30,
      I: 75,
      J: 2,
      K: 11,
      L: 55,
      M: 30,
      N: 67,
      O: 72,
      P: 32,
      Q: 2,
      R: 76,
      S: 57,
      T: 70,
      U: 36,
      V: 10,
      W: 13,
      X: 3,
      Y: 18,
      Z: 3,
    };

    for (const [letter, amount] of Object.entries(local)) {
      for (let i = 0; i < amount; i++) {
        result.push(letter);
      }
    }

    return result;
  }

  static simpleScore(score: number): number {
    return Math.floor(score);
  }

  static getLetters(count: number): string[] {
    const randomIndexes = new Set<number>(); // Use a Set to avoid duplicates
    const result: string[] = [];
    const letters = this.letters();

    while (randomIndexes.size < count) {
        const randomIndex = Math.floor(Math.random() * letters.length);
        randomIndexes.add(randomIndex); // Automatically prevents duplicates
    }

    randomIndexes.forEach(index => {
        result.push(letters[index]);
    });

    return result;
}

  // static getLetters(amount: number): string[] {
  //   const letters = this.letters();
  //   return [...letters].sort(() => Math.random() - 0.5).slice(0, amount);
  // }

  static getAvailableBlocks(moves: Record<string, MoveModel>, availableBlocks: string[]): string[] {
    let result = [...availableBlocks];

    if (Object.keys(moves).length === 0) {
      result = ["3,3"];
    } else {
      for (const move of Object.keys(moves)) {
        result.push(...this.getAdjacentBlocks(move));
      }
    }

    if (result.length === 0) {
      result = ["3,3"];
    }
    return [...new Set(result)];
  }

  static getAdjacentBlocks(coordinate: string): string[] {
    const [r, c] = coordinate.split(",").map(Number);

    return [
      `${r - 1},${c}`, // Up
      `${r + 1},${c}`, // Down
      `${r},${c - 1}`, // Left
      `${r},${c + 1}`, // Right
    ];
  }
 
  static checkDirection(
    finalMove: MoveModel,
    moves: Record<string, MoveModel>,
    direction1: keyof typeof GridFunctions,
    direction2: keyof typeof GridFunctions
  ): [string, string[]] {
    let consecutiveLetters = "";
    let consecutiveCoordinates: string[] = [];
    let currentCoordinates: string | null = finalMove.coordinates;

    while (currentCoordinates) {
      const move = moves[currentCoordinates];
      if (!move) break;

      consecutiveLetters = move.letter + consecutiveLetters;
      consecutiveCoordinates.unshift(currentCoordinates);
      currentCoordinates = (GridFunctions[direction1] as (coordinates: string) => string | null)(currentCoordinates);
    }

    currentCoordinates = (GridFunctions[direction2] as (coordinates: string) => string | null)(finalMove.coordinates);

    while (currentCoordinates) {
      const move = moves[currentCoordinates];
      if (!move) break;

      consecutiveLetters += move.letter;
      consecutiveCoordinates.push(currentCoordinates);
      currentCoordinates = (GridFunctions[direction2] as (coordinates: string) => string | null)(currentCoordinates);
    }

    return [consecutiveLetters.toLowerCase(), consecutiveCoordinates];
  }


  static getWordsToCheck(finalMove: MoveModel, moves: Record<string, MoveModel>): [string, string[]][] {
    const directions: [keyof typeof GridFunctions, keyof typeof GridFunctions][] = [
      ["getNorth", "getSouth"],
      ["getWest", "getEast"],
      ["getNorthWest", "getSouthEast"],
      ["getSouthWest", "getNorthEast"],
    ];

    let words: [string, string[]][] = [];

    for (const [dir1, dir2] of directions) {
      const word = this.checkDirection(finalMove, moves, dir1, dir2);
      words.push(...this.chopString(word));
    }

    return words;
  }

  // static chopString(consecutive: [string, string[]]): [string, string[]][] {
  //   const potentialWords: [string, string[]][] = [];
  //   const wordLen = consecutive[0].length;
  //   const ranges = [4, 5, 6, 7]; // Desired lengths of substrings

  //   for (const length of ranges) {
  //     if (wordLen >= length) {
  //       for (let i = 0; i <= wordLen - length; i++) {
  //         const sub = consecutive[0].substring(i, i + length);
  //         const reversedSub = sub.split("").reverse().join("");

  //         const subCoordinates = consecutive[1].slice(i, i + length);
  //         const reversedSubCoordinates = [...subCoordinates].reverse();

  //         potentialWords.push([sub, subCoordinates]);
  //         potentialWords.push([reversedSub, reversedSubCoordinates]);
  //       }
  //     }
  //   }

  //   return potentialWords;
  // }
static chopString(consecutive: [string, string[]]): [string, string[]][] {
    const potentialWords: [string, string[]][] = [];
    const wordLen = consecutive[0].length;

    // Ensure input is valid
    if (!consecutive[0] || !consecutive[1] || consecutive[0].length === 0 || consecutive[1].length === 0) {
        return [];
    }

    const ranges = [4, 5, 6, 7].filter((length) => length <= wordLen); // Filter ranges to valid lengths

    for (const length of ranges) {
        for (let i = 0; i <= wordLen - length; i++) {
            const sub = consecutive[0].substring(i, i + length);
            const reversedSub = sub.split("").reverse().join("");

            const subCoordinates = consecutive[1].slice(i, i + length);
            const reversedSubCoordinates = [...subCoordinates].reverse();


            potentialWords.push([sub, subCoordinates]);
            potentialWords.push([reversedSub, reversedSubCoordinates]);
        }
    }

    return potentialWords;
}

  static async checkWords(
    finalMove: MoveModel,
    moves: Record<string, MoveModel>,
    wordBankDict: Record<string, string[]>
  ): Promise<[WordModel, string[]][]> {
    const wordsToCheck = this.getWordsToCheck(finalMove, moves);
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


    const validWords = WordBankFunctions.checkWords(wordBank, wordBankDict);
    return validWords.map((word) => [word, wordDict[word.word]]);
  }
}
