import wordBankFilePath from "../../../wordbank.txt";
import { WordModel } from "../Models";

export class WordBankFunctions {

    static async getWordBank(): Promise<Record<string, string[]>> {
        const wordBank: Record<string, string[]> = {};

        try {
            const response = await fetch(wordBankFilePath)
            if (!response.ok) {
                console.error("Failed to fetch word bank");
                return {};
            }

            const content = await response.text();
            const rows = content.split("\n");
            rows.forEach((row) => {
                const splitRow = row.toLowerCase().split(",");
                const word = splitRow[0];
                const frequency = splitRow[1];

                const wordPrefix: string = word.slice(0, 3);
                const newWord = `${word}#${frequency}`;

                let wordArray = wordBank[wordPrefix];
                if (wordArray) {
                    wordArray.push(newWord);
                    wordArray.sort();
                    wordBank[wordPrefix] = wordArray;
                } else {
                    wordBank[wordPrefix] = [newWord];
                }

            })
        } catch (error) {
            console.error("Error reading the word bank:", error);
        }

        // const numberOfKeys = Object.keys(wordBank).length;

        return wordBank;
    }

    static checkWords(
        words: string[],
        wordBank: Record<string, string[]>
    ): WordModel[] {
        const results: WordModel[] = [];

        for (const word of words) {
            const prefix = word.slice(0, 3); // Extract the first 3 characters as the prefix
            const sortedArray = wordBank[prefix];

            if (sortedArray) {
                const wordAndFrequency = this.binarySearchWord(sortedArray, word);

                if (wordAndFrequency) {
                    const splits = wordAndFrequency.split("#");
                    const wordString = splits[0];
                    const frequency = parseInt(splits[1], 10);

                    if (frequency > -1) {
                        const newWordModel: WordModel = {
                            id: wordString,
                            word: wordString,
                            score: frequency,
                        };
                        results.push(newWordModel);
                    }
                }
            }
        }

        return results;
    }

    static binarySearchWord(sortedArray: string[], word: string): string | null {
        let left = 0;
        let right = sortedArray.length - 1;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const midElement = sortedArray[mid];

            const midWord = midElement.split("#")[0];

            if (midWord === word) {
                return midElement;
            } else if (midWord < word) {
                left = mid + 1; 
            } else {
                right = mid - 1; 
            }
        }

        return null;
    }

    static fetchWordModelByWord(
        word: string,
        wordBank: Record<string, string[]>
    ): WordModel | null {
        const wordModels = this.checkWords([word], wordBank);
        return wordModels.length > 0 ? wordModels[0] : null;
    }
}