import Image from "next/image";
import deleteIcon from "../assets/delete.svg"

interface Stream {
    id: string;
    extractedId: string;
    smallImg: string;
    title: string;
    url: string;
    active: boolean;
}


interface Props {
    setMessage: (message: string) => void,
    streams: Stream[],
    setStreams: (streams: Stream[] | ((prevStreams: Stream[]) => Stream[])) => void
}



export default function UpnextStreams({setMessage, streams, setStreams }: Props) {
    async function deleteStream(id: string) {
        const res = await fetch(`api/streams?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if(res.status === 200){
            setMessage("Stream Successfully Deleted!")
        }
        setStreams((prevStreams: Stream[]) => prevStreams.filter(stream => stream.id !== id))

    }
    return (
    <div className="bg-white py-4 px-4 rounded-md shadow-md w-full max-w-4xl ">
        <h1 className="text-2xl font-bold mb-4 text-center sticky top-0 bg-white">Upnext Streams</h1>
        <ul className="max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            {streams.map((stream: Stream) => (

                <li key={stream.id} className="mb-4" >
                    <div className="bg-gray-200 p-4 rounded flex justify-between w-full ">
                        <div className="flex justify-start ">
                            <div className="min-w-fit">
                                <Image width={180} height={175} src={stream.smallImg} alt={stream.title} className="object-cover rounded" />
                            </div>
                            <div className="mx-4 flex flex-col items-start justify-start ">
                                <h2 className="text-xl font-bold">
                                    {stream.title.substring(1, 55)}...
                                </h2>
                                {stream.active && <p>Active</p>}
                            </div>
                        </div>

                        <div className="min-w-10">
                            <button onClick={() => {
                                deleteStream(stream.id)

                            }} className="rounded-md my-2 bg-zinc-300 hover:bg-zinc-400 p-2">{<Image
                                width={20} height={175} src={deleteIcon} alt={stream.title} className="object-cover rounded"
                            />}</button>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    </div>
    )
}