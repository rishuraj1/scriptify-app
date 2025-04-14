import { onStopRecording, selectSources, StartRecording } from "@/lib/recorder";
import { cn, videoRecordingTime } from "@/lib/utils";
import { Cast, Pause, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const StudioTray = () => {
    let initialTime = new Date();
    const [preview, setPreview] = useState(false);
    const [onTimer, setOnTimer] = useState<string>("00:00:00");
    const [count, setCount] = useState<number>(0);
    const [recording, setRecording] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const [onSources, setOnSources] = useState<
        | {
            screen: string;
            id: string;
            audio: string;
            preset: "HD" | "SD";
            plan: "PRO" | "FREE";
        } | undefined
    >(undefined);

    window.ipcRenderer.on('profile-received', (event, payload) => {
        console.log(event, "studio-tray/21");
        setOnSources(payload);
    })

    const videoElement = useRef<HTMLVideoElement | null>(null);
    const clearTime = () => {
        setOnTimer("00:00:00")
        setCount(0)
    }

    // Handle stream setup when sources are available
    useEffect(() => {
        console.log('onSources changed:', onSources);
        if (onSources && onSources.screen) {
            selectSources(onSources, videoElement)
        }
    }, [onSources]);

    useEffect(() => {
        if (!recording) return
        const recordTimeInterval = setInterval(() => {
            const time = count + (new Date().getTime() - initialTime.getTime())
            setCount(time)
            const recordingTime = videoRecordingTime(time)
            setOnTimer(recordingTime.length);
            if (time <= 0) {
                setOnTimer("00:00:00")
                clearInterval(recordTimeInterval)
            }
        }, 1)
        return () => clearInterval(recordTimeInterval)
    }, [recording])

    return !onSources ? <></> :
        (
            <div className="flex flex-col justify-end gap-y-2 py-8 h-screen">
                {preview && (
                    <video
                        autoPlay
                        playsInline
                        muted
                        ref={videoElement}
                        className={cn(
                            "w-6/12 self-end bg-white"
                        )}
                    ></video>
                )}
                <div className="rounded-full flex justify-around items-center h-12 min-w-[300px] border-2 bg-[#171717] draggable border-white/40">
                    <div {...(onSources && {
                        onClick: () => {
                            setRecording(true);
                            StartRecording(onSources);
                        }
                    })}
                        className={cn(
                            "non-draggable rounded-full cursor-pointer relative hover:opacity-80",
                            recording ? "bg-red-500 w-4 h-4" : "bg-red-400 w-5 h-5"
                        )}
                    >
                        {recording && <span className="absolute -right-16 top-1/2 transform -translate-y-1/2 text-white">{onTimer}</span>}
                    </div>
                    {!recording ? (<Pause
                        className="non-draggable opacity-50"
                        size={26}
                        fill="white"
                        stroke="none"
                    />) : (
                        <Square
                            size={26}
                            className="non-draggabled cursor-pointer hover:scale-110 transition duration-150"
                            onClick={() => {
                                setRecording(false)
                                clearTime()
                                onStopRecording()
                            }}
                            stroke="white"
                            fill="white"
                        />
                    )}
                    <Cast
                        onClick={() => setPreview((prev) => !prev)}
                        size={26}
                        fill="white"
                        className="non-draggable cursor-pointer hover:opacity-60"
                        stroke="white"
                    />
                </div>
            </div>
        )
}

export default StudioTray