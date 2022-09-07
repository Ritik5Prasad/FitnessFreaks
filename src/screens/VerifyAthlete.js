import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  TextInput,
  BackHandler,
  Button,
  Share,
  Dimensions,
  Platform,
} from "react-native";
import { auth, db } from "../utils/firebase";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";
import {
  setDbID,
  selectDbId,
  selectUser,
  setUserDetails,
  selectShowData,
  logout,
  setUserData,
  selectUserData,
  setUserVerified,
  selectUserVerified,
} from "../features/userSlice";
import { Icon } from "react-native-elements";
import firebase from "firebase";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import sendPushNotification from "../utils/sendPushNotification";

import { StackActions } from "@react-navigation/native";
import { removeTokenFromFirestore } from "../utils/tokenUtils";

let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 0,
    height: ScreenHeight,
    backgroundColor: "white",
    padding: RFValue(20, 816),
  },
  athlete_card: {
    width: ScreenWidth / 1.05,
    height: RFValue(180, 816),
    backgroundColor: "#2E2E2E",
    // borderWidth: 1,
    // borderColor: "white",
    borderRadius: RFValue(12, 816),
    marginVertical: RFValue(15, 816),
    padding: RFValue(15, 816),
  },
  athlete_cardHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: RFValue(10, 816),
    marginVertical: RFValue(10, 816),
  },
  athlete_image: {
    marginHorizontal: RFValue(10, 816),
    width: ScreenWidth * 0.35,
    height: ScreenWidth * 0.35,
    borderRadius: 100,
    backgroundColor: "white",
    marginRight: RFValue(20, 816),
    marginTop: 0,
  },
  athlete_name: {
    fontSize: RFValue(18, 816),
    color: "black",
    margin: RFValue(15, 816),
    marginBottom: RFValue(5, 816),
  },
  athlete__cardBody: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: RFValue(20, 816),
  },
  share: {
    position: "absolute",
    top: RFValue(20, 816),
    right: RFValue(70, 816),
  },
});

function VerifyAthlete({ navigation, setVerifiedModal }) {
  const user = useSelector(selectUser);
  const userVerified = false;
  const userData = useSelector(selectUserData);
  const [userDetails, setUserDetails] = useState(null);
  const [coachpin, setcoachpin] = useState("");
  const [inviteSent, setInviteSent] = useState(false);
  const [coachData, setCoachData] = useState(null);
  const [verified, setVerified] = useState(false);
  const [exit, setExit] = useState(false);

  const dispatch = useDispatch();

  /*
  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if(!verified && !exit){
          verifyUser();
          e.preventDefault();
        }
        if(verified){
          navigation.dispatch(e.data.action)
        }
        if(exit){
          navigation.dispatch(e.data.action)
        }
      }),
    [verified, exit]
  );
  */

  useEffect(() => {
    if (userVerified) {
      setVerifiedModal(false);
      //navigation.navigate("AthleteFlow");
    }
    db.collection("athletes")
      .where("email", "==", user)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          setUserDetails({
            id: doc.id,
            data: doc.data(),
          });
          dispatch(
            setUserData({
              id: doc.id,
              data: doc.data(),
            })
          );
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  }, [user]);

  const verifyUser = () => {
    db.collection("athletes")
      .where("email", "==", user)
      .get()
      .then((snap) => {
        if (!snap.empty) {
          snap.forEach(function (doc) {
            if (doc.data().verified) {
              dispatch(setUserVerified(true));
              //setVerified(true);
              navigation.navigate("AthleteFlow");
              setVerifiedModal(false);
            } else {
              alert("Athlete not linked to any coach");
            }
          });
        }
      });
  };

  const signout = async () => {
    auth.signOut();
    dispatch(logout());

    navigation.dispatch(
      StackActions.replace("LoginScreen", { test: "Test Params" })
    );

    navigation.navigate("LoginScreen");
  };

  const sendInvite = () => {
    db.collection("invites")
      .where("athlete", "==", userDetails.id)
      .get()
      .then((snap) => {
        if (!snap.empty) {
          snap.forEach(function (doc) {
            db.collection("invites").doc(doc.id).delete();
          });
          db.collection("coaches")
            .where("pin", "==", parseInt(coachpin))
            .get()
            .then(function (querySnapshot) {
              if (querySnapshot.empty) {
                alert("Invalid Coach pin number");
              } else {
                querySnapshot.forEach(function (doc) {
                  setCoachData({
                    id: doc.id,
                    data: doc.data(),
                  });

                  db.collection("invites").add({
                    coach: doc.id,
                    athlete: userDetails.id,
                    name: userDetails.data.name,
                    imageUrl: userDetails.data.imageUrl,
                    email: user,
                    phone: userDetails.data.phone,
                  });
                  alert("Invite Sent");
                  setInviteSent(true);

                  var userIdList = [];
                  userIdList.push(doc.id);
                  sendPushNotification(userIdList, {
                    title: `Invite Request`,
                    body: `${userDetails?.data?.name} has sent a request to be your athlete!`,
                  });

                  db.collection("CoachNotifications")
                    .doc(userData.data.listOfCoaches[0])
                    .collection("notifications")
                    .add(
                      {
                        message: `${userDetails?.data?.name} has sent a request to be your athlete! `,
                        seen: false,
                        timestamp:
                          firebase.firestore.FieldValue.serverTimestamp(),
                        athlete_id: userDetails.id,
                      },
                      { merge: true }
                    );
                });
              }
            })
            .catch(function (error) {
              console.log("Error getting documents: ", error);
            });
        } else {
          db.collection("coaches")
            .where("pin", "==", parseInt(coachpin))
            .get()
            .then(function (querySnapshot) {
              if (querySnapshot.empty) {
                alert("Invalid Coach pin number");
              } else {
                querySnapshot.forEach(function (doc) {
                  setCoachData({
                    id: doc.id,
                    data: doc.data(),
                  });
                  db.collection("coaches")
                    .doc(doc.id)
                    .update({
                      pendingInvites:
                        firebase.firestore.FieldValue.increment(1),
                    });

                  db.collection("invites").add({
                    coach: doc.id,
                    athlete: userDetails.id,
                    name: userDetails.data.name,
                    imageUrl: userDetails.data.imageUrl,
                    email: user,
                    phone: userDetails.data.phone,
                  });
                  alert("Invite Sent");
                  setInviteSent(true);

                  var userIdList = [];
                  userIdList.push(doc.id);
                  sendPushNotification(userIdList, {
                    title: `Invite Request`,
                    body: `${userDetails?.data?.name} has sent a request to be your athlete!`,
                  });

                  db.collection("CoachNotifications")
                    .doc(userData.data.listOfCoaches[0])
                    .collection("notifications")
                    .add(
                      {
                        message: `${userDetails?.data?.name} has sent a request to be your athlete! `,
                        seen: false,
                        timestamp:
                          firebase.firestore.FieldValue.serverTimestamp(),
                        athlete_id: userDetails.id,
                      },
                      { merge: true }
                    );
                });
              }
            })
            .catch(function (error) {
              console.log("Error getting documents: ", error);
            });
        }
      });
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center", marginTop: 40 }}>
        <Text
          style={{
            fontSize: RFValue(30, 816),
            fontFamily: "SF-Pro-Text-regular",
            fontWeight: "bold",
            color: "black",
            alignSelf: "center",
          }}
        >
          Please wait for the coach to onboard you.
        </Text>
      </View>

      {/* <View style={{ paddingTop: RFValue(40, 816), paddingBottom: 0 }}>
        <Text style={{ fontSize: RFValue(18, 816), marginBottom: 10 }}>
          Coach Pin Number
        </Text>
        <TextInput
          style={{
            backgroundColor: "white",
            borderRadius: RFValue(8, 816),
            paddingLeft: RFValue(20, 816),
            borderWidth: 1,
            paddingVertical: Platform.OS === "ios" ? 15 : RFValue(10, 816),
            borderColor: "#DBE2EA",
            padding: RFValue(10, 816),
            fontSize: RFValue(18, 816),
          }}
          value={coachpin}
          onChangeText={(text) => {
            setcoachpin(text);
          }}
          placeholder="Enter Coach Pin Number"
          keyboardType="numeric"
        />
      </View> */}
      {/* {!inviteSent ? (
        <TouchableOpacity
          onPress={() => sendInvite()}
          style={{
            backgroundColor: "#C19F1E",
            padding: RFValue(15, 816),
            alignItems: "center",
            marginTop: RFValue(20, 816),
            borderRadius: 25,
          }}
        >
          <Text style={{ color: "white", fontSize: RFValue(20, 816) }}>
            Send Invite
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => sendInvite()}
          style={{
            backgroundColor: "#C19F1E",
            padding: RFValue(15, 816),
            alignItems: "center",
            marginTop: RFValue(20, 816),
            borderRadius: 25,
          }}
        >
          <Text style={{ color: "white", fontSize: RFValue(20, 816) }}>
            Resend Invite
          </Text>
        </TouchableOpacity>
      )} */}

      <TouchableOpacity
        onPress={() => verifyUser()}
        style={{ alignItems: "center", marginTop: RFValue(60, 816) }}
      >
        <Icon name="sync-alt" type="font-awesome-5" size={30} color="black" />
        <Text style={{ fontSize: RFValue(18, 816) }}>refresh</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => signout()}
        style={{
          alignItems: "center",
          marginTop: 60,
          backgroundColor: "#C19F1E",
          padding: RFValue(20, 816),
          borderRadius: 25,
        }}
      >
        <Text style={{ fontSize: RFValue(18, 816), color: "white" }}>
          Sign Out
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default VerifyAthlete;
