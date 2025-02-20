import { Timestamp } from "firebase/firestore";
import { WordModel } from "../../Background/Models";
import { format } from 'date-fns-tz';
import { Button } from "@mui/material";
import { IoShareOutline } from "react-icons/io5";
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
            switch (words[key][0].score) {
                case (1): {
                    legendaryCount++;
                    score += 100 * words[key][1];
                    break;
                }
                case (2): {
                    rareCount++;
                    score += 75 * words[key][1];
                    break;
                }
                case (3): {
                    uncommonCount++;
                    score += 50 * words[key][1];
                    break;
                }
                case (4): {
                    commonCount++;
                    score += 25 * words[key][1];
                    break;
                }
            }

        }

        const shareText = `Jumblem ${joinedDate}\n🟥LEGENDARY x${legendaryCount}\n🟪RARE x${rareCount}\n⬛️UNCOMMON x${uncommonCount}\n⬜️COMMON x${commonCount}\n${link}\nScore: ${score}`;
        try {
            await navigator.clipboard.writeText(shareText);
            alert('Score copied to clipboard!');
        } catch (error) {

        }
    };

    return (
        <Button onClick={shareLinkItem}>
            <IoShareOutline size={25} color="gray" />

        </Button>
    );
};
