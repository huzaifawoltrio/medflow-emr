"use client";

import { useState } from "react";
import type React from "react";
import { PatientSidebar } from "../../components/layout/patient-sidebar"; // Using the new patient-specific sidebar
import { Header } from "@/components/layout/header"; // Reusing the existing header

interface PatientLayoutProps {
  children: React.ReactNode;
}

/**
 * The dedicated layout for the patient portal.
 * It uses the PatientSidebar and the shared Header component.
 */
export default function PatientLayout({ children }: PatientLayoutProps) {
  // State to manage the sidebar's visibility on mobile screens.
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* The PatientSidebar component for patient-specific navigation. */}
      <PatientSidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* The shared Header component. */}
        <Header onSidebarOpen={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
