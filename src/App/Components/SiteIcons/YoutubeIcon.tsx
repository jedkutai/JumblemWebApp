import logo from "../../../assets/youtube.png";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";

export default function YoutubeIcon() {
    const { minDimension } = useWindowSize();
    const style = {
        maxWidth: `${Math.min(minDimension / 10, 50)}px`,
        maxHeight: `${Math.min(minDimension / 10, 50)}px`,
    };
    return (
        <img src={logo} alt="Youtube Logo" style={style} />
    );
}