import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { auth, db } from "./firebase";
import Auth from "./Auth";
import Chat from "./components/Chat";
import Profile from "./pages/Profile";

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("chat");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  // 🔐 AUTH LISTENER
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        // Check if user document exists
        const userDocRef = doc(db, "users", u.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          // Create user document if it doesn't exist (for existing users)
          await setDoc(userDocRef, {
            displayName: u.displayName || u.email.split("@")[0],
            email: u.email,
            photoURL: "",
            createdAt: new Date(),
          });
        }

        // Fetch user profile
        const profileSnap = await getDoc(userDocRef);
        setUserProfile(profileSnap.data());
      }

      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  // 🔥 REALTIME FIRESTORE LISTENER
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return unsub;
  }, [user]);

  // ✉️ SEND MESSAGE
  async function sendMessage(text) {
    if (!user || !userProfile) return;

    await addDoc(collection(db, "messages"), {
      text,
      uid: user.uid,
      email: user.email,
      senderName: userProfile.displayName || user.email,
      senderPhotoURL: userProfile.photoURL || "",
      createdAt: serverTimestamp(),
    });
  }

  if (loading) return <p style={{ textAlign: "center", marginTop: "50vh" }}>Loading...</p>;

  if (!user) return <Auth />;

  if (page === "profile") {
    return <Profile onBack={() => setPage("chat")} onProfileUpdate={setUserProfile} />;
  }

  return (
    <Chat
      messages={messages}
      onSend={sendMessage}
      onProfile={() => setPage("profile")}
    />
  );
}
