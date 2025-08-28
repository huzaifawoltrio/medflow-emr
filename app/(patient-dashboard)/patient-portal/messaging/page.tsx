"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Plus,
  Send,
  MessageSquare,
  Shield,
  Clock,
  User,
  Stethoscope,
  Users,
} from "lucide-react";

// Mock patient info
const currentPatient = {
  name: "Sarah Johnson",
  id: "MRN-789012",
};

const sampleMessages = [
  {
    id: 1,
    sender: "Dr. Michael Smith",
    senderType: "provider",
    subject: "Lab Results Available",
    preview:
      "Good news! Your recent lab results are now available in your patient portal. Your CBC panel shows all normal values, which is excellent. Your cholesterol levels have improved since your last visit. Please review the detailed results in your documents section. We should schedule a follow-up appointment in 3 months to continue monitoring your progress.",
    timestamp: "8/26/2025",
    time: "2:30 PM",
    unread: true,
    priority: "normal",
  },
  {
    id: 2,
    sender: "Dr. Emily Rodriguez",
    senderType: "provider",
    subject: "Follow-up on Your Recent Visit",
    preview:
      "Thank you for coming in yesterday for your check-up. As discussed, please continue taking your current medications as prescribed. I've sent a prescription for the vitamin D supplement we talked about to your preferred pharmacy. If you experience any unusual symptoms or have questions about your treatment plan, please don't hesitate to reach out.",
    timestamp: "8/25/2025",
    time: "4:45 PM",
    unread: true,
    priority: "normal",
  },
  {
    id: 3,
    sender: "Jennifer Adams, PT",
    senderType: "provider",
    subject: "Physical Therapy Progress Update",
    preview:
      "Great job during today's physical therapy session! Your range of motion has significantly improved, and you're showing excellent progress with the strengthening exercises. Please continue doing the home exercises we practiced today - 10 minutes twice daily. Your next appointment is scheduled for Friday at 2 PM.",
    timestamp: "8/24/2025",
    time: "11:30 AM",
    unread: false,
    priority: "normal",
  },
  {
    id: 4,
    sender: "Billing Department",
    senderType: "staff",
    subject: "Insurance Update - Good News!",
    preview:
      "We have great news regarding your recent insurance inquiry. Your coverage has been approved for the specialist referral Dr. Smith recommended. You can now schedule your appointment with the cardiologist. Your copay will be $30. If you need help scheduling, please call our office.",
    timestamp: "8/23/2025",
    time: "9:00 AM",
    unread: false,
    priority: "normal",
  },
  {
    id: 5,
    sender: "Appointment Scheduling",
    senderType: "staff",
    subject: "Appointment Reminder",
    preview:
      "This is a friendly reminder that you have an upcoming appointment with Dr. Smith on September 2nd at 10:30 AM. Please arrive 15 minutes early for check-in. If you need to reschedule, please call us at least 24 hours in advance. We look forward to seeing you!",
    timestamp: "8/22/2025",
    time: "3:15 PM",
    unread: false,
    priority: "normal",
  },
];

export default function PatientSecureMessaging() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [messages, setMessages] = useState(sampleMessages);

  const [newMessage, setNewMessage] = useState({
    recipient: "",
    subject: "",
    content: "",
    category: "general",
  });

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.preview.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === "all" || message.senderType === filterType;

    return matchesSearch && matchesFilter;
  });

  const handleSendMessage = () => {
    if (newMessage.recipient && newMessage.subject && newMessage.content) {
      const message = {
        id: Date.now(),
        sender: currentPatient.name,
        senderType: "patient" as const,
        subject: newMessage.subject,
        preview: newMessage.content.substring(0, 100) + "...",
        timestamp: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        unread: false,
        priority: "normal",
      };
      setMessages([message, ...messages]);
      setIsComposeOpen(false);
      setNewMessage({
        recipient: "",
        subject: "",
        content: "",
        category: "general",
      });
    }
  };

  const getSenderTypeColor = (type: string) => {
    switch (type) {
      case "provider":
        return "bg-blue-100 text-blue-800";
      case "patient":
        return "bg-green-100 text-green-800";
      case "staff":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSenderTypeIcon = (type: string) => {
    switch (type) {
      case "provider":
        return <Stethoscope className="h-3 w-3" />;
      case "staff":
        return <Users className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  const unreadCount = messages.filter((m) => m.unread).length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Secure Messages
          </h1>
          <div className="flex items-center mt-2 text-sm text-gray-600">
            <Shield className="h-4 w-4 mr-2 text-green-600" />
            <span>
              Communicate securely with your healthcare team. All messages are
              encrypted and HIPAA compliant.
            </span>
          </div>
          {unreadCount > 0 && (
            <div className="mt-2">
              <Badge className="bg-blue-100 text-blue-800">
                {unreadCount} new message{unreadCount > 1 ? "s" : ""}
              </Badge>
            </div>
          )}
        </div>
        <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-800 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              New Message
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Send Message to Healthcare Team</DialogTitle>
              <DialogDescription>
                Send a secure message to your doctor or healthcare team.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="recipient">Send To</Label>
                <Select
                  value={newMessage.recipient}
                  onValueChange={(value) =>
                    setNewMessage({ ...newMessage, recipient: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dr. Michael Smith">
                      Dr. Michael Smith (Primary Care)
                    </SelectItem>
                    <SelectItem value="Dr. Emily Rodriguez">
                      Dr. Emily Rodriguez (Cardiology)
                    </SelectItem>
                    <SelectItem value="Jennifer Adams, PT">
                      Jennifer Adams, PT (Physical Therapy)
                    </SelectItem>
                    <SelectItem value="Nursing Team">Nursing Team</SelectItem>
                    <SelectItem value="Billing Department">
                      Billing Department
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Message Category</Label>
                <Select
                  value={newMessage.category}
                  onValueChange={(value) =>
                    setNewMessage({ ...newMessage, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Question</SelectItem>
                    <SelectItem value="medication">
                      Medication Question
                    </SelectItem>
                    <SelectItem value="symptoms">
                      Symptoms/Side Effects
                    </SelectItem>
                    <SelectItem value="appointment">
                      Appointment Request
                    </SelectItem>
                    <SelectItem value="test_results">
                      Test Results Question
                    </SelectItem>
                    <SelectItem value="billing">Billing/Insurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Brief description of your message"
                  value={newMessage.subject}
                  onChange={(e) =>
                    setNewMessage({ ...newMessage, subject: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Your Message</Label>
                <Textarea
                  id="content"
                  placeholder="Please describe your question or concern in detail..."
                  value={newMessage.content}
                  onChange={(e) =>
                    setNewMessage({ ...newMessage, content: e.target.value })
                  }
                  rows={6}
                />
                <p className="text-xs text-gray-500">
                  For urgent medical concerns, please call our office or visit
                  the emergency room.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSendMessage}
                className="bg-blue-800 hover:bg-blue-700"
              >
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <MessageSquare className="h-5 w-5 text-blue-700" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">
                  Total Messages
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {messages.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Shield className="h-5 w-5 text-green-700" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">
                  Unread Messages
                </p>
                <p className="text-lg font-bold text-gray-900">{unreadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Stethoscope className="h-5 w-5 text-purple-700" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">
                  Healthcare Team
                </p>
                <p className="text-lg font-bold text-gray-900">5 Providers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Messages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Messages</SelectItem>
            <SelectItem value="provider">From Healthcare Providers</SelectItem>
            <SelectItem value="staff">From Staff</SelectItem>
            <SelectItem value="patient">Messages I Sent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Messages</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 border-b cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedMessage?.id === message.id
                        ? "bg-blue-50 border-l-4 border-l-blue-800"
                        : ""
                    } ${message.unread ? "bg-blue-50/30" : ""}`}
                    onClick={() => setSelectedMessage(message)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {message.sender
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p
                            className={`text-sm font-medium ${
                              message.unread ? "text-gray-900" : "text-gray-600"
                            }`}
                          >
                            {message.sender}
                          </p>
                          <Badge
                            className={`text-xs ${getSenderTypeColor(
                              message.senderType
                            )}`}
                          >
                            {getSenderTypeIcon(message.senderType)}
                            <span className="ml-1 capitalize">
                              {message.senderType === "provider"
                                ? "Healthcare Provider"
                                : message.senderType === "staff"
                                ? "Healthcare Staff"
                                : "You"}
                            </span>
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          {message.timestamp}
                        </p>
                        {message.unread && (
                          <div className="w-2 h-2 bg-blue-800 rounded-full mt-1 ml-auto"></div>
                        )}
                      </div>
                    </div>

                    <div className="mb-2">
                      <p
                        className={`text-sm ${
                          message.unread
                            ? "font-medium text-gray-900"
                            : "text-gray-600"
                        }`}
                      >
                        {message.subject}
                      </p>
                    </div>

                    <p className="text-xs text-gray-500 line-clamp-2">
                      {message.preview}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message Content */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            {selectedMessage ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {selectedMessage.subject}
                      </CardTitle>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {selectedMessage.sender
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {selectedMessage.sender}
                            </p>
                            <Badge
                              className={`text-xs ${getSenderTypeColor(
                                selectedMessage.senderType
                              )}`}
                            >
                              {getSenderTypeIcon(selectedMessage.senderType)}
                              <span className="ml-1 capitalize">
                                {selectedMessage.senderType === "provider"
                                  ? "Healthcare Provider"
                                  : selectedMessage.senderType === "staff"
                                  ? "Healthcare Staff"
                                  : "You"}
                              </span>
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {selectedMessage.timestamp} at {selectedMessage.time}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {selectedMessage.preview}
                    </p>
                  </div>
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex space-x-3">
                      <Button className="bg-blue-800 hover:bg-blue-700">
                        <Send className="mr-2 h-4 w-4" />
                        Reply
                      </Button>
                      <Button variant="outline">Forward to Provider</Button>
                      <Button variant="outline">Print</Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a Message
                  </h3>
                  <p className="text-gray-600">
                    Choose a message from your inbox to read its contents
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
