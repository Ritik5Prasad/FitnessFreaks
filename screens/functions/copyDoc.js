import firebase from 'firebase';

export const copyDoc = async (
    collectionFrom,
    docId,
    collectionTo,
    addData,
    recursive = false,
  )=> {
    // document reference
    const docRef = firebase.firestore().collection(collectionFrom).doc(docId);

    // copy the document
    const docData = await docRef
      .get()
      .then((doc) => doc.exists && doc.data())
      .catch((error) => {
        console.error('Error reading document', `${collectionFrom}/${docId}`, JSON.stringify(error));
        throw new functions.https.HttpsError('not-found', 'Copying document was not read');
      });

    if (docData) {
      // document exists, create the new item
      await firebase
        .firestore()
        .collection(collectionTo)
        .doc(docId)
        .set({ ...docData, ...addData })
        .catch((error) => {
          console.error('Error creating document', `${collectionTo}/${docId}`, JSON.stringify(error));
          throw new functions.https.HttpsError(
            'data-loss',
            'Data was not copied properly to the target collection, please try again.',
          );
        });

        await firebase.firestore()
        .collection(collectionFrom)
        .doc(docId)
        .collection("Anthropometric")
        .doc("anthropometric")
        .get()
        .then(async (doc) => {
          if (doc.exists) {
              console.log("Document data:", doc.data());
              await copyDoc(`${collectionFrom}/${docId}/${"Anthropometric"}`, doc.id, `${collectionTo}/${docId}/${"Anthropometric"}`, true);
          } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
          }
          return true;
        }).catch((error) => {
          console.log("Error getting document:", error);
      });
        await firebase.firestore()
        .collection(collectionFrom)
        .doc(docId)
        .collection("Lifestyle")
        .doc("lifestyle")
        .get()
        .then(async (doc) => {
          if (doc.exists) {
              console.log("Document data:", doc.data());
              await copyDoc(`${collectionFrom}/${docId}/${"Lifestyle"}`, doc.id, `${collectionTo}/${docId}/${"Lifestyle"}`, true);
          } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
          }
          return true;
        }).catch((error) => {
          console.log("Error getting document:", error);
      });
        await firebase.firestore()
        .collection(collectionFrom)
        .doc(docId)
        .collection("Medical")
        .doc("medical")
        .get()
        .then(async (doc) => {
          if (doc.exists) {
              console.log("Document data:", doc.data());
              await copyDoc(`${collectionFrom}/${docId}/${"Medical"}`, doc.id, `${collectionTo}/${docId}/${"Medical"}`, true);
          } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
          }
          return true;
        }).catch((error) => {
          console.log("Error getting document:", error);
      });
        await firebase.firestore()
        .collection(collectionFrom)
        .doc(docId)
        .collection("Training")
        .doc("training")
        .get()
        .then(async (doc) => {
          if (doc.exists) {
              console.log("Document data:", doc.data());
              await copyDoc(`${collectionFrom}/${docId}/${"Training"}`, doc.id, `${collectionTo}/${docId}/${"Training"}`, true);
          } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
          }
          return true;
        }).catch((error) => {
          console.log("Error getting document:", error);
      });

      return true;
    }

    return false;
  };
  