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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Plus,
  Send,
  MessageSquare,
  Shield,
  Loader2,
  ArrowLeft,
  Circle,
  X,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import MainLayout from "@/components/layout/main-layout";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchPatients } from "@/app/redux/features/patients/patientActions";
// Import the same Redux actions and hooks as the patient page
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
import { useChatSocket } from "../../redux/useChatSocket";

export default function SecureMessaging() {
  const dispatch = useAppDispatch();

  // Use Redux state instead of local state
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const {
    patients,
    loading: patientsLoading,
    error: patientsError,
  } = useAppSelector((state) => state.patient);
  const {
    conversations,
    selectedConversation,
    chateableUsers,
    loading,
    error,
    isConnected,
  } = useAppSelector((state) => state.chat);

  // Use the same socket hook as patient page
  const { sendMessage, markAsRead, getOnlineStatus } = useChatSocket();

  const [searchTerm, setSearchTerm] = useState("");
  const [newMessageText, setNewMessageText] = useState("");
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [newConversationRecipient, setNewConversationRecipient] = useState("");
  const [newConversationMessage, setNewConversationMessage] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const getInitials = (name: string = "") => {
    return (
      name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    );
  };

  // Initialize data on component mount
  useEffect(() => {
    dispatch(fetchPatients());
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
    if (!newConversationRecipient || !newConversationMessage.trim()) {
      return;
    }

    const recipientId = parseInt(newConversationRecipient, 10);
    if (isNaN(recipientId)) return;

    // Check if conversation already exists
    const existingConversation = conversations.find(
      (c) => c.other_user_id === recipientId
    );

    if (existingConversation) {
      handleSelectConversation(existingConversation);
    } else {
      // Send message to start new conversation
      sendMessage(recipientId, newConversationMessage.trim());
    }

    // Reset form and close dialog
    setIsComposeOpen(false);
    setNewConversationRecipient("");
    setNewConversationMessage("");

    // Refresh conversations after sending
    setTimeout(() => {
      dispatch(fetchConversations());
    }, 1000);
  };

  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.other_user_username
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (conversation.last_message?.content || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Use chateableUsers from Redux instead of filtering patients
  const availableUsers = chateableUsers.filter(
    (user) => !conversations.some((convo) => convo.other_user_id === user.id)
  );

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
                {isConnected && (
                  <span className="ml-2 text-green-600">• Connected</span>
                )}
              </div>
            </div>
            <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => setIsComposeOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!isConnected}
                >
                  <Plus className="mr-2 h-4 w-4" /> New Chat
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Start New Conversation</DialogTitle>
                  <DialogDescription>
                    Select a patient to start a new secure chat.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient</Label>
                    <Select
                      value={newConversationRecipient}
                      onValueChange={setNewConversationRecipient}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a patient..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableUsers.map((user) => (
                          <SelectItem key={user.id} value={String(user.id)}>
                            {user.full_name} ({user.username})
                          </SelectItem>
                        ))}
                        {availableUsers.length === 0 && (
                          <div className="p-2 text-sm text-gray-500">
                            No available patients to message
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Message</Label>
                    <Textarea
                      id="content"
                      placeholder="Type your first message here..."
                      value={newConversationMessage}
                      onChange={(e) =>
                        setNewConversationMessage(e.target.value)
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
                    onClick={handleStartNewConversation}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={
                      !newConversationRecipient ||
                      !newConversationMessage.trim()
                    }
                  >
                    <Send className="mr-2 h-4 w-4" /> Start Chat
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

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Conversations Sidebar */}
          <div
            className={`w-full lg:w-96 bg-white border-r flex-col ${
              selectedConversation ? "hidden lg:flex" : "flex"
            }`}
          >
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
                      <p className="text-xs">Start a new chat with a patient</p>
                    </div>
                  ) : (
                    <p>No conversations match your search</p>
                  )}
                </div>
              ) : (
                filteredConversations.map((convo) => (
                  <div
                    key={`${convo.room_id}-${convo.other_user_id}`}
                    className={`p-4 border-b cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedConversation?.other_user_id ===
                      convo.other_user_id
                        ? "bg-blue-50 border-l-4 border-l-blue-500"
                        : ""
                    }`}
                    onClick={() => handleSelectConversation(convo)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
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
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {convo.other_user_username}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatMessageTime(convo.last_message_at)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-gray-600 truncate">
                            {convo.last_message?.content || "No messages yet"}
                          </p>
                          {convo.unread_count > 0 && (
                            <div className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2 flex-shrink-0">
                              {convo.unread_count > 99
                                ? "99+"
                                : convo.unread_count}
                            </div>
                          )}
                        </div>
                        <div className="mt-1">
                          <Badge variant="outline" className="text-xs">
                            {convo.other_user_role}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div
            className={`flex-1 flex-col ${
              selectedConversation ? "flex" : "hidden lg:flex"
            }`}
          >
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="bg-white border-b px-6 py-4">
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
                          {selectedConversation.is_online
                            ? "Online"
                            : "Offline"}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {selectedConversation.other_user_role}
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
                                  ? "bg-blue-600 text-white"
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
                <div className="bg-white border-t p-4">
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
                      className="bg-blue-600 hover:bg-blue-700"
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
                    Choose a patient from the list to start messaging.
                  </p>
                  {conversations.length === 0 && (
                    <Button
                      onClick={() => setIsComposeOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={!isConnected}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Start Your First Chat
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
