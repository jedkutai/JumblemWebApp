import { Button } from "@mui/material";
import { MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { HStack } from "../../../ReactSwiftly";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";

interface PreviousGameFunctionBarProps {
    goToFirstMove: () => void;
    goToLastMove: () => void;
    goToNextMove: () => void;
    goToPreviousMove: () => void;
}

export default function PreviousGameFunctionBar({
    goToFirstMove,
    goToLastMove,
    goToNextMove,
    goToPreviousMove,
}: PreviousGameFunctionBarProps) {

    const styles = {
        button: {
            color: "black"
        }
    }
    const dimensionDivider = 9 * 2;
    const upperBound = 650;
    const { minDimension } = useWindowSize();
    const iconDimension = Math.max(minDimension, upperBound) / dimensionDivider
    return (
        <HStack>
            <Button sx={styles.button} onClick={goToFirstMove}>
                <MdOutlineKeyboardDoubleArrowLeft size={iconDimension} />
            </Button>
            <Button sx={styles.button} onClick={goToPreviousMove}>
                <MdOutlineKeyboardArrowLeft size={iconDimension} />
            </Button>
            <Button sx={styles.button} onClick={goToNextMove}>
                <MdOutlineKeyboardArrowRight size={iconDimension} />
            </Button>
            <Button sx={styles.button} onClick={goToLastMove}>
                <MdOutlineKeyboardDoubleArrowRight size={iconDimension} />
            </Button>

        </HStack>
    )
}