import { useStudioSettings } from '@/components/hooks/useStudioSettings';
import { SourceDeviceStateProps } from '@/lib/types'
import Loader from '../Loader';
import { Headphones, Monitor, Settings2 } from 'lucide-react';

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
        user?.id ?? '',
        user?.studio?.screen || state.displays?.[0]?.id,
        user?.studio?.mic || state.audioInputs?.[0]?.deviceId,
        user?.studio?.preset || "SD",
        user?.subscription?.plan || "FREE"
    )
    // console.log(state, "state")
    return (
        <form className='flex h-full relative w-full flex-col gap-y-5'>
            {isPending && (<div className='fixed z-50 w-full top-0 right-0 bottom-0 rounded-2xl h-full bg-black/80 flex justify-center items-center'>
                <Loader />
            </div>
            )}
            <div className='flex gap-x-5 justify-center items-center'>
                <Monitor
                    fill='#575655'
                    color='#575655'
                    size={36}
                />
                <select
                    {...register('screen')}
                    className='outline-none cursor-pointer px-5 py-2 rounded-xl border-2 text-white border-[#575655] bg-transparent w-full'
                >
                    {state?.displays?.map((display, key) => {
                        // console.log(display, "display")
                        return (
                            <option
                                selected={activeScreen && activeScreen.id === display.id}
                                value={display.id}
                                className='bg-[#171717] cursor-pointer'
                                key={key}
                            >
                                {display.name}
                            </option>
                        )
                    })}
                </select>
            </div>
            <div className='flex gap-x-5 justify-center items-center'>
                <Headphones
                    color='#575655'
                    size={36}
                />
                <select
                    {...register('audio')}
                    className='outline-none cursor-pointer px-5 py-2 rounded-xl border-2 text-white border-[#575655] bg-transparent w-full'
                >
                    {state?.audioInputs?.map((audio, key) => {
                        return (
                            <option
                                selected={activeAudio && activeAudio.deviceId === audio.deviceId}
                                value={audio.deviceId}
                                className='bg-[#171717] cursor-pointer'
                                key={key}
                            >
                                {audio.label}
                            </option>
                        )
                    })}
                </select>
            </div>
            <div className='flex gap-x-5 justify-center items-center'>
                <Settings2
                    color='#575655'
                    size={36}
                />
                <select
                    {...register('preset')}
                    className='outline-none cursor-pointer px-5 py-2 rounded-xl border-2 text-white border-[#575655] bg-transparent w-full'
                >
                    <option
                        disabled={user?.subscription?.plan === "FREE"}
                        value="HD"
                        selected={onPreset === "HD" || user?.studio?.preset === "HD"}
                        className='bg-[#171717] cursor-pointer'
                    >1080{' '}</option>
                    <option
                        value="SD"
                        selected={onPreset === "SD" || user?.studio?.preset === "SD"}
                        className='bg-[#171717] cursor-pointer'
                    >720{' '}</option>
                </select>
            </div>
        </form>
    )
}

export default MediaConfiguration