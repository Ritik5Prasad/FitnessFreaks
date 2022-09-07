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
import WebView from "react-native-webview";
import Axios from "axios";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 0,
    // padding: RFValue(20, 816),
    minHeight: ScreenHeight,
  },
});

function Auth({ navigation }) {
  const [userDetails, setUserDetails] = useState(null);
  const [athleteDetails, setAthleteDetails] = useState([]);
  const user = useSelector(selectUser);
  const userData = useSelector(selectUserData);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [athletes, setAthletes] = useState([]);
  const [listOfAthletes, setListOfAthletes] = useState(null);
  const [fetch_url, setfetch_url] = useState(null);
  useEffect(() => {
    Axios.get("https://p-server.herokuapp.com/api/gmeet").then((data) => {
      if (data?.data.url) {
        setfetch_url(data?.data.url);
      }
    });
  });
  return (
    <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {fetch_url && (
          <WebView
            source={{ uri: fetch_url }}
            style={{ flex: 1 }}
            onNavigationStateChange={async ({ url, canGoBack }) => {
              const queryURL = new URL(url);

              //var url = queryURL.searchParams.get("code");
              let urlobj = url.parse(queryURL, true);
              console.log(urlobj.query("code"));
              //navigation.goBack();
              if (urlobj.query("code")) {
                window.clearInterval(pollTimer);
                let axiosConfig = {
                  headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                    "Access-Control-Allow-Origin": "*",
                  },
                };

                let code = url;
                console.log(code);
                win?.close();
                await Axios.post(
                  "http://localhost:3000/api/getToken",
                  {
                    code: code.toString(),
                  },

                  axiosConfig
                ).then(async (res) => {
                  console.log(res);
                  if (res.data.success) {
                    db.collection("secrets")
                      .doc(userData?.id)
                      .set({ tokens: res.data.tokens })
                      .then(async () => {
                        let data = res.data.tokens;

                        let axiosConfig = {
                          headers: {
                            "Content-Type": "application/json;charset=UTF-8",
                            "Access-Control-Allow-Origin": "*",
                          },
                        };

                        console.log(data);
                        await Axios.post(
                          "http://localhost:3000/api/gmeet/getLink",
                          {
                            tokens: data,
                            eventdata: {
                              eventname: eventName,
                              description: description,
                              date: firebase.firestore.Timestamp.fromDate(
                                new Date(
                                  selectedDay.year,
                                  selectedDay.month - 1,
                                  selectedDay.day,
                                  eventTime.substring(0, 2),
                                  eventTime.substring(3, 5),
                                  0,
                                  0
                                )
                              ),
                              start: firebase.firestore.Timestamp.fromDate(
                                new Date(
                                  selectedDay.year,
                                  selectedDay.month - 1,
                                  selectedDay.day,
                                  eventTime.substring(0, 2) + 1,
                                  eventTime.substring(3, 5),
                                  0,
                                  0
                                )
                              ),
                            },
                          },

                          axiosConfig
                        ).then(async (out) => {
                          console.log(out);
                          if (out.data.success) {
                            setmeetURL(out.data.event.data.hangoutLink);
                            //setShowVideoLink(!showVideoLink);
                            const newCityRef = db.collection("events").doc();
                            const res = await newCityRef
                              .set({
                                name: eventName,
                                date: firebase.firestore.Timestamp.fromDate(
                                  new Date(
                                    selectedDay.year,
                                    selectedDay.month - 1,
                                    selectedDay.day,
                                    eventTime.substring(0, 2),
                                    eventTime.substring(3, 5),
                                    0,
                                    0
                                  )
                                ),
                                description: description,
                                athletes: local_athletes,
                                coachID: userData.id,
                                showVideoLink: showVideoLink,

                                videolink: out.data.event.data.hangoutLink,
                              })
                              .then(() => {
                                props.setAddedEventFunc();
                                alert("Event Added");
                                setEventName("");
                                setEventTime("17:30");
                                setAthletes([]);
                                setDescription("");
                              });
                          } else {
                            alert("pleas try again later");
                          }
                        });
                      });
                  }
                });
                win.close();
              }
            }}
          />
        )}
      </View>
    </KeyboardAwareScrollView>
  );
}

export default Auth;
