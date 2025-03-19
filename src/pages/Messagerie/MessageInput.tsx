import React, { useState } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";

type MessageInputProps = {
  onSend: (message: string) => void;
};

const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() !== "") {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <InputGroup className="mt-3">
      <Form.Control
        type="text"
        placeholder="Écrire un message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button variant="primary" onClick={handleSend}>
        Envoyer
      </Button>
    </InputGroup>
  );
};

export default MessageInput;
