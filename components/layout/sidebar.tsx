"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useState, useEffect } from "react";
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
  X,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  TrendingUp, // Added icon for Results Review
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Appointments", href: "/appointments", icon: Calendar },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "Patient Intake", href: "/patient-intake", icon: FileText },
  { name: "Patient Portal", href: "/patient-portal", icon: UserCircle },
  { name: "Secure Messaging", href: "/messaging", icon: MessageSquare },
  { name: "Billing", href: "/billing", icon: DollarSign },
  // { name: "e-Prescription", href: "/e-prescription", icon: Pill },
  { name: "Telemedicine", href: "/telemedicine", icon: Video },
  { name: "Documents", href: "/documents", icon: ClipboardList },
  { name: "Results Review", href: "/results-review", icon: TrendingUp }, // Added new Results Review link
  { name: "File Management", href: "/file-management", icon: FolderOpen },
  { name: "OCR Workflow", href: "/ocr-workflow", icon: ScanLine },
];

export function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Initialize from localStorage if available
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebar-collapsed");
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);

      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Save collapse state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar-collapsed", JSON.stringify(isCollapsed));
    }
  }, [isCollapsed]);

  // Handle navigation click
  const handleNavClick = () => {
    if (isMobile) {
      onClose();
    }
  };

  // Toggle sidebar collapse (desktop only)
  const toggleCollapse = () => {
    if (!isMobile) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <Fragment>
      {/* Overlay for mobile */}
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
          "fixed top-0 left-0 h-full flex flex-col bg-white border-r border-gray-200 z-40",
          "transition-all duration-300 ease-in-out",
          // Mobile behavior
          isMobile && (isOpen ? "translate-x-0" : "-translate-x-full"),
          isMobile && "w-64",
          // Desktop behavior
          !isMobile && "relative translate-x-0 flex",
          !isMobile && (isCollapsed ? "w-16" : "w-64")
        )}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-center px-4 border-b border-gray-200 shrink-0">
          {isCollapsed && !isMobile ? (
            /* Collapsed state - Logo and arrow together */
            <div className="flex items-center justify-center space-x-1">
              <div className="w-8 h-8 bg-blue-800 rounded-lg flex items-center justify-center">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <Button
                onClick={toggleCollapse}
                variant="ghost"
                size="icon"
                className="w-6 h-6 p-0 hover:bg-gray-100"
                aria-label="Expand sidebar"
              >
                <ChevronRight className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
          ) : (
            /* Expanded state - Logo with text and separate arrow */
            <>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-800 rounded-lg flex items-center justify-center">
                  <Stethoscope className="h-6 w-6 text-white p-0.5" />
                </div>
                {!isMobile && (
                  <div>
                    <h1 className="text-lg font-semibold text-gray-900">
                      Daisy
                    </h1>
                  </div>
                )}
              </div>

              {/* Close button (mobile) / Collapse button (desktop) */}
              {isMobile ? (
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Close sidebar"
                >
                  <X className="h-6 w-6" />
                </Button>
              ) : (
                <Button
                  onClick={toggleCollapse}
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex"
                  aria-label="Collapse sidebar"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              )}
            </>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-visible">
          {navigation.map((item) => {
            const isActive = pathname === item.href;

            return (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  onClick={handleNavClick}
                  className={cn(
                    "flex items-center text-sm font-medium rounded-lg transition-colors relative",
                    isCollapsed && !isMobile
                      ? "px-2 py-3 justify-center w-12 h-12 mx-auto"
                      : "px-3 py-2",
                    isActive
                      ? "bg-blue-50 text-blue-800"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon
                    className={cn(
                      isCollapsed && !isMobile ? "h-6 w-6" : "h-5 w-5 mr-3",
                      isActive ? "text-blue-800" : "text-gray-400"
                    )}
                  />
                  {(!isCollapsed || isMobile) && item.name}
                </Link>

                {/* Tooltip for collapsed state */}
                {isCollapsed && !isMobile && (
                  <div className="absolute left-16 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-[60] pointer-events-none shadow-lg">
                    {item.name}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </Fragment>
  );
}
