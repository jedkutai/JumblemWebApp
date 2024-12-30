import logo from "../../../assets/appstore.png";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";

export default function AppStoreIcon() {
    const { minDimension } = useWindowSize();
    const style = {
        maxWidth: `${Math.min(minDimension / 10, 50)}px`,
        maxHeight: `${Math.min(minDimension / 10, 50)}px`,
    };
    return (
        <img src={logo} alt="App Store Logo" style={style} />
    );
}