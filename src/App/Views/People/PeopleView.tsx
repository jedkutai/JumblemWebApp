import { useEffect, useState } from "react";
import { UserModel } from "../../../Background/Models";
import { FetchService } from "../../../Background/Service";

interface PeopleViewProps {
    passedUser: UserModel;
}

enum ViewState {
    loading,
    loaded,
    failure
}

export default function PeopleView({passedUser}: PeopleViewProps) {
    const [followedUsers, setFollowedUsers] = useState<UserModel[]>([]);
    const [viewState, setViewState] = useState<ViewState>(ViewState.loading);

    useEffect(() => {
        onAppearActions();
    }, []);

    async function onAppearActions() {
        try {
            const follows = await FetchService.fetchFollowedUsers(passedUser);
            let fetchedUsers: UserModel[] = [];
            for (const follow of follows) {
                const user = await FetchService.fetchUserByUid(follow.userToFollowId);
                fetchedUsers.push(user);
            }
            fetchedUsers.sort((a, b) => a.standardRating - b.standardRating);
            setFollowedUsers(fetchedUsers);
        } catch {

        }
    }
}

