import logo from "../../../assets/tiktok.png";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";

export default function TikTokIcon() {
    const { minDimension } = useWindowSize();
    const style = {
        maxWidth: `${Math.min(minDimension / 10, 50)}px`,
        maxHeight: `${Math.min(minDimension / 10, 50)}px`,
    };
    return (
        <img src={logo} alt="TikTok Logo" style={style} />
    );
}