import logo from "../../../assets/discord.png";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";

export default function DiscordIcon() {
    const { minDimension } = useWindowSize();
    const style = {
        maxWidth: `${Math.min(minDimension / 10, 50)}px`,
        maxHeight: `${Math.min(minDimension / 10, 50)}px`,
    };
    return (
        <img src={logo} alt="Discord Logo" style={style} />
    );
}