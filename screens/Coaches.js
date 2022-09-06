import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Icon } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  selectDbId,
  selectUser,
  selectUserData,
} from "../features/userSlice";
import { db } from "../firebase";
import Notification from "./components/Notification";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 0,
    height: ScreenHeight - RFValue(40, 816),
  },
});

function Coaches({ route, navigation }) {
  const user = useSelector(selectUser);
  const userData = useSelector(selectUserData);
  const userDetails = useSelector(selectUserData);
  const [coachDetails, setCoachDetails] = useState(route?.params?.coachData);
  const [section, setSection] = useState("about");
  const dispatch = useDispatch();

  const isFocused = useIsFocused();

  // useEffect(() => {
  //   console.log("JHAHAHA", userDetails);
  //   db.collection("coaches")
  //     .doc(userDetails.data.listOfCoaches[0])
  //     .get()
  //     .then((snap) => {
  //       let currentID = userDetails.data.listOfCoaches[0];
  //       let appObj = { ...snap.data(), ["id"]: currentID };
  //       setCoachDetails(appObj);
  //     });
  // }, [user, isFocused]);

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: "row",
            padding: RFValue(20, 816),
            paddingBottom: 0,
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={{ paddingRight: 20 }}
              onPress={() => navigation.navigate("Home", { screen: "Home" })}
            >
              <Icon name="chevron-left" type="font-awesome-5" />
            </TouchableOpacity>
            <Icon
              name="bars"
              type="font-awesome-5"
              size={24}
              onPress={() => navigation.toggleDrawer()}
            />
          </View>
          <Notification navigation={navigation} />
        </View>
        <View
          style={{
            padding: RFValue(20, 816),
          }}
        >
          <View style={{ padding: RFValue(20, 816), alignItems: "center" }}>
            <Image
              source={{
                uri: coachDetails?.imageUrl
                  ? coachDetails?.imageUrl
                  : "https://firebasestorage.googleapis.com/v0/b/fitnessapp0.appspot.com/o/userImage.jpeg?alt=media&token=02e8cfe5-c866-4a4f-93ab-8c5930a5cd3c",
              }}
              style={{
                width: RFValue(110, 816),
                height: RFValue(110, 816),
                borderRadius: 100,
                alignSelf: "center",
              }}
            />
            <Text
              style={{
                fontSize: RFValue(25, 816),
                fontWeight: "bold",
                color: "black",
                marginTop: RFValue(10, 816),
              }}
            >
              {coachDetails?.name}
            </Text>
            <Text
              style={{
                fontSize: RFValue(18, 816),
                color: "black",
                marginTop: RFValue(5, 816),
                textAlign: "center",
              }}
            >
              {coachDetails?.CoachType} Coach
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Chat", {
                  from_id: userData?.id,
                  to_id: coachDetails.id,
                  from_name: userData.data.name,
                  to_name: coachDetails.name,
                })
              }
              style={{
                padding: RFValue(10, 816),
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#C19F1E",
                borderRadius: RFValue(20, 816),
                marginTop: RFValue(10, 816),
                paddingHorizontal: RFValue(15, 816),
              }}
            >
              <Icon
                name="message"
                type="material"
                size={24}
                color="white"
                style={{ width: RFValue(40, 816) }}
              />
              <Text
                style={{
                  fontWeight: "bold",
                  color: "black",
                  marginLeft: RFValue(5, 816),
                  marginBottom: RFValue(5, 816),
                }}
              >
                MESSAGE
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity onPress={() => setSection("about")}>
                <Text
                  style={
                    section == "about"
                      ? {
                          fontWeight: "bold",
                          color: "black",
                          paddingBottom: 3,
                          borderBottomWidth: 1,
                        }
                      : { color: "black", paddingBottom: 3 }
                  }
                >
                  About
                </Text>
              </TouchableOpacity>
              {/* <TouchableOpacity
                style={{ marginLeft: RFValue(10, 816) }}
                onPress={() => setSection("payment")}
              >
                <Text
                  style={
                    section == "payment"
                      ? {
                          fontWeight: "bold",
                          color: "black",
                          paddingBottom: 3,
                          borderBottomWidth: 1,
                        }
                      : { color: "black", paddingBottom: 3 }
                  }
                >
                  Payment
                </Text>
              </TouchableOpacity> */}
            </View>
            {section == "about" ? (
              <View style={{ marginTop: RFValue(10, 816) }}>
                <Text style={{ color: "black", fontSize: RFValue(16, 816) }}>
                  Description
                </Text>
                <Text
                  style={{
                    color: "black",
                    marginTop: RFValue(5, 816),
                    fontSize: RFValue(16, 816),
                  }}
                >
                  {coachDetails?.description}
                </Text>

                <View style={{ marginTop: RFValue(20, 816) }}>
                  <Text style={{ color: "black", fontSize: RFValue(16, 816) }}>
                    {/* Accoladesss */}
                  </Text>

                  <View
                    style={{
                      backgroundColor: "white",
                      borderRadius: RFValue(20, 816),
                      padding: RFValue(10, 816),
                      marginTop: RFValue(10, 816),
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        color: "black",
                        fontSize: RFValue(18, 816),
                        alignSelf: "center",
                      }}
                    >
                      Certifications
                    </Text>
                    <Text
                      style={{
                        color: "black",
                        alignSelf: "center",
                        textAlign: "center",
                        marginTop: RFValue(5, 816),
                      }}
                    >
                      {coachDetails?.certificates}
                    </Text>
                  </View>

                  <View
                    style={{
                      backgroundColor: "white",
                      borderRadius: RFValue(20, 816),
                      padding: RFValue(10, 816),
                      marginTop: RFValue(15, 816),
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        color: "black",
                        fontSize: RFValue(18, 816),
                        alignSelf: "center",
                      }}
                    >
                      Awards
                    </Text>
                    <Text
                      style={{
                        color: "black",
                        alignSelf: "center",
                        textAlign: "center",
                        marginTop: RFValue(5, 816),
                      }}
                    >
                      {coachDetails?.awards}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View>
                <View
                  style={{
                    marginTop: RFValue(10, 816),
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "white",
                    borderRadius: RFValue(20, 816),
                  }}
                >
                  <View style={{ padding: RFValue(10, 816) }}>
                    <Text
                      style={{ color: "black", fontSize: RFValue(18, 816) }}
                    >
                      Next Payment
                    </Text>
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: RFValue(24, 816),
                        color: "black",
                      }}
                    >
                      {"\u20B9"} 8000
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ marginRight: RFValue(10, 816) }}>
                      Due in
                    </Text>
                    <View
                      style={{
                        backgroundColor: "#C19F1E",
                        padding: RFValue(20, 816),
                        borderRadius: RFValue(20, 816),
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "bold",
                          color: "black",
                          alignSelf: "center",
                          textAlign: "center",
                        }}
                      >
                        23
                      </Text>
                      <Text
                        style={{
                          fontWeight: "bold",
                          color: "black",
                          alignSelf: "center",
                          textAlign: "center",
                        }}
                      >
                        Apr
                      </Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  style={{
                    backgroundColor: "#C19F1E",
                    borderRadius: RFValue(20, 816),
                    padding: RFValue(10, 816),
                    marginTop: RFValue(15, 816),
                  }}
                >
                  <Text
                    style={{
                      alignSelf: "center",
                      color: "black",
                      fontWeight: "bold",
                    }}
                  >
                    Pay Now
                  </Text>
                </TouchableOpacity>

                <View style={{ marginTop: RFValue(20, 816) }}>
                  <Text style={{ color: "black" }}>Past Transactions</Text>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: RFValue(20, 816),
                      borderBottomWidth: 1,
                      borderColor: "#707070",
                      paddingBottom: RFValue(10, 816),
                    }}
                  >
                    <View>
                      <Text>Coach {coachDetails?.name}</Text>
                      <Text style={{ color: "#707070" }}>23rd march 2021</Text>
                    </View>
                    <Text
                      style={{ color: "#17C261", fontSize: RFValue(18, 816) }}
                    >
                      {"\u20B9"} 8,000
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: RFValue(10, 816),
                      borderBottomWidth: 1,
                      borderColor: "#707070",
                      paddingBottom: RFValue(10, 816),
                    }}
                  >
                    <View>
                      <Text>Coach {coachDetails?.name}</Text>
                      <Text style={{ color: "#707070" }}>23rd march 2021</Text>
                    </View>
                    <Text
                      style={{ color: "#17C261", fontSize: RFValue(18, 816) }}
                    >
                      {"\u20B9"} 8,000
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

export default Coaches;
