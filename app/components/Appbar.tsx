"use client"
import { signIn, signOut, useSession } from "next-auth/react"


export default function Appbar() {
    const session = useSession();
    return <div className="flex justify-between  m-2">
        <div className="flex text-fuchsia-800 text-3xl">
            MusicVerse
        </div>
        <div>
            {session.status === "authenticated"
                ? <button className="m-2 p-2 bg-blue-400" onClick={() => { signOut() }}>Logout</button>
                : <button className="m-2 p-2 bg-blue-400" onClick={() => { signIn() }}>Signin</button>}

        </div>
    </div>
}