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
} from "react-native";
import { auth, db } from "../../utils/firebase";
import { NativeModules } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  setDbID,
  selectDbId,
  selectUser,
  selectShowData,
  logout,
  setUserData,
  selectUserData,
} from "../../features/userSlice";

import { useFocusEffect } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import ChatCard from "./ChatCard";
import Notification from "../components/Notification";
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;

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

function ChatHomeScreen({ navigation }) {
  const user = useSelector(selectUser);
  const userData = useSelector(selectUserData);

  const [search, setSearch] = useState("");
  const [chats, setChats] = useState([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (userData) {
      var unsub1 = db
        .collection("chat")
        .where("from_id", "==", userData?.id)
        .onSnapshot((snapshot) => {
          const data = [];
          var temp = [];
          snapshot.docs.forEach((item) => {
            let currentID = item.id;
            let appObj = { ...item.data(), ["id"]: currentID };
            data.push(appObj);
            temp.push(
              <ChatCard
                from_id={appObj.from_id}
                id={appObj.id}
                key={appObj.id}
                to_id={appObj.to_id}
              />
            );
          });
          setChats(temp);
        });

      return () => {
        unsub1();
      };
    }
  }, [userData?.id, isFocused]);

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
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
                <Image source={require("../../../assets/left_arrow.png")} />
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
                  marginLeft: RFValue(20, 816),
                  color: "black",
                }}
              >
                Messaging
              </Text>
            </View>
            <Notification navigation={navigation} />
          </View>

          <View style={{ marginTop: RFValue(20, 816) }}>
            <Text style={{ fontSize: RFValue(18, 816), color: "black" }}>
              Chats
            </Text>
          </View>

          {chats}
        </View>
      </KeyboardAwareScrollView>
      <TouchableOpacity
        onPress={() => navigation.navigate("AthletesList")}
        activeOpacity={0.8}
        style={{
          position: "absolute",
          right: RFValue(20, 816),
          top: "90%",
          backgroundColor: "#C19F1E",
          borderRadius: 100,
          alignSelf: "flex-end",
          width: RFValue(60, 816),
          height: RFValue(60, 816),
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: RFValue(24, 816),
            color: "white",
            fontWeight: "bold",
          }}
        >
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default ChatHomeScreen;
