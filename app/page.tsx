import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  MessageSquare,
  Pill,
  DollarSign,
  FileText,
  ScanLine,
  Clock,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Good morning, Dr. Johnson</h1>
            <p className="text-gray-600 mt-1">Here's what's happening with your practice today</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Calendar className="mr-2 h-4 w-4" />
            Quick Action
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">Today's Appointments</CardTitle>
              <div className="p-2 bg-blue-600 rounded-lg">
                <Calendar className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">12</div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                <p className="text-xs text-blue-700">+2 from yesterday</p>
              </div>
              <Progress value={75} className="mt-3 h-2" />
              <p className="text-xs text-blue-600 mt-1">75% capacity</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-900">Active Messages</CardTitle>
              <div className="p-2 bg-green-600 rounded-lg">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">7</div>
              <div className="flex items-center mt-2">
                <AlertTriangle className="h-3 w-3 text-orange-600 mr-1" />
                <p className="text-xs text-green-700">3 high priority</p>
              </div>
              <div className="flex space-x-1 mt-3">
                <div className="flex-1 h-2 bg-green-600 rounded"></div>
                <div className="flex-1 h-2 bg-green-600 rounded"></div>
                <div className="flex-1 h-2 bg-green-600 rounded"></div>
                <div className="flex-1 h-2 bg-orange-400 rounded"></div>
                <div className="flex-1 h-2 bg-red-400 rounded"></div>
              </div>
              <p className="text-xs text-green-600 mt-1">2 urgent responses needed</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">Pending Prescriptions</CardTitle>
              <div className="p-2 bg-purple-600 rounded-lg">
                <Pill className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">3</div>
              <div className="flex items-center mt-2">
                <Clock className="h-3 w-3 text-purple-600 mr-1" />
                <p className="text-xs text-purple-700">Awaiting approval</p>
              </div>
              <div className="flex items-center justify-between mt-3">
                <Badge variant="outline" className="text-xs">
                  2 Refills
                </Badge>
                <Badge variant="outline" className="text-xs">
                  1 New
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-red-100 border-orange-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-900">Outstanding Bills</CardTitle>
              <div className="p-2 bg-orange-600 rounded-lg">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900">$2,840</div>
              <div className="flex items-center mt-2">
                <AlertTriangle className="h-3 w-3 text-red-600 mr-1" />
                <p className="text-xs text-orange-700">5 overdue</p>
              </div>
              <Progress value={65} className="mt-3 h-2" />
              <p className="text-xs text-orange-600 mt-1">65% collection rate</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center space-y-2 hover:bg-blue-50 hover:border-blue-300 transition-colors bg-transparent"
                >
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">Schedule</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center space-y-2 hover:bg-green-50 hover:border-green-300 transition-colors bg-transparent"
                >
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">New Note</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center space-y-2 hover:bg-purple-50 hover:border-purple-300 transition-colors bg-transparent"
                >
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Pill className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium">Prescribe</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center space-y-2 hover:bg-orange-50 hover:border-orange-300 transition-colors bg-transparent"
                >
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <ScanLine className="h-5 w-5 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium">Scan Doc</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Today's Schedule section */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Today's Schedule</CardTitle>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                View Full Schedule
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">JD</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">John Doe</p>
                    <p className="text-xs text-gray-600">Follow-up • 9:00 AM</p>
                  </div>
                </div>
                <Badge className="bg-blue-600 text-white">Next</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">SJ</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">Sarah Johnson</p>
                    <p className="text-xs text-gray-600">Initial Consult • 10:30 AM</p>
                  </div>
                </div>
                <Badge variant="outline">Scheduled</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">MW</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">Mike Wilson</p>
                    <p className="text-xs text-gray-600">Therapy Session • 2:00 PM</p>
                  </div>
                </div>
                <Badge variant="outline">Scheduled</Badge>
              </div>

              <div className="text-center pt-2">
                <Button variant="link" className="text-sm text-blue-600 hover:text-blue-700">
                  View All Appointments
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Priority Messages section */}
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Priority Messages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="destructive" className="text-xs">
                      Urgent
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      Patient Portal
                    </Badge>
                  </div>
                  <p className="font-medium text-sm text-gray-900">Mike Wilson</p>
                  <p className="text-xs text-gray-600 mt-1">Experiencing severe side effects from new medication</p>
                  <p className="text-xs text-gray-400 mt-2">5 minutes ago</p>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className="text-xs bg-yellow-500 hover:bg-yellow-600">Follow-up</Badge>
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      Staff Message
                    </Badge>
                  </div>
                  <p className="font-medium text-sm text-gray-900">Nurse Janet</p>
                  <p className="text-xs text-gray-600 mt-1">Lab results ready for John Doe's review</p>
                  <p className="text-xs text-gray-400 mt-2">30 minutes ago</p>
                </div>

                <div className="text-center pt-2">
                  <Button variant="link" className="text-sm text-blue-600 hover:text-blue-700">
                    View All Messages
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Added Recent Activity section */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Lab results reviewed</p>
                    <p className="text-xs text-gray-600">John Doe - CBC panel normal values</p>
                    <p className="text-xs text-gray-400">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Appointment confirmed</p>
                    <p className="text-xs text-gray-600">Sarah Johnson scheduled for today 10:30 AM</p>
                    <p className="text-xs text-gray-400">15 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Prescription sent</p>
                    <p className="text-xs text-gray-600">Mike Wilson - Fluoxetine 20mg</p>
                    <p className="text-xs text-gray-400">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Document uploaded</p>
                    <p className="text-xs text-gray-600">Insurance card scanned for Sarah Johnson</p>
                    <p className="text-xs text-gray-400">2 hours ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
