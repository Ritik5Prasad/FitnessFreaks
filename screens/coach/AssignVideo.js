import "react-native-get-random-values";
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
  FlatList,
  ImageBackground,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { auth, db } from "../../firebase";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";
const defaultimg = require("../../assets/illustration.jpeg");

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
import VimeoPlayer from "../components/VimeoPlayer";
import { Formik } from "formik";
import DocumentPicker from "react-native-document-picker";
import { string, func } from "prop-types";
import WebView from "react-native-autoheight-webview";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 0,

    padding: RFValue(20, 816),
    minHeight: ScreenHeight,
  },
  calendarContainer: {
    position: "absolute",
    alignSelf: "stretch",
    maxHeight: RFValue(100, 816),
    top: ScreenHeight * 0.1,
    width: "100%",
    zIndex: 1,
    backgroundColor: "#f3f3f3",
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "75%",
    paddingBottom: "5%",
  },
  body: {
    position: "absolute",
    right: RFValue(30, 816),
    bottom: "10%",
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Gill Sans",
    textAlign: "center",
    margin: 10,
    color: "#ffffff",
    backgroundColor: "transparent",
  },
});

function AssignVideo({ navigation }) {
  const [userDetails, setUserDetails] = useState(null);
  const [athleteDetails, setAthleteDetails] = useState([]);
  const user = useSelector(selectUser);
  const userData = useSelector(selectUserData);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [athletes, setAthletes] = useState([]);
  const [listOfAthletes, setListOfAthletes] = useState(null);
  const [videoId, setVideoId] = useState(["576142998", "575857316"]);
  const [title, settitle] = useState("");
  const [modal, setModal] = useState(false);
  const [verifiedModal, setVerifiedModal] = useState(false);
  const [onboardModal, setOnboardModal] = useState(false);
  const [selectVideo, setSelectVideo] = useState(true);
  const [selectedAthletes, setselectedAthletes] = useState([]);
  // const [videoData, setVideoData] = useState([
  //   {
  //     title: "sample1",

  //     videoId: 576142998,
  //   },
  //   { title: "sample2", videoId: 576142998 },
  //   { title: "sample3", videoId: 576142998 },
  //   { title: "sample4", videoId: 576142998 },
  //   { title: "sample1", videoId: 576142998 },
  //   { title: "sample2", videoId: 576142998 },
  //   { title: "sample3", videoId: 576142998 },
  // ]);
  const [videoData, setVideoData] = useState([]);

  useEffect(() => {
    var temp = [];
    const data = [];
    console.log(userData);
    if (userData?.id) {
      db.collection("coaches")
        .doc(userData?.id)
        .collection("videos")
        .get()
        .then((snapshot) => {
          snapshot.docs.forEach((dat) => {
            console.log(2, dat.data());
            data.push(dat.data());

            setVideoData(data);
          });
        });
    }
  }, [user, userData]);

  const fetchUsers = (search) => {
    var temp = [];
    const data = [];
    console.log(userData);
    if (userData?.id) {
    }
  };
  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.video],
      });

      let formData1 = {
        title: "name",
        video: {
          uri: res.uri,
          type: res.type,
          size: res.size,
        },
      };

      var formData = new FormData();
      formData.append("title", "title");
      formData.append("description", "description");
      formData.append("video", {
        uri: res.uri,
        type: res.type,

        name: res.name,
      });

      let headers = {
        "Content-Type": "multipart/form-data", // this is a imp line
        Accept: "application/json",
      };
      let obj = {
        method: "POST",
        headers: headers,
        body: formData,
      };
      console.log("err");
      let url1 = "http://192.168.55.101:3000/api/upload/video";

      setTimeout(() => {
        fetch(url1, obj) // put your API URL here
          .then((resp) => {
            console.log(resp);
            let json = null;
            json = resp.json();
            console.log(" Response", json);
            if (resp.ok) {
              return json;
            }
            return json.then((err) => {
              console.log("error :", err);
              throw err;
            });
          })
          .then((json) => json)
          .catch((err) => {
            console.log("c", err);
          });
      }, 3000);

      console.log(res.uri, res.type, res.name, res.size);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  const renderItem_ = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          let temp = [...videoData];
          if (temp[index].selected) {
            temp[index].selected = !temp[index].selected;
            setVideoData(temp);
            console.log(temp);
          } else {
            temp[index].selected = true;
            setVideoData(temp);
            console.log(temp);
          }
        }}
        style={{
          width: "50%",
          borderRadius: 20,
          height: 100,
          borderRadius: 10,
          margin: 50,
        }}
      >
        <View></View>
        {console.log("ni", item)}

        {item ? (
          <View
            style={{
              width: "90%",
              marginLeft: 120,
              position: "absolute",
              height: 400,
            }}
          >
            <WebView
              style={{ maxWidth: "100%", borderRadius: 10 }}
              // onError={onError}
              allowsFullscreenVideo
              androidHardwareAccelerationDisabled={true}
              // scrollEnabled={false}
              // automaticallyAdjustContentInsets
              source={{
                html: `
                <html>
                <body style="border-radius:10px">
                <div style="padding:10px;webkit-border-radius: 20px;-moz-border-radius: 10px;border-radius: 10px;margin:0 auto;overflow:hidden;">
                  <iframe style="border-radius:10px" src="https://player.vimeo.com/video/${item.videoId}" width="100%" height="200px" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
                 </div>
                  <script src="https://player.vimeo.com/api/player.js"></script>
                </body>
              </html>
        `,
              }}
            />
          </View>
        ) : (
          <View style={{ borderRadius: 20 }}>
            <ImageBackground
              imageStyle={{ borderRadius: 10 }}
              style={{ width: "100%", height: 100 }}
              source={defaultimg}
            >
              <LinearGradient
                colors={["transparent", "transparent", "#000000"]}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  opacity: 1,
                  height: "100%",
                  borderRadius: 10,
                }}
              />
            </ImageBackground>
          </View>
        )}

        {videoData[index].selected && (
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 20,
              right: 10,
              top: 40,
              bottom: 0,
              position: "absolute",
              backgroundColor: "green",
              overflow: "hidden",
            }}
          >
            <Text style={{ color: "black", textAlign: "center" }}>✔</Text>
          </View>
        )}
        <Text
          style={{
            position: "absolute",
            bottom: 0,
            left: 10,

            color: "black",
            overflow: "hidden",
            maxWidth: "90%",
            fontSize: 14,
          }}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };
  console.log("n");

  return (
    <View>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 80, fontFamily: "SF-Pro-Text-regular" }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            margin: 20,
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={{ paddingRight: 20 }}
              onPress={() => navigation.goBack()}
            >
              <Icon
                name="chevron-left"
                type="font-awesome-5"
                color="black"
                size={RFValue(30, 816)}
              />
            </TouchableOpacity>
            <Icon
              name="bars"
              type="font-awesome-5"
              size={24}
              onPress={() => navigation.toggleDrawer()}
            />
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 28,
                marginLeft: 20,
                color: "black",
              }}
            >
              Assign Video
            </Text>
          </View>
          {console.log(1, videoData)}
          <Notification navigation={navigation} />
        </View>
        <View
          style={{
            maxWidth: ScreenWidth,
            marginRight: 10,
          }}
        >
          <FlatList numColumns={1} data={videoData} renderItem={renderItem_} />
        </View>
        {videoData?.length == 0 && (
          <Text
            style={{
              fontSize: RFValue(12, 816),
              backgroundColor: "#fff",
              width: "100%",
              paddingVertical: RFValue(10, 816),
              textAlign: "center",
              borderRadius: RFValue(8, 816),
              marginTop: 10,
            }}
          >
            No uploaded videos to assign
          </Text>
        )}
      </KeyboardAwareScrollView>

      {videoData.length > 0 && (
        <View
          style={{
            margin: 20,
            position: "absolute",
            bottom: 0,
            width: "90%",
            boxSizing: "border-box",
            boxShadow: "0px 0px 2px 5px black",
            elevation: 2,
          }}
        >
          <TouchableOpacity
            style={{
              padding: 15,
              backgroundColor: "#C19F1E",
              textAlign: "center",
              borderRadius: 20,
              boxShadow: "0px 0px 2px 5px black",
              elevation: 2,
            }}
            onPress={() => {
              navigation.navigate("SelectAthletesVideo", {
                videoData: videoData,
              });
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 17,
                fontFamily: "SF-Pro-Text-regular",

                color: "white",
              }}
            >
              Select Athletes
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default AssignVideo;
