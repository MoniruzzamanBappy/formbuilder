import { useEffect, useRef, useState } from "react";
import { useFormBuilder } from "../context/FormBuilderContext";

// Hook for draggable items
export function useDrag({ type, fieldType, fieldId, fieldsetId }) {
  const [isDragging, setIsDragging] = useState(false);
  const dragNode = useRef(null);
  const { setIsDragging: setGlobalDragging } = useFormBuilder();

  const handleDragStart = (e) => {
    dragNode.current = e.target;

    // Set data transfer payload
    if (type === "palette-item" && fieldType) {
      e.dataTransfer.setData("type", "palette-item");
      e.dataTransfer.setData("fieldType", fieldType);
    } else if (type === "field-item" && fieldId && fieldsetId) {
      e.dataTransfer.setData("type", "field-item");
      e.dataTransfer.setData("fieldId", fieldId);
      e.dataTransfer.setData("fieldsetId", fieldsetId);
    } else if (type === "fieldset" && fieldsetId) {
      e.dataTransfer.setData("type", "fieldset");
      e.dataTransfer.setData("fieldsetId", fieldsetId);
    }

    e.dataTransfer.effectAllowed = "move";

    // Update drag state
    setIsDragging(true);
    setGlobalDragging(true);

    // Remove focus
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const handleDragEnd = (e) => {
    dragNode.current = null;
    setIsDragging(false);
    setGlobalDragging(false);
  };

  // Cleanup global dragging state on unmount
  useEffect(() => {
    return () => {
      if (isDragging) {
        setGlobalDragging(false);
      }
    };
  }, [isDragging, setGlobalDragging]);

  return {
    isDragging,
    handleDragStart,
    handleDragEnd,
  };
}

// Hook for drop targets
export function useDrop({ type, fieldsetId, onDrop }) {
  const [isOver, setIsOver] = useState(false);
  const dropCounter = useRef(0);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    // Track mouse position globally
    window.lastDragX = e.clientX;
    window.lastDragY = e.clientY;
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    dropCounter.current += 1;
    if (dropCounter.current === 1) {
      setIsOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    dropCounter.current -= 1;
    if (dropCounter.current === 0) {
      setIsOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dropCounter.current = 0;
    setIsOver(false);

    const dataType = e.dataTransfer.getData("type");
    const data = { type: dataType };

    if (dataType === "palette-item") {
      data.fieldType = e.dataTransfer.getData("fieldType");
    } else if (dataType === "field-item") {
      data.fieldId = e.dataTransfer.getData("fieldId");
      data.sourceFieldsetId = e.dataTransfer.getData("fieldsetId");
    } else if (dataType === "fieldset") {
      data.fieldsetId = e.dataTransfer.getData("fieldsetId");
    }

    if (type === "fieldset" && fieldsetId) {
      data.targetFieldsetId = fieldsetId;
    }

    onDrop(data);
  };

  return {
    isOver,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  };
}
