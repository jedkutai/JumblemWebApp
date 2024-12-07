import { useEffect, useState } from "react";
import { PartialWordModel, UserModel, WordModel } from "../../../Background/Models";
import { FetchService } from "../../../Background/Service";
import { HStack, View, VSpacer, VStack } from "../../../ReactSwiftly";
import DisplayPartialWord from "../../Components/DisplayPartialWord";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";
import { Button, CircularProgress } from "@mui/material";
import { ColoredWord } from "../../Components";

interface WordTrainerViewProps {
    passedUser: UserModel;
}

export default function WordTrainerView({ passedUser }: WordTrainerViewProps) {
    const [partialWord, setPartialWord] = useState<PartialWordModel | null>(null);
    const [guess, setGuess] = useState("");
    const [incorrectGuesses, setIncorrectGuesses] = useState(0);

    const [allLetterGuesses, setAllLetterGuesses] = useState<string[]>([]);
    const [correctAnswers, setCorrectAnswers] = useState<WordModel[]>([]);
    const [correctLetterGuesses, setCorrectLetterGuesses] = useState<string[]>([]);
    const [fullWords, setFullWords] = useState<WordModel[]>([]);
    const [incorrectLetterGuesses, setIncorrectLetterGuesses] = useState<string[]>([]);
    const [giveUp, setGiveUp] = useState(false);
    const [failure, setFailure] = useState(false);
    const [updatedStreak, setUpdatedStreak] = useState(false);
    const { minDimension } = useWindowSize();
    const dimensionDivider = 9 * 1.75;
    const upperBound = 650;
    useEffect(() => {
        fetchNewWord();
    }, []);

    useEffect(() => {
        onChangeOfGuess();
    }, [guess]);

    async function onChangeOfGuess() {
        if (guess.length > 0) {
            setAllLetterGuesses([...allLetterGuesses, guess.toUpperCase()]);
            if (!correctLetterGuesses.includes(guess)) {
                if (partialWord !== null) {
                    if (partialWord.validLetters.includes(guess)) {
                        const fullWord = partialWord.partialWord.replaceAll("_", guess);
                        try {
                            const fetchedWord = await FetchService.fetchWordModelByWord(fullWord);
                            setCorrectAnswers([fetchedWord, ...correctAnswers]);
                            setCorrectLetterGuesses([...correctLetterGuesses, guess]);
                        } catch {
                            console.error("Failed to fetch word model");
                        }
                    } else {
                        setIncorrectGuesses(incorrectGuesses + 1);
                        setIncorrectLetterGuesses([...incorrectLetterGuesses, guess]);
                    }
                }
            }

        }
    }

    async function fetchNewWord() {
        setPartialWord(null);
        setFailure(false);
        setGiveUp(false);
        setUpdatedStreak(false);
        setIncorrectGuesses(0);
        setGuess("");

        setAllLetterGuesses([]);
        setCorrectAnswers([]);
        setCorrectLetterGuesses([]);
        setFullWords([]);
        setIncorrectLetterGuesses([]);

        const randomInt = Math.floor(Math.random() * 247116) + 1;

        try {
            const fetchedPartialWord = await FetchService.fetchPartialWord(String(randomInt));
            if (fetchedPartialWord === null) {
                setFailure(true);
            } else {
                setPartialWord(fetchedPartialWord);
            }
        } catch {
            console.error(`Failed (${randomInt})`);
            setFailure(true);
        }
    }

    function stillGuessing(): boolean {
        if (partialWord !== null) {
            return incorrectGuesses < 3 && !giveUp && correctAnswers.length < partialWord.validLetters.length;
        }
        return false;
    }

    function stillMissingLetters(): boolean {
        if (partialWord !== null) {
            return correctAnswers.length < partialWord.validLetters.length;
        }
        return false;
    }

    return (
        <View>
            <VStack>
                {partialWord && (
                    <>
                        <DisplayPartialWord partialWord={partialWord} blockDismension={Math.max(minDimension, upperBound) / dimensionDivider} />
                        <VSpacer />
                        <HStack>
                            {correctAnswers.map((word, index) => (
                                <ColoredWord key={index} word={word} />
                            ))}
                        </HStack>
                        <VSpacer />
                    </>
                )}

                {partialWord == null && failure && (
                    <Button onClick={() => fetchNewWord()}>
                        Click to Reload
                    </Button>
                )}

                {partialWord == null && !failure && (
                    <CircularProgress />
                )}
            </VStack>
        </View>
    );

}