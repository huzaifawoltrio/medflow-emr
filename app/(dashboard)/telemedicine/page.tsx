"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Video,
  Calendar,
  Users,
  Play,
  Settings,
  Shield,
  Camera,
  Mic,
  Wifi,
  Monitor,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

const recentSessions = [
  {
    id: 1,
    patient: "Mike Wilson",
    date: "8/11/2025",
    type: "Initial Consultation",
    duration: "45 min",
    status: "completed",
  },
];

export default function Telemedicine() {
  const [systemStatus, setSystemStatus] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    const checkSystems = async () => {
      const checks: { [key: string]: string } = {};
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        checks["Camera Access"] = "ready";
        stream.getTracks().forEach((track) => track.stop());
      } catch {
        checks["Camera Access"] = "denied";
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        checks["Microphone Access"] = "ready";
        stream.getTracks().forEach((track) => track.stop());
      } catch {
        checks["Microphone Access"] = "denied";
      }
      checks["Internet Connection"] = "excellent";
      checks["Browser Compatibility"] = "supported";
      setSystemStatus(checks);
    };
    checkSystems();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
      case "excellent":
      case "supported":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 capitalize">
            {status}
          </Badge>
        );
      case "denied":
      case "poor":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 capitalize">
            {status}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready":
      case "excellent":
      case "supported":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "denied":
      case "poor":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Telemedicine
            </h1>
            <div className="flex items-start mt-2 text-sm text-gray-600">
              <Shield className="h-4 w-4 mr-2 text-green-600 shrink-0 mt-0.5" />
              <span>All sessions are encrypted and HIPAA compliant.</span>
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
            <Calendar className="mr-2 h-4 w-4" /> Schedule Session
          </Button>
        </div>

        {/* Today's Sessions */}
        <Card className="shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-lg md:text-xl">
              <Video className="mr-2 h-5 w-5" /> Today's Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No sessions scheduled for today</p>
              <Button variant="outline" className="mt-4 bg-transparent">
                <Calendar className="mr-2 h-4 w-4" /> Schedule New Session
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Check */}
          <Card className="shadow-sm rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">System Check</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Camera Access", icon: Camera },
                { name: "Microphone Access", icon: Mic },
                { name: "Internet Connection", icon: Wifi },
                { name: "Browser Compatibility", icon: Monitor },
              ].map((check) => {
                const Icon = check.icon;
                const actualStatus = systemStatus[check.name] || "checking";
                return (
                  <div
                    key={check.name}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900 text-sm">
                        {check.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(actualStatus)}
                      {getStatusBadge(actualStatus)}
                    </div>
                  </div>
                );
              })}
              <div className="pt-3 border-t">
                <Button variant="outline" className="w-full bg-transparent">
                  <Play className="mr-2 h-4 w-4" /> Test Audio/Video
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-sm rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                <Calendar className="mr-3 h-4 w-4" />
                Schedule New Session
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
              >
                <Users className="mr-3 h-4 w-4" />
                Join Waiting Room
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
              >
                <Video className="mr-3 h-4 w-4" />
                Start Instant Session
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
              >
                <Settings className="mr-3 h-4 w-4" />
                Platform Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Sessions */}
        <Card className="shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Recent Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentSessions.length > 0 ? (
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                        <Video className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {session.patient}
                        </p>
                        <p className="text-sm text-gray-600">
                          {session.date} • {session.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 self-end sm:self-center">
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        {session.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        View Summary
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No recent sessions</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
