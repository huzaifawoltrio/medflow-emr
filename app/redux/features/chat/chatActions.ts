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
  is_priority?: boolean; // NEW: Add priority flag
  read_at?: string;
  sender_info?: {
    username: string;
    role: string;
    full_name?: string; // NEW: Add full name for better display
  };
}

interface Conversation {
  room_id: number;
  other_user_id: number;
  other_user_username: string;
  other_user_role: string;
  is_online: boolean;
  unread_count: number;
  priority_unread_count?: number; // NEW: Add priority unread count
  last_message_at: string;
  last_message: {
    content: string;
    sender_id: number;
    is_priority?: boolean; // NEW: Add priority flag to last message
    sent_at: string;
  } | null;
  messages?: Message[]; // NEW: Add optional messages array
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

// NEW: Priority messages types
interface PriorityMessage extends Message {
  sender_info: {
    username: string;
    role: string;
    full_name: string;
  };
}

interface PriorityMessagesResponse {
  priority_messages: PriorityMessage[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

interface PriorityMessagesSummary {
  total_priority_messages: number;
  unread_priority_messages: number;
  patients_with_priority_messages: number;
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
 * NEW: Fetch priority messages for doctors
 */
export const fetchPriorityMessages = createAsyncThunk<
  PriorityMessagesResponse,
  { page?: number; perPage?: number; includeRead?: boolean },
  { rejectValue: string }
>(
  "chat/fetchPriorityMessages",
  async (
    { page = 1, perPage = 20, includeRead = false },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(
        `/chat/priority-messages?page=${page}&per_page=${perPage}&include_read=${includeRead}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(
        error.message || "Failed to fetch priority messages"
      );
    }
  }
);

/**
 * NEW: Fetch priority messages summary for doctors
 */
export const fetchPriorityMessagesSummary = createAsyncThunk<
  PriorityMessagesSummary,
  void,
  { rejectValue: string }
>("chat/fetchPriorityMessagesSummary", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/chat/priority-messages/summary");
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      return rejectWithValue(error.response.data.message);
    }
    return rejectWithValue(
      error.message || "Failed to fetch priority messages summary"
    );
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

// Export new types
export type {
  Message,
  Conversation,
  PriorityMessage,
  PriorityMessagesResponse,
  PriorityMessagesSummary,
};
