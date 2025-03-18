import { FieldValue, Timestamp } from 'firebase/firestore';

export interface GameModel {
    id: string;                  // Unique identifier for the game
    gameMode: string;            // "standard" (rated) or "casual"

    playerOneId: string;         // ID of the first player
    playerOneRating: number;     // Rating of the first player

    playerTwoId?: string;        // ID of the second player (optional)
    playerTwoRating?: number;    // Rating of the second player (optional)
    winner?: string;             // Winner's ID, "draw", or "aborted" (optional)
    winningWords?: string[];     // Array of words contributing to the win (optional)
    winningCoordinates?: string[]; // Array of coordinates for the winning move (optional)
    playerOneRatingChange?: number; // Rating change for player one (optional)
    playerTwoRatingChange?: number; // Rating change for player two (optional)
    playerOneLetterBank?: string[];
    playerTwoLetterBank?: string[];
    matchFound: boolean;        // Indicates if a match was found
    timestamp: Timestamp | FieldValue;       // Timestamp of the game (optional for default initialization)
}
