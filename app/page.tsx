"use client"
import { useState, useEffect, useCallback } from 'react';
import Appbar from "@/app/components/Appbar";
import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import Player from './components/Player';
import AddStream from './components/AddStream';
import UpnextStreams from './components/UpNextStreams';


interface Stream {
  id: string;
  extractedId: string;
  smallImg: string;
  title: string;
  url: string;
  active: boolean;
}

export default function Home() {

  const [streams, setStreams] = useState<Stream[]>([]);

  const session = useSession()
  const email = session?.data?.user?.email ?? ""

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

  return (
    <div>
      <Appbar />
      <div className='flex justify-between mx-4'>
        <div>
          {streams.length > 0 && <Player streams={streams} setStreams={setStreams} />}
        </div>

        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
          <AddStream streams={streams} setStreams={setStreams} />
          {streams.length > 0 && <UpnextStreams streams={streams} setStreams={setStreams} />}
        </div>
      </div>
    </div >
  );
}