import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
} from "react-native";
import { db } from "../utils/firebase";
import { LinearGradient } from "expo-linear-gradient";
import firebase from "firebase";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;

import { Icon } from "react-native-elements";
import { useSelector } from "react-redux";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    marginBottom: 0,
    paddingTop: RFValue(20, 816),
    height: ScreenHeight - 40,
  },
});

const Settings = ({ route, navigation }) => {
  const [type, setType] = useState(null);
  const [athlete_id, setAtheteId] = useState(null);
  const [coach_id, setCoachId] = useState(null);

  useEffect(() => {
    if (route.params?.type) {
      setType(route.params?.type);
    }
  }, [route.params?.type]);

  useEffect(() => {
    if (route.params?.athlete_id) {
      setAtheteId(route.params?.athlete_id);
    }
  }, [route.params?.athlete_id]);

  useEffect(() => {
    if (route.params?.coach_id) {
      setCoachId(route.params?.coach_id);
    }
  }, [route.params?.coach_id]);

  return (
    <View style={styles.container}>
      {type === "coach" && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: "absolute",
            left: 25,
            top: 30,
            backgroundColor: "white",
          }}
        >
          <Icon name="chevron-left" type="font-awesome-5" color="white" />
        </TouchableOpacity>
      )}

      <Text
        style={{
          color: "black",
          textAlign: "center",
          fontSize: 22,
          marginBottom: 50,
        }}
      >
        Settings
      </Text>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ShowProfile", {
            athlete_id: athlete_id,
            type: type,
          })
        }
      >
        <View
          style={{
            display: "flex",
            width: ScreenWidth - 80,
            height: 50,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: "black", fontSize: 18 }}>
            {type === "coach" ? "Profile" : "Your Profile"}
          </Text>
          <Icon name="chevron-right" type="font-awesome-5" color="white" />
        </View>
      </TouchableOpacity>

      {type !== "coach" && (
        <TouchableOpacity onPress={() => navigation.navigate("Home2")}>
          <View
            style={{
              display: "flex",
              width: ScreenWidth - 80,
              height: 50,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ color: "black", fontSize: 18 }}>Link Strava</Text>
            <Icon name="chevron-right" type="font-awesome-5" color="white" />
          </View>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Screen8", {
            athlete_id: athlete_id,
            type: type ? type : "settings",
          })
        }
      >
        <View
          style={{
            display: "flex",
            width: ScreenWidth - 80,
            height: 50,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: "black", fontSize: 18 }}>
            {type === "coach" ? "Selected Sports" : "Sports Selection"}
          </Text>
          <Icon name="chevron-right" type="font-awesome-5" color="white" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate("MedicalCheck", {
            athlete_id: athlete_id,
            type: type,
          })
        }
      >
        <View
          style={{
            display: "flex",
            width: ScreenWidth - 80,
            height: 50,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: "black", fontSize: 18 }}>Medical History</Text>
          <Icon name="chevron-right" type="font-awesome-5" color="white" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Training", {
            athlete_id: athlete_id,
            type: type,
          })
        }
      >
        <View
          style={{
            display: "flex",
            width: ScreenWidth - 80,
            height: 50,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: "black", fontSize: 18 }}>Training</Text>
          <Icon name="chevron-right" type="font-awesome-5" color="white" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Gadgets", {
            athlete_id: athlete_id,
            type: type,
          })
        }
      >
        <View
          style={{
            display: "flex",
            width: ScreenWidth - 80,
            height: 50,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: "black", fontSize: 18 }}>
            Gadgets and Equipments
          </Text>
          <Icon name="chevron-right" type="font-awesome-5" color="white" />
        </View>
      </TouchableOpacity>

      {type !== "coach" && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("BugReport", { userType: "athlete" })
          }
        >
          <View
            style={{
              display: "flex",
              width: ScreenWidth - 80,
              height: 50,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ color: "black", fontSize: 18 }}>Bug Report</Text>
            <Icon name="chevron-right" type="font-awesome-5" color="white" />
          </View>
        </TouchableOpacity>
      )}

      {/* <TouchableOpacity
        onPress={() =>
          navigation.navigate("Zones", {
            athlete_id: athlete_id,
            type: type,
          })
        }
      >
        <View
          style={{
            display: "flex",
            width: ScreenWidth - 80,
            height: 50,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: "black", fontSize: 18 }}>Zones</Text>
          <Icon name="chevron-right" type="font-awesome-5" color="white" />
        </View>
      </TouchableOpacity> */}

      {coach_id && (
        <TouchableOpacity
          activeOpacity={0.6}
          backgroundColor="steelblue"
          style={{
            width: "90%",
            backgroundColor: "steelblue",
            height: 55,
            marginBottom: 70,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: RFValue(8, 816),
            shadowColor: "#3895CE",
            marginHorizontal: RFValue(20, 816),
            marginTop: 30,
            // position: "absolute",
            // bottom: -50,
          }}
          onPress={() => {
            Alert.alert(
              "De-Linking",
              "Are you sure you want to delink with this athlete?",
              [
                {
                  text: "No",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                {
                  text: "Yes",
                  onPress: () => {
                    db.collection("athletes")
                      .doc(athlete_id)
                      .update({
                        listOfCoaches:
                          firebase.firestore.FieldValue.arrayRemove(coach_id),
                      });

                    db.collection("coach")
                      .doc(coach_id)
                      .update({
                        listOfAthletes:
                          firebase.firestore.FieldValue.arrayRemove(athlete_id),
                      });

                    if (type === "athlete") {
                      navigation.navigate("Settings");
                    } else {
                      navigation.navigate("CoachHomeScreen");
                    }
                  },
                },
              ],
              { cancelable: false }
            );
          }}
        >
          <LinearGradient
            colors={["#3895CE", "#004872"]}
            start={[0, 0]}
            end={[1, 0]}
            style={{
              width: "100%",
              height: "100%",
              paddingTop: RFValue(10, 816),
              borderRadius: RFValue(8, 816),
            }}
          >
            <View>
              <Text
                style={{
                  color: "#E2E2E2",
                  fontSize: RFValue(20, 816),
                  fontFamily: "SF-Pro-Display-regular",
                  textAlign: "center",
                }}
              >
                De-Link
              </Text>
            </View>
            <Image
              style={{
                width: 30,
                height: RFValue(20, 816),
                position: "absolute",
                right: RFValue(15, 816),
                marginTop: RFValue(15, 816),
              }}
              source={require("../../assets/doubleleftarrowheads.png")}
            />
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Settings;
