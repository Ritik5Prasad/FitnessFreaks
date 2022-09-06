import firebase from "firebase"

export const deleteDoc = async (docPath) => {
  firebase.firestore().doc(docPath).delete().then(() => {
    console.log("Document successfully deleted!");
    return true;
}).catch((error) => {
    console.error("Error removing document: ", error);
    return false;
});
  };
  