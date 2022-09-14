import React, { useState, useEffect, useLayoutEffect } from "react";
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
  Linking,
  Dimensions,
  SafeAreaView,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { auth, db } from "../../utils/firebase";
import { useDispatch, useSelector } from "react-redux";
import Axios from "axios";
import {
  selectUser,
  setUserData,
  selectUserData,
  selectUserType,
  setTemperoryID,
} from "../../features/userSlice";
import Modal1 from "react-native-modal";
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
import { useFocusEffect } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import { PieChart } from "react-native-svg-charts";
import { Text as SvgText } from "react-native-svg";
import SearchableDropdown from "react-native-searchable-dropdown";
import moment from "moment";
import WorkoutCard from "../components/WorkoutCard";
import NutritionCard from "../components/NutritionCard";
import CalendarComponent from "../components/CalendarComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { StackedBarChart } from "react-native-chart-kit";
import ComplianceCard from "../components/ComplianceCard";
import Notification from "../components/Notification";

import CoachInfo from "../CoachInfo";
import { Modal as IsActiveModal } from "react-native-paper";
const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  container: {
    flex: 1,
    minHeight: ScreenHeight,
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
    width: ScreenWidth,
    height: ScreenHeight / 2.5,
    paddingBottom: ScreenHeight * 0.05,
  },
  body: {
    position: "absolute",
    right: RFValue(30, 816),
    bottom: ScreenHeight * 0.15,
  },
});

function CoachHomeScreen(props) {
  const user = useSelector(selectUser);
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const [athleteDetails, setAthleteDetails] = useState([]);
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [events, setEvents] = useState([]);
  const [requestDate, setRequestDate] = useState(formatDate());
  const [workouts, setWorkouts] = useState([]);
  const [nutrition, setNutrition] = useState([]);
  const [complianceCount, setComplianceCount] = useState(0);
  const [ncomplianceCount, setNComplianceCount] = useState(0);
  const [pcomplianceCount, setPComplianceCount] = useState(0);
  const [fcomplianceCount, setFComplianceCount] = useState(0);
  const [onboardModal, setOnboardModal] = useState(false);
  const [athleteSearch, setAthleteSearch] = useState("");
  const [searchedAthletes, setSearchedAthletes] = useState([]);
  const [AssignedVideos, setAssignedVideos] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [MeetType, setMeetType] = useState("gmeet");
  const [eventDate, setEventDate] = useState(new Date());
  const [eventTime, setEventTime] = useState(new Date());
  const [isSecret, setIsSecret] = useState(false);
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
  const checkForActivation = async () => {
    await db
      .collection("coaches")
      .doc(userData.id)
      .get()
      .then((doc) => {
        if (doc.data().active) {
          setIsActive(true);
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

  const data1 = [
    {
      key: 1,
      amount: 54,
      svg: { fill: "#ffe66d" },
    },
    {
      key: 2,
      amount: 30,
      svg: { fill: "#00b4c4" },
    },
    {
      key: 3,
      amount: 26,
      svg: { fill: "#ff6b6b" },
    },
  ];

  const Labels = ({ slices, height, width }) => {
    return slices.map((slice, index) => {
      const { labelCentroid, pieCentroid, data } = slice;
      return (
        <SvgText
          key={index}
          x={pieCentroid[0]}
          y={pieCentroid[1]}
          fill={"black"}
          textAnchor={"middle"}
          alignmentBaseline={"middle"}
          fontSize={17}
          stroke={"black"}
          strokeWidth={0.1}
          style={{ padding: RFValue(15, 816), backgroundColor: "white" }}
        >
          {data.amount}
        </SvgText>
      );
    });
  };

 



 


  useEffect(() => {
    db.collection("coaches")
      .where("email", "==", user)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          dispatch(
            setUserData({
              id: doc.id,
              data: doc.data(),
            })
          );
          let data = doc.data();
          loadOtherData(data);
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  }, [user, userData?.id, isFocused, requestDate]);

  const loadOtherData = (uData) => {
    if (userData) {
      const data = [];
      db.collection("athletes")
        .orderBy("name", "asc")
        .get()
        .then((snapshot) => {
          if (uData.listOfAthletes?.length) {
            snapshot.docs.forEach((athlete) => {
              if (
                athlete?.data()?.listOfCoaches &&
                athlete?.data()?.listOfCoaches?.length > 0
              ) {
                if (
                  [...uData.listOfAthletes, userData?.id].includes(
                    athlete.data().listOfCoaches[0]
                  )
                ) {
                  let currentID = athlete.id;
                  let appObj = { ...athlete.data(), ["id"]: currentID };
                  data.push(appObj);
                }
              }
            });
            setAthleteDetails(data);
          }
          //  else {
          //   snapshot.docs.forEach((athlete) => {
          //     if (userData?.data?.listOfAthletes?.includes(athlete.id)) {
          //       let currentID = athlete.id;
          //       let appObj = { ...athlete.data(), ["id"]: currentID };
          //       data.push(appObj);
          //     }
          //   });
          // }
          // setAthleteDetails(data);
        });

      db.collection("WorkoutVideo")
        .where("AssignedById", "==", userData?.id)
        .orderBy("timestamp", "desc")
        .onSnapshot(
          (snap) => {
            let data = [];

            snap.docs.forEach((s) => {
              if (s.data().selectedDays.includes(requestDate)) {
                data.push(s.data());
              }
            });
            setAssignedVideos(data.slice(0, 3));
          },
          (error) => {
            console.log("error in video", error);
          }
        );
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (user && userData?.data) {
        console.log(userData?.data?.onboardCoach);
        if (
          userData?.data?.onboardCoach == null ||
          userData?.data?.onboardCoach == undefined ||
          userData?.data?.onboardCoach
        ) {
          setOnboardModal(true);
        } else {
          setOnboardModal(false);
        }
      }
    }, [user, userData?.data?.onboardCoach, onboardModal])
  );

  useEffect(() => {
    const getData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token !== null) {
          if (userData?.data?.token || userData?.data?.token == "") {
          } else {
            db.collection("coaches").doc(userData?.id).update({
              token: token,
            });
          }
        }
      } catch (e) {
        console.log(e);
      }
    };
    getData();
  }, [user, userData?.id]);

 
  useEffect(() => {
    console.log("3");

    const data = [];
    athleteDetails?.map((item) =>
      userData?.data?.listOfAthletes?.map((athlete) =>
        athlete === item.id ? data.push(item) : null
      )
    );
    setData(data);
  }, [userData?.id, athleteDetails]);

  
  function formatSpecificDate(d) {
    var d = new Date(d),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  useEffect(() => {
    console.log("4");
    if (userData) {
      var unsub1 = db
        .collection("CoachWorkouts")
        .where("assignedById", "==", userData?.id)
        .where("saved", "==", false)
        .where("selectedDates", "array-contains", requestDate)
        .limit(3)
        .onSnapshot((snapshot) => {
          setWorkouts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });

      db.collection("CoachFood")
        .where("from_id", "==", userData?.id)
        .where("saved", "==", false)

        .limit(3)
        .onSnapshot((snapshot) => {
          const list1 = snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }));
          const list2 = [];
          list1.map((doc) => {
            for (let i = 0; i < doc.data.selectedAthletes.length; i++) {
              const element = doc.data.selectedAthletes[i];
              if (
                element.selectedDays.includes(formatSpecificDate(requestDate))
              ) {
                list2.push(doc);
                break;
              }
            }
          });
          setNutrition(list2);
        });
      // .catch((error) => {
      //   console.log("Error getting documents: ", error);
      // });

      return () => {
        unsub1();
      };
    }
  }, [userData?.id, requestDate]);

  useEffect(() => {
    if (athleteSearch == null || athleteSearch == "") {
      setSearchedAthletes(athleteDetails);
    } else {
      var temp = [];
      setSearchedAthletes(
        athleteDetails.filter((id) => {
          return id.name.toLowerCase().includes(athleteSearch.toLowerCase());
        })
      );
    }
  }, [athleteSearch]);

  React.useEffect(() => {
    setSearchedAthletes(athleteDetails);
  }, [athleteDetails]);

  useLayoutEffect(() => {
    if (userData?.data?.active != undefined) {
      setIsActive(userData?.data?.active);
    }
  }, [userData?.data?.active]);

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: RFValue(150, 816) }}
      >
        <View
          style={{
            padding: RFValue(10, 816),
            paddingTop: RFValue(20, 816),
            paddingBottom: RFValue(10, 816),
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon
              name="bars"
              type="font-awesome-5"
              size={24}
              onPress={() => props.navigation.toggleDrawer()}
            />
            <Text
              style={{
                fontSize: RFValue(22, 816),
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "700",
                color: "black",
                marginLeft: 20,
              }}
            >
              Hello, {userData?.data.name}
            </Text>
          </View>

          <Notification navigation={props.navigation} />
        </View>

        <View style={{ width: "100%" }}>
          <CalendarComponent
            requestDate={requestDate}
            setRequestDate={setRequestDate}
          />
        </View>

        <View
          style={{
            marginTop: RFValue(10, 816),
          }}
        >
          <View
            style={{
              marginTop: RFValue(20, 816),
            }}
          >
        

            <View style={{ marginTop: RFValue(20, 816) }}>
              <View
                style={{
                  flexDirection: "row",
                  marginHorizontal: RFValue(10, 816),
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    fontSize: RFValue(16, 816),
                    fontWeight: "700",
                    color: "black",
                  }}
                >
                  Messaging
                </Text>
              </View>
              <View
                style={{
                  marginTop: RFValue(10, 816),
                  marginHorizontal: RFValue(10, 816),
                  borderRadius: RFValue(8, 816),
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "#C19F1E",
                    marginRight: RFValue(10, 816),
                    borderRadius: 50,
                    height: RFValue(33, 816),
                    width: "40%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() =>
                    props.navigation.navigate("Messaging", {
                      screen: "ChatHomeScreen",
                    })
                  }
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: RFValue(14, 816),
                    }}
                  >
                    Open Messages
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={{
                    backgroundColor: "#C19F1E",
                    marginRight: RFValue(10, 816),
                    borderRadius: 50,
                    height: RFValue(33, 816),
                    width: "40%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() =>
                    props.navigation.navigate("LoginScreens")
                  }
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: RFValue(14, 816),
                    }}
                  >
                    Video Call
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

           

            <View style={{ marginTop: RFValue(30, 816) }}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginHorizontal: RFValue(10, 816),
                  width: "100%",
                }}
              >
                
              </View>

              {/* <ComplianceCard /> */}
            </View>

            <View style={{ marginTop: RFValue(30, 816) }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginHorizontal: RFValue(10, 816),
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: RFValue(16, 816),
                    fontWeight: "700",
                    color: "black",
                  }}
                >
                  Athletes
                </Text>
                <TouchableHighlight
                  style={{
                    borderRadius: RFValue(12, 816),
                    paddingHorizontal: RFValue(10, 816),
                  }}
                  onPress={() =>
                    props.navigation.navigate("Athletes", {
                      screen: "Athletes",
                    })
                  }
                  activeOpacity={0.6}
                  underlayColor="#DDDDDD"
                >
                  <Text style={{ fontSize: RFValue(14, 816), color: "black" }}>
                    View All
                  </Text>
                </TouchableHighlight>
              </View>
              <View
                style={{
                  marginHorizontal: RFValue(10, 816),
                  borderRadius: RFValue(8, 816),
                  marginTop: RFValue(10, 816),
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    backgroundColor: "white",
                    borderRadius: 6,
                    borderColor: "#DBE2EA",
                    alignItems: "center",
                    marginVertical: RFValue(10, 816),
                  }}
                >
                  {/*
                  <SafeAreaView style={{ flex: 1 }}>
                    <SearchableDropdown
                      onItemSelect={(item) => {
                        setSelectedAthlete(item);
                      }}
                                placeholderTextColor={"black"}
                      containerStyle={{ padding: 5 }}
                      textInputStyle={{
                        backgroundColor: "#fff",
                        marginLeft: 0,
                      }}
                      textInputProps={{
                        underlineColorAndroid: "transparent",
                        style: {
                          borderRadius:RFValue(5, 816),
                          backgroundColor: "#fff",
                          color: "black",
                          borderColor: "#DBE2EA",
                          paddingHorizontal:10
                        },
                      }}
                      itemStyle={{
                        padding:RFValue(10, 816),
                        marginTop: 2,
                        backgroundColor: "#FAF9F8",
                        borderColor: "#fff",
                        borderWidth: 1,
                      }}
                      itemTextStyle={{
                        color: "#222",
                      }}
                      itemsContainerStyle={{
                        maxHeight: RFValue(120, 816),
                        margin: 0,
                        padding: 0,
                      }}
                      items={athleteDetails}
                      listProps={{
                        nestedScrollEnabled: true,
                      }}
                      defaultIndex={2}
                      placeholder={
                        selectedAthlete
                          ? selectedAthlete.name
                          : "Enter Athlete Name"
                      }
                      resetValue={false}
                      underlineColorAndroid="transparent"
                    />
                    </SafeAreaView>*/}
                  <TextInput
                    value={athleteSearch}
                    onChangeText={(text) => setAthleteSearch(text)}
                    style={{
                      width: "100%",
                      padding: RFValue(10, 816),
                      paddingVertical: Platform.OS === "ios" ? 15 : 10,
                    }}
                    placeholder={"Search Athlete"}
                  />
                  {athleteSearch == "" && (
                    <View
                      style={{
                        position: "absolute",
                        right: 10,
                      }}
                    >
                      <Icon name="search" size={30} />
                    </View>
                  )}
                </View>
                {athleteSearch ? (
                  <KeyboardAwareScrollView
                    nestedScrollEnabled={true}
                    style={{
                      height:
                        athleteDetails.length > 4
                          ? RFValue(250, 816)
                          : athleteDetails.length * RFValue(80, 816),
                    }}
                    contentContainerStyle={{ paddingBottom: 20 }}
                  >
                    {searchedAthletes?.map((athlete, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={{
                          backgroundColor: "white",
                          borderRadius: RFValue(12, 816),
                          marginTop: RFValue(10, 816),
                          display: "flex",
                          height: RFValue(60, 816),
                          flexDirection: "row",
                          alignItems: "center",
                          paddingHorizontal: RFValue(20, 816),
                          justifyContent: "space-between",
                        }}
                        onPress={() => {
                          dispatch(setTemperoryID(athlete.id));
                          props.navigation.navigate("Profile");
                        }}
                      >
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Image
                            style={{
                              width: RFValue(40, 816),
                              height: RFValue(40, 816),
                              backgroundColor: "#C19F1E",
                              borderRadius: 60,
                              marginRight: RFValue(15, 816),
                            }}
                            source={{
                              uri: athlete?.imageUrl
                                ? athlete?.imageUrl
                                : "https://firebasestorage.googleapis.com/v0/b/jumpstartwithsudee-80502.appspot.com/o/userImage.jpeg?alt=media&token=a6756f49-9e4d-4cc8-89ea-0a97de7ad376",
                            }}
                          />
                          <View>
                            <Text
                              style={{
                                fontSize: RFValue(15, 816),
                                fontWeight: "700",
                              }}
                            >
                              {athlete.name}
                            </Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          style={{
                            marginRight: RFValue(10, 816),
                            width: 35,
                            height: 35,
                            borderRadius: 35,
                            backgroundColor: "#C19F1E",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          onPress={() =>
                            props.navigation.navigate("Chat", {
                              from_id: userData?.id,
                              to_id: athlete.id,
                              from_name: userData.data.name,
                              to_name: athlete.name,
                              type: "coach",
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
                  </KeyboardAwareScrollView>
                ) : (
                  <KeyboardAwareScrollView
                    nestedScrollEnabled={true}
                    style={{
                      height:
                        athleteDetails.length > 4
                          ? RFValue(290, 816)
                          : athleteDetails.length * RFValue(80, 816),
                    }}
                    contentContainerStyle={{ paddingBottom: 20 }}
                  >
                    {athleteDetails?.map((athlete, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={{
                          backgroundColor: "white",
                          height: RFValue(60, 816),
                          borderRadius: RFValue(12, 816),
                          marginTop: RFValue(10, 816),
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          paddingHorizontal: RFValue(20, 816),
                          justifyContent: "space-between",
                        }}
                        onPress={() => {
                          dispatch(setTemperoryID(athlete.id));
                          props.navigation.navigate("Profile");
                        }}
                      >
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Image
                            style={{
                              width: RFValue(40, 816),
                              height: RFValue(40, 816),
                              backgroundColor: "#C19F1E",
                              borderRadius: 60,
                              marginRight: RFValue(15, 816),
                            }}
                            source={{
                              uri: athlete?.imageUrl
                                ? athlete?.imageUrl
                                : "https://firebasestorage.googleapis.com/v0/b/jumpstartwithsudee-80502.appspot.com/o/userImage.jpeg?alt=media&token=a6756f49-9e4d-4cc8-89ea-0a97de7ad376",
                            }}
                          />
                          <View>
                            <Text
                              style={{
                                fontSize: RFValue(15, 816),
                                fontWeight: "700",
                              }}
                            >
                              {athlete.name}
                            </Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          style={{
                            marginRight: RFValue(10, 816),
                            width: 35,
                            height: 35,
                            borderRadius: 35,
                            backgroundColor: "#C19F1E",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          onPress={() =>
                            props.navigation.navigate("Chat", {
                              from_id: userData?.id,
                              to_id: athlete.id,
                              from_name: userData.data.name,
                              to_name: athlete.name,
                              type: "coach",
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
                  </KeyboardAwareScrollView>
                )}
              </View>
            </View>

            <View
              style={{
                marginTop: RFValue(20, 816),
                paddingHorizontal: RFValue(10, 816),
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: RFValue(16, 816),
                    fontWeight: "700",
                    color: "black",
                  }}
                >
                  Workouts
                </Text>
                <TouchableHighlight
                  style={{
                    borderRadius: RFValue(12, 816),
                    paddingHorizontal: 10,
                  }}
                  onPress={() =>
                    props.navigation.navigate("Workout", {
                      screen: "WorkoutList",
                    })
                  }
                  activeOpacity={0.6}
                  underlayColor="#DDDDDD"
                >
                  <Text style={{ fontSize: RFValue(14, 816), color: "black" }}>
                    View More
                  </Text>
                </TouchableHighlight>
              </View>

              <View
                style={{
                  marginVertical: RFValue(10, 816),
                  width: "100%",
                }}
              >
                {workouts.length > 0 ? (
                  workouts?.map((workout, idx) => (
                    <WorkoutCard
                      key={idx}
                      workouts={workouts}
                      item={workout}
                      idx={idx}
                      navigation={props.navigation}
                      type="non-editable"
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
                    There are no workouts assigned by you today.
                  </Text>
                )}
              </View>
            </View>

            <View
              style={{
                marginTop: RFValue(20, 816),
                width: "100%",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginHorizontal: RFValue(10, 816),
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: RFValue(16, 816),
                    fontWeight: "700",
                    color: "black",
                  }}
                >
                  Nutrition
                </Text>
                <TouchableHighlight
                  style={{
                    borderRadius: RFValue(12, 816),
                    paddingHorizontal: RFValue(10, 816),
                  }}
                  onPress={() =>
                    props.navigation.navigate("Nutrition", {
                      screen: "CoachNutrition",
                    })
                  }
                  activeOpacity={0.6}
                  underlayColor="#DDDDDD"
                >
                  <Text style={{ fontSize: RFValue(14, 816), color: "black" }}>
                    View More
                  </Text>
                </TouchableHighlight>
              </View>

              <View
                style={{
                  width: "100%",
                  paddingHorizontal: RFValue(10, 816),
                }}
              >
                {nutrition.length > 0 ? (
                  nutrition?.map((food, idx) => (
                    <NutritionCard
                      key={idx}
                      nutrition={nutrition}
                      food={food}
                      idx={idx}
                      navigation={props.navigation}
                      type="view"
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
                      marginTop: 10,
                    }}
                  >
                    There are no meal plans assigned by you today.
                  </Text>
                )}
              </View>
            </View>
                
                <View style={{
                  alignItems:'center',
                  marginTop:100
                }}>
                 <Text style={{
                  fontSize:23
                 }} > Crafted With ❤️</Text>
                 <Text>- by Ritik</Text>
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
                    props.navigation.navigate("Athletes", {
                      screen: "InviteAthlete",
                    });
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
                    Invite Athlete
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
                      name="user-plus"
                      type="font-awesome-5"
                      color="white"
                      size={20}
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
                    let nutrition = {
                      data: {
                        nutrition: {
                          plan: {
                            meal: "",
                            description: "",
                          },
                          nutritionName: "",
                        },
                      },
                    };
                    props.navigation.navigate("Nutrition", {
                      screen: "CoachAddMeal",
                      params: nutrition,
                    });
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
                    Create Nutrition Plan
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
                      size={20}
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
                    props.navigation.navigate("Workout", {
                      screen: "AddWorkout",
                    });
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
                    Create Workout
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
                      size={20}
                    />
                  </View>
                </TouchableOpacity>

                
                
              </View>

              <TouchableOpacity
                style={{
                  position: "absolute",
                  bottom: RFValue(42, 816),
                  right: RFValue(30, 816),
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
                onPress={() => setModal(false)}
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
        </Modal>
        <Modal1 isVisible={onboardModal} style={styles.modal}>
          <CoachInfo setOnboardModal={setOnboardModal} />
        </Modal1>
      </KeyboardAwareScrollView>
      {modal ? null : (
        <TouchableOpacity
          style={{
            position: "absolute",
            right: RFValue(30, 816),
            bottom: RFValue(100, 816),
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

export default CoachHomeScreen;
