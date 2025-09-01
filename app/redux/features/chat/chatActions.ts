// redux/features/chat/chatActions.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../../lib/axiosConfig";

// Define types
interface Message {
  id: number;
  sender_id: number;
  recipient_id: number;
  content: string;
  sent_at: string;
  is_read?: boolean;
  read_at?: string;
  sender_info?: {
    username: string;
    role: string;
  };
}

interface Conversation {
  room_id: number;
  other_user_id: number;
  other_user_username: string;
  other_user_role: string;
  is_online: boolean;
  unread_count: number;
  last_message_at: string;
  last_message: {
    content: string;
    sender_id: number;
    sent_at: string;
  } | null;
}

interface ChatHistory {
  messages: Message[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

interface ChateableUser {
  id: number;
  username: string;
  role: string;
  full_name: string;
  is_online: boolean;
  specialization?: string;
}

/**
 * Fetch all conversations for the current user
 */
export const fetchConversations = createAsyncThunk<
  Conversation[],
  void,
  { rejectValue: string }
>("chat/fetchConversations", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/chat/conversations");
    return response.data.conversations;
  } catch (error: any) {
    if (error.response?.data?.message) {
      return rejectWithValue(error.response.data.message);
    }
    return rejectWithValue(error.message || "Failed to fetch conversations");
  }
});

/**
 * Fetch chat history between current user and another user
 */
export const fetchChatHistory = createAsyncThunk<
  ChatHistory,
  { userId: number; page?: number; perPage?: number },
  { rejectValue: string }
>(
  "chat/fetchChatHistory",
  async ({ userId, page = 1, perPage = 20 }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/chat/history?user_id=${userId}&page=${page}&per_page=${perPage}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message || "Failed to fetch chat history");
    }
  }
);

/**
 * Fetch users that can be chatted with
 */
export const fetchChateableUsers = createAsyncThunk<
  ChateableUser[],
  void,
  { rejectValue: string }
>("chat/fetchChateableUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/chat/users");
    return response.data.users;
  } catch (error: any) {
    if (error.response?.data?.message) {
      return rejectWithValue(error.response.data.message);
    }
    return rejectWithValue(error.message || "Failed to fetch chateable users");
  }
});

/**
 * Mark messages as read via REST API
 */
export const markMessagesAsRead = createAsyncThunk<
  { count: number },
  { messageIds?: number[]; otherUserId?: number },
  { rejectValue: string }
>(
  "chat/markMessagesAsRead",
  async ({ messageIds, otherUserId }, { rejectWithValue }) => {
    try {
      const response = await api.post("/chat/mark-read", {
        message_ids: messageIds,
        other_user_id: otherUserId,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(
        error.message || "Failed to mark messages as read"
      );
    }
  }
);

/**
 * Delete a message
 */
export const deleteMessage = createAsyncThunk<
  { messageId: number },
  number,
  { rejectValue: string }
>("chat/deleteMessage", async (messageId, { rejectWithValue }) => {
  try {
    await api.delete(`/chat/messages/${messageId}`);
    return { messageId };
  } catch (error: any) {
    if (error.response?.data?.message) {
      return rejectWithValue(error.response.data.message);
    }
    return rejectWithValue(error.message || "Failed to delete message");
  }
});
