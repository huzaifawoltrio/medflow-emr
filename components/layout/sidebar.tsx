"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
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
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Appointments", href: "/appointments", icon: Calendar },
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

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">MedFlow EMR</h1>
            <p className="text-xs text-gray-500">
              Healthcare Management System
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
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
  );
}
