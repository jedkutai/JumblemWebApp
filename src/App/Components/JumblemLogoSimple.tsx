import jumblemLogoSimpleImage from "../../assets/jumblem_logo_simple.png";
import { useWindowSize } from "../../Background/Utils/useWindowSize";

export default function JumblemLogoSimple() {
    const { minDimension } = useWindowSize();
    const style = {
        maxWidth: `${Math.min(minDimension / 3, 300)}px`,
        maxHeight: `${Math.min(minDimension / 3, 200)}px`,
        marginBottom: "20px",
    };

    return (
        <img src={jumblemLogoSimpleImage} alt="Jumblem Logo" style={style} />
    );
}