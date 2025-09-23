"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  X,
  ChevronLeft,
  ChevronRight,
  PanelLeft,
  Stethoscope,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", initial: "D" },
  { name: "Appointments", href: "/appointments", initial: "A" },
  { name: "Patients", href: "/patients", initial: "P" },
  { name: "Patient Intake", href: "/patient-intake", initial: "PI" },
  { name: "Secure Messaging", href: "/messaging", initial: "SM" },
  { name: "Billing", href: "/billing", initial: "B" },
  { name: "Telemedicine", href: "/telemedicine", initial: "T" },
  { name: "File Management", href: "/file-management", initial: "FM" },
  { name: "OCR Workflow", href: "/ocr-workflow", initial: "O" },
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
  const [isHovered, setIsHovered] = useState(false);

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

  // Determine if sidebar should show expanded content
  const shouldShowExpanded = !isCollapsed || isMobile || isHovered;

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
          !isMobile && (shouldShowExpanded ? "w-64" : "w-16")
        )}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 shrink-0">
          <div className="flex items-center space-x-2 min-w-0">
            {/* Logo - changes based on collapsed state and hover */}
            <div className="w-8 h-8 bg-blue-800 rounded-lg flex items-center justify-center shrink-0">
              {isCollapsed && !isMobile && !isHovered ? (
                <PanelLeft className="h-5 w-5 text-white" />
              ) : (
                <Stethoscope className="text-white" />
              )}
            </div>

            {/* App name - show/hide with smooth transition */}
            <div
              className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                shouldShowExpanded ? "w-auto opacity-100" : "w-0 opacity-0"
              )}
            >
              <h1 className="text-lg font-semibold text-gray-900 whitespace-nowrap">
                Daisy
              </h1>
            </div>
          </div>

          {/* Close button (mobile) / Collapse button (desktop) */}
          <div
            className={cn(
              "transition-all duration-300 ease-in-out shrink-0",
              shouldShowExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
            )}
          >
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
                className="hidden md:flex hover:bg-gray-100"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <ChevronLeft className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-visible">
          {navigation.map((item) => {
            const isActive = pathname === item.href;

            return (
              <div key={item.name} className="relative">
                <Link
                  href={item.href}
                  onClick={handleNavClick}
                  className={cn(
                    "flex items-center text-sm font-medium rounded-lg transition-all duration-200 ease-in-out relative group",
                    isCollapsed && !isMobile && !isHovered
                      ? "px-2 py-3 justify-center w-12 h-12 mx-auto"
                      : "px-3 py-2",
                    isActive
                      ? "bg-blue-50 text-blue-800"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  {/* Initial letter circle */}
                  <div
                    className={cn(
                      "rounded-full flex items-center justify-center font-semibold transition-all duration-200 ease-in-out shrink-0",
                      isCollapsed && !isMobile && !isHovered
                        ? "w-8 h-8 text-xs"
                        : "w-6 h-6 text-xs",
                      (!isCollapsed || isMobile || isHovered) && "mr-3",
                      isActive
                        ? "bg-blue-200 text-blue-800"
                        : "bg-gray-100 text-gray-600"
                    )}
                  >
                    {item.initial}
                  </div>

                  {/* Text with smooth transition */}
                  <span
                    className={cn(
                      "transition-all duration-300 ease-in-out whitespace-nowrap",
                      shouldShowExpanded
                        ? "opacity-100 w-auto"
                        : "opacity-0 w-0 overflow-hidden"
                    )}
                  >
                    {item.name}
                  </span>
                </Link>

                {/* Tooltip for collapsed state when not hovering */}
                {isCollapsed && !isMobile && !isHovered && (
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
