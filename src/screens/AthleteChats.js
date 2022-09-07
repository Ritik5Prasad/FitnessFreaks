import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  KeyboardAvoidingView,
  Dimensions,
  Modal,
} from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Icon } from "react-native-elements";
import Notification from "./components/Notification";
import { auth, db } from "../utils/firebase";
import {
  selectUser,
  setUserData,
  setLoading,
  selectUserData,
  selectUserType,
  setTemperoryID,
  selectUserVerified,
} from "../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: RFValue(20, 816),
    backgroundColor: "#F7F8FB",
  },
});

const AthleteChats = ({ route, navigation }) => {
  const [coachDetails, setCoachDetails] = useState(null);
  const userData = useSelector(selectUserData);
  useEffect(() => {
    if (userData) {
      var data = [];
      db.collection("coaches")
        .where("listOfAthletes", "array-contains", userData.id)
        .onSnapshot((snapshot) => {
          data = [];
          snapshot.docs.forEach((item) => {
            let currentID = item.id;
            let appObj = { ...item.data(), ["id"]: currentID };
            data.push(appObj);
          });
          setCoachDetails(data);
        });
    }
  }, [userData]);
  return (
    <View style={styles.container}>
      <ScrollView
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottomWidth: 1,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              padding: RFValue(5, 816),

              borderColor: "#707070",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                // if (userType === "athlete") {
                //   navigation.navigate("Home", { screen: "Home" });
                // } else {
                //   navigation.goBack();
                // }
                navigation.goBack();
              }}
              style={{ paddingHorizontal: RFValue(10, 816) }}
            >
              <Icon name="chevron-left" type="font-awesome-5" />
            </TouchableOpacity>
            <Icon
              name="bars"
              type="font-awesome-5"
              size={24}
              onPress={() => navigation.toggleDrawer()}
            />

            <Text
              style={{
                color: "black",
                fontSize: RFValue(20, 816),
                fontWeight: "bold",
                marginLeft: RFValue(20, 816),
              }}
            >
              Messaging
            </Text>
          </View>
          <Notification navigation={navigation} />
        </View>
        <View
          style={{
            marginVertical: RFValue(20, 816),
            paddingHorizontal: RFValue(5, 816),
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={{ width: "100%", paddingHorizontal: 5 }}>
            <Text
              style={{
                fontSize: RFValue(16, 816),
                fontWeight: "bold",
                color: "black",
              }}
            >
              Coach
            </Text>
            <View style={{ flex: 1, width: "100%" }}>
              {coachDetails?.map((coach, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={{
                    width: "100%",
                    backgroundColor: "#fff",
                    height: RFValue(80, 816),
                    borderRadius: RFValue(12, 816),
                    marginTop: RFValue(10, 816),
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      style={{
                        width: RFValue(60, 816),
                        height: RFValue(60, 816),
                        backgroundColor: "#d3d3d3",
                        borderRadius: 60,
                        marginRight: RFValue(15, 816),
                        marginLeft: RFValue(10, 816),
                      }}
                      source={{
                        uri: coach.imageUrl
                          ? coach.imageUrl
                          : "https://firebasestorage.googleapis.com/v0/b/fitnessapp0.appspot.com/o/userImage.jpeg?alt=media&token=02e8cfe5-c866-4a4f-93ab-8c5930a5cd3c",
                      }}
                    />
                    <View>
                      <Text
                        style={{
                          fontSize: RFValue(15, 816),
                          fontWeight: "700",
                        }}
                      >
                        {coach.name}
                      </Text>
                      <Text style={{ fontSize: RFValue(12, 816) }}>
                        {coach?.CoachType}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={{ marginRight: RFValue(20, 816) }}
                    onPress={() =>
                      navigation.navigate("Chat", {
                        from_id: userData?.id,
                        to_id: coach.id,
                        from_name: userData.data.name,
                        to_name: coach.name,
                        navigation: navigation,
                      })
                    }
                  >
                    <Image source={require("../../assets/message.png")} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AthleteChats;
