import { Timestamp } from 'firebase/firestore';

export interface DailyPuzzleEntryModel {
    id: string;         // Unique identifier
    puzzleId: string;   // Identifier for the puzzle
    userId: string;     // Identifier for the user
    signature: string;  // Some kind of signature for validation
    score: number;      // Score for the entry
    words: string[];    // List of words
    timestamp: Timestamp; // Timestamp of the entry (optional to allow defaults)
}
