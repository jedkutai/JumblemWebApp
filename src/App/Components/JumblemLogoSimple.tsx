
import jumblemLogoSimpleImage from "../../assets/drawingexportresize.png";
import { useWindowSize } from "../../Background/Utils/useWindowSize";

export default function JumblemLogoSimple() {
    const { minDimension } = useWindowSize();
    const style = {
        maxWidth: `${Math.min(minDimension / 3, 300)}px`,
        maxHeight: `${Math.min(minDimension / 3, 200)}px`,
        marginBottom: `${Math.min(minDimension / 3, 200)/10}px`,
    };
    // const style = {
    //     maxWidth: "300px",
    //     maxHeight: "200px",
    //     margin: "20px",
    // };

    return (
        <img src={jumblemLogoSimpleImage} alt="Jumblem Logo" style={style} />
    );
}