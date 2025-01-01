import { Timestamp } from "firebase/firestore";
import { WordModel } from "../../Background/Models";
import { format } from 'date-fns-tz';
import { Button } from "@mui/material";
import ShareIcon from "./SiteIcons/ShareIcon";
// import { useState } from "react";

interface SharePuzzleResultsButtonProps {
    date: Timestamp;
    words: Record<string, [WordModel, number]>;

}

export default function SharePuzzleResultsButton({ date, words }: SharePuzzleResultsButtonProps) {
    const link = "www.jumblem.com/dailypuzzle";
    // const [codeCopied, setCodeCopied] = useState(false);

    function formattedDate(timestamp: Date): string {
        const puzzleStart = getPuzzleStartTime(timestamp) ?? timestamp;
        return format(puzzleStart, 'MM.dd.yyyy', { timeZone: 'America/New_York' });
    };

    function getPuzzleStartTime(timestamp: Date): Date {
        // Define the puzzle start time as 3 AM EST
        const baseDate = new Date(timestamp);

        return baseDate;
    };

    async function shareLinkItem() {
        let score = 0;
        let legendaryCount = 0;
        let rareCount = 0;
        let uncommonCount = 0;
        let commonCount = 0;

        let joinedDate = formattedDate(date.toDate());

        for (const key in words) {
            if (words[key][0].score >= 3469832) {
                commonCount++;
                score += 25 * words[key][1];
            } else if (words[key][0].score >= 433133) {
                uncommonCount++;
                score += 50 * words[key][1];
            } else if (words[key][0].score >= 94965) {
                rareCount++;
                score += 75 * words[key][1];
            } else {
                legendaryCount++;
                score += 100 * words[key][1];
            }

        }

        const shareText = `Jumblem ${joinedDate}\n🟥x${legendaryCount}\n🟪x${rareCount}\n⬛️x${uncommonCount}\n⬜️x${commonCount}\n${link}\nScore: ${score}`;
        try {
            await navigator.clipboard.writeText(shareText);
            alert('Score copied to clipboard!');
        } catch (error) {

        }
    };

    return (
        <Button onClick={shareLinkItem}>
            <ShareIcon />
        </Button>
    );
};
