import { useSession } from "next-auth/react";
import { useState } from "react";

interface Stream {
    id: string;
    extractedId: string;
    smallImg: string;
    title: string;
    url: string;
    active: boolean;
}

interface Props {
    setMessage: (message: string) => void
    setStreams: (streams: Stream[]) => void

}

export default function AddStream({ setMessage, setStreams }: Props) {
    const [url, setUrl] = useState('');
    // const [message, setMessage] = useState('');
    const session = useSession();
    const email = session.data?.user?.email ?? ""

    const fetchStreams = async () => {

        const response = await fetch(`/api/streams?email=${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();
        setStreams(data.streams);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch('/api/streams', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, url }),
        });
        const data = await response.json();
        setMessage(data.message);
        fetchStreams(); // Refresh the streams list after submission
    };

    return (
        <div className="w-full pt-4 pb-6 rounded shadow-md mt-3 bg-violet-400 px-4">
            <h1 className="text-xl md:text-2xl font-bold mb-4 text-center">Add Song</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <div className="flex justify-center">
                        <input
                            type="text"
                            id="url"
                            placeholder="Enter Youtube Song URL"
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full md:w-3/5 px-3 py-2 border rounded"
                        />
                    </div>
                </div>
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="w-full md:w-3/5 bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
                    >
                        Add
                    </button>
                </div>
            </form>
        </div>
    )
}