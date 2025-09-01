// redux/features/chat/chatSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchConversations,
  fetchChatHistory,
  fetchChateableUsers,
  markMessagesAsRead,
  deleteMessage,
} from "./chatActions";

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
  messages?: Message[];
}

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
  selectedConversation: Conversation | null;
  chateableUsers: ChateableUser[];
  isConnected: boolean;
  loading: {
    conversations: boolean;
    chatHistory: boolean;
    chateableUsers: boolean;
    sendMessage: boolean;
  };
  error: {
    conversations: string | null;
    chatHistory: string | null;
    chateableUsers: string | null;
    connection: string | null;
  };
  pagination: {
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
  isConnected: false,
  loading: {
    conversations: false,
    chatHistory: false,
    chateableUsers: false,
    sendMessage: false,
  },
  error: {
    conversations: null,
    chatHistory: null,
    chateableUsers: null,
    connection: null,
  },
  pagination: null,
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

    // Message management - FIXED to prevent duplicates
    addMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      console.log("Adding message to Redux:", message.id, message.content);

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
        }

        // Add to messages if this is the selected conversation
        if (
          state.selectedConversation?.other_user_id === message.sender_id ||
          state.selectedConversation?.other_user_id === message.recipient_id
        ) {
          if (!state.selectedConversation.messages) {
            state.selectedConversation.messages = [];
          }

          // CHECK FOR DUPLICATES BEFORE ADDING - Use both ID and content/timestamp
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
          state.selectedConversation.messages[messageIndex].is_read = true;
          state.selectedConversation.messages[messageIndex].read_at = readAt;
        }
      }

      // Update in conversations list
      state.conversations.forEach((conversation) => {
        if (conversation.messages) {
          const messageIndex = conversation.messages.findIndex(
            (m) => m.id === messageId
          );
          if (messageIndex !== -1) {
            conversation.messages[messageIndex].is_read = true;
            conversation.messages[messageIndex].read_at = readAt;
          }
        }
      });
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
      }
    },

    setSelectedConversation: (
      state,
      action: PayloadAction<Conversation | null>
    ) => {
      state.selectedConversation = action.payload;
      if (action.payload) {
        // Clear unread count when selecting conversation
        const conversation = state.conversations.find(
          (c) => c.other_user_id === action.payload!.other_user_id
        );
        if (conversation) {
          conversation.unread_count = 0;
        }
      }
    },

    addNewConversation: (state, action: PayloadAction<Conversation>) => {
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
          messages: [],
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

        // Remove from conversations list
        state.conversations.forEach((conversation) => {
          if (conversation.messages) {
            conversation.messages = conversation.messages.filter(
              (m) => m.id !== messageId
            );
          }
        });
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
