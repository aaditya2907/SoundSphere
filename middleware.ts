import { useSession } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";


export default function middleware(req: NextRequest) {
    // const session = useSession();
    // if (session.status === 'unauthenticated') {
    //     return NextResponse.redirect(new URL('/signin', req.url))
    // }
}