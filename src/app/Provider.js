"use client";

import { FormBuilderProvider } from "@/context/FormBuilderContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BaseLayout from "./BaseLayout";

function Provider({ children }) {
  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <FormBuilderProvider>
          <BaseLayout>{children}</BaseLayout>
        </FormBuilderProvider>
      </DndProvider>
    </>
  );
}

export default Provider;
