"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  MessageSquare,
  Upload,
  CreditCard,
  Bell,
  FileText,
  CheckCircle,
  Download,
  Eye,
  AlertTriangle,
  Pill,
  DollarSign,
  Search,
  Link as LinkIcon,
  CheckCircle2,
  CalendarCheck,
  ScanLine,
} from "lucide-react";

// A helper component for Quick Action items
const QuickActionButton = ({ icon: Icon, label, colorClass }) => (
  <div className="flex flex-col items-center justify-center p-4 space-y-2 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
    <Icon className={`h-6 w-6 ${colorClass}`} />
    <span className="text-sm font-medium text-gray-700">{label}</span>
  </div>
);

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Good morning, Dr. Johnson
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your practice today
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search patients..."
                className="pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl px-5 py-2.5">
              + Quick Action
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-blue-50 border-none rounded-2xl shadow-sm p-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-sm font-medium text-blue-800">
                  Today's Appointments
                </CardTitle>
                <div className="text-3xl font-bold text-blue-900 mt-2">12</div>
                <p className="text-xs text-blue-700 mt-1">+2 from yesterday</p>
              </div>
              <div className="p-3 bg-blue-600 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="bg-green-50 border-none rounded-2xl shadow-sm p-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-sm font-medium text-green-800">
                  Active Messages
                </CardTitle>
                <div className="text-3xl font-bold text-green-900 mt-2">7</div>
                <p className="text-xs text-green-700 mt-1">3 high priority</p>
              </div>
              <div className="p-3 bg-green-600 rounded-lg">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="bg-purple-50 border-none rounded-2xl shadow-sm p-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-sm font-medium text-purple-800">
                  Pending Prescriptions
                </CardTitle>
                <div className="text-3xl font-bold text-purple-900 mt-2">3</div>
                <p className="text-xs text-purple-700 mt-1">
                  Awaiting approval
                </p>
              </div>
              <div className="p-3 bg-purple-600 rounded-lg">
                <Pill className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="bg-orange-50 border-none rounded-2xl shadow-sm p-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-sm font-medium text-orange-800">
                  Outstanding Bills
                </CardTitle>
                <div className="text-3xl font-bold text-orange-900 mt-2">
                  $2,840
                </div>
                <p className="text-xs text-orange-700 mt-1">5 overdue</p>
              </div>
              <div className="p-3 bg-orange-600 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <Card className="rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-4 gap-6">
                  <QuickActionButton
                    icon={Calendar}
                    label="Schedule"
                    colorClass="text-blue-600"
                  />
                  <QuickActionButton
                    icon={FileText}
                    label="New Note"
                    colorClass="text-green-600"
                  />
                  <QuickActionButton
                    icon={LinkIcon}
                    label="Prescribe"
                    colorClass="text-purple-600"
                  />
                  <QuickActionButton
                    icon={ScanLine}
                    label="Scan Doc"
                    colorClass="text-orange-600"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-1" />
                  <div className="flex-1">
                    <p className="font-medium">Lab results reviewed</p>
                    <p className="text-sm text-gray-500">
                      John Doe • CBC panel normal values
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">2 minutes ago</p>
                </div>
                <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50">
                  <CalendarCheck className="h-5 w-5 text-blue-500 mt-1" />
                  <div className="flex-1">
                    <p className="font-medium">Appointment confirmed</p>
                    <p className="text-sm text-gray-500">
                      Sarah Johnson scheduled for today 10:30 AM
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">15 minutes ago</p>
                </div>
                <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50">
                  <Pill className="h-5 w-5 text-purple-500 mt-1" />
                  <div className="flex-1">
                    <p className="font-medium">New message from Dr. Smith</p>
                    <p className="text-sm text-gray-500">
                      Mike Wilson • Fluoxetine 20mg
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">1 hour ago</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            {/* Today's Schedule */}
            <Card className="rounded-xl shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-semibold">
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-semibold">John Doe</p>
                    <p className="text-sm text-gray-500">Follow-up • 9:00 AM</p>
                  </div>
                  <Badge className="bg-blue-600 hover:bg-blue-700">Next</Badge>
                </div>
                <div className="p-4 bg-white border-l-4 border-gray-200 rounded-lg">
                  <p className="font-semibold">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">
                    Initial Consult • 10:30 AM
                  </p>
                </div>
                <div className="p-4 bg-white border-l-4 border-gray-200 rounded-lg">
                  <p className="font-semibold">Mike Wilson</p>
                  <p className="text-sm text-gray-500">
                    Therapy Session • 2:00 PM
                  </p>
                </div>
              </CardContent>
              <div className="p-4 border-t border-gray-200">
                <Button variant="outline" className="w-full bg-white">
                  View Full Schedule
                </Button>
              </div>
            </Card>

            {/* Priority Messages */}
            <Card className="rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Priority Messages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge
                      variant="outline"
                      className="bg-red-100 text-red-700 border-red-200"
                    >
                      Urgent
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Patient Portal
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900">Mike Wilson</p>
                  <p className="text-sm text-gray-600">
                    Experiencing severe side effects from new medication
                  </p>
                  <p className="text-xs text-gray-400 mt-2">5 minutes ago</p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge
                      variant="outline"
                      className="bg-yellow-100 text-yellow-800 border-yellow-200"
                    >
                      Follow-up
                    </Badge>
                    <span className="text-xs text-gray-500">Staff Message</span>
                  </div>
                  <p className="font-semibold text-gray-900">Nurse Janet</p>
                  <p className="text-sm text-gray-600">
                    Lab results ready for John Doe's review
                  </p>
                  <p className="text-xs text-gray-400 mt-2">30 minutes ago</p>
                </div>
              </CardContent>
              <div className="p-4 border-t border-gray-200">
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
