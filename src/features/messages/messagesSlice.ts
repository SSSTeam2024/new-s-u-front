import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the Message type
export interface Message {
  _id: string;
  sender: { 
    userId: string;
    userType: "Etudiant" | "Enseignant" | "Personnel" | "User";
    nom_fr: string;
    prenom_fr: string;
    email: string
  };
  receiver: { 
    userId: string;
    userType: "Etudiant" | "Enseignant" | "Personnel" | "User";
    nom_fr: string;
    prenom_fr: string;
    email: string
  };
  subject: string;
  content: string;
  attachments?: string[] | undefined;
  attachmentsBase64Strings: string[];
  attachmentsExtensions: string[];
  status: "sent" | "read" | "archived";
  receiverStatus:"sent" | "read" | "archived";
  senderStatus: "sent" | "read" | "archived";
  createdAt?: string; 
  parentMessageId?: string
}

// API Slice
export const messageSlice = createApi({
  reducerPath: "messageApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/messages/`, 
  }),
  tagTypes: ["Message"],
  endpoints: (builder) => ({
    // Fetch received messages (Inbox)
    fetchInboxMessages: builder.query<Message[], { userId: string; userType: string }>({
      query: ({ userId, userType }) => `inbox/${userId}/${userType}`,
      providesTags: ["Message"],
    }),
// Fetch archived received messages (Inbox)
fetchArchivedInboxMessages: builder.query<Message[], { userId: string; userType: string }>({
  query: ({ userId, userType }) => `archived-inbox/${userId}/${userType}`,
  providesTags: ["Message"],
}),
//Fetch replies 
fetchRepliesByParentId: builder.query<Message[], string>({
  query: (parentMessageId) => `replies/${parentMessageId}`,
}),
    // Fetch sent messages
    fetchSentMessages: builder.query<Message[], { userId: string; userType: string }>({
      query: ({ userId, userType }) => `sent/${userId}/${userType}`,
      providesTags: ["Message"],
    }),
     // Fetch archived sent messages
    fetchArchivedSentMessages: builder.query<Message[], { userId: string; userType: string }>({
      query: ({ userId, userType }) => `archived-sent/${userId}/${userType}`,
      providesTags: ["Message"],
    }),

    // Send a new message
    // sendMessage: builder.mutation<void, Partial<Message>>({
    //   query: (messageData) => ({
    //     url: "send",
    //     method: "POST",
    //     body: messageData,
    //   }),
    //   invalidatesTags: ["Message"],
    // }),

    sendMessage: builder.mutation<void, Partial<Message>>({
      query: (messageData) => ({
        url: "send",
        method: "POST",
        body: {
          ...messageData,
          parentMessageId: messageData.parentMessageId || null, // Set parentMessageId if it's a reply
        },
      }),
      invalidatesTags: ["Message"],
    }),

    // Mark a message as read
    markMessageAsRead: builder.mutation<void, { messageId: string }>({
      query: ({ messageId }) => ({
        url: `read/${messageId}`,
        method: "PUT",
      }),
      invalidatesTags: ["Message"],
    }),
    // Archive a message
    archiveMessage: builder.mutation<Message, { messageId: string; userId: string; userType: string }>({
      query: ({ messageId, userId, userType }) => ({
        url: `archive/${messageId}`,
        method: "POST",
        body: { userId, userType },
      }),
      invalidatesTags: ["Message"],
    }),
    deleteMessageForUser: builder.mutation<Message, { messageId: string; userId: string; userType: string }>({
      query: ({ messageId, userId, userType }) => ({
        url: `delete/${messageId}`,
        method: "PUT",
        body: { userId, userType },
      }),
      invalidatesTags: ["Message"],
    }),


    // Delete a message
    deleteMessage: builder.mutation<void, { messageId: string }>({
      query: ({ messageId }) => ({
        url: `${messageId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Message"],
    }),
  }),
});

export const {
  useFetchInboxMessagesQuery,
  useFetchArchivedInboxMessagesQuery,
  useFetchSentMessagesQuery,
  useFetchArchivedSentMessagesQuery,
  useSendMessageMutation,
  useMarkMessageAsReadMutation,
  useArchiveMessageMutation,
  useDeleteMessageMutation,
  useFetchRepliesByParentIdQuery,
  useDeleteMessageForUserMutation
} = messageSlice;
