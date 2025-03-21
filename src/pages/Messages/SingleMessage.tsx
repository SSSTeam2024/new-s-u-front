import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { Message, useSendMessageMutation, useFetchRepliesByParentIdQuery } from "features/messages/messagesSlice"
import DOMPurify from "dompurify";


const SingleMessage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.message;

  const [sendMessage] = useSendMessageMutation();

  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  // Fetch replies using parentMessageId
  const { data: replies, isLoading } = useFetchRepliesByParentIdQuery(message?._id, {
    skip: !message?._id,
  });
  console.log("replies", replies)
  if (!message) {
    return (
      <div className="container text-center mt-5">
        <div className="alert alert-warning">
          <i className="bi bi-exclamation-circle-fill me-2"></i> Aucun message trouvé.
        </div>
      </div>
    );
  }

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return alert("Le message ne peut pas être vide.");

    const replyMessage: Partial<Message> = {
      sender: {
        userId: message.receiver.userId,
        userType: message.receiver.userType,
        nom_fr: message.receiver.nom_fr,
        prenom_fr: message.receiver.prenom_fr,
        email: message.receiver.email,
      },
      receiver: {
        userId: message.sender.userId,
        userType: message.sender.userType,
        nom_fr: message.sender.nom_fr,
        prenom_fr: message.sender.prenom_fr,
        email: message.sender.email,
      },
      subject: `Re: ${message.subject}`,
      content: replyContent,
      parentMessageId: message._id,
      createdAt: new Date().toISOString(),
      status: "sent",
      receiverStatus: "sent",
      senderStatus: "sent",
      attachments: [],
      attachmentsBase64Strings: [],
      attachmentsExtensions: [],
    };

    try {
      await sendMessage(replyMessage);
      alert("Réponse envoyée !");
      setShowReply(false);
      setReplyContent("");
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      alert("Échec de l'envoi du message.");
    }
  };

  return (
    <div className="container mt-4">
      {/* Back Button */}
      <button className="btn btn-outline-dark mb-3 d-flex align-items-center" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left me-2"></i> Retour
      </button>

      {/* Message Card */}
      <div className="card shadow-lg border-0">
        {/* Header */}
        <div className="card-header bg-gradient text-white d-flex justify-content-between align-items-center" style={{ background: "linear-gradient(135deg, #6a11cb, #2575fc)" }}>
          <h5 className="mb-0"><i className="bi bi-envelope-fill me-2"></i> {message.subject}</h5>
          <span className="badge bg-light text-dark">{new Date(message.createdAt).toLocaleString()}</span>
        </div>

        {/* Body */}
        <div className="card-body">
          {/* Sender & Receiver Section */}
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

          {/* Message Content */}
          <hr />
          <p className="fs-5 lh-lg">{message.content}</p>
          {/* <div className="fs-5 lh-lg"    dangerouslySetInnerHTML={{ __html: message.content }}>   </div> */}

          {/* Attachments Section */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-4">
              <h6 className="mb-3"><i className="bi bi-paperclip me-2"></i> Pièces jointes</h6>
              <div className="d-flex flex-wrap gap-2">
                {message.attachments.map((attachment: any, index: any) => (
                  <a
                    key={index}
                    href={attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary d-flex align-items-center"
                  >
                    <i className="bi bi-file-earmark-text me-2"></i> {`Fichier ${index + 1}`}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Replies Section */}
        <div >
          <h6><i className="bi bi-chat-left-text me-2"></i> Réponses</h6>
          {isLoading ? (
            <Spinner animation="border" />
          ) : (
            replies?.map((reply) => (
              <div key={reply._id} className="card mt-2">
                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                  <small>
                    <strong>{reply.sender.nom_fr} {reply.sender.prenom_fr}</strong>
                    <span className="text-muted"> → {reply.receiver.nom_fr} {reply.receiver.prenom_fr}</span>
                  </small>
                  <span className="badge bg-secondary">{new Date(reply?.createdAt!).toLocaleString()}</span>
                </div>
                <div className="card-body">
                  <p>{reply.content}</p>
                </div>
              </div>
            ))
          )}
        </div>


        {/* Footer */}
        <div className="card-footer  d-flex justify-content-between">
          <Button variant="danger" >
            <i className="bi bi-trash me-5"></i> Supprimer
          </Button>

          <Button variant="secondary" >
            <i className="bi bi-archive me-2"></i> Archiver
          </Button>
          <div>
            {/* Reply Button */}
            <Button variant="primary" className="ms-2" onClick={() => setShowReply(!showReply)}>
              <i className="bi bi-reply me-2"></i> Répondre
            </Button>
          </div>
        </div>
      </div>

      {/* Reply Form */}
      {showReply && (
        <div className="card mt-3">
          <div className="card-header bg-light">
            <h6 className="mb-0"><i className="bi bi-reply-fill me-2"></i> Répondre à {message.sender.nom_fr} {message.sender.prenom_fr}</h6>
          </div>
          <div className="card-body">
            <div className="mb-2">
              <label className="form-label"><strong>À:</strong></label>
              <input type="text" className="form-control" value={`${message.sender.nom_fr} ${message.sender.prenom_fr}`} disabled />
            </div>
            <div className="mb-2">
              <label className="form-label"><strong>Sujet:</strong></label>
              <input type="text" className="form-control" value={`Re: ${message.subject}`} disabled />
            </div>
            <div className="mb-3">
              <label className="form-label"><strong>Message:</strong></label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Tapez votre réponse ici..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              ></textarea>
            </div>
            <div className="text-end">
              <button className="btn btn-secondary me-2" onClick={() => setShowReply(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={handleReplySubmit}>Envoyer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleMessage;

// import { useLocation, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { Button, Spinner } from "react-bootstrap";
// import {
//   Message,
//   useSendMessageMutation,
//   useFetchRepliesByParentIdQuery,
// } from "features/messages/messagesSlice";

// const SingleMessage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const message = location.state?.message;

//   const [sendMessage] = useSendMessageMutation();
//   const [showReply, setShowReply] = useState(false);
//   const [replyContent, setReplyContent] = useState("");

//   // Fetch replies using parentMessageId
//   const { data: replies, isLoading } = useFetchRepliesByParentIdQuery(message?._id, {
//     skip: !message?._id, // Skip query if message is not available
//   });

//   if (!message) {
//     return (
//       <div className="container text-center mt-5">
//         <div className="alert alert-warning">
//           <i className="bi bi-exclamation-circle-fill me-2"></i> Aucun message trouvé.
//         </div>
//       </div>
//     );
//   }

//   const handleReplySubmit = async () => {
//     if (!replyContent.trim()) return alert("Le message ne peut pas être vide.");

//     const replyMessage: Partial<Message> = {
//       sender: {
//         userId: message.receiver.userId,
//         userType: message.receiver.userType,
//         nom_fr: message.receiver.nom_fr,
//         prenom_fr: message.receiver.prenom_fr,
//         email: message.receiver.email,
//       },
//       receiver: {
//         userId: message.sender.userId,
//         userType: message.sender.userType,
//         nom_fr: message.sender.nom_fr,
//         prenom_fr: message.sender.prenom_fr,
//         email: message.sender.email,
//       },
//       subject: `Re: ${message.subject}`,
//       content: replyContent,
//       parentMessageId: message._id,
//       createdAt: new Date().toISOString(),
//       status: "sent",
//       receiverStatus: "sent",
//       senderStatus: "sent",
//       attachments: [],
//     };

//     try {
//       await sendMessage(replyMessage);
//       alert("Réponse envoyée !");
//       setShowReply(false);
//       setReplyContent("");
//     } catch (error) {
//       console.error("Erreur lors de l'envoi:", error);
//       alert("Échec de l'envoi du message.");
//     }
//   };

//   return (
//     <div className="container mt-4">
//       {/* Message Card */}
//       <div className="card shadow-lg border-0">
//         <div className="card-header bg-gradient text-white" style={{ background: "linear-gradient(135deg, #6a11cb, #2575fc)" }}>
//           <h5 className="mb-0"><i className="bi bi-envelope-fill me-2"></i> {message.subject}</h5>
//           <span className="badge bg-light text-dark">{new Date(message.createdAt).toLocaleString()}</span>
//         </div>

//         <div className="card-body">
//           <p className="fs-5 lh-lg">{message.content}</p>
//         </div>

//         {/* Replies Section */}
//         <div className="card-footer">
//           <h6><i className="bi bi-chat-left-text me-2"></i> Réponses</h6>
//           {isLoading ? (
//             <Spinner animation="border" />
//           ) : (
//             replies?.map((reply) => (
//               <div key={reply._id} className="card mt-2">
//                 <div className="card-body">
//                   <p className="mb-1"><strong>{reply.sender.nom_fr} {reply.sender.prenom_fr}</strong> - {new Date(message.createdAt).toLocaleString()}</p>
//                   <p>{reply.content}</p>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {/* Reply Form */}
//       {showReply && (
//         <div className="card mt-3">
//           <div className="card-header bg-light">
//             <h6><i className="bi bi-reply-fill me-2"></i> Répondre à {message.sender.nom_fr} {message.sender.prenom_fr}</h6>
//           </div>
//           <div className="card-body">
//             <textarea
//               className="form-control"
//               rows={4}
//               placeholder="Tapez votre réponse ici..."
//               value={replyContent}
//               onChange={(e) => setReplyContent(e.target.value)}
//             ></textarea>
//             <div className="text-end mt-2">
//               <Button variant="secondary" className="me-2" onClick={() => setShowReply(false)}>Annuler</Button>
//               <Button variant="primary" onClick={handleReplySubmit}>Envoyer</Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Reply Button */}
//       <Button variant="primary" className="mt-3" onClick={() => setShowReply(!showReply)}>
//         <i className="bi bi-reply me-2"></i> Répondre
//       </Button>
//     </div>
//   );
// };

// export default SingleMessage;

