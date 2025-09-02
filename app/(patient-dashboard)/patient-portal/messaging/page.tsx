"use client";

import { useState, useRef, useEffect } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Plus,
  Send,
  MessageSquare,
  Shield,
  Loader2,
  ArrowLeft,
  Circle,
  Clock,
  User,
  Stethoscope,
  Users,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import MainLayout from "@/components/layout/main-layout";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import {
  fetchConversations,
  fetchChatHistory,
  fetchChateableUsers,
} from "@/app/redux/features/chat/chatActions";
import {
  setSelectedConversation,
  clearUnreadCount,
  clearChatError,
} from "@/app/redux/features/chat/chatSlice";
import { useChatSocket } from "../../../redux/useChatSocket";
import { fetchMyDoctors } from "@/app/redux/features/patients/patientActions";

export default function PatientSecureMessaging() {
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { doctors } = useAppSelector((state) => state.patient);
  const {
    conversations,
    selectedConversation,
    chateableUsers,
    loading,
    error,
    isConnected,
  } = useAppSelector((state) => state.chat);

  const { sendMessage, markAsRead, getOnlineStatus } = useChatSocket();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [newMessageText, setNewMessageText] = useState("");
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [newConversation, setNewConversation] = useState({
    recipient: "",
    subject: "",
    content: "",
    category: "general",
  });

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize data on component mount
  useEffect(() => {
    dispatch(fetchMyDoctors());
    dispatch(fetchConversations());
    dispatch(fetchChateableUsers());
  }, [dispatch]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation?.messages]);

  // Get online status for all conversation participants
  useEffect(() => {
    if (isConnected && conversations.length > 0) {
      const userIds = conversations.map((c) => c.other_user_id);
      getOnlineStatus(userIds);
    }
  }, [isConnected, conversations, getOnlineStatus]);

  const getInitials = (name: string = "") => {
    return (
      name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    );
  };

  const getSenderTypeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "doctor":
      case "physician":
        return "bg-blue-100 text-blue-800";
      case "nurse":
        return "bg-green-100 text-green-800";
      case "staff":
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "patient":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSenderTypeIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "doctor":
      case "physician":
        return <Stethoscope className="h-3 w-3" />;
      case "nurse":
      case "staff":
      case "admin":
        return <Users className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  const handleSelectConversation = async (conversation: any) => {
    // Clear any previous errors
    dispatch(clearChatError("chatHistory"));

    // Set selected conversation and clear unread count
    dispatch(setSelectedConversation(conversation));
    dispatch(clearUnreadCount(conversation.other_user_id));

    // Fetch chat history
    await dispatch(
      fetchChatHistory({
        userId: conversation.other_user_id,
      })
    );

    // Mark unread messages as read
    const unreadMessages = conversation.messages?.filter(
      (m: any) => !m.is_read && m.sender_id === conversation.other_user_id
    );

    if (unreadMessages?.length > 0) {
      const messageIds = unreadMessages.map((m: any) => m.id);
      markAsRead(messageIds);
    }
  };

  const handleSendChatMessage = () => {
    if (!newMessageText.trim() || !selectedConversation) {
      return;
    }

    sendMessage(selectedConversation.other_user_id, newMessageText.trim());
    setNewMessageText("");
  };

  const handleStartNewConversation = () => {
    if (!newConversation.recipient || !newConversation.content.trim()) {
      return;
    }

    const recipientId = parseInt(newConversation.recipient, 10);
    if (isNaN(recipientId)) return;

    // Check if conversation already exists
    const existingConversation = conversations.find(
      (c) => c.other_user_id === recipientId
    );

    if (existingConversation) {
      handleSelectConversation(existingConversation);
    } else {
      // Send message to start new conversation
      sendMessage(recipientId, newConversation.content.trim());
    }

    // Reset form and close dialog
    setIsComposeOpen(false);
    setNewConversation({
      recipient: "",
      subject: "",
      content: "",
      category: "general",
    });
  };

  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch =
      conversation.other_user_username
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (conversation.last_message?.content || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === "all" ||
      (filterType === "provider" &&
        conversation.other_user_role.toLowerCase().includes("doctor")) ||
      (filterType === "staff" &&
        !conversation.other_user_role.toLowerCase().includes("doctor"));

    return matchesSearch && matchesFilter;
  });

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const formatFullMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const unreadCount = conversations.reduce(
    (count, conv) => count + conv.unread_count,
    0
  );
  const totalMessages = conversations.reduce(
    (count, conv) => count + (conv.messages?.length || 0),
    0
  );
  const providerCount = new Set(conversations.map((c) => c.other_user_id)).size;

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Secure Messages
            </h1>
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <Shield className="h-4 w-4 mr-2 text-green-600" />
              <span>
                Communicate securely with your healthcare team â€¢ HIPAA
                compliant
              </span>
              {isConnected && (
                <span className="ml-2 text-green-600">â€¢ Connected</span>
              )}
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
              <Button
                className="bg-blue-800 hover:bg-blue-700"
                disabled={!isConnected || loading.chateableUsers}
              >
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
                    value={newConversation.recipient}
                    onValueChange={(value) =>
                      setNewConversation({
                        ...newConversation,
                        recipient: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      {chateableUsers.map((user) => (
                        <SelectItem key={user.id} value={String(user.id)}>
                          {user.full_name} ({user.username}) - {user.role}
                          {user.specialization && ` - ${user.specialization}`}
                        </SelectItem>
                      ))}
                      {chateableUsers.length === 0 && (
                        <div className="p-2 text-sm text-gray-500">
                          No healthcare providers available
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Message Category</Label>
                  <Select
                    value={newConversation.category}
                    onValueChange={(value) =>
                      setNewConversation({
                        ...newConversation,
                        category: value,
                      })
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
                    value={newConversation.subject}
                    onChange={(e) =>
                      setNewConversation({
                        ...newConversation,
                        subject: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Your Message</Label>
                  <Textarea
                    id="content"
                    placeholder="Please describe your question or concern in detail..."
                    value={newConversation.content}
                    onChange={(e) =>
                      setNewConversation({
                        ...newConversation,
                        content: e.target.value,
                      })
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
                <Button
                  variant="outline"
                  onClick={() => setIsComposeOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleStartNewConversation}
                  className="bg-blue-800 hover:bg-blue-700"
                  disabled={
                    !newConversation.recipient ||
                    !newConversation.content.trim()
                  }
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Error Alerts */}
      {error.connection && (
        <Alert className="mx-6 mt-4 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error.connection}
          </AlertDescription>
        </Alert>
      )}

      {error.conversations && (
        <Alert className="mx-6 mt-4 border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            {error.conversations}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Chat Interface */}
      <div className="flex flex-1 overflow-hidden mx-6 mb-6">
        {/* Conversations Sidebar */}
        <div
          className={`w-full lg:w-96 bg-white border rounded-l-lg flex-col ${
            selectedConversation ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Search and Filters */}
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
                <SelectValue placeholder="All Messages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Messages</SelectItem>
                <SelectItem value="provider">Healthcare Providers</SelectItem>
                <SelectItem value="staff">Staff Members</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {loading.conversations ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {conversations.length === 0 ? (
                  <div>
                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p>No conversations yet</p>
                    <p className="text-xs">
                      Start a new chat with your healthcare team
                    </p>
                  </div>
                ) : (
                  <p>No conversations match your search</p>
                )}
              </div>
            ) : (
              filteredConversations.map((convo) => {
                const doctorDetails = doctors.find(
                  (d) => d.user_id === convo.other_user_id
                );
                return (
                  <div
                    key={`${convo.room_id}-${convo.other_user_id}`}
                    className={`p-4 border-b cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedConversation?.other_user_id ===
                      convo.other_user_id
                        ? "bg-blue-50 border-l-4 border-l-blue-800"
                        : ""
                    } ${convo.unread_count > 0 ? "bg-blue-50/30" : ""}`}
                    onClick={() => handleSelectConversation(convo)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={doctorDetails?.profile_picture_url}
                          />
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {getInitials(convo.other_user_username)}
                          </AvatarFallback>
                        </Avatar>
                        {convo.is_online && (
                          <Circle className="absolute bottom-0 right-0 h-3.5 w-3.5 fill-green-500 stroke-2 stroke-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-sm font-medium ${
                              convo.unread_count > 0
                                ? "text-gray-900"
                                : "text-gray-600"
                            }`}
                          >
                            {convo.other_user_username}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatMessageTime(convo.last_message_at)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p
                            className={`text-sm truncate ${
                              convo.unread_count > 0
                                ? "font-medium text-gray-900"
                                : "text-gray-600"
                            }`}
                          >
                            {convo.last_message?.content || "No messages yet"}
                          </p>
                          {convo.unread_count > 0 && (
                            <div className="bg-blue-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2 flex-shrink-0">
                              {convo.unread_count > 99
                                ? "99+"
                                : convo.unread_count}
                            </div>
                          )}
                        </div>
                        <div className="mt-1">
                          <Badge
                            className={`text-xs ${getSenderTypeColor(
                              convo.other_user_role
                            )}`}
                          >
                            {getSenderTypeIcon(convo.other_user_role)}
                            <span className="ml-1">
                              {convo.other_user_role === "doctor"
                                ? "Healthcare Provider"
                                : convo.other_user_role === "nurse"
                                ? "Nurse"
                                : "Healthcare Staff"}
                            </span>
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div
          className={`flex-1 bg-white border rounded-r-lg flex-col ${
            selectedConversation ? "flex" : "hidden lg:flex"
          }`}
        >
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="border-b px-6 py-4">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden p-2 -ml-2"
                    onClick={() => dispatch(setSelectedConversation(null))}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={
                        doctors.find(
                          (d) =>
                            d.user_id === selectedConversation.other_user_id
                        )?.profile_picture_url
                      }
                    />
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {getInitials(selectedConversation.other_user_username)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {selectedConversation.other_user_username}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <p
                        className={`text-xs ${
                          selectedConversation.is_online
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {selectedConversation.is_online ? "Online" : "Offline"}
                      </p>
                      <Badge
                        className={`text-xs ${getSenderTypeColor(
                          selectedConversation.other_user_role
                        )}`}
                      >
                        {getSenderTypeIcon(
                          selectedConversation.other_user_role
                        )}
                        <span className="ml-1">
                          {selectedConversation.other_user_role === "doctor"
                            ? "Healthcare Provider"
                            : selectedConversation.other_user_role === "nurse"
                            ? "Nurse"
                            : "Healthcare Staff"}
                        </span>
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {loading.chatHistory ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : selectedConversation.messages?.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <p>No messages yet</p>
                      <p className="text-sm">Start the conversation below</p>
                    </div>
                  </div>
                ) : (
                  selectedConversation.messages?.map((message) => {
                    const isOwn = message.sender_id === currentUser?.id;
                    const senderDetails = doctors.find(
                      (d) => d.user_id === message.sender_id
                    );
                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          isOwn ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
                            isOwn ? "flex-row-reverse space-x-reverse" : ""
                          }`}
                        >
                          {!isOwn && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={senderDetails?.profile_picture_url}
                              />
                              <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">
                                {getInitials(
                                  selectedConversation.other_user_username
                                )}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`rounded-lg px-4 py-2 ${
                              isOwn
                                ? "bg-blue-800 text-white"
                                : "bg-white text-gray-900 shadow-sm border"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">
                              {message.content}
                            </p>
                            <div
                              className={`text-xs mt-1 flex items-center ${
                                isOwn ? "text-blue-100" : "text-gray-500"
                              }`}
                            >
                              {formatMessageTime(message.sent_at)}
                              {isOwn && message.is_read && (
                                <span className="ml-2 text-xs">Read</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t p-4 bg-white">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendChatMessage();
                      }
                    }}
                    className="flex-1"
                    disabled={!isConnected}
                  />
                  <Button
                    onClick={handleSendChatMessage}
                    disabled={!newMessageText.trim() || !isConnected}
                    className="bg-blue-800 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                {!isConnected && (
                  <p className="text-xs text-red-500 mt-2">
                    Connection lost. Messages cannot be sent.
                  </p>
                )}
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-600 mb-4">
                  Choose a healthcare provider from the list to start messaging.
                </p>
                {conversations.length === 0 && (
                  <Button
                    onClick={() => setIsComposeOpen(true)}
                    className="bg-blue-800 hover:bg-blue-700"
                    disabled={!isConnected}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Start Your First Chat
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
