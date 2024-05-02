import { db } from "@/lib/firebase";
import { useUserStore } from "@/stores/user";
import { doc, getDoc } from "firebase/firestore";

export default async function fetchUserData(userId: string) {
  const { updateUserData } = useUserStore();
  const docRef = doc(db, "userData", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return updateUserData(docSnap.data());
  } else {
    throw new Error("No such document!");
  }
}
