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
      <div className='flex justify-between py-3 mx-4'>

        <div className='w-3/4 flex flex-col justify-start mr-4'>
          <div>
            {streams.length > 0 && <Player streams={streams} />}
          </div>
          <div>
            <AddStream setMessage={setMessage} setStreams={setStreams} />
          </div>
        </div>

        <div className="bg-gray-100 flex flex-col items-center justify-start">
          {streams.length > 0 && <UpnextStreams setMessage={setMessage} streams={streams} setStreams={setStreams} />}
        </div>
        {message && <ShowError message={message} setMessage={setMessage} />}
      </div>
    </div >
  );
}