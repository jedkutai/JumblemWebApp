export interface PartialWordModel {
    id: string;            // Unique identifier for the partial word
    partialWord: string;   // The partial word string
    validLetters: string[]; // Array of valid letters that can complete the word
}
