import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Nav,
  Row,
  Tab,
  Form,
  Modal,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import {
  useFetchInboxMessagesQuery,
  useFetchArchivedInboxMessagesQuery,
  useFetchArchivedSentMessagesQuery,
  useFetchSentMessagesQuery,
  useSendMessageMutation,
  useDeleteMessageMutation,
  useMarkMessageAsReadMutation,
  Message,
  useArchiveMessageMutation,
  useDeleteMessageForUserMutation
} from "features/messages/messagesSlice";
import { RootState } from "app/store";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "features/account/authSlice";
import { useFetchEnseignantsQuery, } from "features/enseignant/enseignantSlice";
import { useFetchPersonnelsQuery, } from "features/personnel/personnelSlice";
import { useFetchEtudiantsQuery, } from "features/etudiant/etudiantSlice";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useNavigate } from "react-router-dom";
import ReactDOMServer from "react-dom/server";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import DOMPurify from "dompurify";

interface BaseUser {
  _id: string;
  nom_fr: string;
  prenom_fr: string;
  userType: string;
}

interface Etudiant extends BaseUser {
  userType: "Etudiant";
  groupe_classe?: {
    _id: string;
    nom_classe_fr: string;
  };
}

interface Personnel extends BaseUser {
  userType: "Personnel";
  poste?: {
    _id: string;
    poste_fr: string;
  };
}

interface Enseignant extends BaseUser {
  userType: "Enseignant";
}


// Define a combined type that includes all possible user types
type User = Etudiant | Personnel | Enseignant;

const Messages = () => {
  const currentUser = useSelector((state: RootState) => selectCurrentUser(state));
  // console.log("currentUser", currentUser)

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();


  const userId = currentUser?._id!;
  const userType = "User"; // Replace with actual user type (Etudiant/Enseignant/Personnel/User)

  const { data: inboxMessages, isLoading: inboxLoading } = useFetchInboxMessagesQuery({ userId, userType: "User" });
  const { data: sentMessages, isLoading: sentLoading } = useFetchSentMessagesQuery({ userId, userType });
  const { data: archivedSentMessages, isLoading: archivedSentLoading } = useFetchArchivedSentMessagesQuery({ userId, userType });
  const { data: archivedInboxMessages, isLoading: archivedInboxLoading } = useFetchArchivedInboxMessagesQuery({ userId, userType });
  const { data: personnels = [] } = useFetchPersonnelsQuery();
  const { data: enseignants = [] } = useFetchEnseignantsQuery();
  const { data: etudiants = [] } = useFetchEtudiantsQuery();

  const isLoading = archivedSentLoading || archivedInboxLoading;
  const archivedMessages = [...(archivedSentMessages || []), ...(archivedInboxMessages || [])];


  const [sendMessage] = useSendMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const [markMessageAsRead] = useMarkMessageAsReadMutation();
  const [archiveMessage] = useArchiveMessageMutation();
  const [deleteMessageForUser] = useDeleteMessageForUserMutation();


  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [attachmentsBase64Strings, setAttachmentsBase64Strings] = useState<string[]>([]);
  const [attachmentsExtensions, setAttachmentsExtensions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);

  const [receiverId, setReceiverId] = useState("");
  const [receiverType, setReceiverType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<{ _id: string; label: string } | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);


  const allUsers: User[] = [
    ...personnels.map((user) => ({ ...user, userType: "Personnel" }) as Personnel),
    ...enseignants.map((user) => ({ ...user, userType: "Enseignant" }) as Enseignant),
    ...etudiants.map((user) => ({ ...user, userType: "Etudiant" }) as Etudiant),
  ];
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);


  const filteredUsers = searchTerm.length >= 3
    ? allUsers.filter((user) =>
      `${user.nom_fr} ${user.prenom_fr}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    : allUsers;

  // const handleReceiverSelect = (userId: React.SetStateAction<string>, userType: React.SetStateAction<string>) => {
  //   setReceiverId(userId);
  //   setReceiverType(userType);
  // };
  const handleReceiverSelect = (userId: string, userType: string) => {
    setReceiverId(userId);
    setReceiverType(userType);
    console.log("Selected Receiver:", { userId, userType }); // Debugging
  };


  const handleSelectUser = (user: { _id: string; userType: string; label: string }) => {
    setSelectedUser(user);
    setSearchTerm(user.label);
    setShowDropdown(false);
    handleReceiverSelect(user._id, user.userType);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);

      // Update selected files list
      setSelectedFiles((prev) => [...prev, ...fileArray]);

      // Convert files to Base64
      Promise.all(fileArray.map(convertFileToBase64)).then((results) => {
        setAttachmentsBase64Strings((prev) => [...prev, ...results.map((r) => r.base64String)]);
        setAttachmentsExtensions((prev) => [...prev, ...results.map((r) => r.extension)]);
      });
    }
  };

  // Convert file to Base64
  const convertFileToBase64 = (file: File): Promise<{ base64String: string; extension: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const extension = file.name.split('.').pop() || "";
        resolve({ base64String, extension });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Remove file from the list
  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setAttachmentsBase64Strings((prev) => prev.filter((_, i) => i !== index));
    setAttachmentsExtensions((prev) => prev.filter((_, i) => i !== index));
  };


  const handleSendMessage = async () => {
    if (!receiverId || !receiverType) {
      Swal.fire({
        icon: "warning",
        title: "Destinataire manquant",
        text: "Veuillez sélectionner un destinataire avant d'envoyer le message.",
      });
      return;
    }

    setLoading(true); // Show spinner
    setLoading(true); // Show spinner
    const senderUserType: "Etudiant" | "Enseignant" | "Personnel" | "User" = userType as "Etudiant" | "Enseignant" | "Personnel" | "User";
    const receiverUserType: "Etudiant" | "Enseignant" | "Personnel" | "User" = receiverType as "Etudiant" | "Enseignant" | "Personnel" | "User";

    const messageData: Partial<Message> = {
      sender: {
        userId: currentUser?._id!,
        userType: senderUserType,
        nom_fr: "",
        prenom_fr: "",
        email: ""

      },
      receiver: {
        userId: receiverId,
        userType: receiverUserType,
        nom_fr: "",
        prenom_fr: "",
        email: ""
      },
      subject,
      content,
      attachmentsBase64Strings,
      attachmentsExtensions,
      status: "sent",
      receiverStatus: "sent",
      senderStatus: "sent",
    };

    try {
      await sendMessage(messageData); // API call

      Swal.fire({
        icon: "success",
        title: "Message envoyé",
        text: "Votre message a été envoyé avec succès !",
        timer: 3000,
        timerProgressBar: true,
      });
      setSelectedFiles([]); // Clear files
      setAttachmentsBase64Strings([]);
      setAttachmentsExtensions([]);
      handleClose(); // Close modal
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Échec de l'envoi",
        text: "Une erreur est survenue lors de l'envoi du message.",
      });
    } finally {
      setLoading(false); // Hide spinner
    }

    console.log("messageData", messageData);

  };

  const handleDeleteMessage = (messageId: string) => {
    deleteMessage({ messageId });
  };

  const handleMarkMessageAsRead = (messageId: string) => {
    markMessageAsRead({ messageId });
  };

  const handleArchiveMessage = (messageId: string, userId: string, userType: string) => {
    const archiveMessageData = {
      messageId,
      userId,
      userType
    };
    archiveMessage(archiveMessageData)
  };
  const handleDeleteMessageForUser = (messageId: string, userId: string, userType: string) => {
    const deleteMessageData = {
      messageId,
      userId,
      userType
    };
    deleteMessageForUser(deleteMessageData)
  };
  // Handle individual checkbox toggle
  const handleCheckboxChange = (messageId: any) => {
    setSelectedMessages((prevSelected: any) =>
      prevSelected.includes(messageId)
        ? prevSelected.filter((id: any) => id !== messageId)
        : [...prevSelected, messageId]
    );
  };

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (!inboxMessages) return; // Prevent errors if inboxMessages is undefined

    if (selectedMessages.length === inboxMessages.length) {
      setSelectedMessages([]); // Unselect all
    } else {
      setSelectedMessages(inboxMessages.map((msg) => msg._id)); // Select all
    }
  };


  // Check if all messages are selected
  const isAllSelected = (inboxMessages ?? []).length > 0 && selectedMessages.length === (inboxMessages ?? []).length;


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Messagerie" pageTitle="Messagerie" />

          <Row className="mb-3">
            <Col lg={2}>
              <div className="d-flex justify-content-center ">
                <Button size="lg" variant="soft-success" onClick={handleShow}>
                  <span className="icon-on fs-6">
                    <i className=" bi bi-pencil align-bottom "></i> Nouveau
                    Message
                  </span>
                </Button>
              </div>
            </Col>
            <Col lg={6}>
              <Form className="d-flex">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                />
                <Button variant="outline-success">
                  <i className="bi bi-search"></i>
                </Button>
              </Form>
            </Col>
          </Row>

          <Card>
            <Card.Body>
              <Row>
                <Tab.Container defaultActiveKey="inbox">
                  <Col lg={2}>
                    <Nav
                      variant="pills"
                      className="flex-column nav-pills-tab custom-verti-nav-pills text-center"
                      role="tablist"
                      aria-orientation="vertical"
                    >
                      <Nav.Link eventKey="inbox" className="text-white bg-primary">
                        <i className="ri-mail-line d-block fs-20 mb-1"></i>{" "}
                        Boite de réception
                      </Nav.Link>
                      <Nav.Link eventKey="sent" className="text-white bg-success">
                        <i className="ri-send-plane-line d-block fs-20 mb-1"></i>{" "}
                        Envoyé
                      </Nav.Link>
                      {/* <Nav.Link eventKey="deleted">
                        <i className="ri-delete-bin-line d-block fs-20 mb-1"></i>{" "}
                        Supprimé
                      </Nav.Link> */}
                      <Nav.Link eventKey="archived" className="text-white bg-warning">
                        <i className="ri-inbox-archive-line d-block fs-20 mb-1"></i>{" "}
                        Archive
                      </Nav.Link>
                    </Nav>
                  </Col>
                  <Col lg={10}>
                    <Tab.Content className="text-muted mt-3 mt-lg-0">
                      {/* Fast Action Buttons */}
                      {selectedMessages.length > 0 && (
                        <div className="d-flex mb-2 gap-2">
                          <Button variant="soft-danger" size="sm" onClick={() => console.log("Delete", selectedMessages)}>
                            <i className="bi bi-trash"></i> Supprimer
                          </Button>
                          <Button variant="soft-warning" size="sm" onClick={() => console.log("Archive", selectedMessages)}>
                            <i className="bi bi-archive"></i> Archiver
                          </Button>
                          <Button variant="soft-primary" size="sm" onClick={() => console.log("Mark as Read", selectedMessages)}>
                            <i className="bi bi-envelope-open"></i> Marquer comme lu
                          </Button>
                        </div>
                      )}

                      {/* Inbox Tab */}
                      <Tab.Pane eventKey="inbox">

                        <div className="table-responsive">
                          <table className="table table-hover align-middle mb-0">
                            <thead>
                              <tr>
                                <th>
                                  <Form.Check
                                    type="checkbox"
                                    checked={isAllSelected}
                                    onChange={handleSelectAll}
                                  />
                                </th>

                                <th>Expediteur</th>
                                <th>Message</th>
                                <th className="text-end">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {inboxLoading ? (
                                <tr>
                                  <td>Loading...</td>
                                </tr>
                              ) : (
                                inboxMessages?.map((message) => (
                                  <tr key={message._id}>
                                    <td>
                                      <Form.Check
                                        type="checkbox"
                                        checked={selectedMessages.includes(message._id)}
                                        onChange={() => handleCheckboxChange(message._id)}
                                      />
                                    </td>

                                    <td className="fw-bold" style={{ maxWidth: "150px" }}>
                                      {message.sender.nom_fr} {message.sender.prenom_fr} {/* Expediteur */}
                                    </td>
                                    <td className="text-truncate" style={{ maxWidth: "400px", overflow: "visible" }}>
                                      <span className="fw-bold">{message.subject}</span> :
                                      {DOMPurify.sanitize(message.content, {
                                        ALLOWED_TAGS: [],
                                      })}
                                    </td>

                                    <td className="text-end">
                                      <Button
                                        variant="link"
                                        className="text-muted p-0 me-2"
                                        onClick={() => navigate("/messagerie/single-message", { state: { message } })}
                                      >
                                        <i className="bi bi-eye"></i>
                                      </Button>
                                      <Button
                                        variant="link"
                                        className="text-muted p-0 me-2"

                                        onClick={() => handleArchiveMessage(message._id, message.receiver.userId, message.receiver.userType)}
                                      >
                                        <i className="bi bi-archive"></i>
                                      </Button>
                                      <Button
                                        variant="link"
                                        className="text-muted p-0 me-2"
                                        onClick={() => handleDeleteMessageForUser(message._id, message.receiver.userId, message.receiver.userType)}
                                      >
                                        <i className="bi bi-trash"></i>
                                      </Button>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </Tab.Pane>

                      <Tab.Pane eventKey="sent">

                        <div className="table-responsive">
                          <table className="table table-hover align-middle mb-0">
                            <thead>
                              <th></th> {/* Empty header for checkboxes */}
                              <th>Destinataire</th> {/* Receiver (Destinataire) Header */}
                              <th>Message</th> {/* Message Content Header */}
                              <th className="text-end">Actions</th> {/* Actions Header */}
                            </thead>
                            <tbody>
                              {sentLoading ? (
                                <tr>
                                  <td>Loading...</td>
                                </tr>
                              ) : (
                                sentMessages?.map((message) => (
                                  <tr key={message._id}>
                                    <td>
                                      <Form.Check type="checkbox" />
                                    </td>
                                    <td className="fw-bold" style={{ maxWidth: "150px" }}>
                                      {message.receiver.nom_fr} {message.receiver.prenom_fr} {/* Destinataire */}
                                    </td>

                                    <td className="text-truncate" style={{ maxWidth: "400px", overflow: "visible" }}>
                                      <span className="fw-bold">{message.subject}</span> :
                                      {DOMPurify.sanitize(message.content, {
                                        ALLOWED_TAGS: [],
                                      })}
                                    </td>

                                    <td className="text-end">
                                      <Button
                                        variant="link"
                                        className="text-muted p-0 me-2"
                                        onClick={() => navigate("/messagerie/single-message", { state: { message } })}
                                      >
                                        <i className="bi bi-eye"></i>
                                      </Button>
                                      <Button
                                        variant="link"
                                        className="text-muted p-0 me-2"
                                        onClick={() => handleArchiveMessage(message._id, message.sender.userId, message.sender.userType)}
                                      >
                                        <i className="bi bi-archive"></i>
                                      </Button>
                                      <Button
                                        variant="link"
                                        className="text-muted p-0 me-2"
                                        onClick={() => handleDeleteMessageForUser(message._id, message.sender.userId, message.sender.userType)}

                                        // onClick={() => handleDeleteMessage(message._id)}
                                      >
                                        <i className="bi bi-trash"></i>
                                      </Button>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>

                      </Tab.Pane>
                      <Tab.Pane eventKey="archived">
                        <div className="table-responsive">
                          <table className="table align-middle mb-0">
                            <thead>
                              <tr>
                                <th></th>
                                <th>Destinataire</th>
                                <th>Expediteur</th>
                                <th>Message</th>
                                <th className="text-end">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {isLoading ? (
                                <tr>
                                  <td>Loading...</td>
                                </tr>
                              ) : (
                                archivedMessages?.map((message) => {

                                  const rowClass = message.senderStatus === "archived"
                                    ? "bg-success bg-opacity-25 text-dark"
                                    : message.receiverStatus === "archived"
                                      ? "bg-primary bg-opacity-25 text-dark"
                                      : "";

                                  return (
                                    <tr key={message._id} className={rowClass}>
                                      <td>
                                        <Form.Check type="checkbox" />
                                      </td>
                                      <td className="fw-bold" style={{ maxWidth: "150px" }}>
                                        {message.receiver.nom_fr} {message.receiver.prenom_fr}
                                      </td>
                                      <td className="fw-bold" style={{ maxWidth: "150px" }}>
                                        {message.sender.nom_fr} {message.sender.prenom_fr}
                                      </td>
                                      <td className="text-truncate" style={{ maxWidth: "400px", overflow: "visible" }}>
                                        <span className="fw-bold">{message.subject}</span> :
                                        {DOMPurify.sanitize(message.content, {
                                          ALLOWED_TAGS: [],
                                        })}
                                        {/* {message.content}  */}
                                      </td>
                                      <td className="text-end">
                                        <Button
                                          variant="link"
                                          className="text-muted p-0 me-2"
                                          onClick={() => navigate("/messagerie/single-message", { state: { message } })}
                                        >
                                          <i className="bi bi-eye"></i>
                                        </Button>
                                        <Button
                                          variant="link"
                                          className="text-muted p-0 me-2"
                                          // onClick={() => handleDeleteMessage(message._id)}
                                          onClick={() => handleDeleteMessageForUser(message._id, message.sender.userId, message.sender.userType)}

                                        >
                                          <i className="bi bi-trash"></i>
                                        </Button>
                                      </td>

                                    </tr>
                                  );
                                })
                              )}
                            </tbody>
                          </table>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Col>
                </Tab.Container>
              </Row>
            </Card.Body>
          </Card>
        </Container>
      </div>

      <Modal size="xl" show={showModal} onHide={handleClose}>
        <Modal.Title className="fw-bold text-primary">
          📩 Nouveau Message
        </Modal.Title>

        <Modal.Body>
          <form>

            <div className="mb-3 position-relative">
              <div className="d-flex">
                <label htmlFor="receiver" className="col-form-label p-3">
                  À:{" "}
                </label>
                <Form.Control
                  type="text"
                  placeholder="Rechercher un destinataire..."
                  className="form-control"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowDropdown(e.target.value.length >= 3);
                  }}
                />
              </div>
              {showDropdown && (
                <div className="dropdown-menu show w-100" style={{ maxHeight: "200px", overflowY: "auto", position: "absolute", zIndex: 1000 }}>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => {
                      // const label =
                      //   user.userType === "Etudiant"
                      //     ? `${user.nom_fr} ${user.prenom_fr}
                      //      ${user.userType} -
                      //       ${user.groupe_classe?.nom_classe_fr || "N/A"}`
                      //     : user.userType === "Personnel"
                      //       ? `${user.nom_fr} ${user.prenom_fr} (${user.userType} - ${user.poste?.poste_fr || "N/A"})`
                      //       : `${user.nom_fr} ${user.prenom_fr} (${user.userType})`;

                      const label =
                        user.userType === "Etudiant" ? (
                          <>
                            {user.nom_fr} {user.prenom_fr}{" "}
                            <span className="badge bg-primary-subtle text-primary">
                              {user.userType}
                            </span>{" "}
                            -{" "}
                            <span className="badge badge-gradient-primary">
                              {user.groupe_classe?.nom_classe_fr || "N/A"}
                            </span>
                          </>
                        ) : user.userType === "Personnel" ? (
                          <>
                            {user.nom_fr} {user.prenom_fr}{" "}
                            <span className="badge bg-warning-subtle text-warning">
                              {user.userType}
                            </span>{" "}
                            -{" "}
                            <span className="badge badge-gradient-warning">
                              {user.poste?.poste_fr || "N/A"}
                            </span>
                          </>
                        ) : (
                          <>
                            {user.nom_fr} {user.prenom_fr}{" "}
                            <span className="badge bg-success-subtle text-success">
                              {user.userType}
                            </span>
                          </>
                        );
                      // Convert JSX to string
                      const labelString = ReactDOMServer.renderToStaticMarkup(label);

                      return (
                        <button
                          key={user._id}
                          className="dropdown-item"
                          onClick={() => handleSelectUser({ _id: user._id, userType: user.userType, label: labelString })}
                        >
                          {label}
                        </button>
                      );
                    })
                  ) : (
                    <span className="dropdown-item text-muted">Aucun résultat</span>
                  )}
                </div>
              )}
            </div>

            <div className="mb-3 d-flex">
              <label htmlFor="subject" className="col-form-label p-3">
                Objet:
              </label>
              <Form.Control
                type="text"
                className="form-control"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)} // Handle subject input
              />
            </div>
            <div className="mb-3">
              <label htmlFor="content" className="col-form-label p-3">
                Corps:
              </label>

              <CKEditor
                editor={ClassicEditor}
                data={content} // Set initial value
                onChange={(event: any, editor: any) => {
                  const data = editor.getData(); // Get editor content
                  setContent(data);
                }}
                id="content"
              />
            </div>
          </form>
        </Modal.Body>



        <Modal.Footer className="d-flex flex-column w-100">
          {/* File List Preview */}
          {selectedFiles.length > 0 && (
            <ListGroup className="mb-3 w-100">
              {selectedFiles.map((file, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                  <span>{file.name}</span>
                  <Button variant="danger" size="sm" onClick={() => removeFile(index)}>
                    <i className="bi bi-x"></i>
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}

          {/* Upload & Action Buttons */}
          <div className="d-flex justify-content-between w-100">
            <Button variant="success" onClick={() => document.getElementById("file-input")?.click()}>
              <i className="bi bi-paperclip"></i> Joindre
            </Button>

            <input id="file-input" type="file" multiple onChange={handleFileChange} style={{ display: "none" }} />

            <div>
              <Button variant="light" onClick={handleClose}>
                <i className="bi bi-x-lg"></i> Fermer
              </Button>
              <Button variant="primary" className="ms-2" onClick={handleSendMessage} disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : <i className="bi bi-send"></i>} Envoyer
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default Messages;
