"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PatientPortal() {
  const [activeTab, setActiveTab] = useState("overview");

  const renderOverview = () => (
    <>
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
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center space-y-2 text-center"
                >
                  <Calendar className="h-6 w-6 text-blue-600" />
                  <span className="text-sm font-medium">
                    Schedule Appointment
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center space-y-2 text-center"
                >
                  <MessageSquare className="h-6 w-6 text-green-600" />
                  <span className="text-sm font-medium">Send Message</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center space-y-2 text-center"
                >
                  <Upload className="h-6 w-6 text-purple-600" />
                  <span className="text-sm font-medium">Upload Document</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center space-y-2 text-center"
                >
                  <CreditCard className="h-6 w-6 text-orange-600" />
                  <span className="text-sm font-medium">Pay Bill</span>
                </Button>
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
                <FileText className="h-5 w-5 text-blue-500 mt-1 shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Lab results are ready</p>
                  <p className="text-xs text-gray-500">
                    CBC panel - Aug 10, 2024
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="shrink-0">
                  View
                </Button>
              </div>
              <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Appointment confirmed</p>
                  <p className="text-xs text-gray-500">
                    Dr. Smith - Aug 15, 2:00 PM
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="shrink-0">
                  Details
                </Button>
              </div>
              <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
                <MessageSquare className="h-5 w-5 text-purple-500 mt-1 shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    New message from Dr. Smith
                  </p>
                  <p className="text-xs text-gray-500">
                    Regarding your recent visit
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="shrink-0">
                  Read
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 md:space-y-8">
          {/* My Information */}
          <Card className="rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl font-semibold">
                My Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500">Name</span>
                <p className="font-medium">John Doe</p>
              </div>
              <div>
                <span className="text-gray-500">Patient ID</span>
                <p className="font-medium">P001</p>
              </div>
              <div>
                <span className="text-gray-500">Date of Birth</span>
                <p className="font-medium">3/15/1985</p>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Update Information
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card className="rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl font-semibold">
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-white border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">Dr. Smith</p>
                    <p className="text-sm text-gray-500">Follow-up</p>
                    <p className="text-sm text-gray-500">
                      8/15/2024 at 2:00 PM
                    </p>
                  </div>
                  <Badge className="bg-blue-600 text-white">confirmed</Badge>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Schedule New Appointment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );

  const renderAppointments = () => (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <CardTitle className="text-xl font-semibold">My Appointments</CardTitle>
        <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
          Schedule New
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 border rounded-lg flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <p className="font-semibold">Dr. Smith</p>
            <p className="text-sm text-gray-500">Follow-up</p>
            <p className="text-sm text-gray-500">8/15/2024 at 2:00 PM</p>
          </div>
          <div className="flex items-center space-x-2 self-end md:self-center">
            <Badge className="bg-blue-100 text-blue-800">confirmed</Badge>
            <Button variant="ghost" size="sm">
              Reschedule
            </Button>
            <Button variant="ghost" size="sm">
              Cancel
            </Button>
          </div>
        </div>
        <div className="p-4 border rounded-lg flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <p className="font-semibold">Dr. Brown</p>
            <p className="text-sm text-gray-500">Therapy Session</p>
            <p className="text-sm text-gray-500">8/22/2024 at 10:30 AM</p>
          </div>
          <div className="flex items-center space-x-2 self-end md:self-center">
            <Badge variant="outline">scheduled</Badge>
            <Button variant="ghost" size="sm">
              Reschedule
            </Button>
            <Button variant="ghost" size="sm">
              Cancel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderMedicalRecords = () => (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <CardTitle className="text-xl font-semibold">Medical Records</CardTitle>
        <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
          <Upload className="mr-2 h-4 w-4" /> Upload Document
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-500 shrink-0" />
            <div>
              <p className="font-semibold">Lab Results - CBC</p>
              <p className="text-sm text-gray-500">Lab Report • 8/10/2024</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 self-end sm:self-center">
            <Button variant="ghost" size="icon">
              <Eye className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Download className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-500 shrink-0" />
            <div>
              <p className="font-semibold">Progress Note - Session 5</p>
              <p className="text-sm text-gray-500">Clinical Note • 8/8/2024</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 self-end sm:self-center">
            <Button variant="ghost" size="icon">
              <Eye className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Download className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderMessages = () => (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <CardTitle className="text-xl font-semibold">Messages</CardTitle>
        <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
          New Message
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="p-4 border rounded-lg flex justify-between items-start bg-blue-50 border-blue-200">
          <div>
            <p className="font-semibold">Dr. Smith</p>
            <p className="text-sm text-gray-600">Lab Results Available</p>
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Read Message
            </a>
          </div>
          <div className="text-right shrink-0">
            <Badge className="mb-1">New</Badge>
            <p className="text-xs text-gray-500">8/12/2024</p>
          </div>
        </div>
        <div className="p-4 border rounded-lg flex justify-between items-start">
          <div>
            <p className="font-semibold">Billing Department</p>
            <p className="text-sm text-gray-600">Payment Reminder</p>
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Read Message
            </a>
          </div>
          <p className="text-xs text-gray-500 shrink-0">8/10/2024</p>
        </div>
      </CardContent>
    </Card>
  );

  const renderBilling = () => (
    <div className="space-y-6">
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-3">
        <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
        <p className="text-sm text-yellow-800">
          You have an outstanding balance of $150.00. Please review and pay your
          bills below.
        </p>
      </div>
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Billing & Payments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <p className="font-semibold">Office Visit - Dr. Smith</p>
                <p className="text-sm text-gray-500">Date: Aug 2, 2024</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-lg">$150.00</p>
                <Badge variant="destructive">Due</Badge>
              </div>
            </div>
            <div className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <p className="font-semibold">Lab Work - CBC Panel</p>
                <p className="text-sm text-gray-500">Date: Jul 28, 2024</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-lg">$85.00</p>
                <Badge className="bg-green-100 text-green-800">Paid</Badge>
              </div>
            </div>
          </div>
          <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
            Pay Outstanding Balance ($150.00)
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "appointments":
        return renderAppointments();
      case "records":
        return renderMedicalRecords();
      case "messages":
        return renderMessages();
      case "billing":
        return renderBilling();
      default:
        return renderOverview();
    }
  };

  const tabs = ["overview", "appointments", "records", "messages", "billing"];

  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Patient Portal
            </h1>
            <p className="text-gray-600 mt-1">Welcome back, John Doe</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
            <Bell className="mr-2 h-4 w-4" /> Notifications
          </Button>
        </div>

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap",
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {renderContent()}
      </div>
    </MainLayout>
  );
}
