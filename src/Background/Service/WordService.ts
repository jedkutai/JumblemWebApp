import { getFirestore, collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { WordModel } from "../Models/WordModel"; // Import your WordModel

export class WordService {
  static async checkWords(words: string[]): Promise<WordModel[]> {
    const result: WordModel[] = [];
    const db = getFirestore();

    if (words.length > 0) {
      const division = words.length / 25;
      const iterations = Math.ceil(division);

      for (let i = 0; i < iterations; i++) {
        const start = i * 25;
        const end = start + 25;
        let subArray: string[];

        if (i === iterations - 1) {
          subArray = words.slice(start);
        } else {
          subArray = words.slice(start, end);
        }

        // Firestore query for the current batch
        const wordQuery = query(
          collection(db, "words"),
          where("word", "in", subArray),
          orderBy("word")
        );

        try {
          const snapshot = await getDocs(wordQuery);
          const retrievedWords: WordModel[] = snapshot.docs.map((doc) => {
            return { ...doc.data() } as WordModel;
          });

          result.push(...retrievedWords);
        } catch (error) {
        }
      }
    }

    return result;
  }
}
