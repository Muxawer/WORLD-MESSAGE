import { useState, useRef } from "react";
import { signOut, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../styles/profile.css";

export default function Profile({ onBack, onProfileUpdate }) {
  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  async function handlePhotoUpload(e) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setLoading(true);
      setMessage("");

      // Upload to Firebase Storage
      const storageRef = ref(storage, `profile-pictures/${user.uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      // Update auth profile
      await updateProfile(user, { photoURL: url });

      // Update Firestore
      await updateDoc(doc(db, "users", user.uid), {
        photoURL: url,
      });

      setPhotoURL(url);
      setMessage("Photo updated successfully!");
    } catch (err) {
      setMessage("Failed to upload photo: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDisplayNameUpdate() {
    if (!user || !displayName.trim()) {
      setMessage("Display name cannot be empty");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      // Update auth profile
      await updateProfile(user, { displayName: displayName.trim() });

      // Update Firestore
      await updateDoc(doc(db, "users", user.uid), {
        displayName: displayName.trim(),
      });

      if (onProfileUpdate) {
        onProfileUpdate({
          displayName: displayName.trim(),
          email: user.email,
          photoURL: photoURL,
        });
      }

      setMessage("Display name updated successfully!");
    } catch (err) {
      setMessage("Failed to update display name: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="profile">
      <div className="profile-card">
        <h2>Your Profile</h2>

        {/* Profile Picture */}
        <div className="profile-picture-section">
          <div className="profile-picture">
            {photoURL ? (
              <img src={photoURL} alt="Profile" />
            ) : (
              <div className="placeholder">👤</div>
            )}
          </div>
          <button
            className="upload-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            {photoURL ? "Change Picture" : "Upload Picture"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            style={{ display: "none" }}
          />
        </div>

        {/* Display Name */}
        <div className="profile-form">
          <div className="form-group">
            <label>Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              disabled={loading}
            />
          </div>

          <button
            className="save-btn"
            onClick={handleDisplayNameUpdate}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Display Name"}
          </button>
        </div>

        {/* Email (read-only) */}
        <div className="profile-info">
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className={`message ${message.includes("success") ? "success" : "error"}`}>
            {message}
          </div>
        )}

        {/* Action Buttons */}
        <div className="profile-actions">
          <button className="back" onClick={onBack} disabled={loading}>
            Back to Chat
          </button>
          <button
            className="logout"
            onClick={() => signOut(auth)}
            disabled={loading}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
