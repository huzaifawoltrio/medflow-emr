"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  FileText,
  MessageSquare,
  DollarSign,
  Pill,
  Video,
  ClipboardList,
  FolderOpen,
  ScanLine,
  LayoutDashboard,
  UserCircle,
  Users,
  X, // Close icon
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Appointments", href: "/appointments", icon: Calendar },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "Patient Intake", href: "/patient-intake", icon: FileText },
  { name: "Patient Portal", href: "/patient-portal", icon: UserCircle },
  { name: "Secure Messaging", href: "/messaging", icon: MessageSquare },
  { name: "Billing", href: "/billing", icon: DollarSign },
  { name: "e-Prescription", href: "/prescriptions", icon: Pill },
  { name: "Telemedicine", href: "/telemedicine", icon: Video },
  { name: "Clinical Notes", href: "/clinical-notes", icon: ClipboardList },
  { name: "File Management", href: "/file-management", icon: FolderOpen },
  { name: "OCR Workflow", href: "/ocr-workflow", icon: ScanLine },
];

/**
 * The main navigation sidebar for the dashboard.
 * On mobile, it acts as a slide-in drawer.
 * On desktop, it is a fixed, visible panel.
 * @param {object} props - The component props.
 * @param {boolean} props.isOpen - Whether the sidebar is open on mobile.
 * @param {() => void} props.onClose - Function to call to close the sidebar.
 */
export function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <Fragment>
      {/* Overlay for mobile: Appears behind the sidebar when it's open.
        Clicking it will close the sidebar. It is hidden on desktop screens.
      */}
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 bg-black/60 z-30 transition-opacity md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        aria-hidden="true"
      />

      {/* The Sidebar panel */}
      <div
        className={cn(
          // Base styles for positioning and transition
          "fixed top-0 left-0 h-full w-64 flex flex-col bg-white border-r border-gray-200 z-40",
          "transition-transform duration-300 ease-in-out",
          // Mobile state: Translate based on the 'isOpen' prop
          isOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop styles: Override mobile positioning to be static
          "md:relative md:translate-x-0 md:flex"
        )}
      >
        {/* Sidebar Header: Contains logo and a close button for mobile */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                MedFlow EMR
              </h1>
            </div>
          </div>
          {/* Close button: Only visible on mobile screens */}
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose} // On mobile, clicking a link closes the sidebar
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5",
                    isActive ? "text-blue-600" : "text-gray-400"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </Fragment>
  );
}
