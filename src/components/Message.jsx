import { auth } from "../firebase";

export default function Message({ message }) {
  const isMe = message.uid === auth.currentUser?.uid;

  return (
    <div className={`message ${isMe ? "me" : "other"}`}>
      <div className="message-header">
        <span className="sender-name">
          {isMe ? "You" : message.senderName || "Unknown"}
        </span>
      </div>
      <p className="message-text">{message.text}</p>
    </div>
  );
}
