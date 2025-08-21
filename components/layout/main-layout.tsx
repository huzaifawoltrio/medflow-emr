"use client";

import { useState } from "react";
import type React from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * The main layout for the entire dashboard.
 * It manages the state for the mobile sidebar and orchestrates the
 * interaction between the Header and Sidebar components.
 */
export function MainLayout({ children }: MainLayoutProps) {
  // State to manage the sidebar's visibility on mobile screens.
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* The Sidebar component receives props to control its visibility.
        It will adapt its own presentation based on whether it's on mobile or desktop.
      */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* The Header component receives a function to toggle the sidebar,
          which it will call from the mobile menu button.
        */}
        <Header onSidebarOpen={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
