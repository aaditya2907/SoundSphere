
interface Props {
    message: string,
    setMessage: (message: string) => void
}

export default function ShowError({ message, setMessage }: Props) {
    let showMessage = "";
    function showError() {
        setTimeout(() => {
            setMessage("")
        }, 4000)
    }
    showError();
    switch (message) {
        case ("invalid_string"):
            showMessage = "Please enter valid youtube URL!";
            break;
        case ("Stream created successfully!"):
            showMessage = "Stream Added Successfully!";
            break;
        case ("Stream Successfully Deleted!"): {
            showMessage = "Stream Deleted Successfully!";
            break;
        }
        case ("Stream already exists!"):
            showMessage = "Stream already exists!";
            break;
        default:
            showMessage = "Error!"
            break;
    }
    // return <div className="bg-white rounded-md flex flex-col items-start w-96">
    //     <div className="bg-slate-600 w-full text-white">
    //         Message
    //     </div>
    //     <div>
    //         {showMessage}
    //     </div>
    // </div>
    return (
        <div className="fixed bottom-4 right-4 animate-slide-up">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden w-72">
                <div className="bg-slate-600 px-4 py-2 text-white text-sm font-medium">
                    Notification
                </div>
                <div className="px-4 py-3 text-gray-600">
                    {showMessage}
                </div>
                <div className="h-1 w-full bg-gray-200">
                    <div
                        className="h-full bg-slate-600 animate-progress-bar"
                        style={{
                            animation: 'progress 4s linear'
                        }}
                    />
                </div>
            </div>
        </div>
    )
}