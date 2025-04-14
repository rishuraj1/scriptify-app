import React, { useState } from "react";
import { cn, onCloseApp } from "@/lib/utils";
import { UserButton } from "@clerk/clerk-react";
import { X } from "lucide-react";
import { default as appLogo } from "/logo.svg"

type ControlLayoutProps = {
    children: React.ReactNode;
    className?: string;
}

const ControlLayout = ({
    children,
    className = "",
}: ControlLayoutProps) => {
    const [isVisible, setIsVisible] = useState(false);
    window.ipcRenderer.on('hide-plugin', (event, payload) => {
        console.log(event);
        setIsVisible(payload.state);
    })
    return (
        <div className={cn(
            className,
            isVisible && "invisible",
            "bg-[#171717] border-2 border-zinc-500 flex px-1 flex-col rounded-3xl overflow-hidden w-[90vw] shadow-lg shadow-black/50 border-solid backdrop-blur-sm transition-all duration-300 ease-in-out transform translate-x-0 translate-y-0 z-50 draggable"
            + " active:translate-x-0 active:translate-y-0 active:scale-100 active:shadow-lg active:shadow-black/50 active:border-gray-700 active:border-solid active:backdrop-blur-sm"
        )}>
            <div className="flex justify-between items-center p-5 draggable">
                <span className="non-draggable">
                    <UserButton />
                </span>
                <X
                    size={20}
                    className="text-gray-400 non-draggable cursor-pointer hover:text-white"
                    onClick={onCloseApp}
                />
            </div>
            <div className="flex-1 h-0 overflow-auto">
                {children}
            </div>
            <div className="flex items-center gap-x-2 p-2">
                <img src={appLogo} alt="Scriptify App Logo" className="w-36 h-14" />
            </div>
        </div>
    )
}

export default ControlLayout;