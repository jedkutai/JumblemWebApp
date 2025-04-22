import { useEffect, useState } from "react";
import { DailyPuzzleEntryModel } from "../../Background/Models";
import { FetchService } from "../../Background/Service";
import TopThreeEntryPreview from "./TopThreeEntryPreview";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useWindowSize } from "../../Background/Utils/useWindowSize";

export default function YesterdaysTopThree() {
    const [leaderboard, setLeaderboard] = useState<DailyPuzzleEntryModel[]>([]);
    const { minDimension } = useWindowSize();
    const styles = {
        section: {
            backgroundImage:
                "linear-gradient(to bottom right, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.05))",
            borderRadius: "15px",
            border: "3px solid rgba(0, 0, 0, 0.1)",
            padding: "20px",
            marginBottom: "20px",
            width: "100%",
            maxWidth: `${Math.min(400, minDimension * 0.8)}px`,
        },
        sectionTitle: {
            fontWeight: "bold" as const,
            fontSize: "1.5rem",
            marginBottom: "10px",
            textAlign: "center" as const,
        },
    }

    async function onAppearActions() {
        try {
            const fetchedPuzzle = await FetchService.fetchYesterdaysDailyPuzzle();
            if (fetchedPuzzle) {
                const fetchedLeaderboard = await FetchService.fetchLeaderboard(fetchedPuzzle, 3);
                if (fetchedLeaderboard) {
                    setLeaderboard(fetchedLeaderboard);
                }
            }
        } catch {

        }
    }
    useEffect(() => {
        onAppearActions();
    }, []);

    if (leaderboard.length == 3) {
        return (
            <Box style={styles.section}>
                <Typography style={styles.sectionTitle}>Yesterday's Top 3</Typography>
                <TopThreeEntryPreview position={1} entry={leaderboard[0]} />
                <div style={{height: "10px"}}></div>
                <TopThreeEntryPreview position={2} entry={leaderboard[1]} />
                <div style={{height: "10px"}}></div>
                <TopThreeEntryPreview position={3} entry={leaderboard[2]} />
            </Box>
        );
    } else {
        return (<CircularProgress sx={{ color: "black" }} />)
    }
}