import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { db } from "../utils/firebase";
import { LinearGradient } from "expo-linear-gradient";
import firebase from "firebase";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
import { StackActions } from "@react-navigation/native";

import { useDispatch, useSelector } from "react-redux";
import { Icon } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import {
  selectUser,
  setUserData,
  setLoading,
  selectUserData,
  selectUserType,
  setTemperoryID,
  selectUserVerified,
} from "../features/userSlice";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginBottom: 0,
    paddingTop: RFValue(20, 816),
    height: ScreenHeight,
    backgroundColor: "white",
  },
});

const OnboardingAthlete = (props) => {
  const [addDetails, setAddDetails] = useState(false);
  const dispatch = useDispatch();
  const userData = useSelector(selectUserData);
  const saved = useSelector((state) => state.onboarding.saved);
  /*
  useFocusEffect(
    useCallback(() => {
      props.navigation.addListener('beforeRemove', (e) => {
        e.preventDefault();
        props.navigation.navigate("AthleteFlow")
    })
    }, [])
  );
    */

  return (
    <View style={styles.container}>
      <View
        style={{
          position: "absolute",
          left: RFValue(25, 816),
          top: RFValue(50, 816),
          zIndex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: RFValue(34, 816),
            fontFamily: "SF-Pro-Text-regular",
            fontWeight: "bold",
            color: "black",
          }}
        >
          Athlete
        </Text>
      </View>

      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginVertical: RFValue(10, 816),
          marginTop: RFValue(80, 816),
        }}
      >
        <Text
          style={{
            margin: RFValue(10, 816),
            textAlign: "center",
            marginTop: RFValue(25, 816),
            color: "black",
          }}
        >
          You can choose to fill this information now or at a later stage
          through profile page.
        </Text>

        <View
          style={{
            width: ScreenWidth - 30,
            borderTopWidth: 0.8,
            marginVertical: RFValue(30, 816),
          }}
        ></View>
        <TouchableOpacity
          onPress={() => {
            props.setOnboardModal(false);
            props.navigation.navigate("Anthropometric", {
              screen: "Anthropometric",
            });
          }}
        >
          <View
            style={{
              display: "flex",
              width: ScreenWidth - RFValue(40, 816),
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "white",
              marginBottom: RFValue(15, 816),
              borderRadius: 5,
              padding: RFValue(15, 816),
              paddingLeft: 5,
            }}
          >
            <Text
              style={{
                fontSize: RFValue(16, 816),
                marginLeft: RFValue(15, 816),
                color: "black",
              }}
            >
              Anthropometric Measurements
            </Text>
            <Icon
              style={{ marginRight: RFValue(20, 816) }}
              name="chevron-right"
              type="font-awesome-5"
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            props.setOnboardModal(false);

            props.navigation.navigate("MedicalAssessment", {
              setAddDetails: setAddDetails,
            });
          }}
        >
          <View
            style={{
              display: "flex",
              width: ScreenWidth - RFValue(40, 816),
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "white",
              marginBottom: RFValue(15, 816),
              borderRadius: 5,
              padding: RFValue(15, 816),
              paddingLeft: 5,
            }}
          >
            <Text
              style={{
                fontSize: RFValue(16, 816),
                marginLeft: RFValue(15, 816),
                color: "black",
              }}
            >
              Medical Assessment
            </Text>
            <Icon
              style={{ marginRight: RFValue(20, 816) }}
              name="chevron-right"
              type="font-awesome-5"
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            props.setOnboardModal(false);

            props.navigation.navigate("TrainingAssessment", {
              setAddDetails: setAddDetails,
            });
          }}
        >
          <View
            style={{
              display: "flex",
              width: ScreenWidth - RFValue(40, 816),
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "white",
              marginBottom: RFValue(15, 816),
              borderRadius: 5,
              padding: RFValue(15, 816),
              paddingLeft: 5,
            }}
          >
            <Text
              style={{
                fontSize: RFValue(16, 816),
                marginLeft: RFValue(15, 816),
                color: "black",
              }}
            >
              Training Assessment
            </Text>
            <Icon
              style={{ marginRight: RFValue(20, 816) }}
              name="chevron-right"
              type="font-awesome-5"
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            props.setOnboardModal(false);

            props.navigation.navigate("LifestyleAssessment", {
              setAddDetails: setAddDetails,
            });
          }}
        >
          <View
            style={{
              display: "flex",
              width: ScreenWidth - RFValue(40, 816),
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "white",
              marginBottom: RFValue(15, 816),
              borderRadius: 5,
              padding: RFValue(15, 816),
              paddingLeft: 5,
            }}
          >
            <Text
              style={{
                fontSize: RFValue(16, 816),
                marginLeft: RFValue(15, 816),
                color: "black",
              }}
            >
              Food and Lifestyle Assessment
            </Text>
            <Icon
              style={{ marginRight: RFValue(20, 816) }}
              name="chevron-right"
              type="font-awesome-5"
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            height: RFValue(52, 816),
            width: ScreenWidth - RFValue(100, 816),
            marginTop: RFValue(45, 816),
            marginBottom: RFValue(25, 816),
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 50,
            backgroundColor: "#C19F1E",
          }}
          onPress={() => {
            //props.navigation.navigate("AthleteFlow",{screen:"Home"});
            props.setOnboardModal(false);
            db.collection("athletes")
              .doc(userData?.id)
              .update({ onboardAthlete: false });
            dispatch(
              setUserData({
                id: userData?.id,
                data: { ...userData?.data, onboardAthlete: false },
              })
            );

            /*
              setTimeout(()=>{
                setVerifiedModal(true);
              },1000)
              */
          }}
        >
          <View>
            <Text
              style={{
                color: "white",
                fontFamily: "SF-Pro-Display-regular",
                fontSize: RFValue(20, 816),
                textAlign: "center",
              }}
            >
              {saved ? "Continue" : "Skip"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingAthlete;
