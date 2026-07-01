import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { UserData } from "@/types";

export async function loginWithEmail(email: string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  const user = result.user;

  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists()) {
    const userData: UserData = {
      uid: user.uid,
      name: user.displayName || "Usuário",
      email: user.email || "",
      photo: user.photoURL,
      score: 0,
      createdAt: Date.now(),
    };
    await setDoc(doc(db, "users", user.uid), userData);
  }

  return user;
}

export async function registerWithEmail(
  name: string,
  email: string,
  password: string
) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName: name });

  const userData: UserData = {
    uid: result.user.uid,
    name,
    email,
    photo: null,
    score: 0,
    createdAt: Date.now(),
  };

  await setDoc(doc(db, "users", result.user.uid), userData);
  return result.user;
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  const userDoc = await getDoc(doc(db, "users", user.uid));

  if (!userDoc.exists()) {
    const userData: UserData = {
      uid: user.uid,
      name: user.displayName || "Usuário",
      email: user.email || "",
      photo: user.photoURL,
      score: 0,
      createdAt: Date.now(),
    };
    await setDoc(doc(db, "users", user.uid), userData);
  }

  return user;
}

export async function logout() {
  await signOut(auth);
}

export async function getUserData(uid: string): Promise<UserData | null> {
  const docSnap = await getDoc(doc(db, "users", uid));
  if (docSnap.exists()) {
    return docSnap.data() as UserData;
  }
  return null;
}


