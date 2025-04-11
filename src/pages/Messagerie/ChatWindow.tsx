import React from "react";
import { Card, ListGroup } from "react-bootstrap";

type Message = {
  text: string;
  sentByMe: boolean;
};

type ChatWindowProps = {
  selectedUser: { name: string };
  messages: Message[];
};

const ChatWindow: React.FC<ChatWindowProps> = ({ selectedUser, messages }) => {
  return (
    <Card>
      <Card.Header>Chat avec {selectedUser.name}</Card.Header>
      <ListGroup variant="flush" style={{ height: "400px", overflowY: "auto" }}>
        {messages.map((msg, index) => (
          <ListGroup.Item
            key={index}
            className={`text-${msg.sentByMe ? "end" : "start"} bg-${msg.sentByMe ? "light" : "white"}`}
          >
            {msg.text}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
};

export default ChatWindow;
