export default function DroppableIndicator({ message }) {
  return (
    <div className="border-2 border-dashed border-red-500/30 rounded-lg p-3 text-center bg-red-500/5 mb-3">
      <p className="text-sm text-red-500/70">{message}</p>
    </div>
  );
}
