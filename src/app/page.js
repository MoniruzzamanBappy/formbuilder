"use client";

import CustomFieldSidebar from "../components/form-builder/CustomFieldSidebar";
import FormCanvas from "../components/form-builder/FormCanvas";
import FormFooter from "../components/form-builder/FormFooter";
import FormHeader from "../components/form-builder/FormHeader";
import PropertiesPanel from "../components/form-builder/PropertiesPanel";
import { useFormBuilder } from "../context/FormBuilderContext";

export default function FormBuilder() {
  const { state, addFieldset, addField, moveField, moveFieldset, saveForm } =
    useFormBuilder();

  // Handle dropping a field from the palette or moving a field/fieldset
  const handleFormCanvasDrop = (data) => {
    // For drops on the canvas (not on a specific fieldset)
    if (data.type === "palette-item" && data.fieldType) {
      // ONLY create a new fieldset if there's already at least one fieldset
      // The first fieldset is handled by the FormCanvas component
      if (state.fieldsets.length > 0) {
        const fieldsetId = addFieldset();
        addField(fieldsetId, data.fieldType);
      }
    }
    // Handle field movement between fieldsets
    else if (
      data.type === "field-item" &&
      data.fieldId &&
      data.sourceFieldsetId
    ) {
      // Only move if there's a specific target fieldset
      if (data.targetFieldsetId) {
        moveField(data.sourceFieldsetId, data.targetFieldsetId, data.fieldId);
      }
    }
    // Handle fieldset reordering
    else if (data.type === "fieldset" && data.fieldsetId) {
      const targetPosition = data.targetPosition
        ? parseInt(data.targetPosition, 10)
        : undefined;

      // Only reorder if we have a valid position
      if (targetPosition !== undefined && !isNaN(targetPosition)) {
        moveFieldset(data.fieldsetId, targetPosition);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <FormHeader />

      <div className="flex flex-1 overflow-hidden">
        <CustomFieldSidebar />
        <FormCanvas onDrop={handleFormCanvasDrop} />
        <PropertiesPanel />
      </div>

      <FormFooter
        onSave={() => saveForm(false)}
        onDraft={() => saveForm(true)}
      />
    </div>
  );
}
