"use client"
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import SessionLoader from './components/SessionLoader';
import dynamic from "next/dynamic"

const Player = dynamic(() => import('./components/Player'))
const AddStream = dynamic(() => import('./components/AddStream'))
const UpnextStreams = dynamic(() => import('./components/UpNextStreams'))
const ShowError = dynamic(() => import('./components/ShowError'))

interface Stream {
  id: string;
  extractedId: string;
  smallImg: string;
  title: string;
  url: string;
  active: boolean;
}

export default function Home() {
  const [message, setMessage] = useState('');
  const [streams, setStreams] = useState<Stream[]>([]);

  const session = useSession()
  const router = useRouter();

  const email = session?.data?.user?.email ?? "";

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/signin")
    }
  }, [session.status, router])

  const fetchStreams = useCallback(async () => {

    const response = await fetch(`/api/streams?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    setStreams(data.streams);
  }, [email]);

  useEffect(() => {
    fetchStreams();
  }, [fetchStreams]);

  if (session.status === "loading") {
    return <div>
      <SessionLoader />
    </div>
  }

  return (
    <div className='bg-violet-200 min-h-[calc(100vh-90px)]' suppressHydrationWarning>
      <div className='flex flex-col lg:flex-row px-4 py-3 gap-4'>
        <div className='w-full lg:w-3/5'>
          {streams.length > 0 && <Player streams={streams} />}
          <AddStream setMessage={setMessage} setStreams={setStreams} />
        </div>
        <div className="w-full lg:w-2/5">
          {streams.length > 0 && <UpnextStreams setMessage={setMessage} streams={streams} setStreams={setStreams} />}
        </div>
        {message && <ShowError message={message} setMessage={setMessage} />}
      </div>
    </div>
  );
}