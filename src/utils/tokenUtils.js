import { db, firestore } from "../utils/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";
import { Platform } from "react-native";

export async function saveTokenInFirestore(email, userType) {
  try {
    if (Platform.OS === "ios") {
      await messaging().requestPermission({
        provisional: true,
      });
    }
    const collection = userType === "coach" ? "coaches" : "athletes";
    const snapshot = await db
      .collection(collection)
      .where("email", "==", email)
      .get();
    const userId = snapshot.docs[0].id;
    const token = await messaging().getToken();
    await db
      .collection("tokens")
      .doc(userId)
      .set(
        {
          tokens: firestore.FieldValue.arrayUnion({
            created_at: firestore.Timestamp.now(),
            notification_token: token,
          }),
        },
        { merge: true }
      );
    await AsyncStorage.setItem("token", token);
  } catch (error) {
    console.log("Error in saving tokens", error.message);
  }
}

export async function removeTokenFromFirestore(userId) {
  try {
    const token = await messaging().getToken();
    const doc = db.collection("tokens").doc(userId);

    const docSnapshot = await doc.get();
    let tokens = docSnapshot.get("tokens");
    tokens = tokens.filter((t) => t.notification_token !== token);

    await doc.set({ tokens });
    await AsyncStorage.removeItem("token");
  } catch (error) {
    console.log("Error in removing tokens", error.message);
  }
}
