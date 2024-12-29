import { useEffect, useRef } from "react";

declare global {
    interface Window {
        onYouTubeIframeAPIReady: () => void;
        //@ts-expect-error Missing type definitions for this module
        YT;
    }
}


interface Stream {
    id: string;
    extractedId: string;
    smallImg: string;
    title: string;
    url: string;
    active: boolean;
}

interface Props {
    streams: Stream[]
}

export default function Player({ streams }: Props) {
    //@ts-expect-error Missing type definitions for this module
    const playerRef = useRef<YT.Player | null>(null);
    const currentStreamIndex = useRef(0);

    useEffect(() => {
        // Load the YouTube IFrame Player API once 
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        // Initialize the YouTube player
        window.onYouTubeIframeAPIReady = () => {
            playerRef.current = new window.YT.Player('player', {
                videoId: streams[currentStreamIndex.current]?.extractedId,
                events: {
                    'onStateChange': onPlayerStateChange
                }
            });
        };
    }, []);

    useEffect(() => {
        if (playerRef.current && streams.length > 0) {
            // Update the video when the streams array changes
            playerRef.current.loadVideoById(streams[currentStreamIndex.current].extractedId);
        }
    }, [streams]);

    //@ts-expect-error Missing type definitions for this module
    const onPlayerStateChange = (event: YT.OnStateChangeEvent) => {
        if ((event.data === window.YT.PlayerState.ENDED) && (currentStreamIndex.current != streams.length - 1)) {
            // Play the next video when the current video ends
            currentStreamIndex.current = currentStreamIndex.current + 1;
            playerRef.current.loadVideoById(streams[currentStreamIndex.current].extractedId);
        }
    };
    function prevHandler() {
        if (currentStreamIndex.current > 0) {
            currentStreamIndex.current = currentStreamIndex.current - 1;
            playerRef.current.loadVideoById(streams[currentStreamIndex.current].extractedId);
        }
    }
    function nextHandler() {
        if (currentStreamIndex.current != streams.length - 1) {
            currentStreamIndex.current = currentStreamIndex.current + 1;
            playerRef.current.loadVideoById(streams[currentStreamIndex.current].extractedId);
        }
    }
    return (
        <div>
            <div id="player"></div>
            <button className="border-gray-500 border-2" onClick={() => prevHandler()}>Play Before</button>
            <button className="border-gray-500 border-2" onClick={() => nextHandler()}>Play Next</button>
        </div>
    );
}