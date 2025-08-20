import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MessageSquare, Upload, CreditCard, Bell, FileText, CheckCircle } from "lucide-react"

export default function PatientPortal() {
  return (
    <MainLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Patient Portal</h1>
            <p className="text-gray-600">Welcome back, John Doe</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 flex items-center">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
          <Button variant="ghost" className="bg-white shadow-sm">
            Overview
          </Button>
          <Button variant="ghost">Appointments</Button>
          <Button variant="ghost">Medical Records</Button>
          <Button variant="ghost">Messages</Button>
          <Button variant="ghost">Billing</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-blue-50 hover:border-blue-300 transition-colors bg-transparent"
                >
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">Schedule Appointment</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-green-50 hover:border-green-300 transition-colors bg-transparent"
                >
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">Send Message</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-purple-50 hover:border-purple-300 transition-colors bg-transparent"
                >
                  <Upload className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium">Upload Document</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-orange-50 hover:border-orange-300 transition-colors bg-transparent"
                >
                  <CreditCard className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium">Pay Bill</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* My Information */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>My Information</CardTitle>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                Update Information
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder.svg?height=48&width=48" alt="John Doe" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">John Doe</p>
                  <p className="text-sm text-gray-600">Patient ID: P001</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name</span>
                  <span className="font-medium">John Doe</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Patient ID</span>
                  <span className="font-medium">P001</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date of Birth</span>
                  <span className="font-medium">3/15/1985</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone</span>
                  <span className="font-medium">(555) 123-4567</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium">john.doe@email.com</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Upcoming Appointments</CardTitle>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                Schedule New Appointment
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-sm">Dr. Smith</p>
                  <Badge className="bg-blue-600 text-white">confirmed</Badge>
                </div>
                <p className="text-xs text-gray-600">Follow-up</p>
                <p className="text-xs text-gray-600">8/15/2024 at 2:00 PM</p>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-sm">Dr. Brown</p>
                  <Badge variant="outline">scheduled</Badge>
                </div>
                <p className="text-xs text-gray-600">Therapy Session</p>
                <p className="text-xs text-gray-600">8/22/2024 at 10:30 AM</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Lab results are ready</p>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                      View
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600">CBC panel completed • Aug 10, 2024</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Appointment confirmed</p>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                      Details
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600">Dr. Smith • Aug 15, 2:00 PM</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MessageSquare className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">New message from Dr. Smith</p>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                      Read
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600">Regarding your recent visit</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Health Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="font-medium text-green-900">All Clear</p>
                </div>
                <p className="text-sm text-green-700">
                  Your recent lab results show normal values across all tested parameters.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Blood Pressure</span>
                  <span className="text-sm font-medium">120/80 mmHg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Heart Rate</span>
                  <span className="text-sm font-medium">72 bpm</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Weight</span>
                  <span className="text-sm font-medium">165 lbs</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Visit</span>
                  <span className="text-sm font-medium">Aug 10, 2024</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
