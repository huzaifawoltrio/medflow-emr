// hooks/useChatSocket.ts
import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import {
  setConnectionStatus,
  setConnectionError,
  addMessage,
  updateMessageReadStatus,
  updateOnlineStatus,
} from "@/app/redux/features/chat/chatSlice";
import Cookies from "js-cookie";

interface Message {
  id: number;
  sender_id: number;
  recipient_id: number;
  content: string;
  sent_at: string;
  is_read?: boolean;
  is_priority?: boolean; // NEW: Add priority flag
  read_at?: string;
  sender_info?: {
    username: string;
    role: string;
  };
}

interface UseChatSocketReturn {
  socket: Socket | null;
  sendMessage: (
    recipientId: number,
    content: string,
    isPriority?: boolean
  ) => void; // NEW: Add priority parameter
  markAsRead: (messageIds: number[]) => void;
  getOnlineStatus: (userIds: number[]) => void;
  isConnected: boolean;
}

const API_URL = "http://127.0.0.1:5000";

export const useChatSocket = (): UseChatSocketReturn => {
  const dispatch = useAppDispatch();
  const { isConnected } = useAppSelector((state) => state.chat);
  const socketRef = useRef<Socket | null>(null);
  const isInitializedRef = useRef<boolean>(false);

  const getAuthToken = useCallback(() => {
    return Cookies.get("accessToken");
  }, []);

  // Initialize socket connection
  useEffect(() => {
    // Prevent multiple initializations
    if (isInitializedRef.current) {
      return;
    }

    const token = getAuthToken();
    if (!token) {
      dispatch(setConnectionError("Authentication token not found"));
      return;
    }

    const socket = io(API_URL, {
      query: { token },
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;
    isInitializedRef.current = true;

    // Connection events
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      dispatch(setConnectionStatus(true));
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      dispatch(setConnectionError("Failed to connect to messaging server"));
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      dispatch(setConnectionStatus(false));
      if (reason === "io server disconnect") {
        // Server initiated disconnect, try to reconnect
        socket.connect();
      }
    });

    socket.on("error", (error: any) => {
      console.error("Socket error:", error);
      dispatch(setConnectionError(error.message || "Socket error occurred"));
    });

    // Authentication events
    socket.on("connected", (data) => {
      console.log("Successfully authenticated:", data);
    });

    // Message events - UPDATED to handle priority messages
    const handleNewMessage = (message: Message) => {
      console.log("New message received:", message);
      // Log if it's a priority message
      if (message.is_priority) {
        console.log(
          "🚨 Priority message received from:",
          message.sender_info?.username
        );
      }
      dispatch(addMessage(message));
    };

    const handleMessageSent = (message: Message) => {
      console.log("Message sent confirmation:", message);
      // Log if it was sent as priority
      if (message.is_priority) {
        console.log("🚨 Priority message sent successfully");
      }
      // Only add to state if it's our own message and doesn't exist yet
      dispatch(addMessage(message));
    };

    // Use named functions to ensure proper cleanup
    socket.on("new_message", handleNewMessage);
    socket.on("message_sent", handleMessageSent);

    socket.on(
      "message_read",
      (data: { message_id: number; read_at: string; reader_id: number }) => {
        console.log("Message read:", data);
        dispatch(
          updateMessageReadStatus({
            messageId: data.message_id,
            readAt: data.read_at,
            readerId: data.reader_id,
          })
        );
      }
    );

    socket.on("online_status", (status: { [key: string]: boolean }) => {
      console.log("Online status update:", status);
      dispatch(updateOnlineStatus(status));
    });

    // Cleanup on unmount
    return () => {
      console.log("Cleaning up socket connection");

      // Remove all event listeners
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
      socket.off("error");
      socket.off("connected");
      socket.off("new_message", handleNewMessage);
      socket.off("message_sent", handleMessageSent);
      socket.off("message_read");
      socket.off("online_status");

      if (socket.connected) {
        socket.disconnect();
      }

      socketRef.current = null;
      isInitializedRef.current = false;
    };
  }, [dispatch, getAuthToken]);

  // Socket action methods - UPDATED to support priority messages
  const sendMessage = useCallback(
    (recipientId: number, content: string, isPriority: boolean = false) => {
      if (!socketRef.current?.connected) {
        dispatch(setConnectionError("Not connected to messaging server"));
        return;
      }

      const messageData = {
        recipient_id: recipientId,
        content: content.trim(),
        message_type: "text",
        is_priority: isPriority, // NEW: Include priority flag
      };

      console.log("Sending message:", messageData);
      if (isPriority) {
        console.log("🚨 Sending as priority message");
      }
      socketRef.current.emit("send_message", messageData);
    },
    [dispatch]
  );

  const markAsRead = useCallback((messageIds: number[]) => {
    if (!socketRef.current?.connected) return;

    socketRef.current.emit("mark_as_read", { message_ids: messageIds });
  }, []);

  const getOnlineStatus = useCallback((userIds: number[]) => {
    if (!socketRef.current?.connected) return;

    socketRef.current.emit("get_online_status", { user_ids: userIds });
  }, []);

  return {
    socket: socketRef.current,
    sendMessage,
    markAsRead,
    getOnlineStatus,
    isConnected,
  };
};
