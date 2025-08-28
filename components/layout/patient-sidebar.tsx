"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MessageSquare,
  DollarSign,
  ClipboardList,
  Video,
  Pill,
  UserCircle,
  X,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  Clock,
} from "lucide-react";

// Patient-specific navigation
const patientNavigation = [
  { name: "Dashboard", href: "/patient-portal", icon: HeartPulse },
  {
    name: "Appointments",
    href: "/patient-portal/appointments",
    icon: Calendar,
  },
  { name: "Messages", href: "/patient-portal/messaging", icon: MessageSquare },
  {
    name: "Documents",
    href: "/patient-portal/documents",
    icon: ClipboardList,
  },
  { name: "Billing", href: "/patient-portal/billing", icon: DollarSign },
  { name: "Prescriptions", href: "/patient-portal/prescriptions", icon: Pill },
  { name: "Telehealth", href: "/patient-portal/telehealth", icon: Video },
];

export function PatientSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("patient-sidebar-collapsed");
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "patient-sidebar-collapsed",
        JSON.stringify(isCollapsed)
      );
    }
  }, [isCollapsed]);

  const handleNavClick = () => {
    if (isMobile) {
      onClose();
    }
  };

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
          "fixed top-0 left-0 h-full flex flex-col bg-blue-50 border-r border-blue-200 z-40",
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
        <div className="flex h-16 items-center justify-center px-4 border-b border-blue-200 shrink-0 bg-blue-100">
          {isCollapsed && !isMobile ? (
            /* Collapsed state - Logo and arrow together */
            <div className="flex items-center justify-center space-x-1">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <Button
                onClick={toggleCollapse}
                variant="ghost"
                size="icon"
                className="w-6 h-6 p-0 hover:bg-blue-200"
                aria-label="Expand sidebar"
              >
                <ChevronRight className="h-4 w-4 text-blue-700" />
              </Button>
            </div>
          ) : (
            /* Expanded state - Logo with text and separate arrow */
            <>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Stethoscope className="h-6 w-6 text-white p-0.5" />
                </div>
                {!isMobile && (
                  <div>
                    <h1 className="text-lg font-semibold text-blue-800">
                      Patient Portal
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
          {patientNavigation.map((item) => {
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
                      ? "bg-blue-100 text-blue-800"
                      : "text-blue-700 hover:bg-blue-100 hover:text-blue-900"
                  )}
                >
                  <item.icon
                    className={cn(
                      isCollapsed && !isMobile ? "h-6 w-6" : "h-5 w-5 mr-3",
                      isActive ? "text-blue-800" : "text-blue-600"
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

        {/* Patient-specific footer information */}
        {!isCollapsed && !isMobile && (
          <div className="p-4 mt-auto border-t border-blue-200 bg-blue-100">
            <div className="flex items-center space-x-2 text-blue-800">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-medium">
                24/7 Access to Your Health Information
              </span>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
}
