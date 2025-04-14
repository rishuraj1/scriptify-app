import { ClerkLoading, SignedIn, useUser } from "@clerk/clerk-react"
import Loader from "../Loader"
import { Profile } from "@/lib/types"
import { useEffect, useState } from "react"
import { fetchUserProfile } from "@/lib/utils"
import { useMediaSources } from "@/components/hooks/useMediaSources"
import MediaConfiguration from "../MediaConfiguration"

const Widget = () => {
    const [profile, setProfile] = useState<Profile>(null)
    const { user } = useUser()

    // console.log("user", user)

    const { state, fetchMediaResources } = useMediaSources()
    // console.log("state", state)

    useEffect(() => {
        fetchMediaResources()
    }, [])

    useEffect(() => {
        // console.log("user", user)
        if (user && user.primaryEmailAddress?.emailAddress) {
            fetchUserProfile(user?.primaryEmailAddress?.emailAddress).then(p => setProfile(p))
        }
    }, [user])
    return (
        <div className="p-5">
            <ClerkLoading>
                <div className="h-full flex justify-center items-center">
                    <Loader />
                </div>
            </ClerkLoading>
            <SignedIn>
                {profile ? (
                    <MediaConfiguration
                        state={{
                            displays: state.displays || [],
                            audioInputs: state.audioInputs || [],
                            error: state.error || null,
                            isPending: state.isPending || false
                        }}
                        user={profile}
                    />
                ) : (
                    <div className="w-full h-full flex justify-center items-center">
                        <Loader />
                    </div>
                )}
            </SignedIn>
        </div>
    )
}

export default Widget