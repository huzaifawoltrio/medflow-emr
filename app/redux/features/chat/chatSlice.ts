// redux/features/chat/chatSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchConversations,
  fetchChatHistory,
  fetchChateableUsers,
  markMessagesAsRead,
  deleteMessage,
  fetchPriorityMessages,
  fetchPriorityMessagesSummary,
  Message,
  Conversation,
  PriorityMessage,
  PriorityMessagesSummary,
} from "./chatActions";

interface ChateableUser {
  id: number;
  username: string;
  role: string;
  full_name: string;
  is_online: boolean;
  specialization?: string;
}

interface ChatState {
  conversations: Conversation[];
  selectedConversation: (Conversation & { messages?: Message[] }) | null; // Fixed: Ensure messages is optional
  chateableUsers: ChateableUser[];
  priorityMessages: PriorityMessage[];
  prioritySummary: PriorityMessagesSummary | null;
  isConnected: boolean;
  loading: {
    conversations: boolean;
    chatHistory: boolean;
    chateableUsers: boolean;
    sendMessage: boolean;
    priorityMessages: boolean;
    prioritySummary: boolean;
  };
  error: {
    conversations: string | null;
    chatHistory: string | null;
    chateableUsers: string | null;
    connection: string | null;
    priorityMessages: string | null;
    prioritySummary: string | null;
  };
  pagination: {
    page: number;
    per_page: number;
    total: number;
    pages: number;
    has_next: boolean;
    has_prev: boolean;
  } | null;
  priorityPagination: {
    page: number;
    per_page: number;
    total: number;
    pages: number;
    has_next: boolean;
    has_prev: boolean;
  } | null;
}

const initialState: ChatState = {
  conversations: [],
  selectedConversation: null,
  chateableUsers: [],
  priorityMessages: [],
  prioritySummary: null,
  isConnected: false,
  loading: {
    conversations: false,
    chatHistory: false,
    chateableUsers: false,
    sendMessage: false,
    priorityMessages: false,
    prioritySummary: false,
  },
  error: {
    conversations: null,
    chatHistory: null,
    chateableUsers: null,
    connection: null,
    priorityMessages: null,
    prioritySummary: null,
  },
  pagination: null,
  priorityPagination: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // Socket connection management
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
      if (action.payload) {
        state.error.connection = null;
      }
    },

    setConnectionError: (state, action: PayloadAction<string>) => {
      state.error.connection = action.payload;
      state.isConnected = false;
    },

    // Message management - UPDATED to handle priority flag
    addMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      console.log(
        "Adding message to Redux:",
        message.id,
        message.content,
        `Priority: ${message.is_priority}`
      );

      // Update conversations list
      const conversationIndex = state.conversations.findIndex(
        (c) =>
          c.other_user_id === message.sender_id ||
          c.other_user_id === message.recipient_id
      );

      if (conversationIndex !== -1) {
        const conversation = state.conversations[conversationIndex];
        const isFromOtherUser =
          conversation.other_user_id === message.sender_id;

        // Update last message info only if this message is newer
        const currentLastMessageTime = conversation.last_message_at
          ? new Date(conversation.last_message_at).getTime()
          : 0;
        const newMessageTime = new Date(message.sent_at).getTime();

        if (newMessageTime >= currentLastMessageTime) {
          conversation.last_message = {
            content: message.content,
            sender_id: message.sender_id,
            is_priority: message.is_priority,
            sent_at: message.sent_at,
          };
          conversation.last_message_at = message.sent_at;
        }

        // Update unread count only if message is from other user and not currently viewing
        if (
          isFromOtherUser &&
          state.selectedConversation?.other_user_id !== message.sender_id
        ) {
          conversation.unread_count += 1;

          // NEW: Update priority unread count
          if (message.is_priority) {
            conversation.priority_unread_count =
              (conversation.priority_unread_count || 0) + 1;
          }
        }

        // Add to messages if this is the selected conversation
        if (
          state.selectedConversation?.other_user_id === message.sender_id ||
          state.selectedConversation?.other_user_id === message.recipient_id
        ) {
          if (!state.selectedConversation.messages) {
            state.selectedConversation.messages = [];
          }

          // CHECK FOR DUPLICATES BEFORE ADDING
          const messageExists = state.selectedConversation.messages.some(
            (existingMessage) =>
              existingMessage.id === message.id ||
              (existingMessage.content === message.content &&
                existingMessage.sender_id === message.sender_id &&
                Math.abs(
                  new Date(existingMessage.sent_at).getTime() -
                    new Date(message.sent_at).getTime()
                ) < 1000)
          );

          if (!messageExists) {
            console.log("Adding new message to conversation:", message.id);
            state.selectedConversation.messages.push(message);
          } else {
            console.log("Duplicate message detected, skipping:", message.id);
          }
        }

        // Move conversation to top only if this is a new message
        if (newMessageTime >= currentLastMessageTime) {
          const updatedConversation = state.conversations.splice(
            conversationIndex,
            1
          )[0];
          state.conversations.unshift(updatedConversation);
        }
      }

      // NEW: Add to priority messages if it's a priority message from a patient
      if (message.is_priority && message.sender_info?.role === "patient") {
        // Check if already exists in priority messages
        const priorityExists = state.priorityMessages.some(
          (pm) => pm.id === message.id
        );

        if (!priorityExists) {
          state.priorityMessages.unshift(message as PriorityMessage);
        }

        // Update priority summary
        if (state.prioritySummary) {
          state.prioritySummary.total_priority_messages += 1;
          if (!message.is_read) {
            state.prioritySummary.unread_priority_messages += 1;
          }
        }
      }
    },

    updateMessageReadStatus: (
      state,
      action: PayloadAction<{
        messageId: number;
        readAt: string;
        readerId: number;
      }>
    ) => {
      const { messageId, readAt, readerId } = action.payload;

      // Update in selected conversation
      if (state.selectedConversation?.messages) {
        const messageIndex = state.selectedConversation.messages.findIndex(
          (m) => m.id === messageId
        );
        if (messageIndex !== -1) {
          const message = state.selectedConversation.messages[messageIndex];
          message.is_read = true;
          message.read_at = readAt;

          // NEW: Update priority summary if this was a priority message
          if (message.is_priority && state.prioritySummary) {
            state.prioritySummary.unread_priority_messages = Math.max(
              0,
              state.prioritySummary.unread_priority_messages - 1
            );
          }
        }
      }

      // Update in conversations list - Fixed: Check if messages exists
      state.conversations.forEach((conversation) => {
        if (conversation.messages) {
          const messageIndex = conversation.messages.findIndex(
            (m) => m.id === messageId
          );
          if (messageIndex !== -1) {
            const message = conversation.messages[messageIndex];
            message.is_read = true;
            message.read_at = readAt;
          }
        }
      });

      // NEW: Update in priority messages
      const priorityMessageIndex = state.priorityMessages.findIndex(
        (m) => m.id === messageId
      );
      if (priorityMessageIndex !== -1) {
        state.priorityMessages[priorityMessageIndex].is_read = true;
        state.priorityMessages[priorityMessageIndex].read_at = readAt;
      }
    },

    updateOnlineStatus: (
      state,
      action: PayloadAction<{ [userId: string]: boolean }>
    ) => {
      const onlineStatus = action.payload;

      state.conversations.forEach((conversation) => {
        conversation.is_online =
          onlineStatus[String(conversation.other_user_id)] || false;
      });

      state.chateableUsers.forEach((user) => {
        user.is_online = onlineStatus[String(user.id)] || false;
      });
    },

    clearUnreadCount: (state, action: PayloadAction<number>) => {
      const userId = action.payload;
      const conversation = state.conversations.find(
        (c) => c.other_user_id === userId
      );
      if (conversation) {
        conversation.unread_count = 0;
        conversation.priority_unread_count = 0;
      }
    },

    setSelectedConversation: (
      state,
      action: PayloadAction<(Conversation & { messages?: Message[] }) | null>
    ) => {
      state.selectedConversation = action.payload;
      if (action.payload) {
        // Clear unread count when selecting conversation
        const conversation = state.conversations.find(
          (c) => c.other_user_id === action.payload!.other_user_id
        );
        if (conversation) {
          conversation.unread_count = 0;
          conversation.priority_unread_count = 0;
        }
      }
    },

    addNewConversation: (
      state,
      action: PayloadAction<Conversation & { messages?: Message[] }>
    ) => {
      // Check if conversation already exists
      const exists = state.conversations.some(
        (c) => c.other_user_id === action.payload.other_user_id
      );

      if (!exists) {
        state.conversations.unshift(action.payload);
      }
    },

    clearChatError: (
      state,
      action: PayloadAction<keyof ChatState["error"]>
    ) => {
      state.error[action.payload] = null;
    },

    resetChatState: (state) => {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    // Fetch Conversations
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading.conversations = true;
        state.error.conversations = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading.conversations = false;
        state.conversations = action.payload.map((c) => ({
          ...c,
          messages: [], // Initialize empty messages array
        }));
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading.conversations = false;
        state.error.conversations =
          action.payload || "Failed to fetch conversations";
      });

    // Fetch Chat History
    builder
      .addCase(fetchChatHistory.pending, (state) => {
        state.loading.chatHistory = true;
        state.error.chatHistory = null;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.loading.chatHistory = false;
        state.pagination = action.payload.pagination;

        if (state.selectedConversation) {
          state.selectedConversation.messages = action.payload.messages;
        }
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.loading.chatHistory = false;
        state.error.chatHistory =
          action.payload || "Failed to fetch chat history";
      });

    // Fetch Chateable Users
    builder
      .addCase(fetchChateableUsers.pending, (state) => {
        state.loading.chateableUsers = true;
        state.error.chateableUsers = null;
      })
      .addCase(fetchChateableUsers.fulfilled, (state, action) => {
        state.loading.chateableUsers = false;
        state.chateableUsers = action.payload;
      })
      .addCase(fetchChateableUsers.rejected, (state, action) => {
        state.loading.chateableUsers = false;
        state.error.chateableUsers =
          action.payload || "Failed to fetch chateable users";
      });

    // NEW: Fetch Priority Messages
    builder
      .addCase(fetchPriorityMessages.pending, (state) => {
        state.loading.priorityMessages = true;
        state.error.priorityMessages = null;
      })
      .addCase(fetchPriorityMessages.fulfilled, (state, action) => {
        state.loading.priorityMessages = false;
        state.priorityMessages = action.payload.priority_messages;
        state.priorityPagination = action.payload.pagination;
      })
      .addCase(fetchPriorityMessages.rejected, (state, action) => {
        state.loading.priorityMessages = false;
        state.error.priorityMessages =
          action.payload || "Failed to fetch priority messages";
      });

    // NEW: Fetch Priority Messages Summary
    builder
      .addCase(fetchPriorityMessagesSummary.pending, (state) => {
        state.loading.prioritySummary = true;
        state.error.prioritySummary = null;
      })
      .addCase(fetchPriorityMessagesSummary.fulfilled, (state, action) => {
        state.loading.prioritySummary = false;
        state.prioritySummary = action.payload;
      })
      .addCase(fetchPriorityMessagesSummary.rejected, (state, action) => {
        state.loading.prioritySummary = false;
        state.error.prioritySummary =
          action.payload || "Failed to fetch priority messages summary";
      });

    // Mark Messages as Read
    builder
      .addCase(markMessagesAsRead.fulfilled, (state) => {
        // Success handled by socket events
      })
      .addCase(markMessagesAsRead.rejected, (state, action) => {
        console.error("Failed to mark messages as read:", action.payload);
      });

    // Delete Message
    builder
      .addCase(deleteMessage.fulfilled, (state, action) => {
        const { messageId } = action.payload;

        // Remove from selected conversation
        if (state.selectedConversation?.messages) {
          state.selectedConversation.messages =
            state.selectedConversation.messages.filter(
              (m) => m.id !== messageId
            );
        }

        // Remove from conversations list - Fixed: Check if messages exists
        state.conversations.forEach((conversation) => {
          if (conversation.messages) {
            conversation.messages = conversation.messages.filter(
              (m) => m.id !== messageId
            );
          }
        });

        // NEW: Remove from priority messages
        state.priorityMessages = state.priorityMessages.filter(
          (m) => m.id !== messageId
        );
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        console.error("Failed to delete message:", action.payload);
      });
  },
});

export const {
  setConnectionStatus,
  setConnectionError,
  addMessage,
  updateMessageReadStatus,
  updateOnlineStatus,
  clearUnreadCount,
  setSelectedConversation,
  addNewConversation,
  clearChatError,
  resetChatState,
} = chatSlice.actions;

export default chatSlice.reducer;
