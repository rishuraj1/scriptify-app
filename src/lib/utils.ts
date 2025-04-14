import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_HOST_URL,
});

export const onCloseApp = () => window.ipcRenderer.send("closeApp");

export const fetchUserProfile = async (emailId: string) => {
  const response = await httpClient.get(
    `/api/v1/auth/getUser?email=${emailId}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  console.log("response", response);
  return response.data;
};

export const getMediaResources = async () => {
  console.log("Starting getMediaResources");
  try {
    console.log("Calling getSources IPC");
    const displays = await window.ipcRenderer.invoke("getSources");
    console.log("Got displays from IPC:", displays);

    console.log("Enumerating devices");
    const enumeratedDevices =
      await window.navigator.mediaDevices.enumerateDevices();
    console.log("Got enumerated devices:", enumeratedDevices);

    const audioInputs = enumeratedDevices.filter(
      (device) => device.kind === "audioinput"
    );
    console.log("Filtered audio inputs:", audioInputs);

    return {
      displays,
      audio: audioInputs,
    };
  } catch (error) {
    console.error("Error in getMediaResources:", error);
    throw error;
  }
};

export const updateStudioSettings = async (
  id: string,
  screen: string,
  audio: string,
  preset: "HD" | "SD"
) => {
  console.log("Updating studio settings", id, screen, audio, preset);
  const response = await httpClient.post(
    `/api/v1/studio/${id}`,
    {
      screen,
      audio,
      preset,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const hidePluginWindow = (state: boolean) => {
  window.ipcRenderer.send("hide-plugin", { state });
};

export const videoRecordingTime = (ms: number) => {
  const second = Math.floor((ms / 1000) % 60)
    .toString()
    .padStart(2, "0");
  const minute = Math.floor((ms / 1000 / 60) % 60)
    .toString()
    .padStart(2, "0");
  const hour = Math.floor(ms / 1000 / 60 / 60)
    .toString()
    .padStart(2, "0");
  return { length: `${hour}:${minute}:${second}`, minute };
};

export const resizeWindow = (shrink: boolean) => {
  window.ipcRenderer.send("resize-studio", { shrink });
};
