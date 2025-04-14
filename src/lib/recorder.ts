import React from "react";
import { hidePluginWindow } from "./utils";
import { v4 as uuid } from "uuid";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL as string);

let videoTransferFileName: string | undefined;
let mediaRecorder: MediaRecorder | undefined;
let userId: string | undefined;

export const StartRecording = (onSources: {
  screen: string;
  id: string;
  audio: string;
}) => {
  hidePluginWindow(true);
  videoTransferFileName = `${uuid()}-${onSources.id.slice(0, 8)}.webm`;
  mediaRecorder?.start(1000);
};

export const onStopRecording = () => {
  mediaRecorder?.stop();
};
const stopRecording = () => {
  hidePluginWindow(false);
  socket.emit("process-video", {
    filename: videoTransferFileName,
    userId,
  });
};

export const onDataAvailable = (event: BlobEvent) => {
  socket.emit("video-chunks", {
    chunks: event.data,
    filename: videoTransferFileName,
  });
};

export const selectSources = async (
  onSources: {
    screen: string;
    audio: string;
    id: string;
    preset: "HD" | "SD";
  },
  videoElement: React.RefObject<HTMLVideoElement>
) => {
  try {
    if (onSources.screen && onSources.audio && onSources.id) {
      console.log("selectSources called with:", onSources);
      const constraints: any = {
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: onSources?.screen,
            minWidth: onSources.preset === "HD" ? 1280 : 854,
            maxWidth: onSources.preset === "HD" ? 1920 : 1280,
            minHeight: onSources.preset === "HD" ? 720 : 480,
            maxHeight: onSources.preset === "HD" ? 1080 : 720,
            frameRate: { ideal: 24, max: 30 },
          },
        },
      };
      userId = onSources.id;
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const audioStream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: onSources.audio
          ? { deviceId: { exact: onSources.audio } }
          : false,
      });

      if (!stream || !stream.getVideoTracks().length) {
        throw new Error('Failed to get video stream');
      }

      if (videoElement && videoElement.current) {
        videoElement.current.srcObject = stream;
        await videoElement.current.play();
      }

      const combinedStream = new MediaStream([
        ...stream.getTracks(),
        ...audioStream.getTracks(),
      ]);

      try {
        mediaRecorder = new MediaRecorder(combinedStream, {
          mimeType: "video/webm; codecs=vp9",
          videoBitsPerSecond: onSources.preset === "HD" ? 2500000 : 1500000
        });
        console.log("mediaRecorder created successfully");
        mediaRecorder.ondataavailable = onDataAvailable;
        mediaRecorder.onstop = stopRecording;
      } catch (recorderError) {
        console.error("Error creating MediaRecorder:", recorderError);
        throw recorderError;
      }
    }
  } catch (error) {
    console.error("Error in stream setup:", error);
    throw error;
  }
};
