import { GripHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFormBuilder } from "../../context/FormBuilderContext";
import { useDrop } from "../../hooks/useDrag";
import DroppableIndicator from "./DroppableIndicator";
import FormField from "./FormField";

export default function Fieldset({ fieldset }) {
  const { addField, moveField, selectFieldset, removeFieldset } =
    useFormBuilder();
  const [showDropIndicator, setShowDropIndicator] = useState(false);

  const handleFieldsetDrop = (data) => {
    if (data.type === "palette-item" && data.fieldType) {
      // Add a new field from the palette
      addField(fieldset.id, data.fieldType);
    } else if (
      data.type === "field-item" &&
      data.fieldId &&
      data.sourceFieldsetId
    ) {
      // Determine drop position
      const targetElement = document.elementFromPoint(
        window.lastDragX || 0,
        window.lastDragY || 0
      );
      const closestField = targetElement?.closest(".field-item");
      let targetPosition;

      if (closestField) {
        const targetFieldId = closestField.getAttribute("data-field-id");
        const targetIndex = fieldset.fields.findIndex(
          (f) => f.id === targetFieldId
        );
        if (targetIndex !== -1) {
          const rect = closestField.getBoundingClientRect();
          const mouseY = window.lastDragY || 0;
          const middleY = rect.top + rect.height / 2;
          targetPosition = mouseY < middleY ? targetIndex : targetIndex + 1;
        }
      }

      console.log("Moving field with position:", targetPosition);
      moveField(
        data.sourceFieldsetId,
        fieldset.id,
        data.fieldId,
        targetPosition
      );
    }

    setShowDropIndicator(false);
  };

  const {
    isOver,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  } = useDrop({
    type: "fieldset",
    fieldsetId: fieldset.id,
    onDrop: handleFieldsetDrop,
  });

  const handleFieldsetClick = (e) => {
    e.stopPropagation();
    selectFieldset(fieldset.id);
  };

  const handleFieldsetDragEnter = (e) => {
    handleDragEnter(e);
    setShowDropIndicator(true);
  };

  const handleFieldsetDragLeave = (e) => {
    handleDragLeave(e);
    setShowDropIndicator(false);
  };

  return (
    <div
      className="fieldset mb-6 border border-neutral-200 rounded-lg overflow-hidden"
      onClick={handleFieldsetClick}
      data-fieldset-id={fieldset.id}
    >
      <div className="bg-neutral-50 px-4 py-2 border-b border-neutral-200 flex justify-between items-center">
        <h3 className="font-medium text-sm">{fieldset.name}</h3>
        <div className="flex items-center text-neutral-400 text-sm space-x-1">
          <button
            className="p-1 hover:text-red-500 transition-colors"
            title="Delete fieldset"
            onClick={(e) => {
              e.stopPropagation();
              removeFieldset(fieldset.id);
            }}
          >
            <Trash2 size={16} />
          </button>
          <button className="p-1 hover:text-neutral-700" title="Drag fieldset">
            <GripHorizontal size={16} />
          </button>
        </div>
      </div>

      <div
        className="p-4 space-y-3 fieldset-content"
        onDragOver={handleDragOver}
        onDragEnter={handleFieldsetDragEnter}
        onDragLeave={handleFieldsetDragLeave}
        onDrop={handleDrop}
      >
        {fieldset.fields.map((field) => (
          <FormField key={field.id} field={field} fieldsetId={fieldset.id} />
        ))}

        {fieldset.fields.length === 0 && (
          <div className="text-center py-4 text-neutral-400 text-sm">
            Drag and drop fields here
          </div>
        )}

        {fieldset.fields.length > 0 && showDropIndicator && isOver && (
          <DroppableIndicator message="Drop field here" />
        )}
      </div>
    </div>
  );
}
