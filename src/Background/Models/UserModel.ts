import { Timestamp } from 'firebase/firestore';

export interface UserModel {
    id: string;                    // Unique identifier for the user
    email: string;                 // User's email address

    username?: string;             // Optional username
    usernameDisplayed?: string;    // Optional displayed username

    lastPuzzlePlayedId?: string;   // ID of the last puzzle the user played
    lastPuzzleCompletedId?: string; // ID of the last puzzle the user completed

    flair?: string;                // Optional flair for the user
    deviceLock?: Timestamp;        // Optional device lock timestamp

    standardRating: number;        // User's standard rating (default: 1500)

    timestamp: Timestamp;         // Timestamp of when the user was created (optional for default initialization)
}
