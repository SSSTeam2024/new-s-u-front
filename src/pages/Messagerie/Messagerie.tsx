import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "./SideBar";
import ChatWindow from "./ChatWindow";
import MessageInput from "./MessageInput";
import Breadcrumb from "Common/BreadCrumb";
import {Personnel,useFetchPersonnelsQuery} from "features/personnel/personnelSlice";
import {Enseignant, useFetchEnseignantsQuery,} from "features/enseignant/enseignantSlice";
import { useGetConversationQuery, useSendMessageMutation } from "features/messagerie/messagerieSlice";
import { RootState } from "app/store";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "features/account/authSlice";
import { skipToken } from "@reduxjs/toolkit/query";


export type User = {
  _id: string;
  name: string;
  role: string; 
};
  
const Messagerie = () => {
 const currentUser  = useSelector((state: RootState) => selectCurrentUser(state));


    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<{ text: string; sentByMe: boolean }[]>([]);
    // Fetch enseignants & personnel using RTK Query
    const { data:personnels = [] } = useFetchPersonnelsQuery();
    const { data:enseignants = [] } = useFetchEnseignantsQuery();
      // RTK Query Mutation for Sending Messages
  const [sendMessage] = useSendMessageMutation();

   // RTK Query to Fetch Conversation (Automatically refetches when `selectedUser` changes)
   const { data: conversationData } = useGetConversationQuery(
    selectedUser && currentUser
      ? {
        userId1: currentUser?._id!,
        userType1: currentUser?.role!,
        userId2: selectedUser?._id!,
        userType2: selectedUser.role,
        }
      : skipToken
  );

  // Populate messages when conversation data changes
  useEffect(() => {
    if (conversationData) {
      setMessages(
        conversationData.map((msg: any) => ({
          text: msg.text,
          sentByMe: msg.senderId === currentUser?._id,
        }))
      );
    }
  }, [conversationData, currentUser]);

  // Send Message Handler
  const handleSendMessage = async (newMessage: string) => {
    if (!selectedUser || !currentUser) return;

    const messageData = {
      senderId: currentUser?._id!,
      senderType: currentUser?.role!,
      receiverId: selectedUser?._id!,
      receiverType: selectedUser?.role!,
      text: newMessage,
    };

    try {
      await sendMessage(messageData).unwrap();
      setMessages([...messages, { text: newMessage, sentByMe: true }]);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    }
  };


  const users: User[] = [
    ...personnels.map((p) => ({ _id: p._id, name: p.nom_fr, role: "Personnel" })),  // "Personnel" (uppercase)
    ...enseignants.map((e) => ({ _id: e._id, name: e.nom_fr, role: "Enseignant" })),  // "Enseignant" (uppercase)
  ];

  return (
    <React.Fragment>
    <div className="page-content">
      <Container fluid={true}>
        <Breadcrumb title="Messagerie" pageTitle="Messagerie" />
        <Container className="mt-4">
          <Row>
            <Col md={4}>
            <Sidebar users={users} onSelectUser={setSelectedUser} />
            </Col>
            <Col md={8}>
              {selectedUser ? (
                <>
                  <ChatWindow selectedUser={selectedUser} messages={messages} />
                  <MessageInput onSend={handleSendMessage} />
                </>
              ) : (
                <p className="text-muted text-center mt-5">
                  Sélectionnez un contact pour commencer à discuter
                </p>
              )}
            </Col>
          </Row>
        </Container>
      </Container>
    </div>
  </React.Fragment>
  );
};

export default Messagerie;
