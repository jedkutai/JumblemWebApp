import { useState } from "react";
import { UserModel } from "../../Background/Models";
import { HSpacer, HStack } from "../../ReactSwiftly";
import { Button, Typography } from "@mui/material";
import { useWindowSize } from "../../Background/Utils/useWindowSize";
import { UserService } from "../../Background/Service";

interface FindPeopleSearchResultProps {
    passedUser: UserModel;
    displayedUser: UserModel;
    followedUsers: UserModel[];
    refresh: boolean;
    setRefresh: (refresh: boolean) => void;
}

export default function FindPeopleSearchResult({
    passedUser,
    displayedUser,
    followedUsers,
    refresh,
    setRefresh
}: FindPeopleSearchResultProps) {
    const [actionHappening, setActionHappening] = useState<boolean>(false);
    const [showRed, setShowRed] = useState<boolean>(false);
    const { minDimension } = useWindowSize();

    async function follow() {
        if (!refresh) {
            setActionHappening(true);
            try {
                await UserService.followUser(passedUser, displayedUser);
                setRefresh(true);
            } catch {

            }
            setActionHappening(false);
        }
    }

    async function unfollow() {
        if (!refresh) {
            setActionHappening(true);
            try {
                await UserService.unfollowUser(passedUser, displayedUser);
                setRefresh(true);
            } catch {

            }
            setActionHappening(false);
        }
    }

    return (
        <HStack width={`${Math.min(minDimension * 0.8, 400)}px`}>
            <Typography>{displayedUser.usernameDisplayed ?? "N/A"}</Typography>
            <Typography>{`(${displayedUser.standardRating})`}</Typography>

            <HSpacer />

            <HStack width={`${Math.min(minDimension * 0.2, 100)}px`}>
                {followedUsers.some((user) => user.id === displayedUser.id) ? (
                    <Button
                        variant="contained"
                        onMouseOver={() => setShowRed(true)}
                        onMouseOut={() => setShowRed(false)}
                        color={showRed ? "error" : "primary"}
                        onClick={unfollow}
                        disabled={actionHappening}>
                        {showRed ? "Unfollow" : "Following"}
                    </Button>
                ) : (
                    <Button variant="contained" color="primary" onClick={follow} disabled={actionHappening}>Follow</Button>
                )}
            </HStack>
        </HStack>
    );

}