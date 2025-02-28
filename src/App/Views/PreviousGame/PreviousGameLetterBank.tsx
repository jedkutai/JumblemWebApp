import { MoveModel } from "../../../Background/Models";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";
import { HStack } from "../../../ReactSwiftly";

interface PreviousGameLetterBankProps {
    lastMove: MoveModel | undefined;
    blockDimension: number;
}

export default function PreviousGameLetterBank({ lastMove, blockDimension }: PreviousGameLetterBankProps) {
    const { minDimension } = useWindowSize();
    const dimensionDivider = 9 * 1.75;
    const upperBound = 650;

    const chosenIndex = lastMove ? lastMove.letterBank.sort().indexOf(lastMove.letter) : -1

    const styles = {
        black: {
            width: `${blockDimension}px`,
            height: `${blockDimension}px`,
            margin: `${blockDimension / 20}px`,
            borderRadius: "5px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "white",   // Optional: Border style
            fontSize: `${blockDimension / 2}px`, // Dynamically scale font size
            fontWeight: "bold",
            color: "black",
        },
        gray: {
            width: `${blockDimension}px`,
            height: `${blockDimension}px`,
            margin: `${blockDimension / 20}px`,
            borderRadius: "5px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "white",   // Optional: Border style
            fontSize: `${blockDimension / 2}px`, // Dynamically scale font size
            fontWeight: "bold",
            color: "gray",
        }
    }

    if (lastMove) {
        return (
            <HStack
                spacing="0px"
                width={`${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`}
            >
                {lastMove?.letterBank.map((letter, index) =>(
                    <div key={index} style={index == chosenIndex ? styles.black : styles.gray}>
                        {letter.toUpperCase()}
                    </div>
                    
                ))}
            </HStack>
        )
    }
}