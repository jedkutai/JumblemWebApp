import logo from "../../../assets/x.png";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";

export default function XIcon() {
    const { minDimension } = useWindowSize();
    const style = {
        maxWidth: `${Math.min(minDimension / 10, 50)}px`,
        maxHeight: `${Math.min(minDimension / 10, 50)}px`,
    };
    return (
        <img src={logo} alt="X Logo" style={style} />
    );
}