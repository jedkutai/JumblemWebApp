import logo from "../../../assets/share.png";

export default function ShareIcon() {
    const style = {
        maxWidth: `30px`,
        maxHeight: `$30px`,
    };
    return (
        <img src={logo} alt="Share Icon" style={style} />
    );
}