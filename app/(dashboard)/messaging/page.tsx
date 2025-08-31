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
  ArrowLeft,
} from "lucide-react";
import MainLayout from "@/components/layout/main-layout";

// Sample conversation data
const sampleConversations = [
  {
    id: 1,
    participant: "Dr. Smith",
    participantType: "provider",
    lastMessage:
      "Your lab results look good. Let me know if you have any questions.",
    timestamp: "8/12/2025",
    time: "2:30 PM",
    unread: 2,
    messages: [
      {
        id: 1,
        sender: "Dr. Smith",
        senderType: "provider",
        content: "Hello! I wanted to follow up on your recent lab work.",
        timestamp: "8/12/2025 1:15 PM",
        isOwn: false,
      },
      {
        id: 2,
        sender: "You",
        senderType: "patient",
        content:
          "Hi Dr. Smith! I've been waiting for the results. How do they look?",
        timestamp: "8/12/2025 1:45 PM",
        isOwn: true,
      },
      {
        id: 3,
        sender: "Dr. Smith",
        senderType: "provider",
        content:
          "Great news! Your CBC panel shows all normal values. Your hemoglobin levels have improved since the last test.",
        timestamp: "8/12/2025 2:15 PM",
        isOwn: false,
      },
      {
        id: 4,
        sender: "Dr. Smith",
        senderType: "provider",
        content:
          "Your lab results look good. Let me know if you have any questions.",
        timestamp: "8/12/2025 2:30 PM",
        isOwn: false,
      },
    ],
  },
  {
    id: 2,
    participant: "Sarah Johnson",
    participantType: "patient",
    lastMessage:
      "I've been experiencing some dizziness since starting the new medication.",
    timestamp: "8/11/2025",
    time: "10:15 AM",
    unread: 1,
    messages: [
      {
        id: 1,
        sender: "Sarah Johnson",
        senderType: "patient",
        content:
          "Hi! I started taking the new medication you prescribed yesterday.",
        timestamp: "8/11/2025 9:30 AM",
        isOwn: false,
      },
      {
        id: 2,
        sender: "Sarah Johnson",
        senderType: "patient",
        content:
          "I've been experiencing some dizziness since starting the new medication. Is this normal?",
        timestamp: "8/11/2025 10:15 AM",
        isOwn: false,
      },
    ],
  },
  {
    id: 3,
    participant: "Billing Department",
    participantType: "staff",
    lastMessage: "Thank you for your payment!",
    timestamp: "8/10/2025",
    time: "9:00 AM",
    unread: 0,
    messages: [
      {
        id: 1,
        sender: "Billing Department",
        senderType: "staff",
        content:
          "This is a friendly reminder that you have an outstanding balance of $150.00.",
        timestamp: "8/10/2025 8:00 AM",
        isOwn: false,
      },
      {
        id: 2,
        sender: "You",
        senderType: "patient",
        content: "I just made the payment online. Can you confirm receipt?",
        timestamp: "8/10/2025 8:30 AM",
        isOwn: true,
      },
      {
        id: 3,
        sender: "Billing Department",
        senderType: "staff",
        content:
          "Thank you for your payment! We have received your payment of $150.00. Your account is now current.",
        timestamp: "8/10/2025 9:00 AM",
        isOwn: false,
      },
    ],
  },
];

export default function SecureMessaging() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [conversations, setConversations] = useState(sampleConversations);
  const [newMessageText, setNewMessageText] = useState("");

  const [newMessage, setNewMessage] = useState({
    recipient: "",
    recipientType: "",
    subject: "",
    content: "",
    priority: "normal",
  });

  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch =
      conversation.participant
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === "all" || conversation.participantType === filterType;

    return matchesSearch && matchesFilter;
  });

  const handleSendMessage = () => {
    if (newMessage.recipient && newMessage.content) {
      const newConversation = {
        id: Date.now(),
        participant: newMessage.recipient,
        participantType: newMessage.recipientType,
        lastMessage: newMessage.content,
        timestamp: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        unread: 0,
        messages: [
          {
            id: 1,
            sender: "You",
            senderType: "patient",
            content: newMessage.content,
            timestamp: new Date().toLocaleString(),
            isOwn: true,
          },
        ],
      };
      setConversations([newConversation, ...conversations]);
      setIsComposeOpen(false);
      setNewMessage({
        recipient: "",
        recipientType: "",
        subject: "",
        content: "",
        priority: "normal",
      });
    }
  };

  const handleSendChatMessage = () => {
    if (newMessageText.trim() && selectedConversation) {
      const newMsg = {
        id: Date.now(),
        sender: "You",
        senderType: "patient",
        content: newMessageText.trim(),
        timestamp: new Date().toLocaleString(),
        isOwn: true,
      };

      const updatedConversations = conversations.map((conv) => {
        if (conv.id === selectedConversation.id) {
          return {
            ...conv,
            messages: [...conv.messages, newMsg],
            lastMessage: newMessageText.trim(),
            timestamp: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
        }
        return conv;
      });

      setConversations(updatedConversations);
      setSelectedConversation((prev) => ({
        ...prev,
        messages: [...prev.messages, newMsg],
      }));
      setNewMessageText("");
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <MainLayout>
      <div className="h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Secure Messaging
              </h1>
              <div className="flex items-center mt-2 text-sm text-gray-600">
                <Shield className="h-4 w-4 mr-2 text-green-600" />
                <span>End-to-end encrypted • HIPAA compliant</span>
              </div>
            </div>
            <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  New Chat
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Start New Conversation</DialogTitle>
                  <DialogDescription>
                    Send a secure, HIPAA-compliant message.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipient">Recipient</Label>
                      <Input
                        id="recipient"
                        placeholder="Enter recipient name"
                        value={newMessage.recipient}
                        onChange={(e) =>
                          setNewMessage({
                            ...newMessage,
                            recipient: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipientType">Recipient Type</Label>
                      <Select
                        value={newMessage.recipientType}
                        onValueChange={(value) =>
                          setNewMessage({ ...newMessage, recipientType: value })
                        }
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
                    <Label htmlFor="content">Message</Label>
                    <Textarea
                      id="content"
                      placeholder="Type your message here..."
                      value={newMessage.content}
                      onChange={(e) =>
                        setNewMessage({
                          ...newMessage,
                          content: e.target.value,
                        })
                      }
                      rows={6}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsComposeOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Start Chat
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Conversations List */}
          <div className="w-80 bg-white border-r flex flex-col">
            {/* Search */}
            <div className="p-4 border-b">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Contacts</SelectItem>
                  <SelectItem value="provider">Providers</SelectItem>
                  <SelectItem value="patient">Patients</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 border-b cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedConversation?.id === conversation.id
                      ? "bg-blue-50"
                      : ""
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {getInitials(conversation.participant)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {conversation.participant}
                        </p>
                        <p className="text-xs text-gray-500">
                          {conversation.time}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage}
                        </p>
                        {conversation.unread > 0 && (
                          <div className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2">
                            {conversation.unread}
                          </div>
                        )}
                      </div>
                      <Badge
                        className={`text-xs mt-2 ${getSenderTypeColor(
                          conversation.participantType
                        )}`}
                      >
                        {conversation.participantType}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="bg-white border-b px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="lg:hidden"
                      onClick={() => setSelectedConversation(null)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {getInitials(selectedConversation.participant)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {selectedConversation.participant}
                      </h3>
                      <Badge
                        className={`text-xs ${getSenderTypeColor(
                          selectedConversation.participantType
                        )}`}
                      >
                        {selectedConversation.participantType}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages.map((message: any) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.isOwn ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex space-x-2 max-w-xs lg:max-w-md ${
                          message.isOwn
                            ? "flex-row-reverse space-x-reverse"
                            : ""
                        }`}
                      >
                        {!message.isOwn && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gray-100 text-gray-700 text-xs">
                              {getInitials(message.sender)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            message.isOwn
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.isOwn ? "text-blue-100" : "text-gray-500"
                            }`}
                          >
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="bg-white border-t p-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleSendChatMessage();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendChatMessage}
                      disabled={!newMessageText.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-600">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
