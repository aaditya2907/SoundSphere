
export default function SessionLoader() {
    return (
        <div className="min-h-screen bg-violet-200 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-violet-500 mb-4"></div>
                <div className="text-xl text-indigo-700 font-medium">
                    Loading...
                </div>
            </div>
        </div>
    )
}