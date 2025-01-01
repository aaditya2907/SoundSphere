"use client"
import { signIn, signOut, useSession } from "next-auth/react"
import Image from "next/image";
import logo from '../assets/logo.png'
import { useRouter } from "next/navigation";

export default function Appbar() {
    const session = useSession();
    const router = useRouter();
    function logoHandler() {
        router.push('/')
    }
    return <div className="flex justify-between mx-2">
        <div className="flex">
            <button onClick={() => logoHandler()}>
                <Image
                    src={logo}
                    alt="Logo"
                    width={220}

                />
            </button>

        </div>
        <div>
            {session.status === "authenticated"
                ? <button className="m-2 py-2.5 px-3 bg-gray-500 text-white rounded-md hover:bg-gray-600" onClick={() => { signOut() }}>Logout</button>
                : <button className="m-2 py-2.5 px-3 bg-gray-500 text-white rounded-md hover:bg-gray-600" onClick={() => { signIn() }}>Signin</button>}

        </div>
    </div>
}