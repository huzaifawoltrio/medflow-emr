"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Plus, Send, MessageSquare, Shield, Clock } from "lucide-react"

const sampleMessages = [
  {
    id: 1,
    sender: "Dr. Smith",
    senderType: "provider",
    subject: "Lab Results Available",
    preview:
      "Your recent lab results are now available. The CBC panel shows normal values. Please schedule a follow-up appointment.",
    timestamp: "8/12/2024",
    time: "2:30 PM",
    unread: true,
    priority: "normal",
  },
  {
    id: 2,
    sender: "Sarah Johnson",
    senderType: "patient",
    subject: "Question about medication side effects",
    preview: "I've been experiencing some dizziness since starting the new medication. Is this normal?",
    timestamp: "8/11/2024",
    time: "10:15 AM",
    unread: true,
    priority: "high",
  },
  {
    id: 3,
    sender: "Billing Department",
    senderType: "staff",
    subject: "Payment Reminder",
    preview: "This is a friendly reminder that you have an outstanding balance of $150.00.",
    timestamp: "8/10/2024",
    time: "9:00 AM",
    unread: false,
    priority: "normal",
  },
]

export default function SecureMessaging() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [messages, setMessages] = useState(sampleMessages)

  const [newMessage, setNewMessage] = useState({
    recipient: "",
    recipientType: "",
    subject: "",
    content: "",
    priority: "normal",
  })

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.preview.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterType === "all" || message.senderType === filterType

    return matchesSearch && matchesFilter
  })

  const handleSendMessage = () => {
    if (newMessage.recipient && newMessage.subject && newMessage.content) {
      const message = {
        id: Date.now(),
        sender: "You",
        senderType: "provider" as const,
        subject: newMessage.subject,
        preview: newMessage.content.substring(0, 100) + "...",
        timestamp: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        unread: false,
        priority: newMessage.priority,
      }
      setMessages([message, ...messages])
      setIsComposeOpen(false)
      setNewMessage({
        recipient: "",
        recipientType: "",
        subject: "",
        content: "",
        priority: "normal",
      })
    }
  }

  const getSenderTypeColor = (type: string) => {
    switch (type) {
      case "provider":
        return "bg-blue-100 text-blue-800"
      case "patient":
        return "bg-green-100 text-green-800"
      case "staff":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <MainLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Secure Messaging</h1>
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <Shield className="h-4 w-4 mr-2 text-green-600" />
              <span>Telemedicine platform ready. All sessions are encrypted and HIPAA compliant.</span>
            </div>
          </div>
          <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Compose Message
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Compose New Message</DialogTitle>
                <DialogDescription>Send a secure, HIPAA-compliant message.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient</Label>
                    <Input
                      id="recipient"
                      placeholder="Enter recipient name"
                      value={newMessage.recipient}
                      onChange={(e) => setNewMessage({ ...newMessage, recipient: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipientType">Recipient Type</Label>
                    <Select
                      value={newMessage.recipientType}
                      onValueChange={(value) => setNewMessage({ ...newMessage, recipientType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="patient">Patient</SelectItem>
                        <SelectItem value="provider">Provider</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Enter message subject"
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newMessage.priority}
                    onValueChange={(value) => setNewMessage({ ...newMessage, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Message</Label>
                  <Textarea
                    id="content"
                    placeholder="Type your message here..."
                    value={newMessage.content}
                    onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                    rows={6}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="provider">Providers</SelectItem>
              <SelectItem value="patient">Patients</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
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
                        selectedMessage?.id === message.id ? "bg-blue-50 border-l-4 border-l-blue-600" : ""
                      }`}
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
                            <p className={`text-sm font-medium ${message.unread ? "text-gray-900" : "text-gray-600"}`}>
                              {message.sender}
                            </p>
                            <Badge className={`text-xs ${getSenderTypeColor(message.senderType)}`}>
                              {message.senderType}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">{message.timestamp}</p>
                          {message.unread && <div className="w-2 h-2 bg-blue-600 rounded-full mt-1 ml-auto"></div>}
                        </div>
                      </div>

                      <div className="mb-2">
                        <p className={`text-sm ${message.unread ? "font-medium text-gray-900" : "text-gray-600"}`}>
                          {message.subject}
                        </p>
                        {message.priority === "high" && (
                          <Badge className={`text-xs mt-1 ${getPriorityColor(message.priority)}`}>High Priority</Badge>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 line-clamp-2">{message.preview}</p>
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
                        <CardTitle className="text-lg">{selectedMessage.subject}</CardTitle>
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
                              <p className="text-sm font-medium">{selectedMessage.sender}</p>
                              <Badge className={`text-xs ${getSenderTypeColor(selectedMessage.senderType)}`}>
                                {selectedMessage.senderType}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {selectedMessage.timestamp} at {selectedMessage.time}
                          </div>
                        </div>
                      </div>
                      {selectedMessage.priority === "high" && (
                        <Badge className={getPriorityColor(selectedMessage.priority)}>High Priority</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed">{selectedMessage.preview}</p>
                    </div>
                    <div className="mt-6 pt-6 border-t">
                      <div className="flex space-x-3">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <Send className="mr-2 h-4 w-4" />
                          Reply
                        </Button>
                        <Button variant="outline">Forward</Button>
                        <Button variant="outline">Archive</Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Message Selected</h3>
                    <p className="text-gray-600">Select a message from the list to view its contents</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
