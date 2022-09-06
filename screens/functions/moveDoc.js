import { copyDoc } from "./copyDoc";
import { deleteDoc } from "./deleteDoc";
import firebase from "firebase"


export const moveDoc = async (
    collectionFrom,
    docId,
    collectionTo,
    addData,
  ) => {
    // copy the organisation document
    const copied = await copyDoc(collectionFrom, docId, collectionTo, addData, true);
   
    firebase.firestore().collection('workouts').where('assignedToId','==',docId)
    .get().then(function (querySnapshot) {
      querySnapshot.forEach(async function (doc) {
        const copiedWorkouts = await copyDoc("workouts", doc.id, "deletedWorkouts", doc.data(), true);
        if(copiedWorkouts){
          doc.ref.delete();
        }
      });
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });
    
    firebase.firestore().collection('Food').where('user_id','==',docId)
    .get().then(function (querySnapshot) {
      querySnapshot.forEach(async function (doc) {
        const copiedNutrition = await copyDoc("Food", doc.id, "deletedAthleteNutrition", doc.data(), true);
        if(copiedNutrition){
          doc.ref.delete();
        }
      });
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });

    firebase.firestore().collection('Food').where('assignedTo_id','==',docId)
    .get().then(function (querySnapshot) {
      querySnapshot.forEach(async function (doc) {
        const copiedCoachNutrition = await copyDoc("Food", doc.id, "deletedNutrition", doc.data(), true);
        if(copiedCoachNutrition){
          doc.ref.delete();
        }
      });
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });

  
   // if copy was successful, delete the original
    if (copied) {
      await deleteDoc(`${collectionFrom}/${docId}`);
      return true;
    }
    throw new functions.https.HttpsError(
      'data-loss',
      'Data was not copied properly to the target collection, please try again.',
    );
  };
  