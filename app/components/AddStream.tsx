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

    return <div className="min-w-full border-2 border-black p-8 rounded shadow-md mt-1">
        <h1 className="text-2xl font-bold mb-4 text-center">Add Song</h1>
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                {/* <div className="flex justify-center mb-2">
                    <label htmlFor="url" className="text-gray-700">Song URL</label>
                </div> */}
                <div className="flex justify-center">
                    <input
                        type="text"
                        id="url"
                        placeholder="Enter Youtube Song URL"
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-3/5 px-3 py-2 border rounded"

                    />
                </div>

            </div>
            <div className="flex justify-center">
                <button
                    type="submit"
                    className="w-3/5 bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
                    onClick={() => {
                        (document.getElementById('url') as HTMLInputElement).value = '';
                    }}
                >
                    Add
                </button>
            </div>

        </form>
        {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
    </div>

}