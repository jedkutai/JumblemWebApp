import { useState } from "react";
import { GameModel, UserModel } from "../../../Background/Models";

interface ProfileViewProps {
    passedUser: UserModel;
}

enum ViewState {
    loading,
    loaded,
    failure
}

export default function ProfileView({passedUser}: ProfileViewProps) {
    const [games, setGames] = useState<GameModel[]>([]);
    const [viewState, setViewState] = useState<ViewState>(ViewState.loading);
}