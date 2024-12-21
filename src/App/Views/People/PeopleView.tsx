import { useEffect, useState } from "react";
import { UserModel } from "../../../Background/Models";
import { FetchService } from "../../../Background/Service";
import { HStack, View, VStack } from "../../../ReactSwiftly";
import { Button, CircularProgress, Typography } from "@mui/material";
import ProfileHeader from "../../Components/ProfileHeader";
import JumblemLogoSimple from "../../Components/JumblemLogoSimple";
import { useNavigate } from "react-router-dom";

interface PeopleViewProps {
    passedUser: UserModel;
}

enum ViewState {
    loading,
    loaded,
    failure
}

export default function PeopleView({ passedUser }: PeopleViewProps) {
    const [followedUsers, setFollowedUsers] = useState<UserModel[]>([]);
    const [viewState, setViewState] = useState<ViewState>(ViewState.loading);
    const navigate = useNavigate();

    useEffect(() => {
        onAppearActions();
    }, []);

    async function onAppearActions() {
        setViewState(ViewState.loading);
        try {
            const follows = await FetchService.fetchFollowedUsers(passedUser);
            let fetchedUsers: UserModel[] = [];
            for (const follow of follows) {
                const user = await FetchService.fetchUserByUid(follow.userToFollowId);
                fetchedUsers.push(user);
            }
            fetchedUsers.sort((a, b) => b.standardRating - a.standardRating);
            setFollowedUsers(fetchedUsers);
            setViewState(ViewState.loaded);
        } catch {
            setViewState(ViewState.failure);
        }
    }

    return (
        <View>
            <VStack>
                <Button onClick={() => navigate("/home")}>
                    <JumblemLogoSimple />
                </Button>

                {viewState === ViewState.loading && (
                    <CircularProgress sx={{ color: "black" }}/>
                )}
                {viewState === ViewState.failure && (
                    <Button color="error" variant="contained" onClick={onAppearActions}>
                        Reload
                    </Button>
                )}
                {viewState === ViewState.loaded && (
                    <>
                        {followedUsers.map((user, index) => (
                            <HStack key={index}>
                                <Typography style={{ color: "gray", width: "50px", fontWeight: "bolder" }}>{index + 1}</Typography>

                                <Button onClick={() => navigate(`/people/${user.username}`)}>
                                    <ProfileHeader passedUser={user} />
                                </Button>
                            </HStack>
                        ))}

                        <Button variant="text" color="primary" onClick={() => navigate("/findpeople")}>
                            {followedUsers.length === 0 ? "Find People" : "Find More People"}
                        </Button>
                    </>
                )}
            </VStack>
        </View>
    );

}

