import { db } from "../utils/firebase";
import * as firebase from "firebase";

export async function saveNotification(athleteId, message) {
  console.log("saveNotification->", message);
  await db
    .collection("coaches")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(async (doc) => {
        console.log("doc.id->", doc.id);
        await db
          .collection("CoachNotifications")
          .doc(doc.id)
          .collection("notifications")
          .add(
            {
              message: message,
              seen: false,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              athlete_id: athleteId,
            },
            { merge: true }
          );
      });
    })
    .catch(function (error) {
      console.log("saveNotification: ", error);
    });
}
