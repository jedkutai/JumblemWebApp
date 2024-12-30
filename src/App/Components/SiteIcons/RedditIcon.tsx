import logo from "../../../assets/reddit.png";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";

export default function RedditIcon() {
    const { minDimension } = useWindowSize();
    const style = {
        maxWidth: `${Math.min(minDimension / 10, 50)}px`,
        maxHeight: `${Math.min(minDimension / 10, 50)}px`,
    };
    return (
        <img src={logo} alt="Reddit Logo" style={style} />
    );
}