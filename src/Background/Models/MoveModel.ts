import { FieldValue, Timestamp } from 'firebase/firestore';

export interface MoveModel {
    id: string;            // Unique identifier for the move
    gameId: string;        // ID of the associated game
    userId: string;        // ID of the user who made the move
    coordinates: string;   // Coordinates of the move on the grid
    letter: string;        // Letter played in the move
    number: number;
    timestamp: Timestamp | FieldValue; // Timestamp of when the move was made (optional for default initialization)
    letterBank: string[];
}
