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
    setStreams: (streams: Stream[]) => void
}

export default function AddStream({ setStreams }: Props) {
    const [url, setUrl] = useState('');
    const [message, setMessage] = useState('');
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
        console.log(data)
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

    return <div>
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md mb-8">
            <h1 className="text-2xl font-bold mb-6 text-center">Add Song</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="url" className="block text-gray-700">Song URL</label>
                    <input
                        type="text"
                        id="url"

                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full px-3 py-2 border rounded"

                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    onClick={() => {
                        (document.getElementById('url') as HTMLInputElement).value = '';
                    }}
                >
                    Add
                </button>
            </form>
            {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
        </div>
    </div>
}