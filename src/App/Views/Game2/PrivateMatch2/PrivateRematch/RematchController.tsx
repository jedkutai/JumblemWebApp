import { GameModel, UserModel } from "../../../../../Background/Models";
import JoinPrivateRematchView from "./JoinPrivateRematchView";
import StartPrivateRematchView from "./StartPrivateRematchView";

interface RematchControllerProps {
    passedUser: UserModel;
    previousGame: GameModel;
    timeOffset: number;
}

export default function RematchController({
    passedUser,
    previousGame,
    timeOffset
}: RematchControllerProps) {
    if (previousGame.playerOneId == passedUser.id) {
        return (
            <JoinPrivateRematchView
                passedUser={passedUser}
                previousGame={previousGame}
                timeOffset={timeOffset}
            />);
    } else {
        return (
            <StartPrivateRematchView
                passedUser={passedUser}
                previousGame={previousGame}
                timeOffset={timeOffset}
            />);
    }
}