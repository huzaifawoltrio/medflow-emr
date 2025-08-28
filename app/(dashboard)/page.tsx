"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { getUserDetails } from "../redux/features/auth/authActions";
import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MessageSquare,
  Pill,
  DollarSign,
  Search,
  Link as LinkIcon,
  CheckCircle2,
  CalendarCheck,
  ScanLine,
  FileText,
  Loader2,
} from "lucide-react";
import type { ComponentType } from "react";
import Link from "next/link";

// A helper component for Quick Action items
const QuickActionButton = ({
  icon: Icon,
  label,
  colorClass,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  colorClass: string;
}) => (
  <div className="flex flex-col items-center justify-center p-3 space-y-2 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer text-center">
    <div className={`p-2 rounded-full bg-${colorClass}-100`}>
      <Icon className={`h-5 w-5 text-${colorClass}-600`} />
    </div>
    <span className="text-xs sm:text-sm font-medium text-gray-700">
      {label}
    </span>
  </div>
);

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // Fetch user details if not already present in the store
    if (!user) {
      dispatch(getUserDetails());
    }
  }, [dispatch, user]);

  const doctorName = user ? `${user.first_name} ${user.last_name}` : "Doctor";

  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {loading ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                `Good morning, Dr. ${doctorName}`
              )}
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your practice today.
            </p>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search patients..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 w-full"
              />
            </div>
          </div>
        </div>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="bg-blue-50 border-none rounded-xl shadow-sm">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <CardTitle className="text-sm font-medium text-blue-800">
                  Appointments
                </CardTitle>
                <div className="text-2xl md:text-3xl font-bold text-blue-900 mt-2">
                  12
                </div>
              </div>
              <div className="p-3 bg-blue-800 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-none rounded-xl shadow-sm">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <CardTitle className="text-sm font-medium text-green-800">
                  Active Messages
                </CardTitle>
                <div className="text-2xl md:text-3xl font-bold text-green-900 mt-2">
                  7
                </div>
              </div>
              <div className="p-3 bg-green-600 rounded-lg">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-none rounded-xl shadow-sm">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <CardTitle className="text-sm font-medium text-purple-800">
                  Pending Rx
                </CardTitle>
                <div className="text-2xl md:text-3xl font-bold text-purple-900 mt-2">
                  3
                </div>
              </div>
              <div className="p-3 bg-purple-600 rounded-lg">
                <Pill className="h-6 w-6 text-white" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-none rounded-xl shadow-sm">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <CardTitle className="text-sm font-medium text-orange-800">
                  Outstanding Bills
                </CardTitle>
                <div className="text-2xl md:text-3xl font-bold text-orange-900 mt-2">
                  $2.8k
                </div>
              </div>
              <div className="p-3 bg-orange-600 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Quick Actions */}
            <Card className="rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl font-semibold">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Responsive grid for actions */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Link href="/appointments">
                    <QuickActionButton
                      icon={Calendar}
                      label="Schedule"
                      colorClass="blue"
                    />
                  </Link>
                  <Link href="/clinical-notes">
                    <QuickActionButton
                      icon={FileText}
                      label="New Note"
                      colorClass="green"
                    />
                  </Link>
                  <Link href="/e-prescription">
                    <QuickActionButton
                      icon={LinkIcon}
                      label="Prescribe"
                      colorClass="purple"
                    />
                  </Link>
                  <Link href="/ocr-workflow">
                    <QuickActionButton
                      icon={ScanLine}
                      label="Scan Doc"
                      colorClass="orange"
                    />
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl font-semibold">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Lab results reviewed</p>
                    <p className="text-xs text-gray-500">
                      John Doe • CBC panel normal
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    2m ago
                  </p>
                </div>
                <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <CalendarCheck className="h-5 w-5 text-blue-800 mt-1 shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Appointment confirmed</p>
                    <p className="text-xs text-gray-500">
                      S. Johnson • Today 10:30 AM
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    15m ago
                  </p>
                </div>
                <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <Pill className="h-5 w-5 text-purple-500 mt-1 shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Prescription sent</p>
                    <p className="text-xs text-gray-500">
                      Mike Wilson • Fluoxetine 20mg
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    1h ago
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 md:space-y-8">
            {/* Today's Schedule */}
            <Card className="rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl font-semibold">
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 border-l-4 border-blue-800 rounded-md flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-sm">John Doe</p>
                    <p className="text-xs text-gray-500">Follow-up • 9:00 AM</p>
                  </div>
                  <Badge className="bg-blue-800 hover:bg-blue-700 text-xs">
                    Next
                  </Badge>
                </div>
                <div className="p-3 bg-white border-l-4 border-gray-200 rounded-md">
                  <p className="font-semibold text-sm">Sarah Johnson</p>
                  <p className="text-xs text-gray-500">
                    Initial Consult • 10:30 AM
                  </p>
                </div>
                <div className="p-3 bg-white border-l-4 border-gray-200 rounded-md">
                  <p className="font-semibold text-sm">Mike Wilson</p>
                  <p className="text-xs text-gray-500">
                    Therapy Session • 2:00 PM
                  </p>
                </div>
              </CardContent>
              <div className="p-4 border-t border-gray-100">
                <Button variant="outline" className="w-full bg-white">
                  View Full Schedule
                </Button>
              </div>
            </Card>

            {/* Priority Messages */}
            <Card className="rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl font-semibold">
                  Priority Messages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge
                      variant="destructive"
                      className="bg-red-100 text-red-700 border-red-200"
                    >
                      Urgent
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Patient Portal
                    </span>
                  </div>
                  <p className="font-semibold text-sm text-gray-900">
                    Mike Wilson
                  </p>
                  <p className="text-xs text-gray-600">
                    Experiencing severe side effects...
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge
                      variant="outline"
                      className="bg-yellow-100 text-yellow-800 border-yellow-200"
                    >
                      Follow-up
                    </Badge>
                    <span className="text-xs text-gray-500">Staff Message</span>
                  </div>
                  <p className="font-semibold text-sm text-gray-900">
                    Nurse Janet
                  </p>
                  <p className="text-xs text-gray-600">
                    Lab results ready for J. Doe's review
                  </p>
                </div>
              </CardContent>
              <div className="p-4 border-t border-gray-100">
                <Button variant="outline" className="w-full bg-white">
                  View All Messages
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
