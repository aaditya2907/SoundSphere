'use client'
import { signIn } from "next-auth/react"
import Image from "next/image"
import logo from '../assets/logo.png'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignIn() {
    const session = useSession();

    const router = useRouter();

    if (session.status === "authenticated") {
        router.push("/")
    }
    return (
        <div className="min-h-screen bg-violet-200 flex flex-col items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-96 flex flex-col items-center">
                <Image
                    src={logo}
                    alt="Logo"
                    width={200}
                    height={200}
                    className="mb-8"
                />
                <button
                    onClick={() => signIn('google')}
                    className="w-full bg-slate-600 text-white py-2 px-4 rounded hover:bg-slate-700 transition-colors"
                >
                    Sign in with Google
                </button>
            </div>
        </div>
    )
}