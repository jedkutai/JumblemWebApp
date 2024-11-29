import { Timestamp } from 'firebase/firestore';

export interface FollowModel {
    id: string;               // Unique identifier for the follow entry
    userId: string;           // ID of the user who is following
    userToFollowId: string;   // ID of the user being followed
    timestamp: Timestamp;    // Timestamp for when the follow occurred (optional for default initialization)
}
