import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export interface Message {
    senderId: string | undefined;
    senderType: "Etudiant" | "Enseignant" | "Personnel";
    receiverId: string;
    receiverType: "Etudiant" | "Enseignant" | "Personnel";
    text: string;
    image: string;
  }
export const messagesSlice = createApi({
  reducerPath: "messagesApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.REACT_APP_API_URL}/api/messagerie/` }),
  endpoints: (builder) => ({
    sendMessage: builder.mutation<void, { senderId: string; senderType: string; receiverId: string; receiverType: string; text?: string; image?: string }>({
      query: (message) => ({
        url: "/send",
        method: "POST",
        body: message,
      }),
    }),
    getConversation: builder.query<any[], { userId1: string; userType1: string; userId2: string; userType2: string }>({
      query: ({ userId1, userType1, userId2, userType2 }) =>
        `/conversation/${userId1}/${userType1}/${userId2}/${userType2}`,
    }),
    getMessageById: builder.query<any, string>({
      query: (messageId) => `/${messageId}`,
    }),
  }),
});

export const { useSendMessageMutation, useGetConversationQuery, useGetMessageByIdQuery } = messagesSlice;
