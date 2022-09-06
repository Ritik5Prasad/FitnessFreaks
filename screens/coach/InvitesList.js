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

function InvitesList({ navigation }) {
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
    db.collection("invites")
      .where("coach", "==", userData?.id)
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((item) => {
          let currentID = item.id;
          let appObj = { ...item.data(), ["id"]: currentID };
          console.log(appObj);
          data.push(appObj);
          temp.push(
            <TouchableOpacity
              key={appObj.name}
              activeOpacity={0.5}
              onPress={() =>
                navigation.navigate("InviteScreen", {
                  data: item.data(),
                  id: item.id,
                })
              }
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: RFValue(15, 816),
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={{
                      uri: appObj?.imageUrl
                        ? appObj?.imageUrl
                        : "https://firebasestorage.googleapis.com/v0/b/fitnessapp0.appspot.com/o/userImage.jpeg?alt=media&token=02e8cfe5-c866-4a4f-93ab-8c5930a5cd3c",
                    }}
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
              </View>
            </TouchableOpacity>
          );
        });
        setAthleteDetails(data);
        setAthletes(temp);
      });
  }, [user]);

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
                navigation.goBack();
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
                marginLeft: 20,
              }}
            >
              Invites Request
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("InviteAthlete")}
            activeOpacity={0.5}
            style={{
              backgroundColor: "#C19F1E",
              padding: RFValue(10, 816),
              borderRadius: RFValue(8, 816),
              marginLeft: RFValue(10, 816),
              paddingHorizontal: 12,
            }}
          >
            <Icon name="plus" type="font-awesome-5" color="white" />
          </TouchableOpacity>
          <Notification navigation={navigation} />
        </View>
        {/*
        <View
          style={{ marginTop: RFValue(20,816), flexDirection: "row", alignItems: "center" }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderRadius:RFValue(8, 816),
              borderWidth: 2,
              borderColor: "rgba(0,0,0,0.5)",
              marginTop:RFValue(10, 816),
              backgroundColor: "white",
              width: "85%",
              justifyContent: "space-between",
              paddingHorizontal:RFValue(10, 816),
            }}
          >
            <TextInput
              style={{
                width: "80%",
                borderColor: "#DBE2EA",
                backgroundColor: "white",
                padding:RFValue(10, 816),
              }}
              editable={true}
              placeholder=""
              defaultValue={search}
              value={search}
              onChangeText={setSearch}
            />
            <Image
              source={require("../../assets/search.png")}
              style={{ marginRight: RFValue(10, 816)}}
            />
          </View>
          <Image
            source={require("../../assets/filter.png")}
            style={{ marginLeft: RFValue(20,816), marginTop: RFValue(10, 816)}}
          />
            </View>*/}

        {athletes}
      </View>
    </KeyboardAwareScrollView>
  );
}

export default InvitesList;
