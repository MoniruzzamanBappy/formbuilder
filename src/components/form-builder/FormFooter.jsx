import { Button } from "../ui/button";

export default function FormFooter({ onSave, onDraft }) {
  return (
    <footer className="bg-white border-t border-neutral-200 py-3 px-4 flex justify-end space-x-2">
      <Button
        variant="outline"
        className="py-2 px-6 bg-neutral-50 hover:bg-neutral-100"
        onClick={onDraft}
      >
        Draft
      </Button>

      <Button
        className="py-2 px-6 bg-red-500 hover:bg-red-500/90 text-white"
        onClick={onSave}
      >
        Save Form
      </Button>
    </footer>
  );
}
