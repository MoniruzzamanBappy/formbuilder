"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useToast } from "../hooks/use-toast";
import { apiRequest } from "../lib/queryClient";
import { generateUniqueId, generateUniqueName } from "../lib/utils/fieldUtils";

// Initial state
const initialState = {
  fieldsets: [],
  selectedFieldId: null,
  selectedFieldsetId: null,
  isDragging: false,
  lastSaved: null,
  isDraft: false,
};

const FormBuilderContext = createContext();

function formBuilderReducer(state, action) {
  switch (action.type) {
    case "ADD_FIELDSET": {
      return {
        ...state,
        fieldsets: [...state.fieldsets, action.payload.fieldset],
      };
    }

    case "ADD_FIELD": {
      const { fieldsetId, field, position } = action.payload;
      const idx = state.fieldsets.findIndex((fs) => fs.id === fieldsetId);
      if (idx === -1) return state;

      const fs = state.fieldsets[idx];
      const newFields = [...fs.fields];
      if (position != null && position >= 0 && position <= newFields.length) {
        newFields.splice(position, 0, field);
      } else {
        newFields.push(field);
      }

      const updated = [...state.fieldsets];
      updated[idx] = { ...fs, fields: newFields };

      return {
        ...state,
        fieldsets: updated,
        selectedFieldId: field.id,
        selectedFieldsetId: fieldsetId,
      };
    }

    case "REMOVE_FIELD": {
      const { fieldsetId, fieldId } = action.payload;
      const idx = state.fieldsets.findIndex((fs) => fs.id === fieldsetId);
      if (idx === -1) return state;

      const fs = state.fieldsets[idx];
      const filtered = fs.fields.filter((f) => f.id !== fieldId);
      const updated = [...state.fieldsets];
      updated[idx] = { ...fs, fields: filtered };

      return {
        ...state,
        fieldsets: updated,
        selectedFieldId:
          state.selectedFieldId === fieldId ? null : state.selectedFieldId,
      };
    }

    case "REMOVE_FIELDSET": {
      const { fieldsetId } = action.payload;
      const filtered = state.fieldsets.filter((fs) => fs.id !== fieldsetId);
      return {
        ...state,
        fieldsets: filtered,
        selectedFieldsetId:
          state.selectedFieldsetId === fieldsetId
            ? null
            : state.selectedFieldsetId,
        selectedFieldId:
          state.selectedFieldsetId === fieldsetId
            ? null
            : state.selectedFieldId,
      };
    }

    case "UPDATE_FIELD": {
      const { fieldsetId, fieldId, updates } = action.payload;
      const fsi = state.fieldsets.findIndex((fs) => fs.id === fieldsetId);
      if (fsi === -1) return state;
      const fs = state.fieldsets[fsi];
      const fi = fs.fields.findIndex((f) => f.id === fieldId);
      if (fi === -1) return state;

      const updatedFields = [...fs.fields];
      updatedFields[fi] = { ...updatedFields[fi], ...updates };
      const updated = [...state.fieldsets];
      updated[fsi] = { ...fs, fields: updatedFields };

      return { ...state, fieldsets: updated };
    }

    case "UPDATE_FIELDSET": {
      const { fieldsetId, updates } = action.payload;
      const idx = state.fieldsets.findIndex((fs) => fs.id === fieldsetId);
      if (idx === -1) return state;

      const updated = [...state.fieldsets];
      updated[idx] = { ...updated[idx], ...updates };
      return { ...state, fieldsets: updated };
    }

    case "SELECT_FIELD":
      return { ...state, selectedFieldId: action.payload.fieldId };

    case "SELECT_FIELDSET":
      return { ...state, selectedFieldsetId: action.payload.fieldsetId };

    case "DUPLICATE_FIELD": {
      const { fieldsetId, field } = action.payload;
      const idx = state.fieldsets.findIndex((fs) => fs.id === fieldsetId);
      if (idx === -1) return state;

      const fs = state.fieldsets[idx];
      const updatedFields = [...fs.fields, field];
      const updated = [...state.fieldsets];
      updated[idx] = { ...fs, fields: updatedFields };

      return { ...state, fieldsets: updated, selectedFieldId: field.id };
    }

    case "MOVE_FIELD": {
      const { sourceFieldsetId, targetFieldsetId, fieldId, position } =
        action.payload;
      // if same and no position change, no-op
      if (sourceFieldsetId === targetFieldsetId && position == null)
        return state;

      const sIdx = state.fieldsets.findIndex(
        (fs) => fs.id === sourceFieldsetId
      );
      const tIdx = state.fieldsets.findIndex(
        (fs) => fs.id === targetFieldsetId
      );
      if (sIdx === -1 || tIdx === -1) return state;

      const sourceFs = state.fieldsets[sIdx];
      const fi = sourceFs.fields.findIndex((f) => f.id === fieldId);
      if (fi === -1) return state;

      const field = sourceFs.fields[fi];
      const newFieldsets = [...state.fieldsets];

      // remove from source
      newFieldsets[sIdx] = {
        ...sourceFs,
        fields: sourceFs.fields.filter((f) => f.id !== fieldId),
      };

      // add to target
      const targetFs = state.fieldsets[tIdx];
      const newTargetFields = [...targetFs.fields];
      if (
        position != null &&
        position >= 0 &&
        position <= newTargetFields.length
      ) {
        newTargetFields.splice(position, 0, field);
      } else {
        newTargetFields.push(field);
      }
      newFieldsets[tIdx] = { ...targetFs, fields: newTargetFields };

      return { ...state, fieldsets: newFieldsets };
    }

    case "ADD_OPTION": {
      const { fieldsetId, fieldId, option } = action.payload;
      const fsi = state.fieldsets.findIndex((fs) => fs.id === fieldsetId);
      if (fsi === -1) return state;

      const fs = state.fieldsets[fsi];
      const fi = fs.fields.findIndex((f) => f.id === fieldId);
      if (fi === -1) return state;

      const field = fs.fields[fi];
      const opts = field.options ? [...field.options, option] : [option];
      const updatedFields = [...fs.fields];
      updatedFields[fi] = { ...field, options: opts };
      const updated = [...state.fieldsets];
      updated[fsi] = { ...fs, fields: updatedFields };

      return { ...state, fieldsets: updated };
    }

    case "UPDATE_OPTION": {
      const { fieldsetId, fieldId, optionId, label } = action.payload;
      const fsi = state.fieldsets.findIndex((fs) => fs.id === fieldsetId);
      if (fsi === -1) return state;
      const fs = state.fieldsets[fsi];
      const fi = fs.fields.findIndex((f) => f.id === fieldId);
      if (fi === -1) return state;

      const field = fs.fields[fi];
      if (!field.options) return state;
      const oi = field.options.findIndex((o) => o.id === optionId);
      if (oi === -1) return state;

      const updatedOpts = [...field.options];
      updatedOpts[oi] = {
        ...updatedOpts[oi],
        label,
        value: label.toLowerCase().replace(/\s+/g, "-"),
      };
      const updatedFields = [...fs.fields];
      updatedFields[fi] = { ...field, options: updatedOpts };
      const updated = [...state.fieldsets];
      updated[fsi] = { ...fs, fields: updatedFields };

      return { ...state, fieldsets: updated };
    }

    case "REMOVE_OPTION": {
      const { fieldsetId, fieldId, optionId } = action.payload;
      const fsi = state.fieldsets.findIndex((fs) => fs.id === fieldsetId);
      if (fsi === -1) return state;
      const fs = state.fieldsets[fsi];
      const fi = fs.fields.findIndex((f) => f.id === fieldId);
      if (fi === -1) return state;

      const field = fs.fields[fi];
      if (!field.options) return state;
      const updatedOpts = field.options.filter((o) => o.id !== optionId);
      const updatedFields = [...fs.fields];
      updatedFields[fi] = { ...field, options: updatedOpts };
      const updated = [...state.fieldsets];
      updated[fsi] = { ...fs, fields: updatedFields };

      return { ...state, fieldsets: updated };
    }

    case "MOVE_FIELDSET": {
      const { fieldsetId, position } = action.payload;
      const idx = state.fieldsets.findIndex((fs) => fs.id === fieldsetId);
      if (idx === -1 || position < 0 || position >= state.fieldsets.length)
        return state;
      if (idx === position) return state;

      const fs = state.fieldsets[idx];
      const arr = state.fieldsets.filter((_, i) => i !== idx);
      arr.splice(position, 0, fs);
      return { ...state, fieldsets: arr };
    }

    case "SET_IS_DRAGGING":
      return { ...state, isDragging: action.payload.isDragging };

    case "SET_FORM_STATE":
      return {
        ...state,
        lastSaved: action.payload.lastSaved,
        isDraft: action.payload.isDraft,
      };

    case "SET_FULL_STATE":
      return action.payload;

    default:
      return state;
  }
}

export function FormBuilderProvider({ children }) {
  const [state, dispatch] = useReducer(formBuilderReducer, initialState);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const API_URL =
    "http://team.dev.helpabode.com:54292/api/wempro/react-dev/coding-test/mdmoniruzzamanbappy@gmail.com";

  useEffect(() => {
    async function loadSaved() {
      try {
        const res = await apiRequest("GET", API_URL);
        const data = await res.json();
        if (data && data.your_respons) {
          const fieldsets = data.your_respons.map((fs) => ({
            id: fs.fieldsetTextId,
            name: fs.fieldsetName,
            fields: fs.fields.map((f) => ({
              id: f.labelTextId,
              type: f.inputType === "select" ? "dropdown" : f.inputType,
              name: f.labelName.toLowerCase().replace(/\s+/g, "-"),
              label: f.labelName,
              placeholder:
                f.inputType === "text" || f.inputType === "textarea"
                  ? "Enter text here"
                  : "",
              required: false,
              options: Array.isArray(f.options)
                ? f.options.map((opt) => ({
                    id: generateUniqueId(),
                    label: opt,
                    value: opt.toLowerCase().replace(/\s+/g, "-"),
                  }))
                : undefined,
            })),
          }));

          dispatch({
            type: "SET_FULL_STATE",
            payload: { ...initialState, fieldsets },
          });
          toast({ title: "Form loaded", description: "Loaded successfully." });
        } else {
          throw new Error("Invalid response: missing your_respons");
        }
      } catch (err) {
        console.error("Load error", err);
        toast({
          title: "Error",
          description: err.message || "Unexpected error loading form.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadSaved();
  }, [toast]);

  const addFieldset = (name) => {
    const id = generateUniqueId();
    const label =
      name ||
      generateUniqueName(
        "Fieldset",
        state.fieldsets.map((fs) => fs.name)
      );
    dispatch({
      type: "ADD_FIELDSET",
      payload: { fieldset: { id, name: label, fields: [] } },
    });
    return id;
  };

  const addField = (fsId, type, position) => {
    const id = generateUniqueId();
    const fsIndex = state.fieldsets.findIndex((fs) => fs.id === fsId);
    const existing =
      fsIndex !== -1 ? state.fieldsets[fsIndex].fields.map((f) => f.name) : [];
    const name = generateUniqueName(type, existing);
    const field = {
      id,
      type,
      name,
      label: type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, " "),
      placeholder:
        type === "text" || type === "textarea" ? "Enter text here" : "",
      required: false,
    };
    if (["dropdown", "radio", "checkbox", "number-combo"].includes(type)) {
      field.options = [
        { id: generateUniqueId(), label: "Option 1", value: "option-1" },
        { id: generateUniqueId(), label: "Option 2", value: "option-2" },
      ];
    }
    dispatch({
      type: "ADD_FIELD",
      payload: { fieldsetId: fsId, field, position },
    });
  };

  const removeField = (fsId, fId) =>
    dispatch({
      type: "REMOVE_FIELD",
      payload: { fieldsetId: fsId, fieldId: fId },
    });
  const removeFieldset = (fsId) =>
    dispatch({ type: "REMOVE_FIELDSET", payload: { fieldsetId: fsId } });

  const duplicateField = (fsId, fId) => {
    const fs = state.fieldsets.find((fs) => fs.id === fsId);
    if (!fs) return;
    const orig = fs.fields.find((f) => f.id === fId);
    if (!orig) return;
    const existing = fs.fields.map((f) => f.name);
    const name = generateUniqueName(`${orig.name} copy`, existing);
    const copy = {
      ...orig,
      id: generateUniqueId(),
      name,
      options: orig.options
        ? orig.options.map((o) => ({
            id: generateUniqueId(),
            label: o.label,
            value: o.value,
          }))
        : undefined,
    };
    dispatch({
      type: "DUPLICATE_FIELD",
      payload: { fieldsetId: fsId, field: copy },
    });
  };

  const updateField = (fsId, fId, updates) =>
    dispatch({
      type: "UPDATE_FIELD",
      payload: { fieldsetId: fsId, fieldId: fId, updates },
    });

  const updateFieldset = (fsId, updates) =>
    dispatch({
      type: "UPDATE_FIELDSET",
      payload: { fieldsetId: fsId, updates },
    });

  const selectField = (fId) =>
    dispatch({ type: "SELECT_FIELD", payload: { fieldId: fId } });
  const selectFieldset = (fsId) =>
    dispatch({ type: "SELECT_FIELDSET", payload: { fieldsetId: fsId } });

  const moveField = (sId, tId, fId, pos) =>
    dispatch({
      type: "MOVE_FIELD",
      payload: {
        sourceFieldsetId: sId,
        targetFieldsetId: tId,
        fieldId: fId,
        position: pos,
      },
    });

  const moveFieldsetFn = (fsId, pos) =>
    dispatch({
      type: "MOVE_FIELDSET",
      payload: { fieldsetId: fsId, position: pos },
    });

  const addOption = (fsId, fId) => {
    const fs = state.fieldsets.find((fs) => fs.id === fsId);
    if (!fs) return;
    const field = fs.fields.find((f) => f.id === fId);
    if (!field || !field.options) return;
    const num = field.options.length + 1;
    const option = {
      id: generateUniqueId(),
      label: `Option ${num}`,
      value: `option-${num}`,
    };
    dispatch({
      type: "ADD_OPTION",
      payload: { fieldsetId: fsId, fieldId: fId, option },
    });
  };

  const updateOption = (fsId, fId, oId, label) =>
    dispatch({
      type: "UPDATE_OPTION",
      payload: { fieldsetId: fsId, fieldId: fId, optionId: oId, label },
    });

  const removeOption = (fsId, fId, oId) =>
    dispatch({
      type: "REMOVE_OPTION",
      payload: { fieldsetId: fsId, fieldId: fId, optionId: oId },
    });

  const setIsDragging = (flag) =>
    dispatch({ type: "SET_IS_DRAGGING", payload: { isDragging: flag } });

  const saveForm = async (asDraft) => {
    try {
      const payload = state.fieldsets.map((fs) => ({
        fieldsetName: fs.name,
        fieldsetTextId: fs.id,
        fields: fs.fields.map((f) => ({
          labelName: f.label,
          labelTextId: f.id,
          inputType: ["dropdown", "number-combo"].includes(f.type)
            ? "select"
            : f.type,
          options: f.options ? f.options.map((o) => o.label) : "",
        })),
      }));
      const res = await apiRequest("POST", API_URL, payload);
      if (res.ok) {
        dispatch({
          type: "SET_FORM_STATE",
          payload: { lastSaved: new Date(), isDraft: !!asDraft },
        });
        toast({
          title: asDraft ? "Draft Saved" : "Form Saved",
          description: asDraft
            ? "Your draft has been saved."
            : "Form saved successfully.",
        });
      }
    } catch (err) {
      console.error("Save error", err);
      toast({
        title: "Error",
        description: err.message || "Unexpected error saving form.",
        variant: "destructive",
      });
    }
  };

  const getSelectedField = () => {
    if (!state.selectedFieldId) return { field: null, fieldset: null };
    for (const fs of state.fieldsets) {
      const f = fs.fields.find((f) => f.id === state.selectedFieldId);
      if (f) return { field: f, fieldset: fs };
    }
    return { field: null, fieldset: null };
  };

  const contextValue = {
    state,
    addFieldset,
    addField,
    removeField,
    removeFieldset,
    duplicateField,
    updateField,
    updateFieldset,
    selectField,
    selectFieldset,
    moveField,
    moveFieldset: moveFieldsetFn,
    addOption,
    updateOption,
    removeOption,
    setIsDragging,
    saveForm,
    getSelectedField,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          <p className="mt-2 text-gray-600">Loading form builder...</p>
        </div>
      </div>
    );
  }

  return (
    <FormBuilderContext.Provider value={contextValue}>
      {children}
    </FormBuilderContext.Provider>
  );
}

export function useFormBuilder() {
  const ctx = useContext(FormBuilderContext);
  if (!ctx) {
    throw new Error("useFormBuilder must be used within a FormBuilderProvider");
  }
  return ctx;
}
