import { useEffect, useState } from "react";
import { UserModel } from "../../../Background/Models";
import { FetchService } from "../../../Background/Service";
import { HStack, View, VStack } from "../../../ReactSwiftly";
import { Button, CircularProgress, Typography } from "@mui/material";
import ProfileHeader from "../../Components/ProfileHeader";
import JumblemLogoSimple from "../../Components/JumblemLogoSimple";
import { useNavigate } from "react-router-dom";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";

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
    const { height } = useWindowSize();

    const style = {
        button: {
            margin: "10px",
            flex: 1,
            backgroundColor: "rgb(227, 218, 195)",
            color: "black",
            fontWeight: 600,
        },
    }

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
        <View startAtTop={true}>
            <VStack>
                <Button onClick={() => navigate("/home")}>
                    <JumblemLogoSimple />
                </Button>

                {viewState === ViewState.loading && (
                    <CircularProgress sx={{ color: "black" }} />
                )}
                {viewState === ViewState.failure && (
                    <Button color="error" variant="contained" onClick={onAppearActions}>
                        Reload
                    </Button>
                )}
                {viewState === ViewState.loaded && (
                    <>
                        {followedUsers.length === 0 && (
                            <div
                                style={{
                                    height: `${height * 0.3}px`,
                                    visibility: "hidden", // Makes it invisible but keeps it in the layout
                                }}
                            ></div>
                        )}
                        {/* <Button variant="text" color="primary" onClick={() => navigate("/findpeople")}>
                            {followedUsers.length === 0 ? "Find People" : "Find More People"}
                        </Button> */}
                        <Button variant="contained" style={style.button} onClick={() => navigate("/findpeople")}>
                            {followedUsers.length === 0 ? "Find People" : "Find More People"}
                        </Button>

                        {followedUsers.map((user, index) => (
                            <HStack key={index}>
                                <Typography style={{ color: "gray", width: "50px", fontWeight: "bolder" }}>{index + 1}</Typography>

                                <Button onClick={() => navigate(`/people/${user.username}`)}>
                                    <ProfileHeader passedUser={user} />
                                </Button>
                            </HStack>
                        ))}


                    </>
                )}
            </VStack>
        </View>
    );

}

