import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  Dimensions,
  Modal,
  TouchableHighlight,
  Image,
  Linking,
  Platform,
} from "react-native";
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
import Modal1 from "react-native-modal";
import { Icon } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
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
import { auth, db } from "../firebase";
import { useFocusEffect } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import moment from "moment";
import Slider from "@react-native-community/slider";
import WorkoutCard from "./components/WorkoutCard";
import NutritionCard from "./components/NutritionCard";
import NutritionGoalProgress from "./components/NutritionGoalProgress";
import WaterCard from "./components/WaterCard";
import CalendarComponent from "./components/CalendarComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import sendPushNotification from "../screens/components/SendNotification";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import Notification from "./components/Notification";
import VerifyAthlete from "./VerifyAthlete";
import { URLSearchParams } from "@visto9259/urlsearchparams-react-native";
import OnboardingAthlete from "./OnboardingAthlete";
import Axios from "axios";
import { Modal as IsActiveModal } from "react-native-paper";
const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  container: {
    flex: 1,
    marginBottom: 0,
    minHeight: "100%",
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
});

function Home({ route, navigation }) {
  const [workouts, setWorkouts] = useState([]);
  const [requestDate, setRequestDate] = useState(formatDate());
  const user = useSelector(selectUser);
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const userVerified = useSelector(selectUserVerified);
  const [coachDetails, setCoachDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const dispatch = useDispatch();
  const [sleep, setSleep] = useState(6);
  const [modal, setModal] = useState(false);
  const [soreness, setSoreness] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const isFocused = useIsFocused();
  const [goals, setGoals] = useState([]);
  const [events, setEvents] = useState([]);
  const [nutrition, setNutrition] = useState([]);
  const [water, setWater] = useState(0);
  const [editable, setEditable] = useState(false);
  const [updatedSleep, setUpdatedSleep] = useState(false);
  const [updatedSoreness, setUpdatedSoreness] = useState(false);
  const [verifiedModal, setVerifiedModal] = useState(false);
  const [onboardModal, setOnboardModal] = useState(false);
  const [AssignedVideos, setAssignedVideos] = useState([]);
  const [isConnected, setIsConnected] = useState(true);
  const [isSecret, setIsSecret] = useState(false);
  const [temporary, setTemporary] = useState(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    global.user = userData;
  }, [userData]);


  const myFunction = async () => {
    db.collection("secrets")
      .doc(userData?.id)
      .get()
      .then(async (snap) => {
        if (snap.exists) {
          setIsSecret(true);
        }
      });
  };

  useEffect(() => {
    myFunction();
  }, [userData?.id]);



  

  function formatDate() {
    var d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async (remoteMessage) => {
  //     alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
  //   });

  //   return unsubscribe;
  // }, []);

  // useFocusEffect(
  //   useCallback(() => {
  //     const onBackPress = () => {
  //       return true;
  //     };

  //     BackHandler.addEventListener("hardwareBackPress", onBackPress);

  //     return () =>
  //       BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  //   }, [])
  // );

  const checkForActivation = async () => {
    if (userType == "athlete") {
      await db
        .collection("athletes")
        .doc(userData.id)
        .get()
        .then((doc) => {
          if (doc.data().active) {
            setIsActive(true);
          }
        });
    } else {
      await db
        .collection("coaches")
        .doc(userData.id)
        .get()
        .then((doc) => {
          if (doc.data().active) {
            setIsActive(true);
          }
        });
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (!userVerified) {
        if (
          userData?.data?.onboardAthlete == undefined ||
          userData?.data?.onboardAthlete == true
        ) {
          setTimeout(() => {
            setOnboardModal(true);
          }, 500);
        } else {
          setOnboardModal(false);
          setTimeout(() => {
            setVerifiedModal(true);
          }, 500);
        }
      }
    }, [userVerified, userData?.data?.onboardAthlete])
  );

  //use this useEffect to get the user details
  useEffect(() => {
    db.collection("athletes")
      .where("email", "==", user)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          setUserDetails({
            id: doc.id,
            data: doc.data(),
          });
          dispatch(setLoading(false));
          dispatch(
            setUserData({
              id: doc.id,
              data: doc.data(),
            })
          );
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });

    setSuccessMessage("");
  }, [user, requestDate, isFocused]);

  useEffect(() => {
    if (userData?.id) {
      db.collection("athletes")
        .doc(userData?.id)
        .get()
        .then((doc) => {
          if (doc.data()) {
            if (doc.data()?.metrics) {
              if (doc.data().metrics[requestDate]) {
                if (doc.data().metrics[requestDate]?.water) {
                  setWater(doc.data().metrics[requestDate]?.water);
                } else {
                  setWater(0);
                }

                if (doc.data().metrics[requestDate]?.sleep) {
                  setUpdatedSleep(true);
                  console.log(
                    "sleep : ",
                    doc.data().metrics[requestDate].sleep
                  );
                  setSleep(doc.data().metrics[requestDate].sleep);
                } else {
                  setSleep(0);
                  setUpdatedSleep(false);
                }
                if (doc.data().metrics[requestDate]?.soreness) {
                  setUpdatedSoreness(true);
                  console.log(
                    "sleep : ",
                    doc.data().metrics[requestDate].soreness
                  );
                  setSoreness(doc.data().metrics[requestDate].soreness);
                } else {
                  setSoreness("");
                  setUpdatedSoreness(false);
                }
              } else {
                setUpdatedSleep(false);
                setUpdatedSoreness(false);
                setSleep(0);
                setSoreness("");
                setWater(0);
              }
            }
          }
        });

      db.collection("WorkoutVideo")
        .where("AssignedToId", "array-contains", userData?.id)
        .orderBy("timestamp", "desc")
        .onSnapshot((snap) => {
          let data = [];

          snap.docs.forEach((s) => {
            if (s.data().selectedDays.includes(requestDate)) {
              data.push(s.data());
            }
          });
          setAssignedVideos(data.slice(0, 1));
        });
    }
  }, [userData?.id, requestDate, isFocused, userData]);

  useEffect(() => {
    if (userData && userData?.id) {
      const getData = async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          if (token !== null) {
            db.collection("athletes").doc(userData?.id).update({
              token: token,
            });
          }
        } catch (e) {
          console.log("1");
          console.log(e);
        }
      };
      getData();
    }
  }, [user, userData?.id]);

  useEffect(() => {
    if (userDetails) {
      var data = [];
      db.collection("coaches")
        .where("listOfAthletes", "array-contains", userDetails.id)
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
  }, [userDetails]);

  useEffect(() => {
    if (userData?.data?.goals) {
      var temp = [];
      var keys = userData.data.goals;
      var array = [...keys];
      if (array.length > 1) {
        array.sort(function (a, b) {
          return (
            new Date(
              a.date.seconds
                ? a.date.seconds * 1000
                : new Date(
                    a.date.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")
                  )
            ) -
            new Date(
              b.date.seconds
                ? b.date.seconds * 1000
                : new Date(
                    b.date.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")
                  )
            )
          );
        });
      }
      array.forEach((id) => {
        if (
          moment(new Date()).valueOf() <
          moment(
            id.date.seconds
              ? id.date.seconds * 1000
              : id.date.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")
          ).valueOf()
        ) {
          temp.push(
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: RFValue(15, 816),
                backgroundColor: "white",
                borderRadius: RFValue(10, 816),
                paddingLeft: RFValue(15, 816),
                width: "100%",
              }}
              key={id.date.seconds}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "65%",
                }}
              >
                <Text style={{ fontSize: RFValue(16, 816), color: "black" }}>
                  {id.name}
                </Text>
                <View
                  style={{
                    backgroundColor: "#707070",
                    height: RFValue(5, 816),
                    width: RFValue(5, 816),
                    borderRadius: 80,
                    marginLeft: RFValue(5, 816),
                    marginRight: RFValue(5, 816),
                  }}
                ></View>
                <Text style={{ fontSize: RFValue(14, 816), color: "black" }}>
                  {moment(
                    id.date.seconds
                      ? id.date.seconds * 1000
                      : new Date(
                          id.date.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")
                        )
                  ).format("LL")}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "35%",
                  justifyContent: "flex-end",
                }}
              >
                <Text style={{ marginRight: RFValue(10, 816), color: "black" }}>
                  Due in
                </Text>
                <View
                  style={{
                    backgroundColor: "#C19F1E",
                    padding: RFValue(10, 816),
                    borderRadius: RFValue(10, 816),
                    minWidth: RFValue(70, 816),
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      fontSize: RFValue(16, 816),
                      alignSelf: "center",
                    }}
                  >
                    {
                      moment(
                        id.date.seconds
                          ? id.date.seconds * 1000
                          : new Date(
                              id.date.replace(
                                /(\d{2})-(\d{2})-(\d{4})/,
                                "$2/$1/$3"
                              )
                            )
                      )
                        .endOf("day")
                        .fromNow()
                        .slice(3)
                        .split(" ")[0]
                    }
                  </Text>
                  <Text
                    style={{
                      color: "black",
                      fontSize: RFValue(16, 816),
                      alignSelf: "center",
                    }}
                  >
                    {
                      moment(
                        id.date.seconds
                          ? id.date.seconds * 1000
                          : new Date(
                              id.date.replace(
                                /(\d{2})-(\d{2})-(\d{4})/,
                                "$2/$1/$3"
                              )
                            )
                      )
                        .endOf("day")
                        .fromNow()
                        .slice(3)
                        .split(" ")[1]
                    }
                  </Text>
                </View>
              </View>
            </View>
          );
        }
      });
      if (temp.length > 2) temp = temp.slice(0, 2);

      setGoals(temp);
    }
  }, [userData?.data?.goals]);


  useEffect(() => {
    if (userDetails) {
      var unsub = db
        .collection("workouts")
        .where("assignedToId", "==", userDetails?.id)
        .where("date", "==", requestDate)
        .where("completed", "==", false)
        .limit(3)
        .onSnapshot((snapshot) => {
          setWorkouts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });
      console.log(requestDate);

      db.collection("Food")
        .where("assignedTo_id", "==", userDetails.id)
        .where("selectedDays", "array-contains", requestDate)
        .onSnapshot((snapshot) => {
          setNutrition(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });

      return unsub;
    }
  }, [userDetails, requestDate]);
  useLayoutEffect(() => {
    if (userData?.data?.active != undefined) {
      setIsActive(userData?.data?.active);
    }
  }, [userData?.data?.active]);

  const updateSleepAndSore = (sleepData, soreData) => {
    setSleep(sleepData);
    setSoreness(soreData);

    console.log("updateSleepAndSore,sleepData", sleepData);

    db.collection("athletes")
      .doc(userData?.id)
      .get()
      .then(function (snap) {
        let temp = snap.data().metrics;
        console.log("temp", temp);

        if (temp[requestDate]) {
          let t = { ...temp[requestDate] };
          t.sleep = sleepData;
          t.soreness = soreData;

          temp[requestDate] = t;
        } else {
          temp[requestDate] = {
            sleep: sleepData,
            soreness: soreData,
          };
        }
        console.log("updateSleepAndSore", temp);
        db.collection("athletes").doc(userData?.id).update({
          metrics: temp,
        });
      });
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: RFValue(160, 816),
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            marginTop: RFValue(25, 816),
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: RFValue(15, 816),
            }}
          >
            <Icon
              name="bars"
              type="font-awesome-5"
              size={24}
              onPress={() => navigation.toggleDrawer()}
            />
            <Text
              style={{
                fontSize: RFValue(22, 816),
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "700",
                textAlign: "center",
                color: "black",
                marginLeft: RFValue(15, 816),
              }}
            >
              Hello, {userData?.data.name}
            </Text>
          </View>

          <Notification navigation={navigation} />
        </View>

        <View style={styles.calendarContainer}>
          <CalendarComponent
            requestDate={requestDate}
            setRequestDate={setRequestDate}
          />
        </View>

        <View
          style={{
            marginTop: RFValue(120, 816),
            flex: 1,
          }}
        >
          

          <KeyboardAwareScrollView
            contentContainerStyle={{ marginTop: RFValue(10, 816) }}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: RFValue(16, 816),
                  fontWeight: "bold",
                  marginLeft: RFValue(10, 816),
                  color: "black",
                }}
              >
                Sleep
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "white",
                paddingTop: RFValue(15, 816),
                marginTop: RFValue(10, 816),
                borderRadius: RFValue(20, 816),
                marginHorizontal: RFValue(10, 816),
              }}
            >
              <View>
                <View
                  style={{
                    flex: 1,
                    width: ScreenWidth - 30,
                    alignItems: "stretch",
                    justifyContent: "center",
                    marginLeft: RFValue(15, 816),
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: RFValue(16, 816),
                          marginLeft: RFValue(10, 816),
                          marginBottom: RFValue(10, 816),
                        }}
                      >
                        Add Last Nights Sleep
                      </Text>
                      {updatedSleep && (
                        <TouchableOpacity
                          style={{ width: 40, height: 25 }}
                          onPress={() => setEditable(true)}
                        >
                          <Image
                            style={{ width: 30, height: RFValue(15, 816) }}
                            source={require("../assets/Controls-Checkbox-Checked2x.png")}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                    {/* {editable === false ? (
                      <TouchableOpacity
                        style={{ marginRight: RFValue(20, 816) }}
                        onPress={() => setEditable(true)}
                      >
                        <Image source={require("../assets/edit.png")} />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={{ marginRight: RFValue(20, 816) }}
                        onPress={() => {
                          let temp = { ...userData?.data?.metrics };

                          if (temp[requestDate]) {
                            console.log("If part ", temp[requestDate]);
                            let t = { ...temp[requestDate] };
                            t.sleep = sleep;
                            t.soreness = soreness;
                            temp[requestDate] = t;
                          } else {
                            temp[requestDate] = {
                              sleep: sleep,
                              soreness: soreness,
                            };
                            console.log("Temp in else part", temp[requestDate]);
                          }

                          setTemporary(temp);
                          db.collection("athletes")
                            .doc(userData?.id)
                            .update({
                              metrics: temp,
                            })
                            .then((docRef) => {
                              console.log(
                                "Document updated successfully! ",
                                docRef
                              );
                              setEditable(false);
                              if (sleep) {
                                setUpdatedSleep(true);
                              }
                              if (soreness) {
                                setUpdatedSoreness(true);
                              }
                            });
                        }}
                      >
                        <Image source={require("../assets/tick.png")} />
                      </TouchableOpacity>
                    )} */}
                  </View>

                  <Slider
                    style={{
                      width: RFValue(300, 816),
                      height: RFValue(20, 816),
                      borderRadius: 50,
                    }}
                    minimumValue={0}
                    maximumValue={12}
                    thumbTintColor="#ffe486"
                    minimumTrackTintColor="black"
                    step={0.25}
                    value={sleep}
                    onValueChange={(value) => {
                      updateSleepAndSore(value, soreness);
                    }}
                    trackStyle={{
                      width: RFValue(20, 816),
                      height: RFValue(10, 816),
                      backgroundColor: "transparent",
                      color: "black",
                    }}
                    animationType="timing"
                    animateTransitions={true}
                    // disabled={!editable}
                  />

                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: RFValue(20, 816),
                        marginVertical: RFValue(7, 816),
                        marginLeft: RFValue(10, 816),
                      }}
                    >
                      {requestDate.split('-').reverse().join('-')}
                    </Text>
                    <Text
                      style={{
                        fontSize: RFValue(12, 816),
                        marginVertical: RFValue(7, 816),
                        fontWeight: "bold",
                        marginLeft: RFValue(10, 816),
                      }}
                    >
                      {sleep} hrs
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flex: 1,
                    width: "100%",
                    justifyContent: "center",
                    marginTop: RFValue(20, 816),
                    marginLeft: RFValue(10, 816),
                    marginRight: RFValue(10, 816),
                    alignSelf: "center",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: RFValue(14, 816),
                        marginBottom: RFValue(7, 816),
                        marginLeft: RFValue(20, 816),
                      }}
                    >
                      How Sore do you feel?
                    </Text>
                    {updatedSoreness && (
                      <TouchableOpacity
                        style={{ width: 40, height: 25 }}
                        onPress={() => setEditable(true)}
                      >
                        <Image
                          style={{ width: 30, height: RFValue(15, 816) }}
                          source={require("../assets/Controls-Checkbox-Checked2x.png")}
                        />
                      </TouchableOpacity>
                    )}
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: RFValue(10, 816),
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "33%",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          updateSleepAndSore(sleep, "very-sore");
                        }}
                      >
                        <Icon
                          name="tired"
                          type="font-awesome-5"
                          color={soreness === "very-sore" ? "red" : "black"}
                          size={RFValue(40, 816)}
                          solid
                        />
                      </TouchableOpacity>
                      <Text style={{ fontSize: 14, marginVertical: 7 }}>
                        Very Sore
                      </Text>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "33%",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          updateSleepAndSore(sleep, "moderately-sore");
                        }}
                      >
                        <Icon
                          name="meh"
                          type="font-awesome-5"
                          color={
                            soreness === "moderately-sore" ? "#f5dd4b" : "black"
                          }
                          size={RFValue(40, 816)}
                          solid
                        />
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontSize: RFValue(14, 816),
                          marginVertical: RFValue(7, 816),
                        }}
                      >
                        Moderately Sore
                      </Text>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "33%",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          updateSleepAndSore(sleep, "not-sore");
                        }}
                      >
                        <Icon
                          name="laugh-beam"
                          type="font-awesome-5"
                          color={soreness === "not-sore" ? "green" : "black"}
                          size={RFValue(40, 816)}
                          solid
                        />
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontSize: RFValue(14, 816),
                          marginVertical: RFValue(7, 816),
                        }}
                      >
                        Not Sore
                      </Text>
                    </View>
                  </View>
                </View>

                {successMessage !== null ? (
                  <Text
                    style={{
                      color: "lightgreen",
                      marginTop: -RFValue(20, 816),
                      marginBottom: RFValue(10, 816),
                      textAlign: "center",
                    }}
                  >
                    {successMessage}
                  </Text>
                ) : null}
              </View>
            </View>
          </KeyboardAwareScrollView>

          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              marginTop: RFValue(20, 816),
              paddingHorizontal: RFValue(5, 816),
              width: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: RFValue(5, 816),
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: RFValue(16, 816),
                  fontWeight: "700",
                  left: 0,
                  color: "black",
                }}
              >
                Workouts
              </Text>
              <TouchableHighlight
                style={{
                  top: 0,
                  paddingVertical: RFValue(5, 816),
                  borderRadius: RFValue(12, 816),
                }}
                onPress={() =>
                  navigation.navigate("Workout", {
                    screen: "AthleteWorkoutList",
                  })
                }
                activeOpacity={0.6}
                underlayColor="#DDDDDD"
              >
                <Text style={{ fontSize: RFValue(10, 816) }}>View More</Text>
              </TouchableHighlight>
            </View>

            <View
              style={{
                alignItems: "center",
                width: "100%",
                marginBottom: RFValue(10, 816),
              }}
            >
              {workouts.length > 0 ? (
                workouts?.map((workout, idx) => (
                  <WorkoutCard
                    key={idx}
                    workouts={workouts}
                    item={workout}
                    idx={idx}
                    navigation={navigation}
                  />
                ))
              ) : (
                <Text
                  style={{
                    fontSize: RFValue(12, 816),
                    backgroundColor: "#fff",
                    width: ScreenWidth - RFValue(20, 816),
                    paddingVertical: RFValue(10, 816),
                    textAlign: "center",
                    borderRadius: RFValue(8, 816),
                  }}
                >
                  There are no workouts for now
                </Text>
              )}
            </View>

           
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                paddingHorizontal: RFValue(5, 816),
              }}
            >
              <Text
                style={{
                  fontSize: RFValue(16, 816),
                  fontWeight: "700",
                  left: 0,
                  color: "black",
                }}
              >
                Nutrition
              </Text>
              <TouchableHighlight
                style={{
                  paddingVertical: RFValue(5, 816),
                  borderRadius: RFValue(12, 816),
                }}
                onPress={() => navigation.navigate("Nutrition")}
                activeOpacity={0.6}
                underlayColor="#DDDDDD"
              >
                <Text style={{ fontSize: RFValue(10, 816) }}>View More</Text>
              </TouchableHighlight>
            </View>

            <View
              style={{
                marginVertical: RFValue(10, 816),
                display: "flex",
                alignItems: "center",
                width: "100%",
                paddingHorizontal: RFValue(5, 816),
              }}
            >
              <NutritionGoalProgress
                navigation={navigation}
                requestDate={requestDate}
              />
              <WaterCard
                date={requestDate}
                water={water}
                setWater={setWater}
                temperoryData={temporary}
              />
              <View
                style={{
                  width: "100%",
                  borderRadius: RFValue(8, 816),
                }}
              >
                <Text
                  style={{
                    marginTop: RFValue(10, 816),
                    fontSize: RFValue(16, 816),
                    marginBottom: RFValue(10, 816),
                    color: "black",
                    fontWeight: "bold",
                    width: "100%",
                  }}
                >
                  Today's Diet
                </Text>
              </View>
              {nutrition.length > 0 ? (
                nutrition?.map((food, idx) => (
                  <NutritionCard
                    key={idx}
                    nutrition={nutrition}
                    food={food}
                    idx={idx}
                    navigation={navigation}
                    selecteddate={requestDate}
                  />
                ))
              ) : (
                <Text
                  style={{
                    fontSize: RFValue(12, 816),
                    backgroundColor: "#fff",
                    width: "100%",
                    paddingVertical: RFValue(10, 816),
                    textAlign: "center",
                    borderRadius: RFValue(8, 816),
                  }}
                >
                  There are no assigned nutrition for now
                </Text>
              )}
            </View>
          </View>

          

          <View
            style={{
              marginHorizontal: 0,
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
                    onPress={() =>
                      navigation.navigate("Coaches", {
                        coachData: coach,
                      })
                    }
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
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
                          {coach.CoachType}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={{
                        marginRight: RFValue(20, 816),
                        width: 35,
                        height: 35,
                        borderRadius: 35,
                        backgroundColor: "#C19F1E",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={() =>
                        navigation.navigate("Chat", {
                          from_id: userData?.id,
                          to_id: coach.id,
                          from_name: userData.data.name,
                          to_name: coach.name,
                        })
                      }
                    >
                      <Icon
                        name="message"
                        type="material"
                        size={24}
                        color="white"
                        style={{ width: RFValue(40, 816) }}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
        <Modal animationType="slide" transparent={true} visible={modal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.body}>
                <TouchableOpacity
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    marginBottom: RFValue(10, 816),
                  }}
                  onPress={() => {
                    setModal(false);
                    navigation.navigate("Reports");
                  }}
                >
                  <Text
                    style={{
                      fontSize: RFValue(16, 816),
                      color: "white",
                      textAlign: "right",
                      marginRight: RFValue(10, 816),
                    }}
                  >
                    View Reports
                  </Text>
                  <View
                    style={{
                      backgroundColor: "#C19F1E",
                      borderRadius: 100,
                      padding: RFValue(10, 816),
                      width: RFValue(50, 816),
                      height: RFValue(50, 816),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon
                      name="file"
                      type="font-awesome-5"
                      color="white"
                      size={RFValue(20, 816)}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    marginBottom: RFValue(10, 816),
                  }}
                  onPress={() => {
                    setModal(false);
                    navigation.navigate("LogWeight");
                  }}
                >
                  <Text
                    style={{
                      fontSize: RFValue(16, 816),
                      color: "#fff",
                      textAlign: "right",
                      marginRight: RFValue(10, 816),
                    }}
                  >
                    Log Weight
                  </Text>
                  <View
                    style={{
                      backgroundColor: "#C19F1E",
                      borderRadius: 100,
                      padding: RFValue(10, 816),
                      width: RFValue(50, 816),
                      height: RFValue(50, 816),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon
                      name="tachometer-alt"
                      type="font-awesome-5"
                      color="white"
                      size={RFValue(20, 816)}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    marginBottom: RFValue(10, 816),
                  }}
                  onPress={() => {
                    setModal(false);
                    navigation.navigate("Nutrition", { screen: "AddMeal" });
                  }}
                >
                  <Text
                    style={{
                      fontSize: RFValue(16, 816),
                      color: "#fff",
                      textAlign: "right",
                      marginRight: RFValue(10, 816),
                    }}
                  >
                    Add Meal
                  </Text>
                  <View
                    style={{
                      backgroundColor: "#C19F1E",
                      borderRadius: 100,
                      padding: RFValue(10, 816),
                      width: RFValue(50, 816),
                      height: RFValue(50, 816),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon
                      name="hamburger"
                      type="font-awesome-5"
                      color="white"
                      size={RFValue(20, 816)}
                    />
                  </View>
                </TouchableOpacity>


                <TouchableOpacity
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    marginBottom: RFValue(10, 816),
                  }}
                  onPress={() => {
                    setModal(false);
                    navigation.navigate("Workout", { screen: "Workout" });
                  }}
                >
                  <Text
                    style={{
                      fontSize: RFValue(16, 816),
                      color: "#fff",
                      marginRight: RFValue(10, 816),
                      textAlign: "right",
                    }}
                  >
                    Add Workout
                  </Text>
                  <View
                    style={{
                      backgroundColor: "#C19F1E",
                      borderRadius: 100,
                      padding: RFValue(10, 816),
                      width: RFValue(50, 816),
                      height: RFValue(50, 816),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon
                      name="dumbbell"
                      type="font-awesome-5"
                      color="white"
                      size={RFValue(20, 816)}
                    />
                  </View>
                </TouchableOpacity>
                

                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    marginTop: 50,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#C19F1E",
                      borderRadius: 100,
                      padding: RFValue(10, 816),
                      width: RFValue(60, 816),
                      height: RFValue(60, 816),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onPress={() => {
                      setModal(false);
                    }}
                  >
                    <Icon
                      name="times"
                      type="font-awesome-5"
                      color="white"
                      size={RFValue(20, 816)}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        <Modal1 isVisible={verifiedModal} style={styles.modal}>
          <VerifyAthlete
            setVerifiedModal={setVerifiedModal}
            navigation={navigation}
          />
        </Modal1>
        <Modal1 isVisible={onboardModal} style={styles.modal}>
          <OnboardingAthlete
            setOnboardModal={setOnboardModal}
            navigation={navigation}
            setVerifiedModal={setVerifiedModal}
          />
        </Modal1>
      </KeyboardAwareScrollView>
      {modal || verifiedModal ? null : (
        <TouchableOpacity
          style={{
            position: "absolute",
            right: RFValue(30, 816),
            bottom: RFValue(60, 816),
            zIndex: 1,
            backgroundColor: "#C19F1E",
            borderRadius: 100,
            padding: RFValue(10, 816),
            width: RFValue(60, 816),
            height: RFValue(60, 816),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => setModal(true)}
        >
          <Icon name="plus" type="font-awesome-5" color="white" size={20} />
        </TouchableOpacity>
      )}
      <IsActiveModal
        visible={!isActive}
        onDismiss={() => {}}
        contentContainerStyle={{
          backgroundColor: "white",
          padding: 20,
          margin: 20,
        }}
      >
        <Text style={{ fontSize: 20, marginBottom: 10 }}>
          Hello {userData?.data?.name},{" "}
        </Text>
        <Text>Your account has been deactivated. </Text>
        <Text>Please contact administrator for further details.</Text>
        <TouchableOpacity
          onPress={checkForActivation}
          style={{
            marginTop: 10,
            alignSelf: "flex-end",
            borderColor: "#C19F1E",
            padding: 5,
            borderWidth: 1,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 5,
            backgroundColor: "#C19F1E",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Refresh</Text>
        </TouchableOpacity>
      </IsActiveModal>
    </View>
  );
}

export default Home;
