import { Button } from "@mui/material";
import { useWindowSize } from "../../Background/Utils/useWindowSize";
import { HStack } from "../../ReactSwiftly";
import { FaRegCircleQuestion } from "react-icons/fa6";

interface HowToPlayHeaderProps {
    versus: boolean;
}
export default function HowToPlayHeader({ versus }: HowToPlayHeaderProps) {
    const { minDimension } = useWindowSize();
    const dimensionDivider = 9 * 1.75;
    const upperBound = 650;

    function openHowToDailyPuzzle() {
        window.open("https://youtu.be/_V9frMe_Obo?feature=shared", "_blank");
    }

    function openHowToVersus() {
        window.open("https://youtu.be/DvVO0vc1LQw?feature=shared", "_blank");
    }

    function action() {
        if (versus) {
            openHowToVersus();
        } else {
            openHowToDailyPuzzle();
        }
    }

    return (
        <HStack width={`${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`}>
            <div style={{ width: "100%" }}></div>
            <Button onClick={action} style={{ color:"black"}}>
                <FaRegCircleQuestion size={25} />
            </Button>
        </HStack>
    )
}