import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  SafeAreaView,
  TextInput,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import RNPickerSelect from "react-native-picker-select";
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
import { db } from "../../utils/firebase";
import firebase from "firebase";
import { useDispatch, useSelector } from "react-redux";
import { selectUserData, selectUserType } from "../../features/userSlice";
import {
  getExerciseList,
  getFirebaseExerciseList,
  setExerciseList,
  setFirebaseExerciseList,
} from "../../features/foodSlice";
import { Icon } from "react-native-elements";
import SearchableDropdown from "react-native-searchable-dropdown";
import WebView from "react-native-webview";
import triggerNotification from "../../utils/sendPushNotification";
import Axios from "axios";
import sendPushNotification from "../../utils/sendPushNotification";
import { StackActions, useIsFocused } from "@react-navigation/native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import moment from "moment";
import Notification from "../components/Notification";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ActivityIndicator } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3",
    alignItems: "center",
    marginBottom: 0,
    paddingTop: RFValue(20, 816),
    height: ScreenHeight,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: ScreenWidth,
    minHeight: ScreenHeight / 1.8,
    paddingBottom: ScreenHeight * 0.05,
    paddingTop: RFValue(50, 816),
  },
});

const AssignWorkout = ({ route, navigation }) => {
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);

  const exercisesList = useSelector(getExerciseList);
  const firebaseExercisesList = useSelector(getFirebaseExerciseList);

  const dispatch = useDispatch();
  const [listOfAthletes, setListOfAthletes] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [selectedAthletes, setSelectedAthletes] = useState([]);
  const [currentStartWeek, setCurrentStartWeek] = useState(null);
  const [currentEndWeek, setCurrentEndWeek] = useState(null);
  const [cardio, setCardio] = useState(false);
  const [feedback, setFeedback] = useState("");

  const [specificDates, setSpecificDates] = useState([]);
  const [selectedWorkoutIndex, setSelectedWorkoutIndex] = useState(0);
  const [selectedWorkoutEdit, setSelectedWorkoutEdit] = useState("");
  const [group, setGroup] = useState([
    {
      exercises: [{}],
      groupName: "Workout",
    },
  ]);
  const [workout, setWorkout] = useState(null);
  const [coachDetails, setCoachDetails] = useState([]);
  const [workoutVideoUrl, setWorkoutVideoUrl] = useState("");
  const [modal, setModal] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [type, setType] = useState("");
  const [exercises, setExercises] = useState([]);
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);

  var ID = function () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return "_" + Math.random().toString(36).substr(2, 9);
  };

  useFocusEffect(
    React.useCallback(() => {
      var tmpExercisesList = exercisesList ? exercisesList : [];
      var tmpFirebaseExercisesList = firebaseExercisesList
        ? firebaseExercisesList
        : [];

      //Combine api and firebase data
      var tmpMixList = tmpExercisesList.concat(tmpFirebaseExercisesList);
      const tmpFilterList = tmpMixList?.map((item, idx) => ({
        ...item,
        name: item.workoutName,
        value: item._id,
        label: item.workoutName,
      }));
      setExercises(tmpFilterList);
      if (tmpFilterList?.length > 0) {
        setIsLoading(false);
      }

      //Get equipment data from list
      var tmpListOfEquipment = [];
      tmpExercisesList.map((item, idx) => {
        tmpListOfEquipment.push({ id: ID(), name: item.equipment });
      });

      tmpListOfEquipment = tmpListOfEquipment.filter(
        (thing, index, self) =>
          index === self.findIndex((t) => t.name === thing.name)
      );
      // setListOfEquipments(tmpListOfEquipment);

      getExerciseAndStore();
    }, [])
  );

  const getExerciseAndStore = () => {
    return new Promise((resolve, reject) => {
      fetch("https://rongoeirnet.herokuapp.com/getexercise")
        .then((response) => response.json())
        .then((responseJson) => {
          // console.log("getExerciseAndStore", responseJson);

          dispatch(setExerciseList(responseJson.data));
          var firebaseList = [];
          db.collection("coaches")
            .doc(userData?.id)
            .collection("ownWorkout")
            .get()
            .then((doc) => {
              doc.forEach((w) => {
                let tmp = w.data();
                tmp["_id"] = w.id;
                firebaseList.push(tmp);
              });
              // console.log("firebaseList", firebaseList);
              dispatch(setFirebaseExerciseList(firebaseList));
              resolve();
            })
            .catch((error) => {
              console.log("Firebase", error);
              reject();
            });
        })
        .catch((error) => {
          console.log("API", error);
          reject();
        });
    });
  };

  useEffect(() => {
    if (workoutVideoUrl) {
      setVideoLoading(false);
    }
  }, [workoutVideoUrl]);

  useEffect(() => {
    if (route.params?.assignType) {
      setType(route.params?.assignType);
    }
  }, [route.params?.assignType]);

  useEffect(() => {
    if (
      route.params?.athlete_id &&
      route.params?.workout?.data?.selectedAthletes
    ) {
      let tmp = [];
      let selectedAthlete = route.params?.workout?.data?.selectedAthletes.find(
        (x) => x.id === route.params?.athlete_id
      );
      tmp.push(selectedAthlete);
      setSelectedAthletes(tmp);
    }
  }, [route.params?.athlete_id]);

  useEffect(() => {
    if (route.params?.workout) {
      setWorkout(route.params?.workout);
      console.log("gagan");
      console.log(route.params?.workout?.data?.preWorkout);
      if (
        route.params?.workout?.data?.preWorkout?.selectedExercises?.length > 0
      ) {
        setGroup([
          {
            exercises:
              route.params?.workout?.data?.preWorkout?.selectedExercises,
          },
        ]);
      }
      if (route.params?.workout?.data?.preWorkout?.group) {
        setGroup(route.params?.workout?.data?.preWorkout?.group);
      }

      if (
        route.params?.workout?.data?.selectedAthletes &&
        !route.params?.athlete_id
      ) {
        setSelectedAthletes(route.params?.workout?.data?.selectedAthletes);
      }
    }
  }, [route.params?.workout]);

  useEffect(() => {
    if (group && workout) {
      let temp = { ...workout };
      temp.data.preWorkout.group = group;
      setWorkout(temp);
    }
  }, [group]);

  useEffect(() => {
    if (route.params?.workout && userType === "athlete") {
      db.collection("coaches")
        .doc(route.params?.workout?.data?.assignedById)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setCoachDetails({ id: doc.id, data: doc.data() });
          } else {
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    }
  }, [route.params?.workout]);

  useEffect(() => {
    if (type === "non-editable" && route.params?.workout) {
      var minDate = route.params?.workout?.data?.selectedDates[0];
      var curr = new Date(minDate); // get current date
      var first = curr.getDate() - curr.getDay(); // First day is the  day of the month - the day of the week \

      var firstday = new Date(curr.setDate(first)).toUTCString();
      var lastday = new Date(curr.setDate(curr.getDate() + 6)).toUTCString();

      setCurrentStartWeek(formatSpecificDate(firstday));
      setCurrentEndWeek(formatSpecificDate(lastday));
    } else {
      var curr = new Date(); // get current date
      var first = curr.getDate() - curr.getDay(); // First day is the  day of the month - the day of the week \

      var firstday = new Date(curr.setDate(first)).toUTCString();
      var lastday = new Date(curr.setDate(curr.getDate() + 6)).toUTCString();

      setCurrentStartWeek(formatSpecificDate(firstday));
      setCurrentEndWeek(formatSpecificDate(lastday));
    }
  }, [type, isFocused, route.params?.workout]);

  function incr_date(date_str) {
    var parts = date_str.split("-");
    var dt = new Date(
      parseInt(parts[0], 10), // year
      parseInt(parts[1], 10) - 1, // month (starts with 0)
      parseInt(parts[2], 10) // date
    );
    dt.setDate(dt.getDate() + 1);
    parts[0] = "" + dt.getFullYear();
    parts[1] = "" + (dt.getMonth() + 1);
    if (parts[1].length < 2) {
      parts[1] = "0" + parts[1];
    }
    parts[2] = "" + dt.getDate();
    if (parts[2].length < 2) {
      parts[2] = "0" + parts[2];
    }
    return parts.join("-");
  }

  useEffect(() => {
    if (currentStartWeek) {
      let temp = currentStartWeek;

      let datesCollection = [];

      for (var i = 0; i < 7; i++) {
        datesCollection.push(temp);
        temp = incr_date(temp);
      }

      setSpecificDates(datesCollection);
    }
  }, [currentStartWeek]);

  function formatSpecificDate(d) {
    var d = new Date(d),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  function formatSpecificDate1(d) {
    var d = new Date(d),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month].join("/");
  }

  useEffect(() => {
    if (userData?.id) {
      const data = [];
      db.collection("athletes")
        .orderBy("name", "asc")
        .get()
        .then((snapshot) => {
          snapshot.docs.forEach((athlete) => {
            if (userData?.data?.listOfAthletes?.includes(athlete.id)) {
              let currentID = athlete.id;
              let appObj = { ...athlete.data(), ["id"]: currentID };
              data.push(appObj);
            }
          });
          setListOfAthletes(data);
        });
    }
  }, [userData?.id]);

  // const fetchUsers = (search) => {
  //   let users = listOfAthletes.filter((l) => l.name >= search);
  //   setAthletes(users);
  // };
  function formatDate() {
    var d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#C19F1E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        enableResetScrollToCoords={false}
      >
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
                paddingHorizontal: RFValue(20, 816),
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
                textAlign: "center",
                fontWeight: "bold",
                marginLeft: RFValue(20, 816),
              }}
            >
              S&C Circuit
            </Text>
          </View>

          <Notification navigation={navigation} />
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginVertical: RFValue(10, 816),
            marginTop: ScreenHeight * 0.08,
            backgroundColor: "#d3d3d3",
            borderBottomLeftRadius: RFValue(20, 816),
            borderBottomRightRadius: RFValue(20, 816),
          }}
        >
          <Image
            style={{
              width: ScreenWidth,
              height: RFValue(200, 816),
              marginBottom: userType === "athlete" ? 0 : RFValue(20, 816),
              resizeMode: "cover",
            }}
            source={require("../../../assets/illustration.jpeg")}
          />
          {userType === "athlete" ? (
            <View
              style={{
                width: "100%",
                height: RFValue(65, 816),
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                backgroundColor: "#C19F1E",
                borderBottomLeftRadius: RFValue(15, 816),
                borderBottomRightRadius: RFValue(15, 816),
                paddingHorizontal: RFValue(25, 816),
              }}
            >
              <Image
                style={{
                  width: RFValue(40, 816),
                  height: RFValue(40, 816),
                  backgroundColor: "#fff",
                  borderRadius: 40,
                  marginRight: RFValue(15, 816),
                }}
                source={
                  coachDetails?.data?.imageUrl
                    ? { uri: coachDetails?.data?.imageUrl }
                    : null
                }
              />
              <View>
                <Text
                  style={{
                    fontSize: RFValue(15, 816),
                    fontWeight: "700",
                    color: "black",
                  }}
                >
                  {coachDetails?.data?.name}
                </Text>
                <Text style={{ fontSize: RFValue(12, 816), color: "black" }}>
                  Strength & Conditioning
                </Text>
              </View>
            </View>
          ) : (
            <View>
              {type !== "non-editable" && type !== "view" && type !== "update" && (
                <View>
                  <Text
                    style={{
                      fontSize: RFValue(12, 816),
                      fontWeight: "700",
                      marginBottom: 6,
                    }}
                  >
                    Search for Athletes
                  </Text>
                  {console.log(type)}
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "flex-start",
                      backgroundColor: "#fff",
                      width: ScreenWidth - RFValue(60, 816),
                      paddingRight: RFValue(10, 816),
                      borderRadius: 6,
                      position: "relative",
                      borderColor: "#bbb",
                      borderWidth: 1,
                    }}
                  >
                    <SafeAreaView style={{ flex: 1 }}>
                      <SearchableDropdown
                        //onTextChange={(search) => fetchUsers(search)}
                        multi={true}
                        placeholderTextColor={"black"}
                        selectedItems={selectedAthletes}
                        onItemSelect={(item) => {
                          const items = [...selectedAthletes];
                          item.selectedDays = [];
                          items.push(item);
                          setSelectedAthletes(items);
                        }}
                        onRemoveItem={(item, index) => {
                          const items = selectedAthletes?.filter(
                            (sitem) => sitem.id !== item.id
                          );
                          setSelectedAthletes(items);
                        }}
                        // setSort={(item, searchedText) =>
                        //   item.name
                        //     .toLowerCase()
                        //     .startsWith(searchedText.toLowerCase())
                        // }
                        containerStyle={{ padding: 5 }}
                        textInputStyle={{
                          flex: 1,
                          paddingHorizontal: RFValue(20, 816),
                          paddingVertical:
                            Platform.OS === "ios" ? 10 : RFValue(5, 816),
                        }}
                        itemStyle={{
                          padding: RFValue(10, 816),
                          marginTop: 2,
                          backgroundColor: "#FAF9F8",
                          paddingVertical:
                            Platform.OS === "ios"
                              ? RFValue(15, 816)
                              : RFValue(5, 816),
                        }}
                        itemTextStyle={{
                          color: "#222",
                        }}
                        itemsContainerStyle={{
                          maxHeight: RFValue(120, 816),
                          margin: 0,
                          padding: 0,
                        }}
                        items={listOfAthletes}
                        textInputProps={{
                          underlineColorAndroid: "transparent",
                          style: {
                            padding: RFValue(12, 816),
                            borderRadius: RFValue(5, 816),
                            backgroundColor: "#fff",
                            height: RFValue(45, 816),
                          },
                        }}
                        listProps={{
                          nestedScrollEnabled: true,
                        }}
                        // defaultIndex={2}
                        resetValue={false}
                        underlineColorAndroid="transparent"
                      />
                    </SafeAreaView>

                    <Icon
                      name="search"
                      type="font-awesome-5"
                      color="#888"
                      size={15}
                      style={{ marginTop: RFValue(15, 816) }}
                    />
                  </View>
                </View>
              )}
              {selectedAthletes.map((athlete, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      marginTop: RFValue(25, 816),
                      display: "flex",
                      alignItems: "flex-start",
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#C19F1E",
                        borderRadius: 100,
                        height: RFValue(45, 816),
                        width: ScreenWidth - RFValue(60, 816),
                      }}
                    >
                      <Image
                        style={{
                          width: RFValue(35, 816),
                          height: RFValue(35, 816),
                          borderRadius: 100,
                          marginHorizontal: RFValue(20, 816),
                        }}
                        source={
                          athlete.imageUrl ? { uri: athlete.imageUrl } : null
                        }
                      />
                      <Text
                        style={{
                          fontSize: RFValue(12, 816),
                          fontWeight: "700",
                          color: "black",
                        }}
                      >
                        {athlete.name}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: RFValue(12, 816),
                        fontWeight: "700",
                        marginTop: RFValue(15, 816),
                        marginLeft: 20,
                      }}
                    >
                      Select days
                    </Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        marginVertical: RFValue(10, 816),
                        width: ScreenWidth - RFValue(50, 816),
                      }}
                    >
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: RFValue(20, 816),
                          width: "100%",
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            paddingRight: RFValue(10, 816),
                            paddingVertical: 15,
                          }}
                          onPress={() => {
                            var curr = new Date(currentStartWeek); // get current date
                            var first = curr.getDate() - curr.getDay() - 7; // First day is the  day of the month - the day of the week \

                            var firstday = new Date(
                              curr.setDate(first)
                            ).toUTCString();
                            var lastday = new Date(
                              curr.setDate(curr.getDate() + 6)
                            ).toUTCString();
                            if (new Date(currentStartWeek) > new Date()) {
                              setCurrentStartWeek(formatSpecificDate(firstday));
                              setCurrentEndWeek(formatSpecificDate(lastday));
                            }
                          }}
                        >
                          <Icon
                            name="chevron-left"
                            size={15}
                            type="font-awesome-5"
                          />
                        </TouchableOpacity>
                        {specificDates.map((day, idx) => (
                          <TouchableOpacity
                            key={idx}
                            disabled={type == "update"}
                            onPress={() => {
                              if (type === "non-editable") {
                                return;
                              }
                              if (type !== "view") {
                                if (
                                  athlete?.selectedDays?.includes(
                                    specificDates[idx]
                                  )
                                ) {
                                  let selected =
                                    selectedAthletes[index].selectedDays;
                                  var index1 = selected.indexOf(
                                    specificDates[idx]
                                  );
                                  if (index1 !== -1) {
                                    selected.splice(index1, 1);
                                    selectedAthletes[index] = {
                                      ...selectedAthletes[index],
                                      selected,
                                    };
                                    setSelectedAthletes([...selectedAthletes]);
                                  }
                                } else {
                                  if (
                                    new Date(specificDates[idx]) > new Date() ||
                                    specificDates[idx] === formatDate()
                                  ) {
                                    let selectedDays =
                                      selectedAthletes[index].selectedDays;
                                    selectedAthletes[index] = {
                                      ...selectedAthletes[index],
                                      selectedDays: [
                                        ...selectedDays,
                                        specificDates[idx],
                                      ],
                                    };
                                    setSelectedAthletes([...selectedAthletes]);
                                  }
                                }
                              }
                            }}
                            style={
                              athlete?.selectedDays?.includes(
                                specificDates[idx]
                              )
                                ? {
                                    backgroundColor: "#C19F1E",
                                    color: "#fff",
                                    width: RFValue(45, 816),
                                    height: RFValue(50, 816),
                                    justifyContent: "center",
                                    alignItems: "center",
                                    position: "relative",
                                    borderRadius: RFValue(10, 816),
                                    marginRight: 6,
                                    marginBottom: RFValue(5, 816),
                                  }
                                : {
                                    backgroundColor:
                                      new Date(specificDates[idx]) >
                                        new Date() ||
                                      specificDates[idx] === formatDate()
                                        ? "#fff"
                                        : "grey",
                                    width: RFValue(45, 816),
                                    height: RFValue(50, 816),
                                    justifyContent: "center",
                                    alignItems: "center",
                                    position: "relative",
                                    borderRadius: RFValue(10, 816),
                                    marginRight: 6,
                                    marginBottom: RFValue(5, 816),
                                  }
                            }
                          >
                            <View
                              style={{
                                alignItems: "center",
                                justifyContent: "center",
                                flex: 1,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: RFValue(13, 816),
                                  fontFamily: "SF-Pro-Display-regular",
                                  width: "80%",
                                  textAlign: "center",
                                  flex: 1,
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: athlete?.selectedDays?.includes(
                                    specificDates[idx]
                                  )
                                    ? "black"
                                    : "black",
                                }}
                              >
                                {moment(day).format("dddd").slice(0, 3)}
                              </Text>
                              <Text
                                style={{
                                  fontSize: RFValue(13, 816),
                                  fontFamily: "SF-Pro-Display-regular",
                                  width: "80%",
                                  textAlign: "center",
                                  flex: 1,
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: athlete?.selectedDays?.includes(
                                    specificDates[idx]
                                  )
                                    ? "black"
                                    : "black",
                                }}
                              >
                                {formatSpecificDate1(day)}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}

                        <TouchableOpacity
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            paddingLeft: RFValue(10, 816),
                            paddingVertical: 15,
                          }}
                          onPress={() => {
                            var curr = new Date(currentStartWeek); // get current date
                            var first = curr.getDate() - curr.getDay() + 7; // First day is the  day of the month - the day of the week \

                            var firstday = new Date(
                              curr.setDate(first)
                            ).toUTCString();
                            var lastday = new Date(
                              curr.setDate(curr.getDate() + 6)
                            ).toUTCString();

                            setCurrentStartWeek(formatSpecificDate(firstday));
                            setCurrentEndWeek(formatSpecificDate(lastday));
                          }}
                        >
                          <Icon
                            name="chevron-right"
                            size={15}
                            type="font-awesome-5"
                          />
                        </TouchableOpacity>
                      </View>

                      {/*
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      {specificDates?.map((tempDate, idx) => (
                        <View
                          style={{
                            width: RFValue(53,816),
                            height: RFValue(30,816),
                          }}
                          key={idx}
                        >
                          <Text
                            style={{
                              fontSize: RFValue(12,816),
                              fontFamily: "SF-Pro-Display-regular",
                              width: "80%",
                              textAlign: "center",
                            }}
                          >
                            {formatSpecificDate1(tempDate)}
                          </Text>
                        </View>
                      ))}
                          </View>*/}
                    </View>
                  </View>
                );
              })}
            </View>
          )}
          <View
            style={{
              width: ScreenWidth,
              paddingVertical: RFValue(25, 816),
              paddingHorizontal: RFValue(10, 816),
              backgroundColor: "#f3f3f3",
              marginTop: userType === "athlete" ? 0 : RFValue(25, 816),
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: RFValue(15, 816),
                  fontWeight: "700",
                  marginBottom: RFValue(10, 816),
                }}
              >
                Workout Details
              </Text>
              <View
                style={{
                  padding: RFValue(10, 816),
                  backgroundColor: "#ffff",
                  borderRadius: RFValue(15, 816),
                }}
              >
                <Text>Name</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#DBE2EA",
                    backgroundColor: "#fff",
                    width: ScreenWidth - RFValue(80, 816),
                    borderRadius: 4,
                    textAlignVertical: "top",
                    padding: RFValue(7, 816),
                    marginBottom: RFValue(5, 816),
                    paddingVertical:
                      Platform.OS === "ios"
                        ? RFValue(15, 816)
                        : RFValue(7, 816),
                    color: "black",
                  }}
                  value={workout?.data?.preWorkout?.workoutName}
                  onChangeText={(newVal) => {
                    let temp = { ...workout };
                    temp.data.preWorkout.workoutName = newVal;
                    setWorkout(temp);
                  }}
                  multiline={true}
                  underlineColorAndroid="transparent"
                  numberOfLines={2}
                  editable={
                    userType === "athlete" || type === "non-editable"
                      ? false
                      : true
                  }
                />
                <Text>Description</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#DBE2EA",
                    backgroundColor: "#fff",
                    width: ScreenWidth - RFValue(80, 816),
                    borderRadius: 4,
                    textAlignVertical: "top",
                    padding: RFValue(7, 816),
                    marginBottom: RFValue(5, 816),
                    paddingVertical:
                      Platform.OS === "ios"
                        ? RFValue(15, 816)
                        : RFValue(7, 816),
                    color: "black",
                  }}
                  value={workout?.data?.preWorkout?.workoutDescription}
                  onChangeText={(newVal) => {
                    let temp = { ...workout };
                    temp.data.preWorkout.workoutDescription = newVal;
                    setWorkout(temp);
                  }}
                  multiline={true}
                  underlineColorAndroid="transparent"
                  numberOfLines={2}
                  editable={
                    userType === "athlete" || type === "non-editable"
                      ? false
                      : true
                  }
                />
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: RFValue(5, 816),
                  }}
                >
                  <Text
                    style={{
                      color: "#003049",
                      fontSize: RFValue(12, 816),
                      fontWeight: "bold",
                      marginRight: RFValue(5, 816),
                    }}
                  >
                    Equipment needed :
                  </Text>
                  <View
                    style={{
                      borderWidth: 0.5,
                      borderColor: "#707070",
                      borderRadius: 4,
                      paddingHorizontal: RFValue(5, 816),
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: RFValue(12, 816),
                      }}
                    >
                      {workout?.data?.preWorkout?.equipmentsNeeded}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#003049",
                      fontSize: RFValue(12, 816),
                      fontWeight: "bold",
                      marginRight: RFValue(5, 816),
                    }}
                  >
                    Target Muscles :
                  </Text>
                  <View
                    style={{
                      borderWidth: 0.5,
                      borderColor: "#707070",
                      borderRadius: 4,
                      paddingHorizontal: RFValue(5, 816),
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: RFValue(12, 816),
                      }}
                    >
                      {workout?.data?.preWorkout?.targetedMuscleGroup}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: RFValue(8, 816),
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      borderRightWidth: 0.5,
                      borderColor: "#707070",
                    }}
                  >
                    <Image
                      style={{ width: 13, height: 13, marginRight: 5 }}
                      source={require("../../../assets/Icon_material_access_time.png")}
                    />
                    <Text
                      style={{
                        borderWidth: 0.5,
                        borderColor: "#707070",
                        borderRadius: 4,
                        paddingHorizontal: RFValue(5, 816),
                        fontSize: RFValue(12, 816),
                        marginRight: RFValue(5, 816),
                      }}
                    >
                      {workout?.data?.preWorkout?.workoutDuration}
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: RFValue(10, 816),
                      borderRightWidth: 0.5,
                      borderColor: "#707070",
                    }}
                  >
                    <Image
                      style={{
                        width: RFValue(10, 816),
                        height: 13,
                        marginRight: 5,
                      }}
                      source={require("../../../assets/Icon_awesome_burn.png")}
                    />
                    <Text
                      style={{
                        borderWidth: 0.5,
                        borderColor: "#707070",
                        borderRadius: 4,
                        paddingHorizontal: RFValue(5, 816),
                        fontSize: RFValue(12, 816),
                        marginRight: RFValue(5, 816),
                      }}
                    >
                      {workout?.data?.preWorkout?.caloriesBurnEstimate}kCal
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: RFValue(5, 816),
                    }}
                  >
                    <Image
                      style={{
                        width: 16,
                        height: RFValue(8, 816),
                        marginRight: 5,
                      }}
                      source={require("../../../assets/Icon_feather_trending_up.png")}
                    />
                    <Text
                      style={{
                        borderWidth: 0.5,
                        borderColor: "#707070",
                        borderRadius: 4,
                        paddingHorizontal: RFValue(5, 816),
                        fontSize: RFValue(12, 816),
                        marginRight: RFValue(8, 816),
                      }}
                    >
                      {workout?.data?.preWorkout?.workoutDifficulty} Difficulty
                    </Text>
                  </View>
                </View>
              </View>

              <Text
                style={{
                  fontSize: RFValue(15, 816),
                  fontWeight: "700",
                  marginTop: RFValue(20, 816),
                  marginBottom: RFValue(10, 816),
                }}
              >
                Exercises
              </Text>
              <View
                style={{
                  padding: RFValue(10, 816),
                  backgroundColor: "#ffff",
                  borderRadius: RFValue(15, 816),
                }}
              >
                {group?.map((grp, idx) => (
                  <View
                    key={idx}
                    style={{
                      marginBottom: RFValue(20, 816),
                      borderColor: "#d3d3d3",
                      paddingBottom: RFValue(30, 816),
                      width: "100%",
                    }}
                  >
                    {/*
                    <TouchableOpacity
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                      onPress={() => {
                        if (selectedWorkoutIndex === idx) {
                          setSelectedWorkoutIndex("");
                        } else {
                          setSelectedWorkoutIndex(idx);
                        }
                      }}
                    >
                      <View
                        style={{
                          width:RFValue(8, 816),
                          height: RFValue(48, 816),
                          backgroundColor: "#C19F1E",
                          marginLeft: -10,
                          marginRight: RFValue(25, 816),
                          borderTopRightRadius: 4,
                          borderBottomRightRadius: 4,
                        }}
                      ></View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          width: "80%",
                        }}
                      >
                      
                        <View style={{ marginRight: RFValue(20, 816) }}>
                          <TextInput
                            style={{
                              fontSize: RFValue(12, 816),
                              fontWeight: "700",
                              color: "#0A0A0A",
                              borderWidth: 1,
                              borderColor: "#DBE2EA",
                              borderRadius:RFValue(8, 816),
                              textAlign: "center",
                              padding: 3,
                              paddingHorizontal:RFValue(5, 816),
                              width: RFValue(100, 816),
                            }}
                            value={grp.groupName}
                            onChangeText={(newVal) => {
                              let temp = [...group];
                              temp[idx].groupName = newVal;
                              setGroup(temp);
                            }}
                            placeholder="Group Name"
                            editable={(userType === "athlete" || type === "non-editable" ) ? false : true}
                          />
                          </View>

                        {selectedWorkoutIndex === idx &&
                          userType !== "athlete" && type !== "non-editable" && (
                            <TouchableOpacity
                              style={{ marginLeft: RFValue(15, 816)}}
                              onPress={() => {
                                let temp = [...group];
                                temp.splice(idx, 1);
                                setGroup(temp);
                              }}
                            >
                              <Icon
                                name="times"
                                size={19}
                                style={{ marginRight: 0 }}
                                type="font-awesome-5"
                              />
                            </TouchableOpacity>
                            )}
                      </View>

                      {selectedWorkoutIndex === idx ? (
                        <TouchableOpacity
                          onPress={() => {
                            if (selectedWorkoutIndex === idx) {
                              setSelectedWorkoutIndex("");
                            } else {
                              setSelectedWorkoutIndex(idx);
                            }
                          }}
                        >
                          <Image
                            style={{ width: RFValue(25, 816), height: RFValue(20, 816), marginRight: 5 }}
                            source={require("../../../assets/up.png")}
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            if (selectedWorkoutIndex === idx) {
                              setSelectedWorkoutIndex("");
                            } else {
                              setSelectedWorkoutIndex(idx);
                            }
                          }}
                        >
                          <Image
                            style={{ width: RFValue(25, 816), height: RFValue(20, 816), marginRight: 5 }}
                            source={require("../../../assets/down.png")}
                          />
                        </TouchableOpacity>
                      )}
                    </TouchableOpacity>*/}

                    {selectedWorkoutIndex === idx && (
                      <View style={{ marginLeft: RFValue(10, 816) }}>
                        {type !== "non-editable" && type !== "view" && (
                          <View
                            style={{
                              width: "100%",
                              marginTop: RFValue(10, 816),
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
                                }}
                              >
                                <View
                                  style={{
                                    width: RFValue(8, 816),
                                    height: RFValue(48, 816),
                                    backgroundColor: "#C19F1E",
                                    marginLeft: -10,
                                    marginRight: RFValue(25, 816),
                                    borderTopRightRadius: 4,
                                    borderBottomRightRadius: 4,
                                  }}
                                ></View>
                                <Text
                                  style={{
                                    fontSize: RFValue(14, 816),
                                    color: "black",
                                  }}
                                >
                                  Search for Exercise
                                </Text>
                              </View>
                            </View>

                            {cardio ? (
                              Platform.OS === "ios" ? (
                                <RNPickerSelect
                                  value={"Select"}
                                  style={{ paddingVertical: 5 }}
                                  onValueChange={(itemValue) => {
                                    setCardioSelect(itemValue);
                                  }}
                                  items={[
                                    { label: "Select", value: "" },
                                    { label: "Run", value: "Run" },
                                    { label: "Walk", value: "Walk" },
                                    {
                                      label: "Elliptical",
                                      value: "Elliptical",
                                    },
                                    { label: "Bike", value: "Bike" },
                                    { label: "Row", value: "Row" },
                                  ]}
                                />
                              ) : (
                                <Picker
                                  selectedValue={"Select"}
                                  style={{
                                    height: RFValue(15, 816),
                                    width: ScreenWidth - RFValue(80, 816),
                                    padding: RFValue(15, 816),
                                    borderWidth: 1,
                                    borderColor: "#777",
                                    paddingBottom: 30,
                                  }}
                                  onValueChange={(item) => {
                                    let items = [...group];
                                    items[idx].exercises.push({
                                      name: item,
                                      sets: [
                                        {
                                          reps: RFValue(12, 816),
                                          rest: RFValue(15, 816),
                                          weights: 0,
                                        },
                                      ],
                                      cardio: true,
                                    });
                                    console.log(items[0].exercises);
                                    setGroup(items);
                                  }}
                                >
                                  <Picker.Item label={"Select"} value={""} />
                                  <Picker.Item label={"Run"} value={"Run"} />
                                  <Picker.Item label={"Walk"} value={"Walk"} />
                                  <Picker.Item
                                    label={"Elliptical"}
                                    value={"Elliptical"}
                                  />
                                  <Picker.Item label={"Bike"} value={"Bike"} />
                                  <Picker.Item label={"Row"} value={"Row"} />
                                </Picker>
                              )
                            ) : (
                              <SafeAreaView></SafeAreaView>
                            )}
                          </View>
                        )}

                        {grp.exercises?.map((workout, idx1) => (
                          <View
                            style={{
                              marginTop: 20,
                            }}
                          >
                            {console.log(workout)}
                            {type !== "non-editable" &&
                              type !== "view" &&
                              userType === "coach" && (
                                <View>
                                  <View
                                    style={{
                                      flex: 1,
                                      flexDirection: "row",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <View
                                      style={{
                                        width: "90%",
                                      }}
                                    >
                                      <SearchableDropdown
                                        textInputStyle={{
                                          paddingVertical:
                                            Platform.OS === "ios" ? 10 : 5,
                                        }}
                                        placeholderTextColor={"black"}
                                        onItemSelect={(item) => {
                                          let items = [...group];
                                          console.log(
                                            items[idx].exercises[idx1]
                                          );
                                          items[idx].exercises[idx1] = item;
                                          items[idx].exercises[idx1].sets = [];
                                          items[idx].exercises[idx1].sets.push({
                                            reps: "12",
                                            weights: "12",
                                            // sets: "",
                                            rest: "12",
                                          });

                                          setGroup(items);
                                        }}
                                        // setSort={(item, searchedText) =>
                                        //   item.name
                                        //     .toLowerCase()
                                        //     .startsWith(searchedText.toLowerCase())
                                        // }
                                        containerStyle={{ padding: 5 }}
                                        onRemoveItem={(item, index) => {
                                          const items = grp.exercises.filter(
                                            (sitem) => sitem._id !== item._id
                                          );
                                          // let items = [...group];
                                          // let temp = grp.exercises[index];
                                          // temp.slice(index, 1);
                                          // items[idx].exercises = temp;
                                          //setGroup(items);
                                          console.log({ items });
                                        }}
                                        itemStyle={{
                                          padding: RFValue(10, 816),
                                          marginTop: 2,
                                          backgroundColor: "#FAF9F8",
                                          paddingVertical:
                                            Platform.OS === "ios" ? 15 : 10,
                                        }}
                                        itemTextStyle={{ color: "#222" }}
                                        itemsContainerStyle={{
                                          maxHeight: RFValue(120, 816),
                                          margin: 0,
                                          padding: 0,
                                          marginBottom: RFValue(15, 816),
                                        }}
                                        items={exercises}
                                        textInputProps={{
                                          placeholder: workout?.name
                                            ? workout?.name
                                            : "Enter Exercise",
                                          underlineColorAndroid: "transparent",
                                          style: {
                                            flex: 1,
                                            paddingHorizontal: RFValue(20, 816),
                                            paddingVertical: RFValue(5, 816),
                                            backgroundColor: "#fff",
                                            borderColor: "#DBE2EA",
                                            borderWidth: 0.4,
                                            borderRadius: 4,
                                          },
                                          onTextChange: (text) =>
                                            console.log(text),
                                        }}
                                        resetValue={false}
                                        listProps={{
                                          nestedScrollEnabled: true,
                                        }}
                                      />
                                    </View>
                                    <TouchableOpacity
                                      onPress={() => {
                                        if (group[0].exercises.length > 1) {
                                          let temp1 = [...group];
                                          let temp = group[idx].exercises;
                                          temp.splice(idx1, 1);
                                          temp1[idx].exercises = temp;
                                          console.log({ temp1 });
                                          setGroup(temp1);
                                        }
                                      }}
                                    >
                                      <Icon
                                        name="times"
                                        size={25}
                                        style={{ marginRight: 0 }}
                                        type="font-awesome-5"
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <SearchableDropdown
                                      textInputStyle={{
                                        paddingVertical:
                                          Platform.OS === "ios" ? 10 : 5,
                                      }}
                                      placeholderTextColor={"black"}
                                      onItemSelect={(item) => {
                                        let items = [...group];

                                        let temp = items[idx].exercises;
                                        let val = item.value;
                                        temp[idx1].sets = [];
                                        if (val == 1) {
                                          temp[idx1].sets.push({
                                            reps: "12",
                                            weights: "0",
                                            // sets: "",
                                            rest: "30",
                                          });
                                        }
                                        if (val == 2) {
                                          temp[idx1].sets.push({
                                            reps: "12",
                                          });
                                        }
                                        if (val == 3) {
                                          temp[idx1].sets.push({
                                            time: "30",
                                          });
                                        }
                                        items[idx].exercises = temp;

                                        setGroup(items);
                                      }}
                                      // setSort={(item, searchedText) =>
                                      //   item.name
                                      //     .toLowerCase()
                                      //     .startsWith(searchedText.toLowerCase())
                                      // }
                                      containerStyle={{
                                        padding: 5,
                                        width: "100%",
                                      }}
                                      onRemoveItem={(item, index) => {
                                        const items = grp.exercises.filter(
                                          (sitem) => sitem._id !== item._id
                                        );
                                        // let items = [...group];
                                        // let temp = grp.exercises[index];
                                        // temp.slice(index, 1);
                                        // items[idx].exercises = temp;
                                        //setGroup(items);
                                        console.log({ items });
                                      }}
                                      itemStyle={{
                                        padding: RFValue(10, 816),
                                        marginTop: 2,
                                        backgroundColor: "#FAF9F8",
                                        paddingVertical:
                                          Platform.OS === "ios" ? 15 : 10,
                                      }}
                                      itemTextStyle={{ color: "#222" }}
                                      itemsContainerStyle={{
                                        maxHeight: RFValue(120, 816),
                                        width: "100%",
                                        margin: 0,
                                        padding: 0,
                                      }}
                                      items={[
                                        {
                                          name: "Reps/Weight/Rest",
                                          value: 1,
                                        },
                                        {
                                          name: "Reps",
                                          value: 2,
                                        },
                                        {
                                          name: "Time",
                                          value: 3,
                                        },
                                      ]}
                                      textInputProps={{
                                        placeholder: workout?.name
                                          ? grp.exercises[idx1].sets[0].weights
                                            ? "reps/weight/rest"
                                            : grp.exercises[idx1].sets[0].reps
                                            ? "reps"
                                            : "time"
                                          : "Enter Exercise",
                                        underlineColorAndroid: "transparent",
                                        style: {
                                          flex: 1,
                                          paddingHorizontal: RFValue(20, 816),
                                          paddingVertical: RFValue(5, 816),
                                          backgroundColor: "#fff",
                                          borderColor: "#DBE2EA",
                                          borderWidth: 0.6,
                                          borderRadius: 4,
                                        },
                                        onTextChange: (text) =>
                                          console.log(text),
                                      }}
                                      resetValue={false}
                                      listProps={{
                                        nestedScrollEnabled: true,
                                      }}
                                    />
                                  </View>
                                </View>
                              )}
                            {workout?.workoutName && (
                              <View
                                key={idx1}
                                style={{ width: "95%", marginLeft: "3%" }}
                              >
                                <TouchableOpacity
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginVertical: RFValue(10, 816),
                                  }}
                                  onPress={() => {
                                    if (selectedWorkoutEdit === "") {
                                      setSelectedWorkoutEdit(idx1);
                                    } else {
                                      setSelectedWorkoutEdit("");
                                    }
                                  }}
                                >
                                  <TouchableOpacity
                                    onPress={() => {
                                      setWorkoutVideoUrl(workout.videoUrl);
                                      setModal(true);
                                      setVideoLoading(true);
                                    }}
                                  >
                                    <Image
                                      style={{
                                        width: RFValue(70, 816),
                                        height: RFValue(70, 816),
                                        borderRadius: RFValue(8, 816),
                                        backgroundColor: "#d3d3d3",
                                      }}
                                      source={
                                        workout.thumbnail_url
                                          ? { uri: workout.thumbnail_url }
                                          : require("../../../assets/illustration.jpeg")
                                      }
                                    />
                                  </TouchableOpacity>
                                  <View
                                    style={{
                                      marginLeft: RFValue(10, 816),
                                      width: "70%",
                                    }}
                                  >
                                    <View
                                      style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <Text>{workout.name}</Text>
                                      {/* {type === "non-editable" ||
                                      userType == "athlete" ? null : (
                                        <TouchableOpacity
                                          onPress={() => {
                                            let temp1 = [...group];
                                            let temp = group[idx].exercises;
                                            temp.splice(idx1, 1);
                                            temp1[idx].exercises = temp;
                                            console.log({ temp1 });
                                            setGroup(temp1);
                                          }}
                                        >
                                          <Icon
                                            name="times"
                                            size={15}
                                            style={{ marginRight: 7 }}
                                            type="font-awesome-5"
                                          />
                                        </TouchableOpacity>
                                      )} */}
                                    </View>

                                    {workout?.sets?.length > 0 &&
                                      ["reps", "weights", "rest", "time"].map(
                                        (set_, i) => {
                                          if (
                                            Object.keys(
                                              workout?.sets[0]
                                            ).indexOf(set_) == -1
                                          )
                                            return null;
                                          return (
                                            <View
                                              style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                alignItems: "center",
                                              }}
                                            >
                                              {console.log()}
                                              <Text
                                                style={{
                                                  width: "50%",
                                                  fontSize: RFValue(12, 816),
                                                }}
                                              >
                                                {set_ == "rest" &&
                                                  set_ + " (secs)"}
                                                {set_ == "weights" &&
                                                  set_ + " (kgs)"}
                                                {set_ == "reps" && set_}
                                                {set_ == "time" &&
                                                  set_ + " (secs)"}
                                              </Text>
                                              {workout.sets.map((s, i) => {
                                                if (
                                                  set_ == "reps_ath" ||
                                                  set_ == "weights_ath" ||
                                                  set_ == "rest_ath" ||
                                                  set_ == "time_ath"
                                                ) {
                                                  return null;
                                                }
                                                return (
                                                  <Text
                                                    key={i}
                                                    style={{
                                                      fontSize: RFValue(
                                                        12,
                                                        816
                                                      ),
                                                      textAlign: "center",
                                                    }}
                                                  >
                                                    {s[set_] ? s[set_] : 12}
                                                    {i < workout.sets.length - 1
                                                      ? "  -  "
                                                      : null}
                                                  </Text>
                                                );
                                              })}
                                            </View>
                                          );
                                        }
                                      )}
                                    {/* <View
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        width: "100%",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <Text
                                        style={{
                                          width: "50%",
                                          fontSize: RFValue(12, 816),
                                        }}
                                      >
                                        Weights
                                      </Text>
                                      {workout.sets.map((s, i) => (
                                        <Text
                                          key={i}
                                          style={{ fontSize: RFValue(12, 816) }}
                                        >
                                          {s.weights ? s.weights : 0}
                                          {i < workout.sets.length - 1
                                            ? " - "
                                            : null}
                                        </Text>
                                      ))}
                                      <View
                                        style={{ marginLeft: RFValue(20, 816) }}
                                      >
                                        {selectedWorkoutEdit === idx1 ? (
                                          <Image
                                            style={{
                                              width: RFValue(25, 816),
                                              height: RFValue(20, 816),
                                            }}
                                            source={require("../../../assets/up.png")}
                                          />
                                        ) : (
                                          <Image
                                            style={{
                                              width: RFValue(25, 816),
                                              height: RFValue(20, 816),
                                            }}
                                            source={require("../../../assets/down.png")}
                                          />
                                        )}
                                      </View>
                                    </View> */}
                                    {/* <View
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Text
                                        style={{
                                          width: "50%",
                                          fontSize: RFValue(12, 816),
                                        }}
                                      >
                                        Rest(secs)
                                      </Text>
                                      {workout.sets.map((s, i) => (
                                        <Text
                                          key={i}
                                          style={{ fontSize: RFValue(12, 816) }}
                                        >
                                          {s.rest ? s.rest : 15}
                                          {i < workout.sets.length - 1
                                            ? " - "
                                            : null}
                                        </Text>
                                      ))}
                                    </View> */}
                                  </View>
                                </TouchableOpacity>
                                {selectedWorkoutEdit === idx1 && (
                                  <View>
                                    {type === "non-editable" ||
                                    userType == "athlete" ? null : (
                                      <TouchableOpacity
                                        style={{
                                          borderWidth: 1,
                                          borderColor: "#006d77",
                                          padding: RFValue(5, 816),
                                          borderRadius: 50,
                                          width: RFValue(120, 816),
                                          marginVertical: RFValue(10, 816),
                                        }}
                                        onPress={() => {
                                          let temp = [...group];
                                          let tmp = {};
                                          let sets =
                                            temp[idx].exercises[idx1].sets;

                                          console.log(
                                            temp[idx].exercises[idx1].sets[0]
                                          );
                                          Object.keys(
                                            temp[idx].exercises[idx1].sets[0]
                                          ).forEach((val) => {
                                            if (val == "weights") {
                                              tmp[val] = "0";
                                            }
                                            if (val == "reps") {
                                              tmp[val] = "12";
                                            }
                                            if (val == "rest") {
                                              tmp[val] = "30";
                                            }
                                            if (val == "time") {
                                              tmp[val] = "30";
                                            } else {
                                              tmp[val] = "12";
                                            }
                                          });
                                          console.log(tmp);

                                          // Object.keys(
                                          //   temp[idx].exercises[idx1].sets[0]
                                          // ).forEach((val) => {
                                          //   if (val == "weights") {
                                          //     tmp[val] = "0";
                                          //   }
                                          //   if (val == "reps") {
                                          //     tmp[val] = "12";
                                          //   }
                                          //   if (val == "rest") {
                                          //     tmp[val] = "30";
                                          //   }
                                          //   if (val == "time") {
                                          //     tmp[val] = "30";
                                          //   } else {
                                          //     tmp[val] = "12";
                                          //   }
                                          // });

                                          temp[idx].exercises[idx1].sets.push(
                                            tmp
                                          );

                                          setGroup(temp);
                                        }}
                                      >
                                        <Text
                                          style={{
                                            color: "black",
                                            textAlign: "center",
                                          }}
                                        >
                                          Add New Set
                                        </Text>
                                      </TouchableOpacity>
                                    )}
                                    {workout.sets?.map((set, idx2) => (
                                      <View
                                        key={idx2}
                                        style={{
                                          width: "100%",
                                          display: "flex",
                                          flexDirection: "row",
                                          alignItems: "center",
                                          marginVertical: RFValue(10, 816),
                                        }}
                                      >
                                        {type === "non-editable" ||
                                        userType == "athlete" ? null : (
                                          <TouchableOpacity
                                            style={{
                                              marginTop: RFValue(20, 816),
                                              marginLeft: RFValue(10, 816),
                                              marginRight: RFValue(5, 816),
                                            }}
                                            disabled={
                                              group[idx].exercises[idx1].sets
                                                .length == 1
                                                ? true
                                                : false
                                            }
                                            onPress={() => {
                                              let temp = [...group];
                                              let tmp =
                                                group[idx].exercises[idx1].sets;
                                              tmp.splice(idx2, 1);

                                              temp[idx].exercises[idx1].sets =
                                                tmp;

                                              setGroup(temp);
                                            }}
                                          >
                                            <Icon
                                              name="times"
                                              size={15}
                                              style={{
                                                marginRight: RFValue(10, 816),
                                              }}
                                              type="font-awesome-5"
                                            />
                                          </TouchableOpacity>
                                        )}
                                        <Text
                                          style={{
                                            marginTop: 18,
                                            marginRight: RFValue(15, 816),
                                          }}
                                        >
                                          Set {idx2 + 1}
                                        </Text>
                                        {/* {Object.keys(set).map((set_, idx5) => ( */}
                                        {[
                                          "reps",
                                          "weights",
                                          "rest",
                                          "time",
                                        ].map((set_, i) => {
                                          if (
                                            Object.keys(set).indexOf(set_) == -1
                                          )
                                            return null;
                                          return (
                                            <View
                                              style={{
                                                marginHorizontal: RFValue(
                                                  5,
                                                  816
                                                ),
                                                display: "flex",
                                                alignItems: "center",
                                              }}
                                            >
                                              {console.log(1, set_ == "rest")}
                                              <Text
                                                style={{
                                                  fontSize: RFValue(14, 816),
                                                  marginBottom: RFValue(5, 816),
                                                }}
                                              >
                                                {set_}
                                              </Text>
                                              <TextInput
                                                style={{
                                                  width: RFValue(50, 816),
                                                  borderWidth: 1,
                                                  borderColor: "#DBE2EA",
                                                  backgroundColor: "#fff",
                                                  padding: RFValue(7, 816),
                                                  borderRadius: RFValue(8, 816),
                                                  textAlign: "center",
                                                  paddingVertical:
                                                    Platform.OS === "ios"
                                                      ? RFValue(15, 816)
                                                      : RFValue(7, 816),
                                                  color: "black",
                                                }}
                                                value={String(
                                                  workout.sets[idx2][set_]
                                                )}
                                                placeholder={"12"}
                                                onChangeText={(e) => {
                                                  let temp = [...group];
                                                  let tmp =
                                                    temp[idx].exercises[idx1]
                                                      .sets;

                                                  if (e === "") {
                                                    tmp[idx2][set_] = "0";
                                                  } else {
                                                    const inputValue =
                                                      parseInt(e) || 0;
                                                    tmp[idx2][set_] =
                                                      inputValue.toString();
                                                  }

                                                  temp[idx].exercises[
                                                    idx1
                                                  ].sets = tmp;

                                                  setGroup(temp);
                                                }}
                                                keyboardType={"number-pad"}
                                                editable={
                                                  userType === "athlete" ||
                                                  type === "non-editable"
                                                    ? false
                                                    : true
                                                }
                                              />
                                            </View>
                                          );
                                        })}
                                        {/* <View
                                          style={{
                                            marginHorizontal: RFValue(5, 816),
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          <Text
                                            style={{
                                              fontSize: RFValue(14, 816),
                                              marginBottom: RFValue(5, 816),
                                            }}
                                          >
                                            Weights
                                          </Text>
                                          <TextInput
                                            style={{
                                              width: RFValue(50, 816),
                                              borderWidth: 1,
                                              borderColor: "#DBE2EA",
                                              backgroundColor: "#fff",
                                              padding: RFValue(7, 816),
                                              borderRadius: RFValue(8, 816),
                                              textAlign: "center",
                                              paddingVertical:
                                                Platform.OS === "ios"
                                                  ? RFValue(15, 816)
                                                  : RFValue(7, 816),
                                            }}
                                            value={String(set.weights)}
                                            placeholder={"0"}
                                            onChangeText={(newVal) => {
                                              let temp = [...group];
                                              let tmp =
                                                group[idx].exercises[idx1].sets;
                                              tmp[idx2].weights = newVal;

                                              temp[idx].exercises[idx1].sets =
                                                tmp;

                                              setGroup(temp);
                                            }}
                                            keyboardType={"number-pad"}
                                          />
                                        </View> */}
                                        {/* <View
                                          style={{
                                            marginHorizontal: RFValue(5, 816),
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          <Text
                                            style={{
                                              fontSize: RFValue(14, 816),
                                              marginBottom: RFValue(5, 816),
                                            }}
                                          >
                                            Rest
                                          </Text>
                                          <TextInput
                                            style={{
                                              width: RFValue(50, 816),
                                              borderWidth: 1,
                                              borderColor: "#DBE2EA",
                                              backgroundColor: "#fff",
                                              padding: RFValue(7, 816),
                                              borderRadius: RFValue(8, 816),
                                              textAlign: "center",
                                              paddingVertical:
                                                Platform.OS === "ios"
                                                  ? RFValue(15, 816)
                                                  : RFValue(7, 816),
                                            }}
                                            value={String(set.rest)}
                                            placeholder={"15"}
                                            onChangeText={(newVal) => {
                                              let temp = [...group];
                                              let tmp =
                                                group[idx].exercises[idx1].sets;
                                              tmp[idx2].rest = newVal;

                                              temp[idx].exercises[idx1].sets =
                                                tmp;

                                              setGroup(temp);
                                            }}
                                            keyboardType={"number-pad"}
                                          />
                                        </View> */}
                                      </View>
                                    ))}
                                    <TouchableOpacity
                                      onPress={() => setSelectedWorkoutEdit("")}
                                      style={{
                                        borderWidth: 1,
                                        borderRadius: RFValue(5, 816),
                                        borderColor: "#DBE2EA",
                                        alignSelf: "flex-end",
                                        padding: RFValue(5, 816),
                                        paddingHorizontal: RFValue(7, 816),
                                      }}
                                    >
                                      <Icon
                                        name="check"
                                        size={20}
                                        style={{ alignSelf: "flex-end" }}
                                        color="black"
                                        type="font-awesome-5"
                                      />
                                    </TouchableOpacity>
                                  </View>
                                )}
                              </View>
                            )}
                          </View>
                        ))}

                        {type == "update" && (
                          <TouchableOpacity
                            style={{
                              backgroundColor: "#C19F1E",
                              padding: RFValue(5, 816),
                              borderRadius: RFValue(15, 816),
                              width: ScreenWidth - RFValue(120, 816),
                              height: RFValue(40, 816),
                              marginVertical: RFValue(20, 816),
                              flex: 1,
                              alignItems: "center",
                              justifyContent: "center",
                              alignSelf: "center",
                            }}
                            onPress={() => {
                              let temp = [...group];
                              temp[idx].exercises.push({});
                              setGroup(temp);
                            }}
                          >
                            <Text
                              style={{
                                fontSize: RFValue(16, 816),
                                color: "white",
                                fontWeight: "bold",
                              }}
                            >
                              Add Exercise
                            </Text>
                          </TouchableOpacity>
                        )}
                        {route.params.isSaved && (
                          <TouchableOpacity
                            style={{
                              backgroundColor: "#C19F1E",
                              padding: RFValue(5, 816),
                              borderRadius: RFValue(15, 816),
                              width: ScreenWidth - RFValue(120, 816),
                              height: RFValue(40, 816),
                              marginVertical: RFValue(20, 816),
                              flex: 1,
                              alignItems: "center",
                              justifyContent: "center",
                              alignSelf: "center",
                            }}
                            onPress={() => {
                              let temp = [...group];
                              temp[idx].exercises.push({});
                              setGroup(temp);
                            }}
                          >
                            <Text
                              style={{
                                fontSize: RFValue(16, 816),
                                color: "white",
                                fontWeight: "bold",
                              }}
                            >
                              Add Exercise
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                  </View>
                ))}
                {/*
                <View
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#fff",
                    borderRadius: 4,
                    paddingBottom:RFValue(15, 816),
                  }}
                >
                  {userType !== "athlete" && type !== "non-editable" &&(
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#C19F1E",
                        padding:RFValue(10, 816),
                        borderRadius: 50,
                        width: ScreenWidth / 2.4,
                        height: RFValue(40, 816),
                      }}
                      onPress={() => {
                        setGroup([
                          ...group,
                          {
                            groupName: "",
                            timing: "",
                            description: "",
                            exercises: [],
                          },
                        ]);
                      }}
                    >
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon
                          name="plus"
                          size={15}
                          style={{ marginRight: RFValue(10, 816)}}
                          color="black"
                          type="font-awesome-5"
                        />
                        <Text
                          style={{
                            fontSize:RFValue(10, 816),
                            fontWeight: "bold",
                            color: "black",
                            textAlign: "center",
                          }}
                        >
                          CREATE GROUP
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                        </View>*/}
              </View>
            </View>
            {userType === "coach" && workout?.data?.completed == true && (
              <View>
                <Text
                  style={{
                    fontSize: RFValue(14, 816),
                    marginBottom: RFValue(7, 816),
                    color: "black",
                    marginTop: 10,
                  }}
                >
                  Workout Feedback
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#DBE2EA",
                    backgroundColor: "#fff",
                    width: ScreenWidth - RFValue(50, 816),
                    borderRadius: RFValue(8, 816),
                    textAlignVertical: "top",
                    padding: RFValue(7, 816),
                    marginBottom: RFValue(15, 816),
                    paddingVertical:
                      Platform.OS === "ios"
                        ? RFValue(15, 816)
                        : RFValue(7, 816),
                  }}
                  value={
                    workout?.data?.completed == true
                      ? workout?.data?.postWorkout?.feedback
                      : ""
                  }
                  onChangeText={setFeedback}
                  editable={false}
                />
              </View>
            )}
          </View>
        </View>

        {route.params.coach && (
          <Text
            style={{
              fontSize: RFValue(14, 816),
              marginBottom: RFValue(7, 816),
              color: "black",
              paddingHorizontal: RFValue(10, 816),
            }}
          >
            Assigned By {route.params.coach.name}
          </Text>
        )}

        <View style={{ display: "flex", alignItems: "center" }}>
          <TouchableOpacity
            style={{
              height: RFValue(25, 816),
              width: ScreenWidth - RFValue(25, 816),
              marginTop: RFValue(15, 816),
              height: RFValue(50, 816),
              marginBottom: RFValue(25, 816),
              justifyContent: "center",
              alignItems: "center",
              borderRadius: RFValue(15, 816),
              backgroundColor: "#C19F1E",
            }}
            onPress={async () => {
              let temp = [...group];
              let tmp = [];
              temp[0].exercises.map((ex, idx) => {
                console.log(ex);
                if (Object.keys(ex).length > 0) {
                  tmp.push(ex);
                }
              });
              temp[0].exercises = tmp;
              setGroup(temp);

              if (userType === "athlete") {
                navigation.navigate("PostWorkoutDetails", {
                  workout: workout,
                  workoutName: route.params?.workoutName,
                });
              } else {
                

                if (type === "non-editable") {
                  navigation.goBack();
                } else if (type === "update") {
                  let tempDate1 = [];
                  selectedAthletes.map((athlete) => {
                    athlete.selectedDays.map((d) => {
                      tempDate1.push(d);
                    });
                  });

                  selectedAthletes.selectedDays = tempDate1;

                  const snapshot = await db
                    .collection("workouts")
                    .doc(workout.id)
                    .get();

                  db.collection("workouts")
                    .doc(workout.id)
                    .update({
                      completed: false,
                      preWorkout: {
                        workoutName: workout.data.preWorkout.workoutName,
                        workoutDescription:
                          workout.data.preWorkout.workoutDescription,
                        equipmentsNeeded:
                          workout.data.preWorkout.equipmentsNeeded,
                        targetedMuscleGroup:
                          workout.data.preWorkout.targetedMuscleGroup,
                        workoutDuration:
                          workout.data.preWorkout.workoutDuration,
                        caloriesBurnEstimate:
                          workout.data.preWorkout.caloriesBurnEstimate,
                        workoutDifficulty:
                          workout.data.preWorkout.workoutDifficulty,
                        selectedExercises: group[0].exercises,
                      },
                      saved: false,
                      selectedAthletes,
                      selectedDay: 0,
                      timestamp:
                        firebase.firestore.FieldValue.serverTimestamp(),
                    })
                    .then(() => {
                      db.collection("CoachWorkouts")
                        .doc(snapshot.data().coachWorkoutId)
                        .update({
                          preWorkout: {
                            workoutName: workout.data.preWorkout.workoutName,
                            workoutDescription:
                              workout.data.preWorkout.workoutDescription,
                            equipmentsNeeded:
                              workout.data.preWorkout.equipmentsNeeded,
                            targetedMuscleGroup:
                              workout.data.preWorkout.targetedMuscleGroup,
                            workoutDuration:
                              workout.data.preWorkout.workoutDuration,
                            caloriesBurnEstimate:
                              workout.data.preWorkout.caloriesBurnEstimate,
                            workoutDifficulty:
                              workout.data.preWorkout.workoutDifficulty,
                            selectedExercises: group[0].exercises,
                          },
                          selectedAthletes: selectedAthletes,
                          selectedDates: tempDate1,
                        });
                      navigation.goBack();
                    });
                } else {
                  let tempDate1 = [];
                  selectedAthletes.map((athlete) => {
                    athlete.selectedDays.map((d) => {
                      tempDate1.push(d);
                    });
                  });
                  if (selectedAthletes && tempDate1.length > 0) {
                    db.collection("CoachWorkouts")
                      .add({
                        assignedById: workout.data?.assignedById,
                        completed: false,
                        // preWorkout: workout.data?.preWorkout,
                        preWorkout: {
                          workoutName: workout.data.preWorkout.workoutName,
                          workoutDescription:
                            workout.data.preWorkout.workoutDescription,
                          equipmentsNeeded:
                            workout.data.preWorkout.equipmentsNeeded,
                          targetedMuscleGroup:
                            workout.data.preWorkout.targetedMuscleGroup,
                          workoutDuration:
                            workout.data.preWorkout.workoutDuration,
                          caloriesBurnEstimate:
                            workout.data.preWorkout.caloriesBurnEstimate,
                          workoutDifficulty:
                            workout.data.preWorkout.workoutDifficulty,
                          selectedExercises: group[0].exercises,
                        },
                        saved: false,
                        selectedAthletes: selectedAthletes,
                        selectedDates: tempDate1,
                        timestamp:
                          firebase.firestore.FieldValue.serverTimestamp(),
                      })
                      .then((docRef) => {
                        triggerNotification(
                          selectedAthletes.map((sa) => sa.id),
                          {
                            title: `New Workout Assign`,
                            body: `${workout.data.preWorkout.workoutName} for ${tempDate1}`,
                          }
                        );
                        selectedAthletes.map((athlete, idx) => {
                          workout.data.assignedToId = athlete.id;
                          sendPushNotification(
                            athlete.token,
                            "new workout assigned"
                          );

                          athlete.selectedDays.map((tempDate, idx1) => {
                            workout.data.date = tempDate;

                            db.collection("workouts")
                              .add({
                                assignedById: workout.data?.assignedById,
                                assignedToId: workout.data?.assignedToId,
                                date: workout.data?.date,
                                completed: false,
                                preWorkout: {
                                  workoutName:
                                    workout.data.preWorkout.workoutName,
                                  workoutDescription:
                                    workout.data.preWorkout.workoutDescription,
                                  equipmentsNeeded:
                                    workout.data.preWorkout.equipmentsNeeded,
                                  targetedMuscleGroup:
                                    workout.data.preWorkout.targetedMuscleGroup,
                                  workoutDuration:
                                    workout.data.preWorkout.workoutDuration,
                                  caloriesBurnEstimate:
                                    workout.data.preWorkout
                                      .caloriesBurnEstimate,
                                  workoutDifficulty:
                                    workout.data.preWorkout.workoutDifficulty,
                                  selectedExercises: group[0].exercises,
                                },
                                saved: false,
                                selectedAthletes,
                                coachWorkoutId: docRef.id,
                                selectedDay: new Date(workout.data?.date),
                                timestamp:
                                  firebase.firestore.FieldValue.serverTimestamp(),
                              })
                              .then((docRef) => {
                                navigation.navigate("PostAddScreen", {
                                  screen: "workout",
                                });
                              })
                              .catch((error) => {
                                console.error("Error adding document: ", error);
                              });
                          });
                        });

                        selectedAthletes.forEach((id) => {
                          db.collection("AthleteNotifications")
                            .doc(id.id)
                            .collection("notifications")
                            .add({
                              message:
                                "New Workout created for " +
                                moment(workout.data?.date).format("ll"),
                              seen: false,
                              timestamp:
                                firebase.firestore.FieldValue.serverTimestamp(),
                              coach_id: userData?.id,
                            });
                        });
                      })
                      .then(() => {
                        const ids = [
                          selectedAthletes.map((athlete) => athlete.id),
                        ];
                        const notification = "Workout has been added";
                        const data1 = AthleteWorkoutList;
                        triggerNotification(ids, notification, data1);
                      })
                      .catch((error) => {
                        console.error("Error adding document: ", error);
                      });
                  } else {
                    alert("Please select an athlete and assign a date");
                  }
                }
              }
            }}
          >
            <View>
              <Text
                style={{
                  color: "white",
                  fontFamily: "SF-Pro-Display-regular",
                  fontSize: RFValue(18, 816),
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {userType === "athlete"
                  ? "Complete Workout"
                  : type === "non-editable"
                  ? "Return"
                  : "Save Changes and Exit"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <Modal animationType="slide" transparent={true} visible={modal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <WebView
                style={{ height: RFValue(700, 816), width: ScreenWidth }}
                source={
                  workoutVideoUrl
                    ? {
                        uri:
                          "https://player.vimeo.com/video/" +
                          workoutVideoUrl.substring(
                            workoutVideoUrl.lastIndexOf("/") + 1
                          ),
                      }
                    : null
                }
              />

              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: RFValue(150, 816),
                }}
              >
                <TouchableOpacity
                  style={{
                    height: RFValue(40, 816),
                    width: ScreenWidth / 1.8,
                    marginBottom: RFValue(8, 816),
                    borderRadius: RFValue(8, 816),
                    position: "absolute",
                    bottom: RFValue(20, 816),
                    shadowColor: "rgba(0,0,0, .4)", // IOS
                    shadowOffset: { height: 1, width: 1 }, // IOS
                    shadowOpacity: 1, // IOS
                    shadowRadius: 1, //IOS
                    backgroundColor: "#fff",
                    elevation: 2, // Android
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                  onPress={() => setModal(false)}
                >
                  <Text
                    style={{
                      color: "#006D77",
                      fontSize: RFValue(14, 816),
                      textAlign: "center",
                    }}
                  >
                    RETURN
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default AssignWorkout;
