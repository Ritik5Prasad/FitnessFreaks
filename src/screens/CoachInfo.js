import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Textarea from "react-native-textarea";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../utils/firebase";
import {
  selectUser,
  setUserData,
  setLoading,
  selectUserData,
  selectUserType,
  setTemperoryID,
  selectUserVerified,
} from "../features/userSlice";
import Notification from "./components/Notification";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function CoachInfo({ setOnboardModal }) {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const userData = useSelector(selectUserData);
  const [userDetails, setUserDetails] = useState(null);
  const [awards, setAwards] = useState(null);
  const [certificates, setCertificates] = useState(null);
  const [description, setDescription] = useState(null);
  const [exit, setExit] = useState(false);

  const handle = () => {
    var local_user = {};
    if (awards || certificates || description) {
      db.collection("coaches")
        .where("email", "==", user)
        .get()
        .then((snap) => {
          if (!snap.empty) {
            snap.forEach(function (doc) {
              local_user = {
                id: doc.id,
                data: doc.data(),
              };
              setUserDetails({
                id: doc.id,
                data: doc.data(),
              });
            });
            db.collection("coaches").doc(local_user.id).update({
              awards,
              description,
              certificates,
            });
          }
        });
      dispatch(
        setUserData({
          id: userData?.id,
          data: { ...userData?.data, onboardCoach: false },
        })
      );
      setOnboardModal(false);
      db.collection("coaches")
        .doc(userData?.id)
        .update({ onboardCoach: false });
    } else {
      dispatch(
        setUserData({
          id: userData?.id,
          data: { ...userData?.data, onboardCoach: false },
        })
      );
      setOnboardModal(false);
      db.collection("coaches")
        .doc(userData?.id)
        .update({ onboardCoach: false });
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: "#F6F6F6" }}
      contentContainerStyle={{ padding: 0, backgroundColor: "#F6F6F6" }}
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          padding: RFValue(20, 816),
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "black",
            fontSize: RFValue(25, 816),
            fontWeight: "bold",
          }}
        >
          Enter Coach Information
        </Text>
      </View>

      <View style={{ padding: RFValue(20, 816), flex: 1 }}>
        <Text
          style={{
            color: "black",
            fontSize: RFValue(18, 816),
            marginBottom: RFValue(10, 816),
            marginTop: RFValue(10, 816),
          }}
        >
          Description
        </Text>
        <Textarea
          containerStyle={{ backgroundColor: "white", padding: 10 }}
          onChangeText={(text) => setDescription(text)}
          defaultValue={description}
          maxLength={120}
          placeholder={"Enter Coach Description"}
        />

        <Text
          style={{
            color: "black",
            fontSize: RFValue(18, 816),
            marginBottom: RFValue(10, 816),
            marginTop: RFValue(10, 816),
          }}
        >
          Certifications
        </Text>
        <Textarea
          containerStyle={{ backgroundColor: "white", padding: 10 }}
          onChangeText={(text) => setCertificates(text)}
          defaultValue={certificates}
          maxLength={120}
          placeholder={"Enter Coach Certifications"}
        />

        <Text
          style={{
            color: "black",
            fontSize: RFValue(18, 816),
            marginBottom: RFValue(10, 816),
            marginTop: RFValue(10, 816),
          }}
        >
          Awards
        </Text>
        <Textarea
          containerStyle={{ backgroundColor: "white", padding: 10 }}
          onChangeText={(text) => setAwards(text)}
          defaultValue={awards}
          maxLength={120}
          placeholder={"Enter Awards earned"}
        />

        <TouchableOpacity
          onPress={() => {
            handle();
          }}
          style={{
            backgroundColor: "#C19F1E",
            borderRadius: RFValue(10, 816),
            padding: RFValue(15, 816),
            marginTop: RFValue(20, 816),
          }}
        >
          {awards || certificates || description ? (
            <Text
              style={{
                fontSize: RFValue(18, 816),
                fontWeight: "bold",
                color: "black",
                alignSelf: "center",
              }}
            >
              Add Coach Details
            </Text>
          ) : (
            <Text
              style={{
                fontSize: RFValue(18, 816),
                fontWeight: "bold",
                color: "white",
                alignSelf: "center",
              }}
            >
              Skip
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}
