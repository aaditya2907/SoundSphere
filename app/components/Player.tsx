import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import playNext from "../assets/playNext.svg"
import playPrev from "../assets/playPrev.svg"
import play from "../assets/play.svg"
import pause from "../assets/pause.svg"

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
    const [isPlayingState, setIsPlayingState] = useState(false);
    const isPlaying = useRef(false);

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
                },
                playerVars: {
                    controls: 0,        // Hide controls
                    disablekb: 1,      // Disable keyboard controls
                    modestbranding: 1, // Hide YouTube logo
                    rel: 0,            // Hide related videos
                    showinfo: 0,       // Hide video title
                    iv_load_policy: 3  // Hide video annotations
                }
            });
        };
    }, []);

    // useEffect(() => {
    //     if (playerRef.current && streams.length > 0) {
    //         // Update the video when the streams array changes
    //         playerRef.current.loadVideoById(streams[currentStreamIndex.current].extractedId);
    //     }
    // }, [streams]);

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
    function playHandler() {
        if (!playerRef.current) return;

        if (isPlaying.current) {
            playerRef.current.pauseVideo();
            isPlaying.current = false;
            setIsPlayingState(false)
        } else {
            playerRef.current.playVideo();
            isPlaying.current = true;
            setIsPlayingState(true)
        }
    }
    return (
        <div className="mb-2 bg-violet-400 rounded-md shadow-md">
            <div className="relative">
                <div id="player" className="w-full h-96 pointer-events-none" ></div>
                <div className="absolute inset-0" /> {/* Overlay to prevent interaction */}
            </div>
            <div className="my-2 h-10 flex justify-center">
                <button className="mx-2" onClick={() => prevHandler()}>
                    <Image
                        src={playPrev}
                        alt="Play Next"
                        width={30} />
                </button>
                <button className="w-10" onClick={() => playHandler()}>
                    <div className="transition-all duration-400 ease-in-out">
                        {isPlayingState ?
                            <Image
                                src={pause}
                                alt={"Pause"}
                                width={40}
                                className="transform scale-100 hover:scale-110"
                            /> :
                            <Image
                                src={play}
                                alt={"Play"}
                                width={30}
                                className="transform scale-100 hover:scale-110 translate-x-1"
                            />}
                    </div>
                </button>
                <button className="mx-2" onClick={() => nextHandler()}>
                    <Image
                        src={playNext}
                        alt="Play Next"
                        width={30} />
                </button>
            </div>
        </div>
    );
}