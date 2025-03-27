import { useEffect, useRef } from "react";
import { useWindowSize } from "../../Background/Utils/useWindowSize";

declare global {
    interface Window {
        Twitch: any;
    }
}

interface TwitchEmbedProps {
    channel: string;
}

export default function TwitchEmbed({ channel }: TwitchEmbedProps) {

    const { minDimension } = useWindowSize();
    const width: number = Math.min(400, minDimension * 0.8);
    const height: number = width * 378 / 620;

    const playerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (window.Twitch && window.Twitch.Player && playerRef.current) {
            new window.Twitch.Player(playerRef.current, {
                channel,
                width,
                // height,
                parent,
            });
        }
    }, [channel]);

    return (
        <iframe
            src={`https://player.twitch.tv/?channel=${channel}&parent=localhost&parent=jumblem.com`}
            height={height}
            width={width}
            allowFullScreen>

        </iframe>

    );
}