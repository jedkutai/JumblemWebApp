import { GameModel, MoveModel, UserModel } from "../../../../Background/Models";

interface CasualLetterGeneratorProps {
    user: UserModel;
    game: GameModel;
    letters: string[];
    setLetters: (letters: string[]) => void;
    wordCheckComplete: boolean;
    moves: Record<string, MoveModel>;
    selectedBlock: string;
    setSelectedBlock: (selectedBlock: string) => void;
    yourTurn: boolean;
    blockDimension: number;
}

export default function CasualLetterGenerator({
    user,
    game,
    letters,
    setLetters,
    wordCheckComplete,
    moves,
    selectedBlock,
    setSelectedBlock,
    yourTurn,
    blockDimension
}: CasualLetterGeneratorProps) {

}