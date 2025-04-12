import { useStudioSettings } from '@/components/hooks/useStudioSettings';
import { Profile, SourceDeviceStateProps } from '@/lib/types'
import React from 'react'

type Props = {
    state: SourceDeviceStateProps;
    user:
    | ({
        subscription: {
            plan: "PRO" | "FREE";
        } | null;
        studio: {
            id: string;
            screen: string | null;
            mic: string | null;
            preset: "HD" | "SD";
            camera: string | null;
            userId: string | null;
        } | null;
    } & {
        id: string;
        email: string;
        firstname: string | null;
        lastname: string | null;
        createdAt: Date;
        clerkid: string;
    })
    | null;
}

const MediaConfiguration = ({ state, user }: Props) => {

    const activeScreen = state.displays?.find((d) => d.id === user?.studio?.screen)
    const activeAudio = state.audioInputs?.find((a) => a.deviceId === user?.studio?.mic)

    const { isPending, onPreset, register } = useStudioSettings(
        user?.id!,
        user?.studio?.screen || state.displays?.[0]?.id,
        user?.studio?.mic || state.audioInputs?.[0]?.deviceId,
        user?.studio?.preset || "SD",
        user?.subscription?.plan || "FREE"
    )
    console.log(state, "state")
    return (
        <form className='flex h-full relative w-full flex-col gap-y-5'>
            { }
        </form>
    )
}

export default MediaConfiguration