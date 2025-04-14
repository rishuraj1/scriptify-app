import { DisplayDeviceActiveProps, SourceDeviceStateProps } from "@/lib/types";
import { getMediaResources } from "@/lib/utils";
import { useReducer } from "react";

export const useMediaSources = () => {
  const [state, action] = useReducer(
    (state: SourceDeviceStateProps, action: DisplayDeviceActiveProps) => {
      console.log("useMediaSources reducer called with action:", action);
      switch (action.type) {
        case "GET_DEVICES":
          console.log("Updating state with payload:", action.payload);
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
    console.log("fetchMediaResources called");
    action({ type: "GET_DEVICES", payload: { isPending: true } });
    getMediaResources()
      .then((sources) => {
        console.log("Got media resources:", sources);
        action({
          type: "GET_DEVICES",
          payload: {
            displays: sources.displays,
            audioInputs: sources.audio,
            isPending: false,
          },
        });
      })
      .catch((error) => {
        console.error("Error fetching media resources:", error);
        action({
          type: "GET_DEVICES",
          payload: {
            error: error.message,
            isPending: false,
          },
        });
      });
  };

  return {
    state,
    fetchMediaResources,
  };
};
