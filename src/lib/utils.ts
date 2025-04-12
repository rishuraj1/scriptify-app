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
  const displays = await window.ipcRenderer.invoke("getSources");
  const enumeratedDevices =
    await window.navigator.mediaDevices.enumerateDevices();
  const audioInputs = enumeratedDevices.filter(
    (device) => device.kind === "audioinput"
  );
  console.log("getting sources");
  return {
    displays,
    audio: audioInputs,
  };
};

export const updateStudioSettings = async (
  id: string,
  screen: string,
  audio: string,
  preset: "HD" | "SD"
) => {
  const response = await httpClient.post(
    `/studio/${id}`,
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
