import { useEffect, useState } from "react";
import { UserModel } from "../../../Background/Models";
import { View, VSpacer, VStack } from "../../../ReactSwiftly";
import { Button, TextField } from "@mui/material";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";
import { FetchService, SearchService } from "../../../Background/Service";
import { useNavigate } from "react-router-dom";
import FindPeopleSearchResult from "../../Components/FindPeopleSearchResult";
import JumblemLogoSimple from "../../Components/JumblemLogoSimple";

interface FindPeopleViewProps {
    passedUser: UserModel;
}

export default function FindPeopleView({ passedUser }: FindPeopleViewProps) {
    const [searchText, setSearchText] = useState<string>("");
    const { minDimension } = useWindowSize();
    const [followedUsers, setFollowedUsers] = useState<UserModel[]>([]);
    const [searchResults, setSearchResults] = useState<UserModel[]>([]);
    const [searchedDatabase, setSearchedDatabase] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);

    const navigate = useNavigate();

    const filteredResults: UserModel[] = searchResults.filter((user) => {
        if (user.id === passedUser.id) return false;
        return user.username?.toLowerCase().includes(searchText.toLowerCase());
    });

    useEffect(() => {
        updateFollowedUsers();
    }, []);

    useEffect(() => {
        if (refresh) {
            updateFollowedUsers();
        }
    }, [refresh]);

    useEffect(() => {
        onChangeOfSeachText();
    }, [searchText]);


    async function updateFollowedUsers() {
        try {
            const follows = await FetchService.fetchFollowedUsers(passedUser);
            let fetchedUsers: UserModel[] = [];
            for (const follow of follows) {
                const user = await FetchService.fetchUserByUid(follow.userToFollowId);
                fetchedUsers.push(user);
            }
            fetchedUsers.sort((a, b) => a.standardRating - b.standardRating);
            setFollowedUsers(fetchedUsers);
            setRefresh(false);
        } catch {
            navigate("/");
        }
    }

    async function onChangeOfSeachText() {
        if (!searchedDatabase && searchText.length == 3 && !searchText.includes(" ")) {
            setSearchedDatabase(true);
            try {
                const fetchedResults = await SearchService.searchDatabase(searchText);
                setSearchResults(fetchedResults);
            } catch (error) {
            }
        } else if (searchedDatabase && searchText.length < 3) {
            setSearchedDatabase(false);
        }
    }

    const styles = {
        textField: {
            marginBottom: '20px',
            width: '100%',
            maxWidth: `${Math.min(minDimension * 0.8, 400)}px`,
        },

        divider: {
            width: `${Math.min(minDimension * 0.8, 400)}px`,
            height: "3px",
            fill: "gray",
        }
    }

    return (
        <View>
            <VStack>
                <Button onClick={() => navigate("/home")}>
                    <JumblemLogoSimple />
                </Button>
                <TextField
                    label="Find People"
                    type="text"
                    variant="outlined"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={styles.textField}
                />

                {filteredResults.map((displayedUser) => (
                    <div key={displayedUser.id}>
                        <FindPeopleSearchResult
                            passedUser={passedUser}
                            displayedUser={displayedUser}
                            followedUsers={followedUsers}
                            refresh={refresh}
                            setRefresh={setRefresh}
                        />

                        <svg>
                            <rect style={styles.divider} />
                        </svg>
                    </div>
                ))}

                <VSpacer />
            </VStack>
        </View>
    )
}
