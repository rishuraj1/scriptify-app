import { DisplayDeviceActiveProps, SourceDeviceStateProps } from "@/lib/types";
import { getMediaResources } from "@/lib/utils";
import { useReducer } from "react";

export const useMediaSources = () => {
  const [state, action] = useReducer(
    (state: SourceDeviceStateProps, action: DisplayDeviceActiveProps) => {
      switch (action.type) {
        case "GET_DEVICES":
          return { ...state, ...action.payload };
        default:
          return state;
      }
    },
    {
      displays: [],
      audioInputs: [],
      error: null,
      isPending: false,
    }
  );

  const fetchMediaResources = () => {
    action({ type: "GET_DEVICES", payload: { isPending: true } });
    getMediaResources().then((sources) =>
      action({
        type: "GET_DEVICES",
        payload: {
          displays: sources.displays,
          audioInputs: sources.audio,
          isPending: false,
        },
      })
    );
  };

  return {
    state,
    fetchMediaResources,
  };
};
