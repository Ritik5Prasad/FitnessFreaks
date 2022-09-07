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
import { auth, db } from "../../utils/firebase";
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
} from "../../features/userSlice";
import { useIsFocused } from "@react-navigation/native";
import { Icon } from "react-native-elements";
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
import Notification from "../components/Notification";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 0,
    padding: RFValue(20, 816),
    minHeight: ScreenHeight,
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
    fontSize: 18,
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

function AthletesList({ navigation }) {
  const [userDetails, setUserDetails] = useState(null);
  const [athleteDetails, setAthleteDetails] = useState([]);
  const user = useSelector(selectUser);
  const userData = useSelector(selectUserData);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [athletes, setAthletes] = useState([]);
  const [listOfAthletes, setListOfAthletes] = useState(null);

  useEffect(() => {
    var temp = [];
    const data = [];
    console.log(userData);
    if (userData?.id) {
      db.collection("athletes")
        .orderBy("name", "asc")
        .get()
        .then((snapshot) => {
          snapshot.docs.forEach((item) => {
            console.log("Item ID", item.id);
            if (userData?.data?.listOfAthletes?.includes(item.id)) {
              let currentID = item.id;
              let appObj = { ...item.data(), ["id"]: currentID };
              data.push(appObj);
              temp.push(
                <View
                  key={appObj.name}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: RFValue(15, 816),
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={{ uri: appObj?.imageUrl }}
                      style={{
                        width: RFValue(50, 816),
                        height: RFValue(50, 816),
                        borderRadius: 100,
                        alignSelf: "center",
                      }}
                    />
                    <View style={{ marginLeft: RFValue(20, 816) }}>
                      <Text
                        style={{
                          fontSize: RFValue(20, 816),
                          color: "black",
                          fontWeight: "bold",
                        }}
                      >
                        {appObj?.name}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {/* <TouchableOpacity>
                    <Image
                      source={require("../../assets/video.png")}
                      style={{ marginRight: 30 }}
                    />
                  </TouchableOpacity> */}
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("Chat", {
                          from_id: userData?.id,
                          to_id: appObj.id,
                          from_name: userData.data.name,
                          to_name: appObj.name,
                          type: "coach",
                        })
                      }
                      activeOpacity={0.8}
                      style={{
                        marginRight: RFValue(10, 816),
                        width: 35,
                        height: 35,
                        borderRadius: 35,
                        backgroundColor: "#C19F1E",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon
                        name="message"
                        type="material"
                        size={24}
                        color="white"
                        style={{ width: RFValue(40, 816) }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }
          });
          setAthleteDetails(data);
          setAthletes(temp);
        });
    }
  }, [user, userData?.id]);

  const fetchUsers = (search) => {
    var temp = [];
    const data = [];
    console.log(userData);
    if (userData?.id) {
      db.collection("athletes")
        .where("name", ">=", search)
        .orderBy("name", "asc")
        .get()
        .then((snapshot) => {
          snapshot.docs.forEach((item) => {
            if (userData.data.listOfAthletes.includes(item.id)) {
              let currentID = item.id;
              let appObj = { ...item.data(), ["id"]: currentID };
              data.push(appObj);
              temp.push(
                <View
                  key={appObj.name}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: RFValue(15, 816),
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={{ uri: appObj?.imageUrl }}
                      style={{
                        width: RFValue(50, 816),
                        height: RFValue(50, 816),
                        borderRadius: 100,
                        alignSelf: "center",
                      }}
                    />
                    <View style={{ marginLeft: RFValue(20, 816) }}>
                      <Text
                        style={{
                          fontSize: RFValue(20, 816),
                          color: "black",
                          fontWeight: "bold",
                        }}
                      >
                        {appObj?.name}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {/* <TouchableOpacity>
                    <Image
                      source={require("../../assets/video.png")}
                      style={{ marginRight: 30 }}
                    />
                  </TouchableOpacity> */}
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("Chat", {
                          from_id: userData?.id,
                          to_id: appObj.id,
                          from_name: userData.data.name,
                          to_name: appObj.name,
                          type: "coach",
                        })
                      }
                      activeOpacity={0.8}
                      style={{
                        marginRight: RFValue(10, 816),
                        width: 35,
                        height: 35,
                        borderRadius: 35,
                        backgroundColor: "#C19F1E",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon
                        name="message"
                        type="material"
                        size={24}
                        color="white"
                        style={{ width: RFValue(40, 816) }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }
          });
          setAthleteDetails(data);
          setAthletes(temp);
        });
    }
  };

  return (
    <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: RFValue(10, 816),
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={{
                paddingRight: RFValue(20, 816),
              }}
              onPress={() => {
                navigation.navigate("Home", { screen: "CoachHomeScreen" });
              }}
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
                fontSize: RFValue(30, 816),
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                color: "black",
                marginLeft: RFValue(20, 816),
              }}
            >
              All Athletes
            </Text>
          </View>
          <Notification navigation={navigation} />
        </View>

        <View
          style={{
            marginTop: RFValue(20, 816),
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderRadius: RFValue(8, 816),
              borderWidth: 2,
              borderColor: "rgba(0,0,0,0.3)",
              marginTop: RFValue(10, 816),
              backgroundColor: "white",
              width: "85%",
              justifyContent: "space-between",
              paddingHorizontal: RFValue(10, 816),
            }}
          >
            <TextInput
              style={{
                width: "80%",
                borderColor: "rgba(0,0,0,0.3)",
                backgroundColor: "white",
                padding: RFValue(10, 816),
                paddingVertical: Platform.OS === "ios" ? 15 : 10,
              }}
              editable={true}
              onChangeText={(search) => fetchUsers(search)}
            />
            <Image
              source={require("../../../assets/search.png")}
              style={{ marginRight: RFValue(10, 816) }}
            />
          </View>
          <Image
            source={require("../../../assets/filter.png")}
            style={{
              marginLeft: RFValue(20, 816),
              marginTop: RFValue(10, 816),
            }}
          />
        </View>

        {athletes}
      </View>
    </KeyboardAwareScrollView>
  );
}

export default AthletesList;
