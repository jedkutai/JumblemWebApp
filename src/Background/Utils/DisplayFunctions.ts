import { FieldValue, Timestamp } from "firebase/firestore";

export class DisplayFunctions {

    static displayUsername(usernameDisplayed?: string): string {
        let username = usernameDisplayed ?? "N/A";
        let result = username;
        if (username.length > 10) {
            result = username.slice(0, 8) + "...";
        }

        return result;
    }

    static displayUserDate(time: Timestamp): string {
        const creationDate = new Date(time.toDate());
        return creationDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    }

    static displayPuzzleDate(time: Timestamp): string {
        const puzzleDate = new Date(time.toDate());
        return puzzleDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    }

    static displayPuzzleDateShort(time: Timestamp): string {
        const puzzleDate = new Date(time.toDate());
        return puzzleDate.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" });
    }

    static displayGameDate(time: Timestamp | FieldValue): string {
        const correctTime = time as Timestamp;
        if (correctTime) {
            const gameDate = new Date(correctTime.toDate());
            return gameDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
        }
        return "-";
        
    }

    static nextPuzzleDate(time: Timestamp): string {
        const nextPuzzleDate = new Date(time.toDate());
        nextPuzzleDate.setHours(nextPuzzleDate.getHours() + 24);
        return nextPuzzleDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" });
    }

    static longDate(date: Date): string {
        return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" });
    }
}