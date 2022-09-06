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
import { auth, db } from "../../firebase";
import { NativeModules } from "react-native";
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

let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
import { useNavigation } from "@react-navigation/native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 0,
    padding: RFValue(20, 816),
    minHeight: ScreenHeight,
  },
  athlete_card: {
    width: ScreenWidth / 1.05,
    height: 180,
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

function ChatCard({ to_id, from_id, id }) {
  const [athleteDetails, setAthleteDetails] = useState({});
  const [chatId, setChatId] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const navigation = useNavigation();

  const user = useSelector(selectUser);
  const userData = useSelector(selectUserData);

  useEffect(() => {
    db.collection("athletes")
      .doc(to_id)
      .get()
      .then(function (querySnapshot) {
        setAthleteDetails(querySnapshot.data());
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });

    db.collection("chat")
      .doc(id)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        var data = [];
        snapshot.docs.forEach((item) => {
          let currentID = item.id;
          let appObj = { ...item.data(), ["id"]: currentID };
          data.push(appObj);
        });
        setAllMessages(data);
      })
      
  }, [user]);

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Chat", {
          from_id: from_id,
          to_id: to_id,
          from_name: userData.data.name,
          to_name: athleteDetails.name,
          type: "coach",
        })
      }
      style={{
        backgroundColor: "white",
        padding: RFValue(10, 816),
        borderRadius: RFValue(20, 816),
        marginTop: 15,
      }}
      activeOpacity={0.8}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={
              athleteDetails?.imageUrl
                ? { uri: athleteDetails?.imageUrl }
                : null
            }
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
                fontSize: RFValue(16, 816),
                color: "black",
                fontWeight: "bold",
              }}
            >
              {athleteDetails?.name}
            </Text>
            <Text style={{ fontSize: RFValue(16, 816), color: "#2C2C2C" }}>
              {allMessages[0]?.format == "image"
                ? "Photo"
                : allMessages[0]?.message
                ? allMessages[0]?.message
                : "..."}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default ChatCard;
