import logo from "../../../assets/instagram.png";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";

export default function InstagramIcon() {
    const { minDimension } = useWindowSize();
    const style = {
        maxWidth: `${Math.min(minDimension / 10, 50)}px`,
        maxHeight: `${Math.min(minDimension / 10, 50)}px`,
    };
    return (
        <img src={logo} alt="Instagram Logo" style={style} />
    );
}