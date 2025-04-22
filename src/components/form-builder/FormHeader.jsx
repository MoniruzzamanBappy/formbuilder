import { formatDistanceToNow } from "date-fns";
import { Eye } from "lucide-react";
import { useFormBuilder } from "../../context/FormBuilderContext";

export default function FormHeader() {
  const { state } = useFormBuilder();

  // Format the last saved time
  const getLastSavedText = () => {
    if (!state.lastSaved) return "Not saved yet";

    try {
      return `Changes saved ${formatDistanceToNow(state.lastSaved, {
        addSuffix: false,
      })} ago`;
    } catch {
      return "Recently saved";
    }
  };

  return (
    <header className="bg-white border-b border-neutral-200 py-3 px-4 flex justify-between items-center">
      <div className="flex items-center">
        <div className="flex items-center mr-2">
          <img
            className="w-16 h-10"
            src="/images/wempro_com_logo.jpg"
            alt="wempro_logo"
          />
        </div>
        <div>
          <h1 className="text-lg font-bold">Form Builder for Wempro</h1>
          <p className="text-xs text-neutral-500">
            Create and manage your forms with ease.
          </p>
        </div>
      </div>

      <div className="flex items-center text-sm text-neutral-600">
        <span className="mr-2">{getLastSavedText()}</span>
        <button className="p-2 rounded-md bg-blue-600/20">
          <Eye size={16} className="text-blue-800" />
        </button>
      </div>
    </header>
  );
}
