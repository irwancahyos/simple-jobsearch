import toast, { Toaster } from "react-hot-toast";
import { X } from "lucide-react";

// ********** Local intrerface and type **********
type ToastStatus = "success" | "warning" | "error";

// ********** Main Component **********
const CustomToast = (message: string, status: ToastStatus = "success") => {
 const colorMap: Record<ToastStatus, string> = {
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
  };

  toast.custom((t) => (
    <div
      className={`flex items-center justify-between w-full max-w-sm p-4 rounded shadow-lg border border-gray-200
        bg-red-500 text-gray-800 transform transition-all duration-300 translate-y-0 opacity-100
        `}
    >
      {/* ********** Left Flag ********** */}
      <div className={`w-3 h-3 rounded-full mr-3 ${colorMap[status]}`}></div>

      {/* ********** Message ********** */}
      <div className="flex-1">{message}</div>

      {/* ********** Close ********** */}
      <button onClick={() => toast.dismiss(t.id)} className="ml-3 text-gray-400 hover:text-gray-600">
        <X size={16} />
      </button>
    </div>
  ));
};

export default CustomToast;
