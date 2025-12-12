"use client";

import React from 'react';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Sidebar } from "@/components/sidebar";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";

export const SidebarSheet = () => {
  const { isSidebarOpen, closeSidebar } = useSidebarToggle();

  // The sidebar content is wrapped in a Sheet, which acts as a drawer on all screen sizes.
  // The padding top is adjusted to account for the fixed header (assuming Header is fixed).
  return (
    <Sheet open={isSidebarOpen} onOpenChange={closeSidebar}>
      <SheetContent side="left" className="w-72 p-0 pt-16 sm:pt-0 flex flex-col">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};