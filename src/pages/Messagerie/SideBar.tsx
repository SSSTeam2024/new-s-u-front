import React from "react";
import { ListGroup } from "react-bootstrap";
import { User } from './Messagerie'

type SidebarProps = {
  users: User[];
  onSelectUser: (user: User) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ users, onSelectUser }) => {
  return (
    <ListGroup>
      {users.map((user) => (
        <ListGroup.Item
          key={user._id}
          action
          onClick={() => onSelectUser(user)}
          className="d-flex justify-content-between align-items-center"
        >
          <span>{user.name}</span>
          <span className={`badge bg-${user.role === "personnel" ? "primary" : "success"}`}>
            {user.role}
          </span>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default Sidebar;
