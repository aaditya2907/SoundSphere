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
    return (
        <div className="flex justify-between items-center px-4 py-2">
            <div className="flex">
                <button onClick={logoHandler}>
                    <Image
                        src={logo}
                        alt="Logo"
                        width={150}
                        height={40}
                        className="w-32 md:w-48"
                    />
                </button>
            </div>
            <div>
                {session.status === "authenticated" ? (
                    <button className="px-3 py-2 bg-gray-500 text-white text-sm md:text-base rounded-md hover:bg-gray-600"
                        onClick={() => signOut()}>
                        Logout
                    </button>
                ) : (
                    <button className="px-3 py-2 bg-gray-500 text-white text-sm md:text-base rounded-md hover:bg-gray-600"
                        onClick={() => signIn()}>
                        Sign in
                    </button>
                )}
            </div>
        </div>
    )
}