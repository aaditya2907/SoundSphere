
interface Stream {
    id: string;
    extractedId: string;
    smallImg: string;
    title: string;
    url: string;
    active: boolean;
}


interface Props {
    streams: Stream[],
    setStreams: (streams: Stream[] | ((prevStreams: Stream[]) => Stream[])) => void
}



export default function UpnextStreams({ streams, setStreams }: Props) {
    async function deleteStream(id: string) {
        console.log(id)
        await fetch(`api/streams?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        setStreams((prevStreams: Stream[]) => prevStreams.filter(stream => stream.id !== id))

    }
    return <div>
        <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl">
            <h1 className="text-2xl font-bold mb-6 text-center">Upnext Streams</h1>
            <ul>
                {streams.map((stream: Stream) => (

                    <li key={stream.id} className="mb-4" >
                        <div className="bg-gray-200 p-4 rounded flex justify-between">
                            <div>
                                <img src={stream.smallImg} alt={stream.title} className="" />
                            </div>
                            <div className="mx-3">
                                <h2 className="mx-0 text-xl font-bold">
                                    <a href={stream.url} target='_blank'>{stream.title}</a>
                                </h2>
                                {stream.active && <p>Active</p>}
                                <button onClick={() => {
                                    deleteStream(stream.id)

                                }} className="border-2 border-black rounded-md px-1 my-2">delete</button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    </div >
}