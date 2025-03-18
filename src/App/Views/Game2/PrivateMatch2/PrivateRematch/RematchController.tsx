import { GameModel, UserModel } from "../../../../../Background/Models";
import JoinPrivateRematchView from "./JoinPrivateRematchView";
import StartPrivateRematchView from "./StartPrivateRematchView";

interface RematchControllerProps {
    passedUser: UserModel;
    previousGame: GameModel;
}

export default function RematchController({
    passedUser,
    previousGame,
}: RematchControllerProps) {
    if (previousGame.playerOneId == passedUser.id) {
        return (
            <JoinPrivateRematchView
                passedUser={passedUser}
                previousGame={previousGame}
            />);
    } else {
        return (
            <StartPrivateRematchView
                passedUser={passedUser}
                previousGame={previousGame}
            />);
    }
}