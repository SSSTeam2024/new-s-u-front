import { useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import {
  Message,
  useSendMessageMutation,
  useFetchRepliesByParentIdQuery,
  useTransferMessageMutation,
} from "features/messages/messagesSlice";
import Breadcrumb from "Common/BreadCrumb";
import DOMPurify from "dompurify";
import { toast } from "react-toastify";
import { useFetchEnseignantsQuery } from "features/enseignant/enseignantSlice";
import { useFetchPersonnelsQuery } from "features/personnel/personnelSlice";
import { useFetchEtudiantsQuery } from "features/etudiant/etudiantSlice";
import { useFetchAllUsersQuery } from "features/account/accountSlice";
import Swal from "sweetalert2";
import { RootState } from "app/store";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "features/account/authSlice";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
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
  departements?: {
    _id: string;
    name_fr: string;
  };
}
interface User extends BaseUser {
  userType: "User";
  departements?: {
    _id: string;
    name_fr: string;
  };
}

type Users = Etudiant | Personnel | Enseignant | User;

const SingleMessage = () => {
  const currentUser = useSelector((state: RootState) =>
    selectCurrentUser(state)
  );
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.message;
  console.log("message", message);
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<string | null>(
    null
  );
  const [showReplyModal, setShowReplyModal] = useState(false);

  const [selectedReceiver, setSelectedReceiver] = useState<any>(null);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);

  const [replyFiles, setReplyFiles] = useState<File[]>([]);
  const [replyBase64Strings, setReplyBase64Strings] = useState<string[]>([]);
  const [replyExtensions, setReplyExtensions] = useState<string[]>([]);

  const [sendMessage] = useSendMessageMutation();
  const [transferMessage] = useTransferMessageMutation();

  const { data: personnels = [] } = useFetchPersonnelsQuery();
  const { data: enseignants = [] } = useFetchEnseignantsQuery();
  const { data: etudiants = [] } = useFetchEtudiantsQuery();
  const { data: users = [] } = useFetchAllUsersQuery();
  const allUsers: Users[] = [
    ...personnels.map(
      (user) => ({ ...user, userType: "Personnel" } as Personnel)
    ),
    ...enseignants.map(
      (user) => ({ ...user, userType: "Enseignant" } as Enseignant)
    ),
    ...etudiants.map((user) => ({ ...user, userType: "Etudiant" } as Etudiant)),
    ...users.map((user) => ({ ...user, userType: "User" } as Users)),
  ];

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      replyFiles.forEach((file) => URL.revokeObjectURL(file as any));
    };
  }, [replyFiles]);

  // Fetch replies using parentMessageId
  const { data: replies, isLoading } = useFetchRepliesByParentIdQuery(
    message?._id,
    {
      skip: !message?._id,
    }
  );
  console.log("replies", replies);
  if (!message) {
    return (
      <div className="container text-center mt-5">
        <div className="alert alert-warning">
          <i className="bi bi-exclamation-circle-fill me-2"></i> Aucun message
          trouvé.
        </div>
      </div>
    );
  }
  // Convert file to Base64
  const convertFileToBase64 = (
    file: File
  ): Promise<{ base64String: string; extension: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string; // include full "data:image/png;base64,..."
        const extension = file.name.split(".").pop() || "";
        resolve({ base64String, extension });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  const handleReplyFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setReplyFiles((prev) => [...prev, ...fileArray]);

      Promise.all(fileArray.map(convertFileToBase64)).then((results) => {
        setReplyBase64Strings((prev) => [
          ...prev,
          ...results.map((r) => r.base64String),
        ]);
        setReplyExtensions((prev) => [
          ...prev,
          ...results.map((r) => r.extension),
        ]);
      });
    }
  };
  const removeReplyFile = (index: number) => {
    setReplyFiles((prev) => prev.filter((_, i) => i !== index));
    setReplyBase64Strings((prev) => prev.filter((_, i) => i !== index));
    setReplyExtensions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return alert("Le message ne peut pas être vide.");

    const replyMessage: Partial<Message> = {
      sender: {
      userId: currentUser?._id!,
      userType: "User",
      nom_fr: currentUser?.nom_fr!,
      prenom_fr: currentUser?.prenom_fr!,
      email: currentUser?.email!,
    },
      receivers: [
        {
          userId: message.sender.userId,
          userType: message.sender.userType,
          nom_fr: message.sender.nom_fr,
          prenom_fr: message.sender.prenom_fr,
          email: message.sender.email,
        },
      ],
      subject: `Re: ${message.subject}`,
      content: replyContent,
      parentMessageId: message._id,
      createdAt: new Date().toISOString(),
      status: "sent",
      senderStatus: "sent",
      attachments: replyFiles.map((file) => file.name), // optional: just for preview
      attachmentsBase64Strings: replyBase64Strings,
      attachmentsExtensions: replyExtensions,
    };
    console.log("replymessage", replyMessage);

    try {
      await sendMessage(replyMessage);
      alert("Réponse envoyée !");
      setShowReplyModal(false);
      setReplyContent("");
      setReplyFiles([]);
      setReplyBase64Strings([]);
      setReplyExtensions([]);
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      alert("Échec de l'envoi du message.");
    }
  };
  //modal to show attachements

  const handleOpenModal = (attachment: string) => {
    setSelectedAttachment(attachment);
    setShowModal(true);
  };
  const handleTransferMessage = (message: any) => {
    // For example: open a modal with a list of users to select the new receiver
    setSelectedMessage(message);
    setShowTransferModal(true); // You can use a Bootstrap modal or your own
  };
  const confirmTransfer = (messageId: string, receiver: any) => {
    if (!receiver?._id || !receiver?.userType || !currentUser?._id) return;

    const forwarder = {
      userId: currentUser._id,
      userType: "User", // fallback to 'User' if needed
    };

    const newReceiver = {
      userId: receiver._id,
      userType: receiver.userType,
    };

    transferMessage({
      messageId,
      newReceiver,
      forwardedBy: forwarder,
    })
      .unwrap()
      .then(() => {
        toast.success("Message transféré avec succès");
        setShowTransferModal(false);
      })
      .catch((err) => {
        console.error("Erreur de transfert :", err);
        toast.error("Échec du transfert");
      });
  };
  const handleConfirm = () => {
    if (!selectedMessage || !selectedReceiver) return;

    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action transférera le message.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, transférer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        confirmTransfer(selectedMessage._id, selectedReceiver);
        Swal.fire("Transféré !", "Le message a été transféré.", "success");
      }
    });
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Messagerie" pageTitle="Messagerie" />
          <Card className="shadow-sm">
            {/* Message Header */}
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="bi bi-envelope-fill me-2"></i> {message.subject}
              </h5>
              <small className="fw-light">
                {new Date(message.createdAt).toLocaleString()}
              </small>
            </Card.Header>
            <Card.Body>
              <div>
                {/* <div className="card-header bg-gradient text-white d-flex justify-content-between align-items-center" style={{ background: "linear-gradient(135deg, #6a11cb, #2575fc)" }}>
                  <h5 className="mb-0"><i className="bi bi-envelope-fill me-2"></i> {message.subject}</h5>
                  <span className="badge bg-light text-dark">{new Date(message.createdAt).toLocaleString()}</span>
                </div> */}

                {/* <div className="card-body">
                 
                  <div className="d-flex align-items-center mb-3">
                    <div className="me-3">
                      <i className="bi bi-person-circle text-primary fs-1"></i>
                    </div>
                    <div>
                      <p className="mb-1"><strong>De:</strong> {message.sender.nom_fr} {message.sender.prenom_fr}</p>
                      <p className="text-muted small">{message.sender.email}</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-4">
                    <div className="me-3">
                      <i className="bi bi-person-check text-success fs-1"></i>
                    </div>
                    <div>
                      <p className="mb-1"><strong>À:</strong> {message.receiver.nom_fr} {message.receiver.prenom_fr}</p>
                      <p className="text-muted small">{message.receiver.email}</p>
                    </div>
                  </div>

                
                  <hr />
                  <div
                    className="mb-4"
                    dangerouslySetInnerHTML={{ __html: message.content }}
                  ></div>


                  <div className="d-flex flex-wrap gap-2">
                    {message.attachments && message.attachments.length > 0 ? (
                      message.attachments.map((filename: string, index: number) => {
                     
                        const fileUrl = `${process.env.REACT_APP_API_URL}/files/messagerieFiles/${filename}`;

                        return (
                          <button
                            key={index}
                            className="btn btn-outline-primary d-flex align-items-center"
                            onClick={() => handleOpenModal(fileUrl)}
                          >
                            <i className="bi bi-file-earmark-text me-2"></i> {`Fichier ${index + 1}`}
                          </button>
                        );
                      })
                    ) : (
                      <p className="text-muted">Aucune pièce jointe</p>
                    )}
                  </div>

                </div> */}

                <Card.Body className="pb-0">
                  <Row className="mb-3">
                    <Col md={6}>
                      <div className="d-flex align-items-start">
                        <i className="bi bi-person-circle text-primary fs-3 me-2"></i>
                        <div>
                          <strong>De:</strong> <br />
                          {message.sender.nom_fr} {message.sender.prenom_fr}
                          <br />
                          <small className="text-muted">
                            {message.sender.email}
                          </small>
                        </div>
                      </div>
                    </Col>
                   <Col md={6}>
  <div className="d-flex align-items-start">
    <i className="bi bi-person-check text-success fs-3 me-2"></i>
    <div>
      <strong>À :</strong>
      {message.receivers && message.receivers.length > 0 ? (
        message.receivers.map((receiver:any, index:any) => (
          <div key={index}>
            {receiver.nom_fr} {receiver.prenom_fr}
            <br />
            <small className="text-muted">{receiver.email}</small>
          </div>
        ))
      ) : (
        <div className="text-muted">Aucun destinataire</div>
      )}
    </div>
  </div>
</Col>
                  </Row>

                  {/* Message Content */}
                  <hr />
                  <div className="mb-3 px-2">
                    <div
                      dangerouslySetInnerHTML={{ __html: message.content }}
                      className="fs-6"
                    />
                  </div>

                  {/* Attachments */}
                  <div className="mb-3 px-2">
                    <strong>
                      <i className="bi bi-paperclip me-1"></i> Pièces jointes:
                    </strong>
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      {message.attachments?.length > 0 ? (
                        message.attachments.map((filename: any, idx: any) => {
                          const fileUrl = `${process.env.REACT_APP_API_URL}/files/messagerieFiles/${filename}`;
                          return (
                            <Button
                              key={idx}
                              variant="outline-primary"
                              size="sm"
                              className="d-flex align-items-center"
                              onClick={() => handleOpenModal(fileUrl)}
                            >
                              <i className="bi bi-file-earmark-text me-2" />{" "}
                              Fichier {idx + 1}
                            </Button>
                          );
                        })
                      ) : (
                        <span className="text-muted">Aucune</span>
                      )}
                    </div>
                  </div>
                </Card.Body>

                {/* Replies Section */}
                <div>
                  <h6>
                    <i className="bi bi-chat-left-text me-2"></i> Réponses
                  </h6>
                  {isLoading ? (
                    <Spinner animation="border" />
                  ) : (
                    replies?.map((reply) => (
                      <div key={reply._id} className="card mt-2">
                        <div className="card-header bg-light d-flex justify-content-between align-items-center">
                          <small>
                            <strong>
                              {reply.sender.nom_fr} {reply.sender.prenom_fr}
                            </strong>
                            <span className="text-muted">
                              →{" "}
                              {reply.receivers
                                .map((r) => `${r.nom_fr} ${r.prenom_fr}`)
                                .join(", ")}
                            </span>{" "}
                          </small>
                          <span className="badge bg-secondary">
                            {new Date(reply?.createdAt!).toLocaleString()}
                          </span>
                        </div>
                        <div className="card-body">
                          <p>{reply.content}</p>
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                          {reply.attachments && reply.attachments.length > 0 ? (
                            reply.attachments.map(
                              (filename: string, index: number) => {
                                // Construct file URL
                                const fileUrl = `${process.env.REACT_APP_API_URL}/files/messagerieFiles/${filename}`;

                                return (
                                  <button
                                    key={index}
                                    className="btn btn-outline-primary d-flex align-items-center"
                                    onClick={() => handleOpenModal(fileUrl)}
                                  >
                                    <i className="bi bi-file-earmark-text me-2"></i>{" "}
                                    {`Fichier ${index + 1}`}
                                  </button>
                                );
                              }
                            )
                          ) : (
                            <p className="text-muted">Aucune pièce jointe</p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="card-footer  d-flex justify-content-between">
                  {/* <Button variant="danger" > <i className="bi bi-trash me-5"></i> Supprimer
                  </Button>

                  <Button variant="secondary" >
                    <i className="bi bi-archive me-2"></i> Archiver
                  </Button> */}
                  <div>
                    {/* Reply Button */}
                    <Button
                      variant="outline-primary"
                      onClick={() => setShowReplyModal(true)}
                    >
                      <i className="bi bi-reply-fill me-1" /> Répondre
                    </Button>
                    <Button
                      variant="success"
                      className="ms-2"
                      onClick={() => handleTransferMessage(message)}
                    >
                      <i className="bi bi-box-arrow-up-right"></i> Transferer
                    </Button>
                  </div>
                </div>
              </div>

              {/* Reply Form Modal*/}
              <Modal
                show={showReplyModal}
                onHide={() => setShowReplyModal(false)}
                size="lg"
              >
                <Modal.Header closeButton>
                  <Modal.Title>
                    Répondre à {message.sender.nom_fr}{" "}
                    {message.sender.prenom_fr}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {/* To Field */}
                  <div className="mb-2">
                    <label className="form-label">
                      <strong>À:</strong>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={`${message.sender.nom_fr} ${message.sender.prenom_fr}`}
                      disabled
                    />
                  </div>

                  {/* Subject Field */}
                  <div className="mb-2">
                    <label className="form-label">
                      <strong>Sujet:</strong>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={`Re: ${message.subject}`}
                      disabled
                    />
                  </div>

                  {/* Message TextArea */}
                  <div className="mb-3">
                    <label className="form-label">
                      <strong>Message:</strong>
                    </label>
                    {/* <textarea
                      className="form-control"
                      rows={4}
                      placeholder="Tapez votre réponse ici..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                    ></textarea> */}
                      <CKEditor
                                    editor={ClassicEditor}
                                    data={replyContent} // Set initial value
                                    onChange={(event: any, editor: any) => {
                                      const data = editor.getData(); // Get editor content
                                      setReplyContent(data);
                                    }}
                                    id="content"
                                  />
                  </div>

                  {/* File Upload */}
                  <label className="form-label">
                    <strong>Pièces jointes:</strong>
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={handleReplyFileChange}
                    className="form-control mb-3"
                  />

                  {/* File Previews */}
                  <div className="d-flex flex-wrap gap-3">
                    {replyFiles.map((file, index) => {
                      const fileType = file.type;

                      return (
                        <div
                          key={index}
                          className="border rounded p-2"
                          style={{ maxWidth: "200px" }}
                        >
                          {fileType.startsWith("image/") ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="img-fluid mb-2 rounded"
                              style={{ maxHeight: "150px" }}
                            />
                          ) : fileType === "application/pdf" ? (
                            <div className="text-center mb-2">
                              <i className="bi bi-file-earmark-pdf-fill fs-2 text-danger"></i>
                              <div className="small">{file.name}</div>
                            </div>
                          ) : (
                            <div className="text-center mb-2">
                              <i className="bi bi-file-earmark fs-2"></i>
                              <div className="small">{file.name}</div>
                            </div>
                          )}
                          <div className="text-center">
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => removeReplyFile(index)}
                            >
                              Supprimer
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => setShowReplyModal(false)}
                  >
                    Annuler
                  </Button>
                  <Button variant="primary" onClick={handleReplySubmit}>
                    Envoyer
                  </Button>
                </Modal.Footer>
              </Modal>
            </Card.Body>
          </Card>
        </Container>
      </div>
      {/* Modal for Attachments */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Prévisualisation de la pièce jointe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAttachment ? (
            <iframe
              src={selectedAttachment}
              style={{ width: "100%", height: "400px", border: "none" }}
              title="Attachment Preview"
            ></iframe>
          ) : (
            <p className="text-muted">Aucune pièce jointe sélectionnée.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedAttachment && (
            <a href={selectedAttachment} download className="btn btn-success">
              <i className="bi bi-download me-2"></i> Télécharger
            </a>
          )}
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* //Modal transfer message */}
      <Modal
        show={showTransferModal}
        onHide={() => setShowTransferModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Transférer le message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Select
            onChange={(e) => {
              const selected = allUsers.find(
                (user) => user._id === e.target.value
              );
              setSelectedReceiver(selected || null);
            }}
          >
            <option>Choisissez un utilisateur</option>
            {allUsers?.map((user: any) => (
              <option key={user._id} value={user._id}>
                {user.nom_fr} {user.prenom_fr} ({user.userType})
              </option>
            ))}
          </Form.Select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleConfirm}>
            Transférer
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default SingleMessage;
