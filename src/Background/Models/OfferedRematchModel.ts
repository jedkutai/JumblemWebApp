import { Timestamp } from 'firebase/firestore';

export interface OfferedRematchModel {
    id: string;          // Unique identifier for the rematch offer
    gameId: string;      // ID of the associated game
    senderId: string;    // ID of the user who sent the rematch offer
    receiverId: string;  // ID of the user who received the rematch offer
    timestamp: Timestamp; // Timestamp of when the offer was created (optional for default initialization)
}
