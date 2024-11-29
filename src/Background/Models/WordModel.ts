export interface WordModel {
    id: string;            // Unique identifier for the word
    word: string;          // The word itself
    score: number;         // Score associated with the word
    definitions?: string[]; // Optional array of definitions
}
