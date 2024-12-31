"use client"
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Player from './components/Player';
import AddStream from './components/AddStream';
import UpnextStreams from './components/UpNextStreams';
import ShowError from './components/ShowError';

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
  const [message, setMessage] = useState('');

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
    <div className='bg-violet-200 min-h-[calc(100vh-90px)]'>
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