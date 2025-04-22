import { Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useFormBuilder } from "../../context/FormBuilderContext";

export default function PropertiesPanel() {
  const {
    getSelectedField,
    updateField,
    updateFieldset,
    addOption,
    updateOption,
    removeOption,
    removeField,
    selectField,
  } = useFormBuilder();

  const [fieldName, setFieldName] = useState("");
  const [fieldsetName, setFieldsetName] = useState("");
  const { field, fieldset } = getSelectedField();

  // Reset state when selected field/fieldset changes
  useEffect(() => {
    if (field) {
      setFieldName(field.name || "");
    }
    if (fieldset) {
      setFieldsetName(fieldset.name || "");
    }
  }, [field, fieldset]);

  // Nothing selected
  if (!field && !fieldset) {
    return (
      <div className="w-72 bg-white border-l border-neutral-200 flex flex-col overflow-hidden hidden">
        <div className="p-4 border-b border-neutral-200">
          <h2 className="text-sm font-semibold">Field Properties</h2>
        </div>
      </div>
    );
  }

  const handleFieldNameChange = (e) => {
    setFieldName(e.target.value);
  };

  const handleFieldsetNameChange = (e) => {
    setFieldsetName(e.target.value);
  };

  const handleApply = () => {
    if (field && fieldset) {
      updateField(fieldset.id, field.id, { name: fieldName, label: fieldName });
      updateFieldset(fieldset.id, { name: fieldsetName });
      // Close panel
      setTimeout(() => {
        updateField(fieldset.id, field.id, {}); // force refresh
        selectField(null);
      }, 100);
    } else if (fieldset) {
      updateFieldset(fieldset.id, { name: fieldsetName });
      setTimeout(() => {
        selectField(null);
      }, 100);
    }
  };

  const handleDelete = () => {
    if (field && fieldset) {
      removeField(fieldset.id, field.id);
    }
  };

  const handleOptionChange = (optionId, value) => {
    if (field && fieldset) {
      updateOption(fieldset.id, field.id, optionId, value);
    }
  };

  const handleAddOption = () => {
    if (field && fieldset) {
      addOption(fieldset.id, field.id);
    }
  };

  const handleRemoveOption = (optionId) => {
    if (field && fieldset) {
      removeOption(fieldset.id, field.id, optionId);
    }
  };

  const hasOptions =
    field &&
    ["dropdown", "radio", "checkbox", "number-combo"].includes(field.type);

  return (
    <div className="w-72 bg-white border-l border-neutral-200 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-neutral-200">
        <h2 className="text-sm font-semibold">Field Properties</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {/* Fieldset Properties */}
        {fieldset && (
          <div className="mb-4">
            <h3 className="font-medium text-sm mb-3">Field-set</h3>
            <Input
              type="text"
              className="mb-4 bg-neutral-50"
              placeholder="Enter field-set name"
              value={fieldsetName}
              onChange={handleFieldsetNameChange}
            />
          </div>
        )}

        {/* Field Properties */}
        {field && (
          <div>
            <h3 className="font-medium text-sm mb-3">{field.label}</h3>
            <Input
              type="text"
              className="mb-4 bg-neutral-50"
              placeholder="Enter field name"
              value={fieldName}
              onChange={handleFieldNameChange}
            />

            {/* Options for multi-choice fields */}
            {hasOptions && field.options && (
              <div className="space-y-2 mb-4">
                {field.options.map((option) => (
                  <div key={option.id} className="flex items-center">
                    <Input
                      type="text"
                      className="flex-1"
                      value={option.label}
                      onChange={(e) =>
                        handleOptionChange(option.id, e.target.value)
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 text-neutral-400 hover:text-neutral-700"
                      onClick={() => handleRemoveOption(option.id)}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center py-2 px-3 bg-neutral-50"
                  onClick={handleAddOption}
                >
                  <Plus size={16} className="mr-1 text-neutral-400" />
                  Add new option
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        {field && (
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              className="py-2 px-4 bg-neutral-50"
              onClick={handleDelete}
            >
              Delete
            </Button>
            <Button
              className="py-2 px-4 bg-[#FF564D] hover:bg-[#FF564D]/90 text-white"
              onClick={handleApply}
            >
              Apply
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
