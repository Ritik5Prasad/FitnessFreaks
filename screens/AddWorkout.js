import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableHighlight,
  Modal,
  Platform,
  DatePickerIOS,
} from "react-native";
import { db } from "../firebase";
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
import { useDispatch, useSelector } from "react-redux";
import { selectUserData } from "../features/userSlice";
import { Icon } from "react-native-elements";
import TextInputMask from "react-native-masked-input";
import DatePicker from "react-native-datepicker";
import CheckBox from "@react-native-community/checkbox";
import { AirbnbRating } from "react-native-elements";
import firebase from "firebase";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import Marker from "react-native-image-marker";
import Share from "react-native-share";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import moment from "moment";
import Notification from "./components/Notification";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

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
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    backgroundColor: "#fff",
    borderRadius: RFValue(20, 816),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#333",
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 3.84,
    elevation: 9,
    width: ScreenWidth,
    height: ScreenHeight / 1.5,
    paddingBottom: ScreenHeight * 0.05,
  },
  body: {
    display: "flex",
    alignItems: "center",
    width: ScreenWidth - RFValue(130, 816),
  },
});

const AddWorkout = ({ route, navigation }) => {
  const userData = useSelector(selectUserData);
  const dispatch = useDispatch();
  const [workoutDurationPlanned, setWorkoutDurationPlanned] = useState("");
  const [calories, setCalories] = useState("");
  const [modal, setModal] = useState(false);
  const [selectedWorkoutIndex, setSelectedWorkoutIndex] = useState("");
  const [selectedWorkoutEdit, setSelectedWorkoutEdit] = useState("");
  const [group, setGroup] = useState([]);
  const [postWorkout, setPostWorkout] = useState([]);
  const [workoutId, setWorkoutId] = useState("");
  const [completed, setCompleted] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [path, setPath] = useState("");
  const [preWorkout, setPreWorkout] = useState(null);
  const [workoutsCount, setWorkoutsCount] = useState(0);
  const [averageWorkoutTime, setAverageWorkoutTime] = useState(0);
  const [workout, setWorkout] = useState([]);

  useEffect(() => {
    if (userData?.id) {
      var unsub1 = db
        .collection("athletes")
        .doc(userData?.id)
        .onSnapshot((doc) => {
          setWorkoutsCount(doc.data()?.completedWorkouts);
          setAverageWorkoutTime(doc.data()?.averageWorkoutTime);
        });
      return () => {
        unsub1();
      };
    }
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

  useEffect(() => {
    if (route.params?.workout) {
      setGroup(route.params?.workout?.data?.preWorkout?.group);
      setPostWorkout(route.params?.workout?.data?.preWorkout);
      setPreWorkout(route.params?.workout?.data?.preWorkout);
      setWorkout(route.params?.workout);

      setWorkoutId(route.params?.workout?.id);
      setCalories(
        route.params?.workout?.data?.preWorkout?.caloriesBurnEstimate
      );
      setWorkoutDurationPlanned(
        route.params?.workout?.data?.preWorkout?.workoutDuration
      );
    }
  }, [route.params?.workout]);

  useEffect(() => {
    if (route.params?.completed && route.params?.workout) {
      setGroup(route.params?.workout?.data?.postWorkout?.group);
      // setPostWorkout(route.params?.workout?.data?.postWorkout);
      setCompleted(true);
    }
  }, [route.params?.completed, route.params?.workout]);

  useEffect(() => {
    if (group && postWorkout && !route.params.completed) {
      let temp = { ...postWorkout };
      temp.group = group;
      setPostWorkout(temp);
    }
  }, [group]);

  function ratingCompleted(rating) {
    let temp = { ...postWorkout };
    temp.rating = rating;
    setPostWorkout(temp);
  }

  function TimeToMinutes(time) {
    var hms = time; // your input string
    var a = hms.split(":"); // split it at the colons

    // Hours are worth 60 minutes.
    var minutes = +a[0] * 60 + +a[1];

    return minutes;
  }

  const GenerateMarkedImage = (uri) => {
    Marker.markImage({
      src: "file://" + uri,
      markerSrc:
        "https://firebasestorage.googleapis.com/v0/b/triden-workout-app.appspot.com/o/website%2Fritik%20-%20BlackYellow-01%20(1).png?alt=media&token=91afea86-4baf-4df7-8c27-d949ed00f37f",
      position: "topRight",
      scale: 1,
      markerScale: 0.2,
      quality: 100,
      saveFormat: "png",
    }).then((local_path) => {
      var text = "";
      if (
        postWorkout.workoutDuration &&
        postWorkout.workoutDuration != undefined
      ) {
        text =
          route.params?.workoutName +
          " Duration: " +
          postWorkout?.workoutDuration;
      } else {
        text = route.params?.workoutName;
      }

      Marker.markText({
        src: "file://" + local_path,
        text: text,
        position: "bottomLeft",
        color: "black",
        fontName: "Helvetica",
        fontSize: RFValue(40, 816),
        scale: 1,
        quality: 100,
        saveFormat: "png",
      }).then((res) => {
        setPath("file://" + res);
        uploadImage("file://" + res);
      });
    });
  };

  const getImageFromCamera = async () => {
    const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
    // const cameraRollPermission = await Permissions.askAsync(
    //   Permissions.CAMERA
    // );

    if (
      cameraPermission.status === "granted"
      // &&
      // cameraRollPermission.status === "granted"
    ) {
      let capturedImage = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [3, 3],
      });
      if (!capturedImage.cancelled) {
        setImageUrl(capturedImage.uri);
        GenerateMarkedImage(capturedImage.uri);
      }
    }
  };

  const share = async () => {
    await Share.open({ url: path });
  };
  

  const uploadImage = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const childPath = `images/${userData.data.email}/workouts`;

    const task = firebase.storage().ref().child(childPath).put(blob);

    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        //setPath(snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log("upload " + snapshot);
    };

    task.on("_changed", taskProgress, taskError, taskCompleted);
  };

  const getImageFromGallery = async () => {
    const cameraRollPermission = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );

    if (cameraRollPermission.status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [3, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setImageUrl(result.uri);
        GenerateMarkedImage(result.uri);
        console.log("gallery " + result.uri);
      }
    }
  };

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
            marginTop: ScreenHeight * 0.04,
            width: ScreenWidth - RFValue(80, 816),
            marginHorizontal: RFValue(40, 816),
          }}
        >
          <View style={{ width: "100%" }}>
            <Text
              style={{
                fontSize: RFValue(14, 816),
                marginVertical: RFValue(10, 816),
              }}
            >
              Date
            </Text>
            {/*Platform.OS === 'ios'?
               <DatePickerIOS
               date={new Date(moment(postWorkout?.date,"YY-MM-DD")) || new Date()}
               //style={{marginTop:-RFValue(80,816),marginBottom:-RFValue(80,816)}}
               onDateChange={(date) => {setPostWorkout(moment(date).format("YYYY-MM-DD"));}}
               timeZoneOffsetInMinutes={5*60 + 30}
             />
        :  */}
            <DatePicker
              style={{
                width: RFValue(300, 816),
                marginBottom: RFValue(20, 816),
              }}
              date={postWorkout?.date || new Date()}
              mode="date"
              placeholder="Set Date"
              format="YYYY-MM-DD"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              showIcon={false}
              customStyles={{
                dateInput: {
                  borderWidth: 1,
                  borderColor: "#DBE2EA",
                  backgroundColor: "#fff",
                  width: ScreenWidth - RFValue(80, 816),
                  borderRadius: RFValue(8, 816),
                  padding: RFValue(7, 816),
                  height: RFValue(40, 816),
                },
              }}
              onDateChange={(date) => {
                let temp = { ...postWorkout };
                temp.date = date;
                setPostWorkout(temp);
              }}
              disabled={completed ? true : false}
            />
          </View>

          <View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: RFValue(10, 816),
              }}
            >
              <Text
                style={{
                  marginRight: RFValue(10, 816),
                  marginTop: RFValue(20, 816),
                }}
              >
                Duration
              </Text>

              <View style={{ display: "flex", alignItems: "center" }}>
                <Text style={{ marginBottom: 5 }}>Completed</Text>
                <TextInputMask
                  style={{
                    borderWidth: 1,
                    borderColor: "#DBE2EA",
                    backgroundColor: "#fff",
                    width: 100,
                    borderRadius: RFValue(8, 816),
                    padding: RFValue(7, 816),
                    textAlign: "center",
                    paddingVertical:
                      Platform.OS === "ios"
                        ? RFValue(15, 816)
                        : RFValue(7, 816),
                  }}
                  type={"datetime"}
                  options={{
                    format: "hh:mm:ss",
                  }}
                  value={postWorkout?.workoutDuration}
                  placeholder="HH : MM : SS"
                  onChangeText={(itemValue) => {
                    let temp = { ...postWorkout };
                    temp.workoutDuration = itemValue;
                    setPostWorkout(temp);
                  }}
                  editable={completed ? false : true}
                />
              </View>
            </View>
          </View>

          <View
            style={{
              width: ScreenWidth,
              height: 0.5,
              backgroundColor: "#707070",
              marginBottom: RFValue(10, 816),
            }}
          ></View>

          <View>
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
                width: ScreenWidth - RFValue(50, 816),
              }}
            >
              {group?.map((grp, idx) => (
                <View
                  key={idx}
                  style={{
                    marginBottom: RFValue(20, 816),
                    borderBottomWidth: 1,
                    borderColor: "#d3d3d3",
                    paddingBottom: RFValue(30, 816),
                    width: "100%",
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

                  <View style={{ marginLeft: RFValue(10, 816) }}>
                    {grp.exercises?.map((workout, idx1) =>
                      workout.cardio ? (
                        <View key={idx1} style={{ width: "95%" }}>
                          <TouchableOpacity
                            style={{
                              display: "flex",
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
                            <CheckBox
                              disabled={completed ? true : false}
                              value={workout?.completed}
                              tintColors={{ true: "#C19F1E", false: "#C19F1E" }}
                              onValueChange={(newValue) => {
                                let temp = [...group];
                                let tmp = group[idx].exercises[idx1];
                                tmp.completed = newValue;
                                if (newValue === true) {
                                  tmp.sets.map((s) => {
                                    s.actualReps = s.reps;
                                  });
                                  console.log("checked value ", tmp.sets);
                                } else {
                                  tmp.sets.map((s) => {
                                    s.actualReps = "";
                                  });
                                }

                                temp[idx].exercises[idx1] = tmp;

                                setGroup(temp);
                              }}
                            />
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
                                  : require("../assets/illustration.jpeg")
                              }
                            />
                            <View
                              style={{
                                marginHorizontal: RFValue(10, 816),
                                width: "30%",
                              }}
                            >
                              <Text>{workout.name}</Text>
                              <View
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                              >
                                <Text
                                  style={{
                                    width: RFValue(50, 816),
                                    fontSize: RFValue(12, 816),
                                  }}
                                >
                                  Coach
                                </Text>
                                {workout.sets.map((s, i) => (
                                  <Text
                                    key={i}
                                    style={{ fontSize: RFValue(12, 816) }}
                                  >
                                    {s.reps ? s.reps : 0}
                                    {i < workout.sets.length - 1 ? " - " : null}
                                  </Text>
                                ))}
                              </View>
                              <View
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                              >
                                <View
                                  style={{
                                    position: "absolute",
                                    left: ScreenWidth / 2.5,
                                  }}
                                >
                                  <View style={{ alignItems: "center" }}>
                                    <Text style={{ fontSize: 11 }}>Edit</Text>
                                    <View>
                                      {selectedWorkoutEdit === idx1 ? (
                                        <Image
                                          style={{
                                            width: RFValue(25, 816),
                                            height: RFValue(20, 816),
                                            marginRight: RFValue(5, 816),
                                          }}
                                          source={require("../assets/up.png")}
                                        />
                                      ) : (
                                        <Image
                                          style={{
                                            width: RFValue(25, 816),
                                            height: RFValue(20, 816),
                                            marginRight: RFValue(5, 816),
                                          }}
                                          source={require("../assets/down.png")}
                                        />
                                      )}
                                    </View>
                                  </View>
                                </View>
                              </View>

                              <View
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                  width: "100%",
                                }}
                              >
                                <Text
                                  style={{
                                    width: RFValue(50, 816),
                                    fontSize: RFValue(12, 816),
                                  }}
                                >
                                  Time
                                </Text>
                                {workout.sets.map((s, i) => (
                                  <Text
                                    key={i}
                                    style={{ fontSize: RFValue(12, 816) }}
                                  >
                                    {s.rest ? s.rest : 0}
                                    {i < workout.sets.length - 1 ? " - " : null}
                                  </Text>
                                ))}
                              </View>
                            </View>
                          </TouchableOpacity>
                          {selectedWorkoutEdit === idx1 && (
                            <View>
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
                                  <View>
                                    <Text
                                      style={{
                                        marginTop: RFValue(10, 816),
                                        marginRight: RFValue(15, 816),
                                        fontSize: RFValue(12, 816),
                                      }}
                                    >
                                      Time
                                    </Text>
                                  </View>
                                  <View
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
                                      Coach
                                    </Text>
                                    <TextInput
                                      style={{
                                        width: RFValue(100, 816),
                                        borderWidth: 1,
                                        borderColor: "#DBE2EA",
                                        backgroundColor: "#C19F1E",
                                        padding: RFValue(7, 816),
                                        borderRadius: RFValue(8, 816),
                                        textAlign: "center",
                                        color: "black",
                                        paddingVertical:
                                          Platform.OS === "ios"
                                            ? RFValue(15, 816)
                                            : RFValue(7, 816),
                                      }}
                                      value={String(set.rest)}
                                      onChangeText={(newVal) => {
                                        let temp = [...group];
                                        let tmp =
                                          group[idx].exercises[idx1].sets;
                                        tmp[idx2].rest = newVal;

                                        temp[idx].exercises[idx1].sets = tmp;

                                        setGroup(temp);
                                      }}
                                      keyboardType={"number-pad"}
                                      editable={false}
                                    />
                                  </View>
                                  <View
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
                                      Actual
                                    </Text>
                                    <TextInput
                                      style={{
                                        width: RFValue(100, 816),
                                        borderWidth: 1,
                                        borderColor: "#DBE2EA",
                                        backgroundColor: "#f3f3f3",
                                        padding: RFValue(7, 816),
                                        borderRadius: RFValue(8, 816),
                                        textAlign: "center",
                                        paddingVertical:
                                          Platform.OS === "ios"
                                            ? RFValue(15, 816)
                                            : RFValue(7, 816),
                                      }}
                                      value={String(
                                        set.actualReps ? set.actualReps : ""
                                      )}
                                      onChangeText={(newVal) => {
                                        let temp = [...group];
                                        let tmp =
                                          group[idx].exercises[idx1].sets;
                                        tmp[idx2].actualReps = newVal;

                                        temp[idx].exercises[idx1].sets = tmp;

                                        setGroup(temp);
                                      }}
                                      keyboardType={"number-pad"}
                                      editable={completed ? false : true}
                                    />
                                  </View>
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
                      ) : (
                        <View key={idx1} style={{ width: "95%" }}>
                          <TouchableOpacity
                            style={{
                              display: "flex",
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
                            <CheckBox
                              disabled={completed ? true : false}
                              value={workout?.completed}
                              tintColors={{ true: "#C19F1E", false: "#C19F1E" }}
                              onValueChange={(newValue) => {
                                let temp = [...group];
                                let tmp = group[idx].exercises[idx1];
                                tmp.completed = newValue;
                                if (newValue === true) {
                                  tmp.sets.map((s) => {
                                    s.actualReps = s.rest;
                                  });
                                  console.log("checked value ", tmp.sets);
                                } else {
                                  tmp.sets.map((s) => {
                                    s.actualReps = "";
                                  });
                                }

                                temp[idx].exercises[idx1] = tmp;

                                setGroup(temp);
                              }}
                            />
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
                                  : require("../assets/illustration.jpeg")
                              }
                            />
                            <View
                              style={{
                                marginHorizontal: RFValue(10, 816),
                                width: "30%",
                              }}
                            >
                              <Text>{workout.name}</Text>
                              <View
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                              >
                                <Text
                                  style={{
                                    width: RFValue(50, 816),
                                    fontSize: RFValue(12, 816),
                                  }}
                                >
                                  Coach
                                </Text>
                                {workout.sets.map((s, i) => (
                                  <Text
                                    key={i}
                                    style={{ fontSize: RFValue(12, 816) }}
                                  >
                                    {s.reps ? s.reps : 0}
                                    {i < workout.sets.length - 1 ? " - " : null}
                                  </Text>
                                ))}
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
                                    width: RFValue(50, 816),
                                    fontSize: RFValue(12, 816),
                                  }}
                                >
                                  Weights
                                </Text>
                                {workout.sets.map((s, i) => (
                                  <Text style={{ fontSize: RFValue(12, 816) }}>
                                    {s.weights ? s.weights : 0}
                                    {i < workout.sets.length - 1 ? " - " : null}
                                  </Text>
                                ))}

                                <View
                                  style={{
                                    position: "absolute",
                                    left: ScreenWidth / 2.5,
                                  }}
                                >
                                  <View style={{ alignItems: "center" }}>
                                    <Text style={{ fontSize: 11 }}>Edit</Text>
                                    <View>
                                      {selectedWorkoutEdit === idx1 ? (
                                        <Image
                                          style={{
                                            width: RFValue(25, 816),
                                            height: RFValue(20, 816),
                                            marginRight: RFValue(5, 816),
                                          }}
                                          source={require("../assets/up.png")}
                                        />
                                      ) : (
                                        <Image
                                          style={{
                                            width: RFValue(25, 816),
                                            height: RFValue(20, 816),
                                            marginRight: RFValue(5, 816),
                                          }}
                                          source={require("../assets/down.png")}
                                        />
                                      )}
                                    </View>
                                  </View>
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
                                    width: RFValue(50, 816),
                                    fontSize: RFValue(12, 816),
                                  }}
                                >
                                  Rest
                                </Text>
                                {workout.sets.map((s, i) => (
                                  <Text
                                    key={i}
                                    style={{ fontSize: RFValue(12, 816) }}
                                  >
                                    {s.rest ? s.rest : 0}
                                    {i < workout.sets.length - 1 ? " - " : null}
                                  </Text>
                                ))}
                              </View>
                            </View>

                            {/* <Text
                              style={{
                                fontSize:RFValue(10, 816),
                                marginLeft: -25,
                                width: 70,
                              }}
                            >
                              Tap to View
                            </Text> */}
                          </TouchableOpacity>
                          {selectedWorkoutEdit === idx1 && (
                            <View>
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
                                  <View>
                                    <Text
                                      style={{
                                        marginTop: RFValue(8, 816),
                                        marginRight: RFValue(15, 816),
                                        fontSize: RFValue(14, 816),
                                        fontWeight: "700",
                                      }}
                                    >
                                      Set {idx2 + 1}
                                    </Text>
                                    <Text
                                      style={{
                                        marginTop: RFValue(10, 816),
                                        marginRight: RFValue(15, 816),
                                        fontSize: RFValue(12, 816),
                                      }}
                                    >
                                      Reps
                                    </Text>
                                  </View>
                                  <View
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
                                      Coach
                                    </Text>
                                    <TextInput
                                      style={{
                                        width: RFValue(50, 816),
                                        borderWidth: 1,
                                        borderColor: "#DBE2EA",
                                        backgroundColor: "#C19F1E",
                                        padding: RFValue(7, 816),
                                        borderRadius: RFValue(8, 816),
                                        textAlign: "center",
                                        color: "black",
                                        paddingVertical:
                                          Platform.OS === "ios"
                                            ? RFValue(15, 816)
                                            : RFValue(7, 816),
                                      }}
                                      value={String(set.reps)}
                                      onChangeText={(newVal) => {
                                        let temp = [...group];
                                        let tmp =
                                          group[idx].exercises[idx1].sets;
                                        tmp[idx2].reps = newVal;

                                        temp[idx].exercises[idx1].sets = tmp;

                                        setGroup(temp);
                                      }}
                                      keyboardType={"number-pad"}
                                      editable={false}
                                    />
                                  </View>
                                  <View
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
                                      Actual
                                    </Text>
                                    <TextInput
                                      style={{
                                        width: RFValue(50, 816),
                                        borderWidth: 1,
                                        borderColor: "#DBE2EA",
                                        backgroundColor: "#f3f3f3",
                                        padding: RFValue(7, 816),
                                        borderRadius: RFValue(8, 816),
                                        textAlign: "center",
                                        paddingVertical:
                                          Platform.OS === "ios"
                                            ? RFValue(15, 816)
                                            : RFValue(7, 816),
                                      }}
                                      value={String(
                                        set.actualReps ? set.actualReps : ""
                                      )}
                                      onChangeText={(newVal) => {
                                        let temp = [...group];
                                        let tmp =
                                          group[idx].exercises[idx1].sets;
                                        tmp[idx2].actualReps = newVal;

                                        temp[idx].exercises[idx1].sets = tmp;

                                        setGroup(temp);
                                      }}
                                      keyboardType={"number-pad"}
                                      editable={completed ? false : true}
                                    />
                                  </View>
                                  <View
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
                                        backgroundColor: "#f3f3f3",
                                        padding: RFValue(7, 816),
                                        borderRadius: RFValue(8, 816),
                                        textAlign: "center",
                                        paddingVertical:
                                          Platform.OS === "ios"
                                            ? RFValue(15, 816)
                                            : RFValue(7, 816),
                                      }}
                                      value={String(set.weights)}
                                      onChangeText={(newVal) => {
                                        let temp = [...group];
                                        let tmp =
                                          group[idx].exercises[idx1].sets;
                                        tmp[idx2].weights = newVal;

                                        temp[idx].exercises[idx1].sets = tmp;

                                        setGroup(temp);
                                      }}
                                      keyboardType={"number-pad"}
                                      editable={completed ? false : true}
                                    />
                                  </View>
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
                      )
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={{ width: ScreenWidth - RFValue(50, 816) }}>
            <Text style={{ fontSize: 14, marginVertical: 7 }}>Description</Text>
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
                  Platform.OS === "ios" ? RFValue(15, 816) : RFValue(7, 816),
              }}
              value={postWorkout?.description}
              onChangeText={(newValue) => {
                let temp = { ...postWorkout };
                temp.description = newValue;
                setPostWorkout(temp);
              }}
              multiline={true}
              underlineColorAndroid="transparent"
              numberOfLines={4}
              placeholder="Enter Description"
              editable={completed ? false : true}
            />
          </View>

          <View
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              width: ScreenWidth - RFValue(50, 816),
            }}
          >
            <Text
              style={{
                fontSize: RFValue(14, 816),
                marginBottom: RFValue(7, 816),
                color: "black",
              }}
            >
              Post workout fatigue level
            </Text>
            <View
              style={{
                display: "flex",
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
                  marginRight: RFValue(15, 816),
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    if (!completed) {
                      let temp = { ...postWorkout };
                      temp.fatigue = "very-sore";
                      setPostWorkout(temp);
                    }
                  }}
                >
                  <Icon
                    name="tired"
                    type="font-awesome-5"
                    color={
                      postWorkout?.fatigue === "very-sore" ? "red" : "black"
                    }
                    size={RFValue(40, 816)}
                    solid
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  marginRight: RFValue(15, 816),
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    if (!completed) {
                      let temp = { ...postWorkout };
                      temp.fatigue = "moderately-sore";
                      setPostWorkout(temp);
                    }
                  }}
                >
                  <Icon
                    name="meh"
                    type="font-awesome-5"
                    color={
                      postWorkout?.fatigue === "moderately-sore"
                        ? "#f5dd4b"
                        : "black"
                    }
                    size={RFValue(40, 816)}
                    solid
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginRight: RFValue(15, 816),
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    if (!completed) {
                      let temp = { ...postWorkout };
                      temp.fatigue = "not-sore";
                      setPostWorkout(temp);
                    }
                  }}
                >
                  <Icon
                    name="laugh-beam"
                    type="font-awesome-5"
                    color={
                      postWorkout?.fatigue === "not-sore" ? "green" : "black"
                    }
                    size={40}
                    solid
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {!completed && (
            <View
              style={{
                width: ScreenWidth - RFValue(50, 816),
                marginTop: RFValue(20, 816),
              }}
            >
              <Text style={{ color: "black", textAlign: "left" }}>
                Upload Post Workout Image
              </Text>
              <View
                style={{ marginTop: RFValue(40, 816), flexDirection: "row" }}
              >
                <Image
                  source={imageUrl ? { uri: imageUrl } : null}
                  style={{
                    margin: RFValue(10, 816),
                    width: RFValue(100, 816),
                    height: RFValue(100, 816),
                    borderRadius: 100,
                    backgroundColor: "grey",
                  }}
                />
                <View
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                    marginLeft: RFValue(20, 816),
                  }}
                >
                  <TouchableOpacity
                    style={{ marginVertical: RFValue(15, 816) }}
                    onPress={getImageFromCamera}
                  >
                    <AntDesign name="camera" size={RFValue(24, 816)} />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={getImageFromGallery}>
                    <FontAwesome name="photo" size={RFValue(24, 816)} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={{
              backgroundColor: "#C19F1E",
              padding: RFValue(10, 816),
              borderRadius: RFValue(15, 816),
              width: ScreenWidth - RFValue(80, 816),
              height: RFValue(45, 816),
              marginVertical: RFValue(20, 816),
              marginTop: RFValue(20, 816),
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              if (completed) {
                navigation.goBack();
              } else {
                // let compliance = 0;
                // let complianceMessage = "";
                // group?.map((grp) => {
                //   grp.exercises.map((ex) => {
                //     ex.sets.map((s) => {
                //       compliance = compliance + s.actualReps * s.weights;
                //     });
                //   });
                // });
                // if (
                //   compliance <
                //   0.2 * route.params?.workout?.data?.preWorkout?.compliance
                // ) {
                //   complianceMessage = "Non compliant";
                // } else if (
                //   compliance >
                //     0.2 * route.params?.workout?.data?.preWorkout?.compliance &&
                //   compliance <
                //     0.8 * route.params?.workout?.data?.preWorkout?.compliance
                // ) {
                //   complianceMessage = "Partially compliant";
                // } else if (
                //   compliance >
                //     0.8 * route.params?.workout?.data?.preWorkout?.compliance &&
                //   compliance <
                //     1 * route.params?.workout?.data?.preWorkout?.compliance
                // ) {
                //   complianceMessage = "Fully compliant";
                // } else if (
                //   compliance >
                //   1.1 * route.params?.workout?.data?.preWorkout?.compliance
                // ) {
                //   complianceMessage = "Exceeded";
                // } else {
                //   complianceMessage = "";
                // }
                // postWorkout.compliance = compliance;
                // postWorkout.group = group;
                if (!postWorkout.date) {
                  postWorkout.date = formatDate();
                }
                db.collection("AthleteWorkouts")
                  .doc(userData?.id)
                  .collection(
                    postWorkout?.date ? postWorkout?.date : formatDate()
                  )
                  .add({
                    completed: true,
                    preWorkout: postWorkout,

                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                  })
                  .then(() => {
                    db.collection("CoachNotifications")
                      .doc(userData.data.listOfCoaches[0])
                      .collection("notifications")
                      .add(
                        {
                          message: `${
                            userData?.data?.name
                          } has completed Workout ${
                            workout?.data?.preWorkout?.workoutName
                          } on ${postWorkout.date || formatDate()} `,
                          seen: false,
                          timestamp:
                            firebase.firestore.FieldValue.serverTimestamp(),
                          athlete_id: userData?.id,
                        },
                        { merge: true }
                      );

                    db.collection("athletes")
                      .doc(userData?.id)
                      .update({
                        completedWorkouts: workoutsCount + 1,
                        averageWorkoutTime:
                          (parseFloat(averageWorkoutTime) * workoutsCount +
                            TimeToMinutes(
                              postWorkout?.workoutDuration ||
                                preWorkout?.workoutDuration ||
                                "00:00:00"
                            )) /
                          (workoutsCount + 1),
                      })
                      .then(() => setModal(true));
                  });
              }
            }}
          >
            <Text style={{ fontSize: 14, color: "white", fontWeight: "bold" }}>
              {completed ? "Return" : "Complete Workout"}
            </Text>
          </TouchableOpacity>
        </View>

        <Modal animationType="slide" transparent={true} visible={modal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.body}>
                <Text
                  style={{
                    fontSize: RFValue(25, 816),
                    fontWeight: "bold",
                    color: "#003049",
                    textAlign: "center",
                  }}
                >
                  Congratulations We have added your workout!
                </Text>
                <Text
                  style={{
                    fontSize: RFValue(15, 816),
                    fontWeight: "700",
                    color: "#070707",
                    marginTop: RFValue(10, 816),
                    textAlign: "center",
                  }}
                >
                  Rate the quality of the workout
                </Text>
                <AirbnbRating
                  count={5}
                  reviews={["Terrible", "Bad", "Okay", "Good", "Great"]}
                  defaultRating={4}
                  size={25}
                  onFinishRating={ratingCompleted}
                />
                <Text style={{ fontSize: 14, marginVertical: 7 }}>
                  Write Feedback
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#DBE2EA",
                    backgroundColor: "#fff",
                    width: ScreenWidth - RFValue(80, 816),
                    borderRadius: RFValue(8, 816),
                    textAlignVertical: "top",
                    padding: RFValue(7, 816),
                    marginBottom: RFValue(15, 816),
                    paddingVertical:
                      Platform.OS === "ios"
                        ? RFValue(15, 816)
                        : RFValue(7, 816),
                  }}
                  value={postWorkout?.feedback}
                  onChangeText={(newValue) => {
                    let temp = { ...postWorkout };
                    temp.feedback = newValue;
                    setPostWorkout(temp);
                  }}
                  multiline={true}
                  underlineColorAndroid="transparent"
                  numberOfLines={4}
                  placeholder="Enter Feedback"
                />
              </View>

              <Text>Share your workout photo!</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/*
                <TouchableOpacity style={{padding:RFValue(10, 816),marginTop:RFValue(10, 816),alignItems:"center"}} onPress={()=>shareInstagramStories()}>
                  <View style={{padding:RFValue(10, 816),backgroundColor:"black",borderRadius:100}}>
                <Image source={{uri:"https://firebasestorage.googleapis.com/v0/b/triden-workout-app.appspot.com/o/website%2Finsta2.PNG?alt=media&token=5f229f3b-9ae8-4d36-ae0d-c5faec222532"}} style={{width:25,backgroundColor:"black",height:25}}/>
                </View>
                  <Text style={{color:"black"}}>Stories</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{padding:RFValue(10, 816),marginTop:RFValue(10, 816),alignItems:"center"}} onPress={()=>shareInstagramPosts()}>
                  <View style={{padding:RFValue(10, 816),backgroundColor:"black",borderRadius:100}}>
                <Image source={{uri:"https://firebasestorage.googleapis.com/v0/b/triden-workout-app.appspot.com/o/website%2Finsta2.PNG?alt=media&token=5f229f3b-9ae8-4d36-ae0d-c5faec222532"}} style={{width:25,backgroundColor:"black",height:25}}/>
                </View>
                  <Text style={{color:"black"}}>Posts</Text>
                </TouchableOpacity>




                <TouchableOpacity style={{padding:RFValue(10, 816),marginTop:RFValue(10, 816),alignItems:"center"}} onPress={()=>shareFacebookStories()}>
                  <View style={{padding:RFValue(10, 816),backgroundColor:"black",borderRadius:100}}>
                  <Image source={{uri:"https://firebasestorage.googleapis.com/v0/b/triden-workout-app.appspot.com/o/website%2Ffacebook.PNG?alt=media&token=f57af9d7-1d50-455d-bbbe-ae24be8c9c03"}} style={{width:25,backgroundColor:"black",height:25}}/>
                </View>
                  <Text style={{color:"black"}}>Stories</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{padding:RFValue(10, 816),marginTop:RFValue(10, 816),alignItems:"center"}} onPress={()=>shareFacebookPosts()}>
                  <View style={{padding:RFValue(10, 816),backgroundColor:"black",borderRadius:100}}>
                  <Image source={{uri:"https://firebasestorage.googleapis.com/v0/b/triden-workout-app.appspot.com/o/website%2Ffacebook.PNG?alt=media&token=f57af9d7-1d50-455d-bbbe-ae24be8c9c03"}} style={{width:25,backgroundColor:"black",height:25}}/>
                </View>
                  <Text style={{color:"black"}}>Posts</Text>
                </TouchableOpacity>*/}

                <TouchableOpacity
                  style={{
                    padding: RFValue(10, 816),
                    borderRadius: RFValue(10, 816),
                    marginTop: RFValue(10, 816),
                    marginLeft: RFValue(20, 816),
                  }}
                  onPress={() => share()}
                >
                  <Icon name="share-alt" type="font-awesome-5" />
                </TouchableOpacity>
              </View>

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
                onPress={() => {
                  navigation.navigate("Workout", {
                    screen: "AthleteWorkoutList",
                  });
                  setModal(false);
                  if (!postWorkout.rating) {
                    postWorkout.rating = 4;
                  }

                  db.collection("workouts")
                    .doc(workoutId)
                    .update({
                      completed: true,
                      timestamp:
                        firebase.firestore.FieldValue.serverTimestamp(),
                      postWorkout,
                    })
                    .then(() => {
                      navigation.navigate("Workout", {
                        screen: "AthleteWorkoutList",
                      });
                      setModal(false);
                    });
                }}
              >
                <Text
                  style={{
                    color: "#006D77",
                    fontSize: RFValue(14, 816),
                    textAlign: "center",
                  }}
                >
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default AddWorkout;
