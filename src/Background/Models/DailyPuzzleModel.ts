import { Timestamp } from 'firebase/firestore';

export interface DailyPuzzleModel {
    id: string;
    signature: string;
    letterBank: string[];
    title?: string;
    timestamp: Timestamp
}