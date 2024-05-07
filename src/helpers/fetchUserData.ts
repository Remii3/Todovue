import { auth, db } from "@/lib/firebase";
import { useUserStore } from "@/stores/user";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default async function fetchUserData(userId: string) {
  const { updateUserData } = useUserStore();
  const docRef = doc(db, "userData", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    updateUserData({ ...docSnap.data(), uid: docSnap.id });
    return { error: null };
  } else {
    try {
      await setDoc(doc(db, "userData", userId), {
        email: auth.currentUser?.email,
        todoCategories: [],
        todos: [],
      });
    } catch (error) {
      console.error("Error creating userData document: ", error);
    }
    return { error: "No such document!" };
  }
}
