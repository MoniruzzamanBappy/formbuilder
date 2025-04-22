"use client";

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FormBuilderProvider } from "@/context/FormBuilderContext";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function BaseLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DndProvider backend={HTML5Backend}>
          <FormBuilderProvider>
            {children}
            <Toaster />
          </FormBuilderProvider>
        </DndProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default BaseLayout;
