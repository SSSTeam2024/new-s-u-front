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
  useDeleteMessageForUserMutation,
  useMarkMessageAsUnreadMutation,
  useRestoreMessageMutation,
  useFetchDeletedMessagesForUserQuery,
} from "features/messages/messagesSlice";
import { RootState } from "app/store";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "features/account/authSlice";
import { useFetchEnseignantsQuery } from "features/enseignant/enseignantSlice";
import { useFetchPersonnelsQuery } from "features/personnel/personnelSlice";
import { useFetchEtudiantsQuery } from "features/etudiant/etudiantSlice";
import { useFetchAllUsersQuery } from "features/account/accountSlice";
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
  email: string;
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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
// Define a combined type that includes all possible user types
type Users = Etudiant | Personnel | Enseignant | User;

const Messages = () => {
  const currentUser = useSelector((state: RootState) =>
    selectCurrentUser(state)
  );
  // console.log("currentUser", currentUser)

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const userId = currentUser?._id!;
  const userType = "User"; // Replace with actual user type (Etudiant/Enseignant/Personnel/User)

  const { data: inboxMessages, isLoading: inboxLoading } =
    useFetchInboxMessagesQuery({ userId, userType: "User" });

  const { data: sentMessages, isLoading: sentLoading } =
    useFetchSentMessagesQuery({ userId, userType });
  const { data: archivedSentMessages, isLoading: archivedSentLoading } =
    useFetchArchivedSentMessagesQuery({ userId, userType });
  // console.log("archivedSentMessages", archivedSentMessages)
  const { data: archivedInboxMessages, isLoading: archivedInboxLoading } =
    useFetchArchivedInboxMessagesQuery({ userId, userType });
  // console.log("archivedInboxMessages", archivedInboxMessages)
  // const { data: deletedMessages, isLoading: deletedLoading, refetch } = useFetchDeletedMessagesForUserQuery({ userId, userType });

  const {
    data,
    isLoading: deletedLoading,
    refetch,
  } = useFetchDeletedMessagesForUserQuery({ userId, userType });

  const deletedMessages = data?.deletedMessages ?? [];
  console.log("deletedmessages", deletedMessages);
  const { data: personnels = [] } = useFetchPersonnelsQuery();
  const { data: enseignants = [] } = useFetchEnseignantsQuery();
  const { data: etudiants = [] } = useFetchEtudiantsQuery();
  const { data: users = [] } = useFetchAllUsersQuery();
  const isLoading = archivedSentLoading || archivedInboxLoading;
  const archivedMessages = [
    ...(archivedSentMessages || []),
    ...(archivedInboxMessages || []),
  ];

  //   const isLoadingDeleted = deletedSentLoading || deletedInboxLoading;
  //   const deletedMessages = [...(deletedSentMessages || []), ...(deletedInboxMessages || [])];
  // console.log("deleted messages",deletedMessages)

  const [sendMessage] = useSendMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const [markMessageAsRead] = useMarkMessageAsReadMutation();
  const [markMessageAsUnread] = useMarkMessageAsUnreadMutation();
  const [archiveMessage] = useArchiveMessageMutation();
  const [restoreMessage] = useRestoreMessageMutation();
  const [deleteMessageForUser] = useDeleteMessageForUserMutation();

  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [attachmentsBase64Strings, setAttachmentsBase64Strings] = useState<
    string[]
  >([]);
  const [attachmentsExtensions, setAttachmentsExtensions] = useState<string[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [selectedSentMessages, setSelectedSentMessages] = useState<string[]>(
    []
  );
  const [selectedArchivedMessages, setSelectedArchivedMessages] = useState<
    { messageId: string; userId: string; userType: string }[]
  >([]);
  const [selectedDeletedMessages, setSelectedDeletedMessages] = useState<
    { messageId: string; userId: string; userType: string }[]
  >([]);
  const [selectedFinalDeletedMessages, setSelectedFinalDeletedMessages] =
    useState<string[]>([]);

  const [activeKey, setActiveKey] = useState("inbox");

  const [receiverId, setReceiverId] = useState("");
  const [receiverType, setReceiverType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<{
    _id: string;
    userType: string;
    nom: string;
    prenom: string;
    extraInfo: string;
  } | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedReceivers, setSelectedReceivers] = useState([]);

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
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const filteredUsers =
    searchTerm.length >= 3
      ? allUsers.filter((user) =>
          `${user.nom_fr} ${user.prenom_fr}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      : allUsers;

  const handleReceiverSelect = (userId: string, userType: string) => {
    setReceiverId(userId);
    setReceiverType(userType);
    console.log("Selected Receiver:", { userId, userType });
  };

  // const handleSelectUser = (user: { _id: string; userType: string; nom: string; prenom: string; extraInfo: string }) => {
  //   setSelectedUser(user);

  //   // Set only the plain text (name + post/group)
  //   setSearchTerm(`${user.nom} ${user.prenom} - ${user.extraInfo}`);

  //   setShowDropdown(false);
  //   handleReceiverSelect(user._id, user.userType);
  // };
  const handleSelectUser = (user: any) => {
    setSelectedReceivers((prev: any) => {
      const exists = prev.find((u: any) => u._id === user._id);
      if (exists) return prev; // prevent duplicate
      return [...prev, user];
    });

    setSearchTerm(""); // clear input after selection
    setShowDropdown(false); // hide dropdown after selection
  };
  // Called to remove a selected user
  const removeUser = (id: any) => {
    setSelectedReceivers((prev) => prev.filter((u: any) => u._id !== id));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);

      // Prevent duplicates
      const newFiles = fileArray.filter(
        (file) =>
          !selectedFiles.some(
            (existing) =>
              existing.name === file.name && existing.size === file.size
          )
      );

      // Validate size
      const validFiles = newFiles.filter((file) => {
        if (file.size > MAX_FILE_SIZE) {
          Swal.fire({
            icon: "warning",
            title: "Fichier trop volumineux",
            text: `${file.name} dépasse la taille maximale autorisée de 5MB.`,
          });
          return false;
        }
        return true;
      });

      // Update file state
      setSelectedFiles((prev) => [...prev, ...validFiles]);

      // Convert to Base64
      Promise.all(validFiles.map(convertFileToBase64)).then((results) => {
        setAttachmentsBase64Strings((prev) => [
          ...prev,
          ...results.map((r) => r.base64String),
        ]);
        setAttachmentsExtensions((prev) => [
          ...prev,
          ...results.map((r) => r.extension),
        ]);
      });
    }
  };

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

  // Remove file from the list
  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setAttachmentsBase64Strings((prev) => prev.filter((_, i) => i !== index));
    setAttachmentsExtensions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async () => {
    if (selectedReceivers.length === 0) {
  Swal.fire({
    icon: "warning",
    title: "Destinataires manquants",
    text: "Veuillez sélectionner au moins un destinataire avant d'envoyer le message.",
  });
  return;
}

    setLoading(true); // Show spinner
    setLoading(true); // Show spinner
    const senderUserType: "Etudiant" | "Enseignant" | "Personnel" | "User" =
      userType as "Etudiant" | "Enseignant" | "Personnel" | "User";
    const receiverUserType: "Etudiant" | "Enseignant" | "Personnel" | "User" =
      receiverType as "Etudiant" | "Enseignant" | "Personnel" | "User";

    const messageData: Partial<Message> = {
      sender: {
        userId: currentUser?._id!,
        userType: senderUserType,
        nom_fr: "",
        prenom_fr: "",
        email: "",
      },
      receivers: selectedReceivers.map((receiver: any) => ({
        userId: receiver._id,
        userType: receiver.userType,
        nom_fr: receiver.nom_fr,
        prenom_fr: receiver.prenom_fr,
        email: receiver.email,
      })),
      subject,
      content,
      attachmentsBase64Strings,
      attachmentsExtensions,
      status: "sent",
      senderStatus: "sent",
    };

    try {
      await sendMessage(messageData);

      Swal.fire({
        icon: "success",
        title: "Message envoyé",
        text: "Votre message a été envoyé avec succès !",
        timer: 3000,
        timerProgressBar: true,
      });
      setSelectedFiles([]);
      setAttachmentsBase64Strings([]);
      setAttachmentsExtensions([]);
      handleClose();
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

  const handleMarkMessageAsRead = (messageId: string) => {
    markMessageAsRead({ messageId });
  };
  const handleMarkMessageAsUnread = (messageId: string) => {
    markMessageAsUnread({ messageId });
  };

  const handleArchiveMessage = (
    messageId: string,
    userId: string,
    userType: string
  ) => {
    const archiveMessageData = {
      messageId,
      userId,
      userType,
    };
    archiveMessage(archiveMessageData);
  };

  // const handleDeleteMessage = (messageId: string, userId: string, userType: string) => {
  //   const deleteMessageData = {
  //     messageId,
  //     userId,
  //     userType
  //   };
  //   deleteMessage(deleteMessageData)
  // };

  const handleDeleteMessage = async (
    messageId: string,
    userId: string,
    userType: string
  ) => {
    Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Cette action est irréversible!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer!",
      cancelButtonText: "Annuler",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteMessage({ messageId, userId, userType }).unwrap();

          Swal.fire(
            "Supprimé!",
            "Le message a été supprimé avec succès.",
            "success"
          );

          // ✅ Refetch messages immediately after deletion
          refetch();
        } catch (error) {
          Swal.fire(
            "Erreur!",
            "Une erreur est survenue lors de la suppression.",
            "error"
          );
        }
      }
    });
  };
  const handleDeleteMultipleMessages = async (idsOnly: string[]) => {
    if (selectedDeletedMessages.length === 0) {
      Swal.fire(
        "Aucun message sélectionné",
        "Veuillez sélectionner des messages à supprimer.",
        "info"
      );
      return;
    }

    Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Tous les messages sélectionnés seront supprimés définitivement!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer!",
      cancelButtonText: "Annuler",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Delete all selected messages in parallel
          await Promise.all(
            selectedDeletedMessages.map(({ messageId, userId, userType }) =>
              deleteMessage({ messageId, userId, userType }).unwrap()
            )
          );

          Swal.fire(
            "Supprimé!",
            "Tous les messages sélectionnés ont été supprimés.",
            "success"
          );

          // Clear selection and refetch data
          setSelectedDeletedMessages([]);
          refetch();
        } catch (error) {
          Swal.fire(
            "Erreur!",
            "Une erreur est survenue lors de la suppression multiple.",
            "error"
          );
        }
      }
    });
  };

  const handleRestoreMessage = (
    messageId: string,
    userId: string,
    userType: string
  ) => {
    const restoreMessageData = {
      messageId,
      userId,
      userType,
    };
    restoreMessage(restoreMessageData);
  };
  const handleDeleteMessageForUser = (
    messageId: string,
    userId: string,
    userType: string
  ) => {
    const deleteMessageData = {
      messageId,
      userId,
      userType,
    };
    deleteMessageForUser(deleteMessageData);
  };
  // Handle individual checkbox for inbox
  const handleCheckboxChange = (messageId: any) => {
    setSelectedMessages((prevSelected: any) =>
      prevSelected.includes(messageId)
        ? prevSelected.filter((id: any) => id !== messageId)
        : [...prevSelected, messageId]
    );
  };
  // Handle individual checkbox for sent messages
  const handleSentCheckboxChange = (messageId: any) => {
    setSelectedSentMessages((prevSelected: any) =>
      prevSelected.includes(messageId)
        ? prevSelected.filter((id: any) => id !== messageId)
        : [...prevSelected, messageId]
    );
  };
  // Handle individual checkbox for archived messages
  const handleArchiveCheckboxChange = (message: {
    messageId: string;
    userId: string;
    userType: string;
  }) => {
    setSelectedArchivedMessages((prevSelected) => {
      const exists = prevSelected.some(
        (m) => m.messageId === message.messageId
      );
      return exists
        ? prevSelected.filter((m) => m.messageId !== message.messageId)
        : [...prevSelected, message];
    });
  };
  const handleDeleteCheckboxChange = (messageId: string) => {
    setSelectedDeletedMessages((prevSelected) => {
      const exists = prevSelected.some((m) => m.messageId === messageId);
      return exists
        ? prevSelected.filter((m) => m.messageId !== messageId)
        : [...prevSelected, { messageId, userId, userType }];
    });
  };
  // const handleDeleteCheckboxChange = (messageId: string) => {
  //   setSelectedDeletedMessages((prevSelected) =>
  //     prevSelected.includes(messageId)
  //       ? prevSelected.filter((id) => id !== messageId)
  //       : [...prevSelected, messageId]
  //   );
  // };
  // Handle select all checkbox inbox
  const handleSelectAll = () => {
    if (!inboxMessages) return;

    if (selectedMessages.length === inboxMessages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(inboxMessages.map((msg) => msg._id));
    }
  };
  // Handle select all checkbox sent messages
  const handleSelectAllSent = () => {
    if (!sentMessages) return;

    if (selectedSentMessages.length === sentMessages.length) {
      setSelectedSentMessages([]);
    } else {
      setSelectedSentMessages(sentMessages.map((msg) => msg._id));
    }
  };
  const handleSelectAllDeleted = () => {
    if (!deletedMessages) return;

    if (selectedDeletedMessages.length === deletedMessages.length) {
      setSelectedDeletedMessages([]);
    } else {
      const allMessages = deletedMessages.map((msg: any) => ({
        messageId: msg._id,
        userId,
        userType,
      }));
      setSelectedDeletedMessages(allMessages);
    }
  };
  // Handle select all checkbox archived messages
  // const handleSelectAllArchived = () => {
  //   if (!archivedMessages) return;

  //   if (selectedArchivedMessages.length === archivedMessages.length) {
  //     setSelectedArchivedMessages([]);
  //   } else {
  //     setSelectedArchivedMessages(archivedMessages.map((msg) => msg._id));
  //   }
  // };

  // Check if all messages are selected
  const isAllSelected =
    (inboxMessages ?? []).length > 0 &&
    selectedMessages.length === (inboxMessages ?? []).length;
  const isAllSelectedSent =
    (sentMessages ?? []).length > 0 &&
    selectedSentMessages.length === (sentMessages ?? []).length;
  const isAllSelectedArchived =
    (archivedMessages ?? []).length > 0 &&
    selectedArchivedMessages.length === (archivedMessages ?? []).length;
  const isAllSelectedDeleted =
    (deletedMessages ?? []).length > 0 &&
    selectedDeletedMessages.length === (deletedMessages ?? []).length;

  // Function to mark messages as read (single or multiple)
  const handleMarkMessageAsReadMulti = async (
    messageIds: string | string[]
  ) => {
    const ids = Array.isArray(messageIds) ? messageIds : [messageIds];
    await Promise.all(
      ids.map(async (id) => await markMessageAsRead({ messageId: id }))
    );
    setSelectedMessages([]);
  };

  // Function to mark messages as unread (single or multiple)
  const handleMarkMessageAsUnreadMulti = async (
    messageIds: string | string[]
  ) => {
    const ids = Array.isArray(messageIds) ? messageIds : [messageIds];
    await Promise.all(
      ids.map(async (id) => await markMessageAsUnread({ messageId: id }))
    );
    setSelectedMessages([]);
  };
  const handleArchiveMessageMulti = async (
    messageIds: string | string[],
    userId?: string,
    userType?: string
  ) => {
    const ids = Array.isArray(messageIds) ? messageIds : [messageIds];
    await Promise.all(
      ids.map(async (id) => {
        const message = inboxMessages?.find((msg) => msg._id === id);
        if (message) {
          await Promise.all(
            message.receivers.map(async (receiver) => {
              await archiveMessage({
                messageId: id,
                userId: receiver.userId,
                userType: receiver.userType,
              });
            })
          );
          // await archiveMessage({ messageId: id, userId: message.receivers.userId, userType: message.receivers.userType });
        }
      })
    );
    setSelectedMessages([]);
  };
  const handleArchiveSentMessageMulti = async (
    messageIds: string | string[],
    userId?: string,
    userType?: string
  ) => {
    const ids = Array.isArray(messageIds) ? messageIds : [messageIds];
    await Promise.all(
      ids.map(async (id) => {
        const message = sentMessages?.find((msg) => msg._id === id);
        if (message) {
          await archiveMessage({
            messageId: id,
            userId: message.sender.userId,
            userType: message.sender.userType,
          });
        }
      })
    );
    setSelectedMessages([]);
  };
  // const handleDeleteMessageForUserMulti = async (messageIds: string | string[], userId?: string, userType?: string) => {
  //   const ids = Array.isArray(messageIds) ? messageIds : [messageIds];
  //   await Promise.all(ids.map(async (id) => {
  //     const message = inboxMessages?.find((msg) => msg._id === id);
  //     if (message) {
  //       await deleteMessageForUser({ messageId: id, userId: message.receivers.userId, userType: message.receiver.userType });
  //     }
  //   }));
  //   setSelectedMessages([]);
  // };

  const handleDeleteMessageForUserMulti = async (
    messageIds: string | string[],
    userId?: string,
    userType?: string
  ) => {
    if (!userId || !userType) return;

    const ids = Array.isArray(messageIds) ? messageIds : [messageIds];

    await Promise.all(
      ids.map(async (id) => {
        await deleteMessageForUser({
          messageId: id,
          userId,
          userType,
        });
      })
    );

    setSelectedMessages([]);
  };
  const handleDeleteSentMessageForUserMulti = async (
    messageIds: string | string[],
    userId?: string,
    userType?: string
  ) => {
    const ids = Array.isArray(messageIds) ? messageIds : [messageIds];
    await Promise.all(
      ids.map(async (id) => {
        const message = sentMessages?.find((msg) => msg._id === id);
        if (message) {
          await deleteMessageForUser({
            messageId: id,
            userId: message.sender.userId,
            userType: message.sender.userType,
          });
        }
      })
    );
    setSelectedMessages([]);
  };
  // const handleDeleteArchivedMessageForUserMulti = async (
  //   messageIds: string | string[]
  // ) => {
  //   const ids = Array.isArray(messageIds) ? messageIds : [messageIds];

  //   await Promise.all(
  //     ids.map(async (id) => {
  //       const message = archivedMessages?.find((msg) => msg._id === id);

  //       if (message) {
  //         // Figure out if current user is the sender or the receiver
  //         const isSender = message.sender?.userId === userId;
  //         const isReceiver = message.receivers?.userId === userId;

  //         if (isSender) {
  //           await deleteMessageForUser({
  //             messageId: id,
  //             userId: message.sender.userId,
  //             userType: message.sender.userType,
  //           });
  //         } else if (isReceiver) {
  //           await deleteMessageForUser({
  //             messageId: id,
  //             userId: message.receivers.userId,
  //             userType: message.receiver.userType,
  //           });
  //         } else {
  //           console.warn("User not found in message:", id);
  //         }
  //       }
  //     })
  //   );

  //   setSelectedArchivedMessages([]);
  // };
  const handleDeleteArchivedMessageForUserMulti = async (
    messageIds: string | string[]
  ) => {
    const ids = Array.isArray(messageIds) ? messageIds : [messageIds];

    await Promise.all(
      ids.map(async (id) => {
        const message = archivedMessages?.find((msg) => msg._id === id);

        if (message) {
          const isSender = message.sender?.userId === userId;
          const receiver = message.receivers.find((r) => r.userId === userId);

          if (isSender) {
            await deleteMessageForUser({
              messageId: id,
              userId: message.sender.userId,
              userType: message.sender.userType,
            });
          } else if (receiver) {
            await deleteMessageForUser({
              messageId: id,
              userId: receiver.userId,
              userType: receiver.userType,
            });
          } else {
            console.warn("User not found in message:", id);
          }
        }
      })
    );

    setSelectedArchivedMessages([]);
  };

  const handleRestoreMultiple = async () => {
    try {
      await Promise.all(
        selectedArchivedMessages.map((msg: any) =>
          restoreMessage({
            messageId: msg.messageId,
            userId: msg.userId,
            userType: msg.userType,
          })
        )
      );

      // Clear selected messages after restoration
      setSelectedArchivedMessages([]);

      // Refresh UI if needed
      // archivedMessages(); // or refetch data
    } catch (error) {
      console.error("Error restoring messages:", error);
    }
  };

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
                <Tab.Container
                  defaultActiveKey="inbox"
                  activeKey={activeKey}
                  onSelect={(key: any) => setActiveKey(key)}
                >
                  <Col lg={2}>
                    <Nav
                      variant="pills"
                      className="flex-column nav-pills-tab custom-verti-nav-pills text-center"
                      role="tablist"
                      aria-orientation="vertical"
                    >
                      <Nav.Link
                        eventKey="inbox"
                        className="text-white bg-primary"
                      >
                        <i className="ri-mail-line d-block fs-20 mb-1"></i>{" "}
                        Boite de réception
                      </Nav.Link>
                      <Nav.Link
                        eventKey="sent"
                        className="text-white bg-success"
                      >
                        <i className="ri-send-plane-line d-block fs-20 mb-1"></i>{" "}
                        Envoyé
                      </Nav.Link>

                      <Nav.Link
                        eventKey="archived"
                        className="text-white bg-warning"
                      >
                        <i className="ri-inbox-archive-line d-block fs-20 mb-1"></i>{" "}
                        Archive
                      </Nav.Link>
                      <Nav.Link
                        eventKey="deleted"
                        className="text-white bg-danger"
                      >
                        <i className="bi bi-trash3 d-block fs-20 mb-1"></i>{" "}
                        Corbeille
                      </Nav.Link>
                    </Nav>
                  </Col>
                  <Col lg={10}>
                    <Tab.Content className="text-muted mt-3 mt-lg-0">
                      {/* Fast Action Buttons */}
                      {selectedMessages.length > 0 && (
                        <div className="d-flex mb-2 gap-2">
                          <Button
                            variant="soft-danger"
                            size="sm"
                            onClick={() =>
                              handleDeleteMessageForUserMulti(selectedMessages)
                            }
                          >
                            <i className="bi bi-trash"></i> Supprimer
                          </Button>
                          <Button
                            variant="soft-warning"
                            size="sm"
                            onClick={() =>
                              handleArchiveMessageMulti(selectedMessages)
                            }
                          >
                            <i className="bi bi-archive"></i> Archiver
                          </Button>
                          <Button
                            variant="soft-primary"
                            size="sm"
                            onClick={() =>
                              handleMarkMessageAsReadMulti(selectedMessages)
                            }
                          >
                            <i className="bi bi-envelope-open"></i> Marquer
                            comme lu
                          </Button>
                          <Button
                            variant="soft-secondary"
                            size="sm"
                            onClick={() =>
                              handleMarkMessageAsUnreadMulti(selectedMessages)
                            }
                          >
                            <i className="bi bi-envelope"></i> Marquer comme non
                            lu
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
                                  <td colSpan={4}>Loading...</td>
                                </tr>
                              ) : (
                                inboxMessages?.map((message) => {
                                  // Find the current user's receiver info
                                  const userReceiver = message.receivers.find(
                                    (r) => r.userId === currentUser?._id
                                  );

                                  return (
                                    <tr
                                      key={message._id}
                                      className={
                                        userReceiver?.status === "unread"
                                          ? "bg-light"
                                          : ""
                                      }
                                    >
                                      {/* Checkbox */}
                                      <td>
                                        <Form.Check
                                          type="checkbox"
                                          checked={selectedMessages.includes(
                                            message._id
                                          )}
                                          onChange={() =>
                                            handleCheckboxChange(message._id)
                                          }
                                        />
                                      </td>

                                      {/* Sender name */}
                                      <td
                                        className="fw-bold"
                                        style={{ maxWidth: "150px" }}
                                      >
                                        {message.sender?.nom_fr}{" "}
                                        {message.sender?.prenom_fr}
                                      </td>

                                      {/* Subject + content preview */}
                                      <td
                                        className="text-truncate"
                                        style={{
                                          maxWidth: "400px",
                                          overflow: "hidden",
                                          whiteSpace: "nowrap",
                                          textOverflow: "ellipsis",
                                        }}
                                      >
                                        <span className="fw-bold">
                                          {message.subject}
                                        </span>{" "}
                                        :{" "}
                                        <span
                                          dangerouslySetInnerHTML={{
                                            __html: (() => {
                                              const cleanText =
                                                DOMPurify.sanitize(
                                                  message.content,
                                                  {
                                                    ALLOWED_TAGS: [],
                                                  }
                                                );
                                              return cleanText.length > 100
                                                ? cleanText.substring(0, 100) +
                                                    "..."
                                                : cleanText;
                                            })(),
                                          }}
                                        />
                                      </td>

                                      {/* Action buttons */}
                                      <td className="text-end">
                                        {/* View */}
                                        <Button
                                          variant="link"
                                          className="text-muted p-0 me-2"
                                          onClick={() => {
                                            handleMarkMessageAsRead(
                                              message._id
                                            );
                                            navigate(
                                              "/messagerie/single-message",
                                              { state: { message } }
                                            );
                                          }}
                                        >
                                          <i className="bi bi-eye"></i>
                                        </Button>

                                        {/* Archive */}
                                        {userReceiver && (
                                          <Button
                                            variant="link"
                                            className="text-muted p-0 me-2"
                                            onClick={() =>
                                              handleArchiveMessage(
                                                message._id,
                                                userReceiver.userId,
                                                userReceiver.userType
                                              )
                                            }
                                          >
                                            <i className="bi bi-archive"></i>
                                          </Button>
                                        )}

                                        {/* Delete */}
                                        {userReceiver && (
                                          <Button
                                            variant="link"
                                            className="text-muted p-0 me-2"
                                            onClick={() =>
                                              handleDeleteMessageForUser(
                                                message._id,
                                                userReceiver.userId,
                                                userReceiver.userType
                                              )
                                            }
                                          >
                                            <i className="bi bi-trash"></i>
                                          </Button>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })
                              )}
                            </tbody>
                          </table>
                        </div>
                      </Tab.Pane>
                      {/* Fast Action Buttons for sent messages */}
                      {selectedSentMessages.length > 0 &&
                        activeKey === "sent" && (
                          <div className="d-flex mb-2 gap-2">
                            <Button
                              variant="soft-danger"
                              size="sm"
                              onClick={() =>
                                handleDeleteSentMessageForUserMulti(
                                  selectedSentMessages
                                )
                              }
                            >
                              <i className="bi bi-trash"></i> Supprimer
                            </Button>
                            <Button
                              variant="soft-warning"
                              size="sm"
                              onClick={() =>
                                handleArchiveSentMessageMulti(
                                  selectedSentMessages
                                )
                              }
                            >
                              <i className="bi bi-archive"></i> Archiver
                            </Button>
                          </div>
                        )}
                      <Tab.Pane eventKey="sent">
                        <div className="table-responsive">
                          <table className="table table-hover align-middle mb-0">
                            <thead>
                              <th>
                                <Form.Check
                                  type="checkbox"
                                  checked={isAllSelectedSent}
                                  onChange={handleSelectAllSent}
                                />
                              </th>
                              <th>Destinataire</th>
                              <th>Message</th>
                              <th className="text-end">Actions</th>
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
                                      <Form.Check
                                        type="checkbox"
                                        checked={selectedSentMessages.includes(
                                          message._id
                                        )}
                                        onChange={() =>
                                          handleSentCheckboxChange(message._id)
                                        }
                                      />
                                    </td>
                                    <td
                                      className="fw-bold"
                                      style={{ maxWidth: "150px" }}
                                    >
                                      {message.receivers
                                        .map(
                                          (r) => `${r.nom_fr} ${r.prenom_fr}`
                                        )
                                        .join(", ")}
                                    </td>

                                    <td
                                      className="text-truncate"
                                      style={{
                                        maxWidth: "400px",
                                        overflow: "hidden",
                                        whiteSpace: "nowrap",
                                        textOverflow: "ellipsis",
                                      }}
                                    >
                                      <span className="fw-bold">
                                        {message.subject}
                                      </span>{" "}
                                      :{" "}
                                      <span
                                        dangerouslySetInnerHTML={{
                                          __html: (() => {
                                            const cleanText =
                                              DOMPurify.sanitize(
                                                message.content,
                                                { ALLOWED_TAGS: [] }
                                              );
                                            return cleanText.length > 100
                                              ? cleanText.substring(0, 100) +
                                                  "..."
                                              : cleanText;
                                          })(),
                                        }}
                                      />
                                    </td>

                                    <td className="text-end">
                                      <Button
                                        variant="link"
                                        className="text-muted p-0 me-2"
                                        onClick={() =>
                                          navigate(
                                            "/messagerie/single-message",
                                            { state: { message } }
                                          )
                                        }
                                      >
                                        <i className="bi bi-eye"></i>
                                      </Button>

                                      <Button
                                        variant="link"
                                        className="text-muted p-0 me-2"
                                        onClick={() =>
                                          handleArchiveMessage(
                                            message._id,
                                            message.sender.userId,
                                            message.sender.userType
                                          )
                                        }
                                      >
                                        <i className="bi bi-archive"></i>
                                      </Button>
                                      <Button
                                        variant="link"
                                        className="text-muted p-0 me-2"
                                        onClick={() =>
                                          handleDeleteMessageForUser(
                                            message._id,
                                            message.sender.userId,
                                            message.sender.userType
                                          )
                                        }

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
                      {/* Fast Action Buttons for Archived Messages */}
                      {selectedArchivedMessages.length > 0 &&
                        activeKey === "archived" && (
                          <div className="d-flex mb-2 gap-2">
                            <Button
                              variant="soft-danger"
                              size="sm"
                              onClick={() => {
                                const idsOnly = selectedArchivedMessages.map(
                                  (msg) => msg.messageId
                                );
                                handleDeleteArchivedMessageForUserMulti(
                                  idsOnly
                                );
                              }}
                            >
                              <i className="bi bi-trash"></i> Supprimer
                            </Button>
                            <Button
                              variant="soft-warning"
                              size="sm"
                              onClick={() => handleRestoreMultiple()}
                              disabled={selectedArchivedMessages.length === 0}
                            >
                              <i className="bi bi-arrow-counterclockwise"></i>{" "}
                              Restaurer
                            </Button>
                          </div>
                        )}
                      <Tab.Pane eventKey="archived">
                        <div className="table-responsive">
                          <table className="table align-middle mb-0">
                            <thead>
                              <tr>
                                <th>
                                  <Form.Check
                                    type="checkbox"
                                    checked={
                                      archivedMessages?.length > 0 &&
                                      archivedMessages.every((msg) =>
                                        selectedArchivedMessages.some(
                                          (sel) => sel.messageId === msg._id
                                        )
                                      )
                                    }
                                    onChange={() => {
                                      const allMessagesSelected =
                                        archivedMessages?.every((msg) =>
                                          selectedArchivedMessages.some(
                                            (sel) => sel.messageId === msg._id
                                          )
                                        );

                                      if (allMessagesSelected) {
                                        // Deselect all
                                        setSelectedArchivedMessages([]);
                                      } else {
                                        // Select all
                                        const newSelection = archivedMessages
                                          ?.map((msg) => {
                                            const isSender =
                                              msg.sender.userId ===
                                              currentUser?._id;
                                            const receiver = msg.receivers.find(
                                              (r) =>
                                                r.userId === currentUser?._id
                                            );

                                            if (!isSender && !receiver)
                                              return null;

                                            return {
                                              messageId: msg._id,
                                              userId: isSender
                                                ? msg.sender.userId
                                                : receiver!.userId,
                                              userType: isSender
                                                ? msg.sender.userType
                                                : receiver!.userType,
                                            };
                                          })
                                          .filter(
                                            (
                                              entry
                                            ): entry is {
                                              messageId: string;
                                              userId: string;
                                              userType:
                                                | "Etudiant"
                                                | "Personnel"
                                                | "Enseignant"
                                                | "User";
                                            } => entry !== null
                                          );

                                        setSelectedArchivedMessages(
                                          newSelection
                                        );
                                      }
                                    }}
                                  />
                                </th>
                                <th>Destinataire</th>
                                <th>Expediteur</th>
                                <th>Message</th>
                                <th className="text-end">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {isLoading ? (
                                <tr>
                                  <td colSpan={5}>Loading...</td>
                                </tr>
                              ) : (
                                archivedMessages?.map((message) => {
                                  const isSender =
                                    message.sender.userId === currentUser?._id;
                                  const receiver = message.receivers.find(
                                    (r) => r.userId === currentUser?._id
                                  );

                                  const isChecked =
                                    selectedArchivedMessages.some(
                                      (msg) => msg.messageId === message._id
                                    );

                                  // Determine userId and userType for restore/delete
                                  const userId = isSender
                                    ? message.sender.userId
                                    : receiver?.userId;
                                  const userType = isSender
                                    ? message.sender.userType
                                    : receiver?.userType;

                                  // Determine row class based on who archived it
                                  const rowClass = isSender
                                    ? message.senderStatus === "archived"
                                      ? "bg-success bg-opacity-25 text-dark"
                                      : ""
                                    : receiver?.status === "archived"
                                    ? "bg-primary bg-opacity-25 text-dark"
                                    : "";

                                  return (
                                    <tr key={message._id} className={rowClass}>
                                      {/* Checkbox */}
                                      <td>
                                        <Form.Check
                                          type="checkbox"
                                          checked={isChecked}
                                          onChange={() =>
                                            handleArchiveCheckboxChange({
                                              messageId: message._id,
                                              userId: userId!,
                                              userType: userType!,
                                            })
                                          }
                                        />
                                      </td>

                                      {/* Receiver */}
                                      <td
                                        className="fw-bold"
                                        style={{ maxWidth: "150px" }}
                                      >
                                        {receiver?.nom_fr} {receiver?.prenom_fr}
                                      </td>

                                      {/* Sender */}
                                      <td
                                        className="fw-bold"
                                        style={{ maxWidth: "150px" }}
                                      >
                                        {message.sender?.nom_fr}{" "}
                                        {message.sender?.prenom_fr}
                                      </td>

                                      {/* Subject + content preview */}
                                      <td
                                        className="text-truncate"
                                        style={{
                                          maxWidth: "400px",
                                          overflow: "hidden",
                                          whiteSpace: "nowrap",
                                          textOverflow: "ellipsis",
                                        }}
                                      >
                                        <span className="fw-bold">
                                          {message.subject}
                                        </span>{" "}
                                        :{" "}
                                        <span
                                          dangerouslySetInnerHTML={{
                                            __html: (() => {
                                              const cleanText =
                                                DOMPurify.sanitize(
                                                  message.content,
                                                  {
                                                    ALLOWED_TAGS: [],
                                                  }
                                                );
                                              return cleanText.length > 100
                                                ? cleanText.substring(0, 100) +
                                                    "..."
                                                : cleanText;
                                            })(),
                                          }}
                                        />
                                      </td>

                                      {/* Action buttons */}
                                      <td className="text-end">
                                        {/* View */}
                                        <Button
                                          variant="link"
                                          className="text-muted p-0 me-2"
                                          onClick={() =>
                                            navigate(
                                              "/messagerie/single-message",
                                              { state: { message } }
                                            )
                                          }
                                        >
                                          <i className="bi bi-eye"></i>
                                        </Button>

                                        {/* Delete */}
                                        <Button
                                          variant="link"
                                          className="text-muted p-0 me-2"
                                          onClick={() =>
                                            handleDeleteMessageForUser(
                                              message._id,
                                              userId!,
                                              userType!
                                            )
                                          }
                                        >
                                          <i className="bi bi-trash"></i>
                                        </Button>

                                        {/* Restore */}
                                        <Button
                                          variant="link"
                                          className="text-muted p-0 me-2"
                                          onClick={() =>
                                            handleRestoreMessage(
                                              message._id,
                                              userId!,
                                              userType!
                                            )
                                          }
                                        >
                                          <i
                                            className="bi bi-arrow-up-circle"
                                            title="Restaurer"
                                          ></i>
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

                      {selectedDeletedMessages.length > 0 &&
                        activeKey === "deleted" && (
                          <div className="d-flex mb-2 gap-2">
                            <Button
                              variant="soft-danger"
                              size="sm"
                              onClick={() => {
                                const idsOnly = selectedDeletedMessages.map(
                                  (msg) => msg.messageId
                                );
                                handleDeleteMultipleMessages(idsOnly);
                              }}
                            >
                              <i className="bi bi-trash"></i> supprimer définitivement 
                            </Button>
                          </div>
                        )}
                      {/* <Tab.Pane eventKey="deleted">
  <div className="table-responsive">
    <table className="table align-middle mb-0">
      <thead>
        <tr>
          <th>
            <Form.Check
              type="checkbox"
              checked={isAllSelectedDeleted}
              onChange={handleSelectAllDeleted}
            />
          </th>
          <th>Destinataire</th>
          <th>Expediteur</th>
          <th>Message</th>
          <th className="text-end">Actions</th>
        </tr>
      </thead>
      <tbody>
        {deletedLoading ? (
          <tr>
            <td colSpan={5}>Loading...</td>
          </tr>
        ) : Array.isArray(deletedMessages) && deletedMessages.length > 0 ? (
          deletedMessages.map((message: any) => {
            // const rowClass =
            //   message.senderStatus === "deleted"
            //     ? "bg-success bg-opacity-25 text-dark"
            //     : message.receiverStatus === "deleted"
            //     ? "bg-primary bg-opacity-25 text-dark"
            //     : "";

            return (
              <tr key={message._id}>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={selectedDeletedMessages.some(
                      (m) => m.messageId === message._id
                    )}
                    onChange={() => handleDeleteCheckboxChange(message._id)}
                  />
                </td>
                <td className="fw-bold" style={{ maxWidth: "150px" }}>
                  {message.receiver?.nom_fr} {message.receiver?.prenom_fr}
                </td>
                <td className="fw-bold" style={{ maxWidth: "150px" }}>
                  {message.sender?.nom_fr} {message.sender?.prenom_fr}
                </td>
                <td
                  className="text-truncate"
                  style={{
                    maxWidth: "400px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  <span className="fw-bold">{message.subject}</span>:{" "}
                  <span
                    dangerouslySetInnerHTML={{
                      __html: (() => {
                        const cleanText = DOMPurify.sanitize(message.content, {
                          ALLOWED_TAGS: [],
                        });
                        return cleanText.length > 100
                          ? cleanText.substring(0, 100) + "..."
                          : cleanText;
                      })(),
                    }}
                  />
                </td>
                <td className="text-end">
                  <Button
                    variant="link"
                    className="text-muted p-0 me-2"
                    onClick={() =>
                      navigate("/messagerie/single-message", {
                        state: { message },
                      })
                    }
                  >
                    <i className="bi bi-eye"></i>
                  </Button>
                  <Button
                    variant="link"
                    className="text-muted p-0 me-2"
                    onClick={() =>
                      handleDeleteMessage(
                        message._id,
                        message.sender?.userId,
                        message.sender?.userType
                      )
                    }
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={5}>Aucun message supprimé.</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</Tab.Pane> */}
                      <Tab.Pane eventKey="deleted">
                        <div className="table-responsive">
                          <table className="table align-middle mb-0">
                            <thead>
                              <tr>
                                <th>
                                  <Form.Check
                                    type="checkbox"
                                    checked={isAllSelectedDeleted}
                                    onChange={handleSelectAllDeleted}
                                  />
                                </th>
                                <th>Destinataire</th>
                                <th>Expéditeur</th>
                                <th>Message</th>
                                <th className="text-end">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {deletedLoading ? (
                                <tr>
                                  <td colSpan={5}>Chargement...</td>
                                </tr>
                              ) : deletedMessages?.length ? (
                                deletedMessages.map((message: any) => (
                                  <tr key={message._id}>
                                    <td>
                                      <Form.Check
                                        type="checkbox"
                                        checked={selectedDeletedMessages.some(
                                          (m) => m.messageId === message._id
                                        )}
                                        onChange={() =>
                                          handleDeleteCheckboxChange(
                                            message._id
                                          )
                                        }
                                      />
                                    </td>
                                    {/* <td
                                      className="fw-bold"
                                      style={{ maxWidth: "150px" }}
                                    >
                                      {message.receiver?.nom_fr}{" "}
                                      {message.receiver?.prenom_fr}
                                    </td> */}
                                    <td className="fw-bold" style={{ maxWidth: "150px" }}>
  {Array.isArray(message.receivers) && message.receivers.length > 0
    ? message.receivers
        .map((r: any) => `${r.nom_fr} ${r.prenom_fr}`)
        .join(", ")
    : "N/A"}
</td>
                                    <td
                                      className="fw-bold"
                                      style={{ maxWidth: "150px" }}
                                    >
                                      {message.sender?.nom_fr}{" "}
                                      {message.sender?.prenom_fr}
                                    </td>
                                    <td
                                      className="text-truncate"
                                      style={{
                                        maxWidth: "400px",
                                        overflow: "hidden",
                                        whiteSpace: "nowrap",
                                        textOverflow: "ellipsis",
                                      }}
                                    >
                                      <span className="fw-bold">
                                        {message.subject}
                                      </span>
                                      :{" "}
                                      <span
                                        dangerouslySetInnerHTML={{
                                          __html: (() => {
                                            const cleanText =
                                              DOMPurify.sanitize(
                                                message.content,
                                                {
                                                  ALLOWED_TAGS: [],
                                                }
                                              );
                                            return cleanText.length > 100
                                              ? cleanText.substring(0, 100) +
                                                  "..."
                                              : cleanText;
                                          })(),
                                        }}
                                      />
                                    </td>
                                    <td className="text-end">
                                      <Button
                                        variant="link"
                                        className="text-muted p-0 me-2"
                                        onClick={() =>
                                          navigate(
                                            "/messagerie/single-message",
                                            {
                                              state: { message },
                                            }
                                          )
                                        }
                                      >
                                        <i className="bi bi-eye"></i>
                                      </Button>
                                      <Button
                                        variant="link"
                                        className="text-muted p-0 me-2"
                                        onClick={() =>
                                          handleDeleteMessage(
                                            message._id,
                                            message.sender?.userId,
                                            message.sender?.userType
                                          )
                                        }
                                      >
                                        <i className="bi bi-trash"></i>
                                      </Button>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={5}>Aucun message supprimé.</td>
                                </tr>
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
            {/* <div className="mb-3 position-relative">
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
                        ) : user.userType === "User" ? (
                          <>
                            {user.nom_fr} {user.prenom_fr}{" "}
                            <span className="badge bg-warning-subtle text-warning">
                              {user.userType}
                            </span>{" "}
                            -{" "}
                            <span className="badge badge-gradient-warning">
                             admin
                            </span>
                          </>
                        ): (
                          <>
                            {user.nom_fr} {user.prenom_fr}{" "}
                            <span className="badge bg-success-subtle text-success">
                              {user.userType}
                            </span>{" "}
                            -{" "}
                            <span className="badge badge-gradient-success">
                              {user.departements?.name_fr || "N/A"}
                            </span>
                          </>
                        );
                      // Convert JSX to string
                      // const labelString = ReactDOMServer.renderToStaticMarkup(label);

                      return (
                        <button
                          key={user._id}
                          className="dropdown-item"
                          onClick={() => handleSelectUser({
                            _id: user._id,
                            userType: user.userType,
                            nom: user.nom_fr,
                            prenom: user.prenom_fr,
                            extraInfo: user.userType === "Etudiant"
                              ? user.groupe_classe?.nom_classe_fr || "N/A"
                              : user.userType === "Personnel"
                                ? user.poste?.poste_fr || "N/A"
                                : user.userType
                          })}                        >
                          {label}


                        </button>
                      );
                    })
                  ) : (
                    <span className="dropdown-item text-muted">Aucun résultat</span>
                  )}
                </div>
              )}
            </div> */}
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

              {/* Selected receivers */}
              <div className="mt-2 d-flex flex-wrap gap-2">
                {selectedReceivers.map((user: Users) => (
                  <span
                    key={user._id}
                    className="badge bg-secondary position-relative pe-4"
                  >
                    {user.nom_fr} {user.prenom_fr} ({user.userType})
                    <button
                      type="button"
                      className="btn-close btn-close-white position-absolute end-0 top-50 translate-middle-y me-1"
                      aria-label="Remove"
                      onClick={() => removeUser(user._id)}
                      style={{ fontSize: "0.6rem" }}
                    />
                  </span>
                ))}
              </div>

              {/* Dropdown */}
              {showDropdown && (
                <div
                  className="dropdown-menu show w-100"
                  style={{
                    maxHeight: "200px",
                    overflowY: "auto",
                    position: "absolute",
                    zIndex: 1000,
                  }}
                >
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => {
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
                        ) : user.userType === "User" ? (
                          <>
                            {user.nom_fr} {user.prenom_fr}{" "}
                            <span className="badge bg-warning-subtle text-warning">
                              {user.userType}
                            </span>{" "}
                            -{" "}
                            <span className="badge badge-gradient-warning">
                              admin
                            </span>
                          </>
                        ) : (
                          <>
                            {user.nom_fr} {user.prenom_fr}{" "}
                            <span className="badge bg-success-subtle text-success">
                              {user.userType}
                            </span>{" "}
                            -{" "}
                            <span className="badge badge-gradient-success">
                              {user.departements?.name_fr || "N/A"}
                            </span>
                          </>
                        );

                      return (
                        <button
                          key={user._id}
                          className="dropdown-item"
                         onClick={() => handleSelectUser(user)}
                        >
                          {label}
                        </button>
                      );
                    })
                  ) : (
                    <span className="dropdown-item text-muted">
                      Aucun résultat
                    </span>
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
                <ListGroup.Item
                  key={index}
                  className="d-flex justify-content-between align-items-center"
                >
                  <span>{file.name}</span>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <i className="bi bi-x"></i>
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}

          {/* Upload & Action Buttons */}
          <div className="d-flex justify-content-between w-100">
            <Button
              variant="success"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <i className="bi bi-paperclip"></i> Joindre
            </Button>

            <input
              id="file-input"
              type="file"
              multiple
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            <div>
              <Button variant="light" onClick={handleClose}>
                <i className="bi bi-x-lg"></i> Fermer
              </Button>
              <Button
                variant="primary"
                className="ms-2"
                onClick={handleSendMessage}
                disabled={loading}
              >
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <i className="bi bi-send"></i>
                )}{" "}
                Envoyer
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default Messages;
