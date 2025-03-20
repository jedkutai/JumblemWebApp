import { useWindowSize } from "../../../../Background/Utils/useWindowSize";
import { VStack } from "../../../../ReactSwiftly";
import { DimLetterBlock, WhiteLetterBlock } from "../../../Components";

interface SpectateGameLetterBankProps {
    playerTurnId: string;
    playerId: string | undefined;
    letters: string[] | undefined;
}
export default function SpectateGameLetterBank({
    playerTurnId,
    playerId,
    letters
}: SpectateGameLetterBankProps) {
    const { minDimension } = useWindowSize();
    const dimensionDivider = 9 * 1.75;
    const upperBound = 650;
    const blockDimension = Math.max(minDimension, upperBound) / dimensionDivider;

    const noLetters = ["-", "-", "-", "-", "-", "-", "-"]
    return (
        <VStack
            spacing="0px"
            height={`${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`}
        >
            {letters ? (
                <>
                {letters.map((letter, index) => (
                    <div key={index}>
                        {(playerId && playerTurnId && playerId == playerTurnId) ? (
                            <DimLetterBlock letter={letter} blockDimension={blockDimension} />
                        ) : (
                            <WhiteLetterBlock letter={letter} blockDimension={blockDimension} />
                        )}
                    </div>
                ))}
                </>
            ) : (
                <>
                {noLetters.map((letter, index) => (
                    <div key={index}>
                        {(playerId && playerTurnId && playerId == playerTurnId) ? (
                            <DimLetterBlock letter={letter} blockDimension={blockDimension} />
                        ) : (
                            <WhiteLetterBlock letter={letter} blockDimension={blockDimension} />
                        )}
                    </div>
                ))}
                </>
            )}
        </VStack>
    )
}