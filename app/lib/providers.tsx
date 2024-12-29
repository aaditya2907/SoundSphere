"use client"
import { SessionProvider } from "next-auth/react";


export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <div >
            <SessionProvider>

                {children}
            </SessionProvider>
        </div>
    );
}