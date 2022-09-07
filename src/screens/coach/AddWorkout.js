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
  Switch,
} from "react-native";
import { db } from "../../utils/firebase";
import firebase from "firebase";
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
import { useDispatch, useSelector } from "react-redux";
import { selectUserData } from "../../features/userSlice";
import {
  getExerciseList,
  getFirebaseExerciseList,
  setExerciseList,
  setFirebaseExerciseList,
} from "../../features/foodSlice";
import { Icon } from "react-native-elements";
import Axios from "axios";
import SearchableDropdown from "react-native-searchable-dropdown";
import TextInputMask from "react-native-masked-input";
import { Picker } from "@react-native-picker/picker";
import WebView from "react-native-webview";
import sendPushNotification from "../components/SendNotification";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import RNPickerSelect from "react-native-picker-select";
import Notification from "../components/Notification";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ActivityIndicator } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import { useFocusEffect } from "@react-navigation/native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3",
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
    width: "100%",
    height: ScreenHeight / 3.2,
    paddingBottom: ScreenHeight * 0.05,
  },
  body: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: ScreenWidth - RFValue(130, 816),
  },
  centeredView1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView1: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: ScreenWidth,
    minHeight: ScreenHeight / 1.8,
    paddingBottom: ScreenHeight * 0.05,
    paddingTop: RFValue(50, 816),
  },
});

const TextInputComponent = ({
  name,
  functionName,
  placeholder,
  group,
  keyboardType,
}) => {
  return (
    <TextInput
      style={{
        borderWidth: 0.4,
        bordercolor: "white",
        backgroundColor: "#fff",
        borderRadius: RFValue(5, 816),
        padding: RFValue(7, 816),
        color: "black",
        paddingVertical: Platform.OS === "ios" ? 10 : 7,
      }}
      value={name}
      onChangeText={functionName}
      placeholder={placeholder ? placeholder : ""}
      keyboardType={keyboardType}
    />
  );
};

const AddWorkout = ({ route, navigation }) => {
  const userData = useSelector(selectUserData);
  const exercisesList = useSelector(getExerciseList);
  const firebaseExercisesList = useSelector(getFirebaseExerciseList);

  const dispatch = useDispatch();
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDescription, setWorkoutDescription] = useState("");
  const [equipmentsNeeded, setEquipmentsNeeded] = useState("");
  const [targetedMuscleGroup, setTargetedMuscleGroup] = useState("");
  const [workoutDuration, setWorkoutDuration] = useState("");
  const [caloriesBurnEstimate, setCaloriesBurnEstimate] = useState("");
  const [workoutDifficulty, setWorkoutDifficulty] = useState("");
  const [cardio, setCardio] = useState(false);
  const [cardioSelect, setCardioSelect] = useState("Select");
  const [group, setGroup] = useState([
    {
      exercises: [{}],
      groupName: "Workout",
    },
  ]);
  const [selectedWorkoutEdit, setSelectedWorkoutEdit] = useState(null);
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [workoutVideoUrl, setWorkoutVideoUrl] = useState("");
  const [modal2, setModal2] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [listOfEquipments, setListOfEquipments] = useState([]);
  const [listOfTargetedMuscles, setListOfTargetedMuscles] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [objs, setObjs] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  var ID = function () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return "_" + Math.random().toString(36).substr(2, 9);
  };

  useFocusEffect(
    React.useCallback(() => {
      getExerciseAndStore();
      setListData();
    }, [])
  );

  useEffect(() => {
    setListData();
  }, [firebaseExercisesList]);

  const setListData = () => {
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
    setListOfEquipments(tmpListOfEquipment);
  };

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
              dispatch(setFirebaseExerciseList(firebaseList));
              setListData();
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

  // useEffect(() => {
  //   if (objs) {
  //     let result = objs.filter(
  //       (o1) =>
  //         (equipmentsNeeded.some((o2) => o2.name === o1.equipment) &&
  //           targetedMuscleGroup.some((o2) => o2.name === o1.bodyPart)) ||
  //         targetedMuscleGroup.some((o2) => o2.name === o1.bodyPart2) ||
  //         targetedMuscleGroup.some((o2) => o2.name === o1.bodyPart3) ||
  //         targetedMuscleGroup.some((o2) => o2.name === o1.bodyPart4)
  //     );

  //     setExercises(result);
  //   }
  // }, [equipmentsNeeded, targetedMuscleGroup]);

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
        enableOnAndroid={true}
        extraScrollHeight={100}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={{
                paddingHorizontal: RFValue(20, 816),
              }}
              onPress={() => {
                navigation.replace("WorkoutList");
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
              Create Workout
            </Text>
          </View>

          <Notification navigation={navigation} />
        </View>

        <View
          style={{
            marginVertical: RFValue(10, 816),
            marginTop: ScreenHeight * 0.04,
          }}
        >
          <Image
            style={{
              width: ScreenWidth,
              height: RFValue(200, 816),
              marginVertical: RFValue(10, 816),
            }}
            source={require("../../../assets/illustration.jpeg")}
          />

          <View
            style={{
              padding: RFValue(10, 816),
              backgroundColor: "white",
              margin: RFValue(10, 816),
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                fontSize: RFValue(16, 816),
                marginVertical: RFValue(10, 816),
                color: "black",
              }}
            >
              Workout Name
            </Text>
            <TextInputComponent
              name={workoutName}
              functionName={setWorkoutName}
              placeholder="Enter Workout Name"
            />
          </View>

          <View
            style={{
              margin: RFValue(10, 816),
              backgroundColor: "white",
              borderRadius: 10,
            }}
          >
            <View style={{ paddingHorizontal: RFValue(10, 816) }}>
              <Text
                style={{
                  fontSize: RFValue(15, 816),
                  fontWeight: "700",
                  marginVertical: RFValue(10, 816),
                  color: "black",
                }}
              >
                Workout Details
              </Text>
            </View>
            <View
              style={{ width: "100%", paddingHorizontal: RFValue(10, 816) }}
            >
              <Text
                style={{
                  fontSize: RFValue(14, 816),
                  marginBottom: RFValue(7, 816),
                  color: "black",
                }}
              >
                Equipments Needed
              </Text>
              {/* <SafeAreaView style={{ flex: 1 }}>
                <SearchableDropdown
                  multi={true}
                  placeholderTextColor={"black"}
                  selectedItems={equipmentsNeeded}
                  //onTextChange={(text) => console.log(text)}
                  onItemSelect={(item) => {
                    const items = [...equipmentsNeeded];
                    items.push(item);
                    setEquipmentsNeeded(items);
                  }}
                  onRemoveItem={(item, index) => {
                    const items = equipmentsNeeded.filter(
                      (sitem) => sitem.id !== item.id
                    );
                    setEquipmentsNeeded(items);
                  }}
                  setSort={(item, searchedText) =>
                    item.name
                      .toLowerCase()
                      .startsWith(searchedText.toLowerCase())
                  }
                  textInputStyle={{
                    flex: 1,
                    paddingHorizontal: RFValue(7, 816),
                    paddingVertical: Platform.OS === "ios" ? 10 : 5,
                    backgroundColor: "#fff",
                    bordercolor: "white",
                    borderWidth: 0.4,
                    borderRadius: RFValue(5, 816),
                    color: "black",
                    width: "100%",
                  }}
                  containerStyle={{ marginTop: 10, padding: RFValue(5, 816) }}
                  itemStyle={{
                    padding: RFValue(10, 816),
                    marginTop: 2,
                    backgroundColor: "#FAF9F8",
                    color: "black",
                    paddingVertical: Platform.OS === "ios" ? 15 : 10,
                  }}
                  itemTextStyle={{
                    color: "#222",
                  }}
                  itemsContainerStyle={{
                    maxHeight: RFValue(120, 816),
                    margin: 0,
                    padding: 0,
                    marginBottom: RFValue(15, 816),
                    color: "black",
                  }}
                  items={listOfEquipments}
                  textInputProps={{
                    underlineColorAndroid: "transparent",
                    style: {
                      borderRadius: RFValue(5, 816),
                      backgroundColor: "#fff",
                      color: "black",
                      bordercolor: "white",
                      borderWidth: 0.4,
                      paddingLeft: RFValue(10, 816),
                      padding: 10,
                    },
                  }}
                  listProps={{
                    nestedScrollEnabled: true,
                  }}
                  defaultIndex={0}
                  chip={true}
                  resetValue={false}
                  underlineColorAndroid="transparent"
                  placeholder={
                    equipmentsNeeded.length > 0
                      ? "Enter Equipments needed"
                      : "Equipments Selected"
                  }
                />
              </SafeAreaView> */}
              <TextInput
                style={{
                  borderWidth: 0.4,
                  bordercolor: "white",
                  backgroundColor: "#fff",
                  borderRadius: RFValue(5, 816),
                  padding: RFValue(7, 816),
                  color: "black",
                  paddingVertical: Platform.OS === "ios" ? 10 : 7,
                }}
                onChangeText={(text) => setEquipmentsNeeded(text)}
                value={equipmentsNeeded}
                placeholder="Enter Equipments needed"
              />
            </View>

            <View style={{ width: "100%", padding: RFValue(10, 816) }}>
              <Text
                style={{
                  fontSize: RFValue(14, 816),
                  color: "black",
                  marginBottom: 10,
                }}
              >
                Targeted Muscle Group
              </Text>
              {/* <SearchableDropdown
                multi={true}
                scrollable={false}
                placeholderTextColor={"black"}
                selectedItems={targetedMuscleGroup}
                onItemSelect={(item) => {
                  const items = [...targetedMuscleGroup];
                  items.push(item);
                  setTargetedMuscleGroup(items);
                }}
                onRemoveItem={(item, index) => {
                  const items = targetedMuscleGroup.filter(
                    (sitem) => sitem.id !== item.id
                  );
                  setTargetedMuscleGroup(items);
                }}
                setSort={(item, searchedText) =>
                  item.name.toLowerCase().startsWith(searchedText.toLowerCase())
                }
                containerStyle={{ marginTop: 10 }}
                textInputStyle={{
                  flex: 1,
                  paddingHorizontal: RFValue(20, 816),
                  paddingVertical: Platform.OS === "ios" ? 15 : 5,
                  backgroundColor: "#fff",
                  borderColor: "#DBE2EA",
                  padding: RFValue(12, 816),
                }}
                itemStyle={{
                  padding: RFValue(10, 816),
                  marginTop: 2,
                  backgroundColor: "#FAF9F8",
                  paddingVertical: Platform.OS === "ios" ? 15 : 10,
                }}
                itemTextStyle={{
                  color: "#222",
                }}
                itemsContainerStyle={{
                  maxHeight: RFValue(120, 816),
                  margin: 0,
                  padding: 0,
                  marginBottom: RFValue(15, 816),
                }}
                chip={true}
                items={listOfTargetedMuscles}
                textInputProps={{
                  underlineColorAndroid: "transparent",
                  style: {
                    borderRadius: RFValue(5, 816),
                    backgroundColor: "#fff",
                    bordercolor: "white",
                    borderWidth: 0.4,
                    paddingLeft: 10,
                    padding: 10,
                  },
                }}
                listProps={{
                  nestedScrollEnabled: true,
                }}
                defaultIndex={0}
                resetValue={false}
                underlineColorAndroid="transparent"
                placeholder={"Enter the target muscle group"}
              /> */}
              <TextInput
                style={{
                  borderWidth: 0.4,
                  bordercolor: "white",
                  backgroundColor: "#fff",
                  borderRadius: RFValue(5, 816),
                  padding: RFValue(7, 816),
                  color: "black",
                  paddingVertical: Platform.OS === "ios" ? 10 : 7,
                }}
                onChangeText={(text) => setTargetedMuscleGroup(text)}
                value={targetedMuscleGroup}
                placeholder="Enter the target muscle group"
              />
            </View>
            <View
              style={{ width: "100%", paddingHorizontal: RFValue(10, 816) }}
            >
              <Text
                style={{
                  fontSize: RFValue(14, 816),
                  marginVertical: RFValue(10, 816),
                  color: "black",
                }}
              >
                Workout Duration
              </Text>
              <TextInputMask
                style={{
                  borderWidth: 0.4,
                  bordercolor: "white",
                  backgroundColor: "#fff",
                  width: "100%",
                  borderRadius: RFValue(5, 816),
                  paddingLeft: RFValue(10, 816),
                  paddingVertical: Platform.OS === "ios" ? 10 : 0,
                }}
                type={"datetime"}
                options={{
                  format: "hh:mm:ss",
                }}
                value={workoutDuration}
                placeholder="HH : MM : SS"
                onChangeText={(itemValue) => {
                  setWorkoutDuration(itemValue);
                }}
              />
            </View>
            <View style={{ padding: RFValue(10, 816) }}>
              <Text
                style={{
                  fontSize: RFValue(14, 816),
                  marginVertical: RFValue(10, 816),
                  color: "black",
                }}
              >
                Calories Burn Estimate
              </Text>
              <TextInputComponent
                name={caloriesBurnEstimate}
                functionName={setCaloriesBurnEstimate}
                placeholder="Enter Calories Burn Estimate"
                keyboardType="number-pad"
              />
            </View>
            <View style={{ padding: RFValue(10, 816) }}>
              <Text
                style={{
                  fontSize: RFValue(14, 816),
                  marginVertical: RFValue(10, 816),
                  color: "black",
                }}
              >
                Workout Difficulty
              </Text>
              <View
                style={{
                  alignItems: "center",
                  backgroundColor: "#fff",
                  borderWidth: 0.4,
                  borderRadius: RFValue(5, 816),
                  padding: Platform.OS === "ios" ? RFValue(20, 816) : 0,
                  paddingBottom: RFValue(20, 816),
                }}
              >
                {Platform.OS === "ios" ? (
                  <RNPickerSelect
                    value={workoutDifficulty}
                    style={{ paddingVertical: 5 }}
                    onValueChange={(itemValue) => {
                      setWorkoutDifficulty(itemValue);
                    }}
                    items={[
                      { label: "Select the Workout difficulty", value: "" },
                      { label: "Easy", value: "Easy" },
                      { label: "Moderate", value: "Moderate" },
                      { label: "Hard", value: "Hard" },
                    ]}
                  />
                ) : (
                  <Picker
                    selectedValue={workoutDifficulty}
                    style={{
                      height: RFValue(15, 816),
                      width: ScreenWidth - RFValue(80, 816),
                      padding: RFValue(15, 816),
                      borderWidth: 0.4,
                      borderColor: "#777",
                    }}
                    onValueChange={(itemValue) => {
                      setWorkoutDifficulty(itemValue);
                    }}
                  >
                    <Picker.Item
                      label={"Select the Workout difficulty"}
                      value={""}
                    />
                    <Picker.Item label={"Easy"} value={"Easy"} />
                    <Picker.Item label={"Moderate"} value={"Moderate"} />
                    <Picker.Item label={"Hard"} value={"Hard"} />
                  </Picker>
                )}
              </View>
            </View>
          </View>

          <View style={{ padding: 10 }}>
            <View
              style={{
                width: "100%",
                padding: RFValue(30, 816),
                backgroundColor: "#fff",
                borderRadius: RFValue(8, 816),
              }}
            >
              {group?.map((grp, idx) => (
                <View
                  key={idx}
                  style={{
                    paddingBottom: RFValue(10, 816),
                  }}
                >
                  {/*
                  <View
                    style={{
                      width: ScreenWidth,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width:RFValue(8, 816),
                        height: RFValue(45, 816),
                        backgroundColor: "#C19F1E",
                        marginLeft: -RFValue(30, 816),
                        marginRight: RFValue(25, 816),
                        borderTopRightRadius: 4,
                        borderBottomRightRadius: 4,
                      }}
                    ></View>
                    <Text
                      style={{
                        fontSize: RFValue(15, 816),
                        fontWeight: "700",
                        width: "62%",
                        color: "black",
                      }}
                    >
                      Group
                    </Text>
                    <TouchableOpacity
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
                    </View>*/}
                  {/*
                  <View>
                    <Text
                      style={{
                        fontSize: RFValue(14, 816),
                        marginVertical:RFValue(10, 816),
                      }}
                    >
                      Group Name
                    </Text>
                    <TextInputComponent
                      name={grp.groupName}
                      functionName={(newVal) => {
                        let temp = [...group];
                        temp[idx].groupName = newVal;
                        setGroup(temp);
                      }}
                      placeholder="Enter Group Name"
                      group
                    />
                    </View>*/}

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: RFValue(8, 816),
                        height: RFValue(45, 816),
                        backgroundColor: "#C19F1E",
                        marginLeft: -RFValue(30, 816),
                        marginRight: RFValue(25, 816),
                        borderTopRightRadius: 4,
                        borderBottomRightRadius: 4,
                      }}
                    ></View>
                    <Text
                      style={{
                        fontSize: RFValue(18, 816),
                        fontWeight: "700",
                        width: "90%",
                        color: "black",
                        marginTop: RFValue(15, 816),
                      }}
                    >
                      Exercise
                    </Text>
                  </View>

                  <View style={{ width: "100%", marginTop: RFValue(10, 816) }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: RFValue(14, 816),
                          marginBottom: RFValue(7, 816),
                          color: "black",
                        }}
                      >
                        Search for Exercise
                      </Text>
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#C19F1E",
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                          borderRadius: 50,
                        }}
                        onPress={() => {
                          navigation.navigate("CreateOwnWorkout");
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                          }}
                        >
                          Add Own Workout
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {cardio ? (
                      Platform.OS === "ios" ? (
                        <RNPickerSelect
                          value={"Select"}
                          style={{ paddingVertical: 5 }}
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
                          items={[
                            { label: "Select", value: "" },
                            { label: "Run", value: "Run" },
                            { label: "Walk", value: "Walk" },
                            { label: "Elliptical", value: "Elliptical" },
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
                            borderWidth: 0.4,
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

                  {grp.exercises?.map((workout, idx1) => (
                    <View
                      style={{
                        marginTop: 20,
                      }}
                    >
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
                          {/* <Dropdown label="sample" data={exercises} /> */}
                          <SearchableDropdown
                            textInputStyle={{
                              paddingVertical: Platform.OS === "ios" ? 10 : 5,
                            }}
                            placeholderTextColor={"black"}
                            onItemSelect={(item) => {
                              let items = [...group];
                              console.log(items[idx].exercises[idx1]);
                              items[idx].exercises[idx1] = item;
                              items[idx].exercises[idx1].sets = [];
                              items[idx].exercises[idx1].sets.push({
                                reps: "12",
                                weights: "0",
                                // sets: "",
                                rest: "30",
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
                              paddingVertical: Platform.OS === "ios" ? 15 : 10,
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
                              onTextChange: (text) => console.log(text),
                            }}
                            resetValue={false}
                            listProps={{
                              nestedScrollEnabled: true,
                            }}
                          />

                          {/* <DropDownPicker
                            value={
                              grp?.exercises?.length > 0 &&
                              grp.exercises[idx1]?.value
                            }
                            items={exercises}
                            open={true}
                            searchable={true}
                            setValue={setValue}
                            setItems={setItems}
                            group={group}
                            style={{
                              paddingVertical: Platform.OS === "ios" ? 10 : 0,
                              height: RFValue(40, 816),
                            }}
                            searchContainerStyle={{
                              padding: 0,
                              margin: 0,
                              borderRadius: 0,
                            }}
                            searchTextInputStyle={{
                              padding: 0,
                              margin: 0,
                              borderRadius: 0,
                              borderWidth: 1,
                            }}
                            idx={idx}
                            setExercise={true}
                            idx1={idx1}
                            zIndex={(grp?.exercises?.length - idx1) * 1000}
                            setGroup={setGroup}
                            listMode="SCROLLVIEW"
                            scrollViewProps={{
                              nestedScrollEnabled: true,
                            }}
                            placeholder={"Enter Exercise"}
                          /> */}
                        </View>
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
                            size={25}
                            style={{ marginRight: 0 }}
                            type="font-awesome-5"
                          />
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          width: "100%",
                        }}
                      >
                        <SearchableDropdown
                          textInputStyle={{
                            paddingVertical: Platform.OS === "ios" ? 10 : 5,
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
                            paddingVertical: Platform.OS === "ios" ? 15 : 10,
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
                              : "reps/weight/rest",
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
                            onTextChange: (text) => console.log(text),
                          }}
                          resetValue={false}
                          listProps={{
                            nestedScrollEnabled: true,
                          }}
                        />
                      </View>
                      {workout?.workoutName && (
                        <View
                          key={idx1}
                          style={{ width: "95%", marginLeft: "3%" }}
                        >
                          {!isLoading && (
                            <>
                              {/* <SearchableDropdown
                              textInputStyle={{
                                paddingVertical: Platform.OS === "ios" ? 10 : 5,
                              }}
                              placeholderTextColor={"black"}
                              onItemSelect={(item) => {
                                let items = [...group];
                                console.log(items[idx].exercises[idx1]);
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
                                placeholder: "Enter Exercise",
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
                                onTextChange: (text) => console.log(text),
                              }}
                              defaultIndex={0}
                              resetValue={false}
                              listProps={{
                                nestedScrollEnabled: true,
                              }}
                            /> */}

                              {console.log(value)}
                            </>
                          )}
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
                                if (workout?.videoUrl) {
                                  setWorkoutVideoUrl(workout?.videoUrl);
                                  setModal2(true);
                                  setVideoLoading(true);
                                }
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
                                  workout?.thumbnail_url
                                    ? { uri: workout?.thumbnail_url }
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
                                <Text>{workout?.name}</Text>
                                {/* <TouchableOpacity
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
                                </TouchableOpacity> */}
                              </View>

                              {workout?.sets?.length > 0 &&
                                Object.keys(workout?.sets[0]).map((set_, i) => (
                                  <View
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
                                      {/* {set_} */}
                                      {set_ == "rest" && set_ + " (secs)"}
                                      {set_ == "weights" && set_ + " (kgs)"}
                                      {set_ == "reps" && set_}
                                      {set_ == "time" && set_ + " (secs)"}
                                    </Text>
                                    {workout?.sets?.map((s, i) => (
                                      <Text
                                        key={i}
                                        style={{ fontSize: RFValue(12, 816) }}
                                      >
                                        {s[set_] ? s[set_] : 0}
                                        {i < workout?.sets?.length - 1
                                          ? " - "
                                          : null}
                                      </Text>
                                    ))}
                                  </View>
                                ))}
                              {/* 
                            <View
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
                              {workout?.sets?.map((s, i) => (
                                <Text
                                  key={i}
                                  style={{ fontSize: RFValue(12, 816) }}
                                >
                                  {s.weights ? s.weights : 0}
                                  {i < workout?.sets?.length - 1 ? " - " : null}
                                </Text>
                              ))}
                              <View style={{ marginLeft: RFValue(20, 816) }}>
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
                                  width: "50%",
                                  fontSize: RFValue(12, 816),
                                }}
                              >
                                Rest(secs)
                              </Text>
                              {workout?.sets?.map((s, i) => (
                                <Text
                                  key={i}
                                  style={{ fontSize: RFValue(12, 816) }}
                                >
                                  {s.rest ? s.rest : 15}
                                  {i < workout?.sets?.length - 1 ? " - " : null}
                                </Text>
                              ))}
                            </View> */}
                            </View>
                          </TouchableOpacity>
                          {selectedWorkoutEdit === idx1 && (
                            <View>
                              <TouchableOpacity
                                style={{
                                  borderWidth: 0.4,
                                  borderColor: "#006d77",
                                  padding: RFValue(5, 816),
                                  borderRadius: 50,
                                  width: RFValue(120, 816),
                                  marginVertical: RFValue(10, 816),
                                }}
                                onPress={() => {
                                  // navigation.navigate("AddWorkout");
                                  let temp = [...group];
                                  let tmp = {};
                                  let sets = temp[idx].exercises[idx1].sets;

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

                                  temp[idx].exercises[idx1].sets.push(tmp);

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
                              {workout?.sets?.map((set, idx2) => (
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
                                  <TouchableOpacity
                                    style={{
                                      marginTop: RFValue(20, 816),
                                      marginLeft: RFValue(10, 816),
                                      marginRight: RFValue(5, 816),
                                    }}
                                    disabled={
                                      group[idx].exercises[idx1].sets.length ==
                                      1
                                        ? true
                                        : false
                                    }
                                    onPress={() => {
                                      let temp = [...group];
                                      let tmp = group[idx].exercises[idx1].sets;
                                      tmp.splice(idx2, 1);

                                      temp[idx].exercises[idx1].sets = tmp;

                                      setGroup(temp);
                                    }}
                                  >
                                    <Icon
                                      name="times"
                                      size={15}
                                      style={{ marginRight: RFValue(10, 816) }}
                                      type="font-awesome-5"
                                    />
                                  </TouchableOpacity>
                                  <Text
                                    style={{
                                      marginTop: 18,
                                      marginRight: RFValue(15, 816),
                                    }}
                                  >
                                    Set {idx2 + 1}
                                  </Text>
                                  {Object.keys(set).map((set_, idx5) => (
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
                                          marginBottom: 5,
                                        }}
                                      >
                                        {set_}
                                      </Text>
                                      <TextInput
                                        style={{
                                          width: RFValue(50, 816),
                                          borderWidth: 0.4,
                                          borderColor: "#DBE2EA",
                                          backgroundColor: "#fff",
                                          padding: RFValue(7, 816),
                                          borderRadius: RFValue(8, 816),
                                          textAlign: "center",
                                          paddingVertical:
                                            Platform.OS === "ios" ? 15 : 7,
                                        }}
                                        value={String(workout.sets[idx2][set_])}
                                        placeholder={"12"}
                                        onChangeText={(e) => {
                                          let temp = [...group];
                                          let tmp =
                                            temp[idx].exercises[idx1].sets;

                                          if (e === "") {
                                            tmp[idx2][set_] = "0";
                                          } else {
                                            const inputValue = parseInt(e) || 0;
                                            tmp[idx2][set_] =
                                              inputValue.toString();
                                          }

                                          temp[idx].exercises[idx1].sets = tmp;

                                          setGroup(temp);
                                        }}
                                        keyboardType={"number-pad"}
                                      />
                                    </View>
                                  ))}
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
                                      marginBottom: 5,
                                    }}
                                  >
                                    Weights
                                  </Text>
                                  <TextInput
                                    style={{
                                      width: RFValue(50, 816),
                                      borderWidth: 0.4,
                                      borderColor: "#DBE2EA",
                                      backgroundColor: "#fff",
                                      padding: RFValue(7, 816),
                                      borderRadius: RFValue(8, 816),
                                      textAlign: "center",
                                      paddingVertical:
                                        Platform.OS === "ios" ? 10 : 7,
                                    }}
                                    value={String(set.weights)}
                                    placeholder={"0"}
                                    onChangeText={(newVal) => {
                                      let temp = [...group];
                                      let tmp = group[idx].exercises[idx1].sets;
                                      tmp[idx2].weights = newVal;

                                      temp[idx].exercises[idx1].sets = tmp;

                                      setGroup(temp);
                                    }}
                                    keyboardType={"number-pad"}
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
                                      marginBottom: 5,
                                    }}
                                  >
                                    Rest
                                  </Text>
                                  <TextInput
                                    style={{
                                      width: RFValue(50, 816),
                                      borderWidth: 0.4,
                                      borderColor: "#DBE2EA",
                                      backgroundColor: "#fff",
                                      padding: RFValue(7, 816),
                                      borderRadius: RFValue(8, 816),
                                      textAlign: "center",
                                      paddingVertical:
                                        Platform.OS === "ios" ? 10 : 7,
                                    }}
                                    value={String(set.rest)}
                                    placeholder={"15"}
                                    onChangeText={(newVal) => {
                                      let temp = [...group];
                                      let tmp = group[idx].exercises[idx1].sets;
                                      tmp[idx2].rest = newVal;

                                      temp[idx].exercises[idx1].sets = tmp;

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
                                  borderWidth: 0.4,
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
                </View>
              ))}
            </View>

            {/*
            <View
              style={{
                width: ScreenWidth - RFValue(60, 816),
                marginHorizontal: RFValue(30, 816),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fff",
                borderRadius: 4,
                borderTopWidth: 1,
                borderColor: "#e3e3e3",
                paddingBottom:RFValue(15, 816),
                paddingTop:RFValue(15, 816),
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#C19F1E",
                  padding:RFValue(10, 816),
                  borderRadius: 50,
                  width: ScreenWidth / 2.4,
                }}
                onPress={() => {
                  setGroup([
                    ...group,
                    {
                      groupName: "",
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
                  </View>*/}
          </View>
          <View
            style={{
              marginTop: RFValue(15, 816),
              padding: RFValue(10, 816),
              margin: RFValue(10, 816),
              backgroundColor: "white",
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                fontSize: RFValue(14, 816),
                marginBottom: RFValue(7, 816),
                color: "black",
              }}
            >
              Workout Description
            </Text>
            <TextInput
              style={{
                borderWidth: 0.4,
                bordercolor: "white",
                backgroundColor: "#fff",
                width: "100%",
                borderRadius: 4,
                textAlignVertical: "top",
                padding: RFValue(7, 816),
                marginBottom: RFValue(15, 816),
                paddingVertical: Platform.OS === "ios" ? 10 : 7,
              }}
              value={workoutDescription}
              onChangeText={setWorkoutDescription}
              multiline={true}
              underlineColorAndroid="transparent"
              numberOfLines={4}
              placeholder="Enter Workout Description"
            />
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "#C19F1E",
              padding: RFValue(10, 816),
              borderRadius: RFValue(15, 816),
              width: ScreenWidth - RFValue(80, 816),
              height: RFValue(50, 816),
              marginVertical: RFValue(20, 816),
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
            }}
            onPress={() => {
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

              console.log(1, tmp);
              if (workoutName == "") {
                alert("Please add workoutName");
              } else if (equipmentsNeeded == "") {
                alert("Please add equipments name");
              } else if (targetedMuscleGroup == "") {
                alert("Please add targeted muscle group");
              } else {
                setModal(true);
              }
            }}
          >
            <Text
              style={{
                fontSize: RFValue(16, 816),
                color: "white",
                fontWeight: "bold",
              }}
            >
              Complete Workout
            </Text>
          </TouchableOpacity>
        </View>
        <Modal animationType="slide" transparent={true} visible={modal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.body}>
                <Text
                  style={{
                    fontSize: RFValue(15, 816),
                    fontWeight: "700",
                    color: "black",
                    marginTop: -10,
                  }}
                >
                  Do you want to save the workout?
                </Text>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: RFValue(15, 816),
                }}
              >
                <TouchableOpacity
                  style={{
                    height: RFValue(40, 816),
                    width: ScreenWidth / 2.5,
                    marginBottom: RFValue(8, 816),
                    borderRadius: RFValue(8, 816),
                    shadowColor: "rgba(0,0,0, .4)", // IOS
                    shadowOffset: { height: 1, width: 1 }, // IOS
                    shadowOpacity: 1, // IOS
                    shadowRadius: 1, //IOS
                    backgroundColor: "#808080",
                    elevation: 2, // Android
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    marginRight: RFValue(15, 816),
                  }}
                  onPress={() => {
                    setModal(false);
                    setModal1(true);
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: RFValue(14, 816),
                      textAlign: "center",
                    }}
                  >
                    DON'T SAVE
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    height: RFValue(40, 816),
                    width: ScreenWidth / 4,
                    marginBottom: RFValue(8, 816),
                    borderRadius: RFValue(8, 816),
                    shadowColor: "rgba(0,0,0, .4)", // IOS
                    shadowOffset: { height: 1, width: 1 }, // IOS
                    shadowOpacity: 1, // IOS
                    shadowRadius: 1, //IOS
                    backgroundColor: "#C19F1E",
                    elevation: 2, // Android
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    marginLeft: RFValue(15, 816),
                  }}
                  onPress={() => {
                    if (workoutName) {
                      db.collection("CoachWorkouts")
                        .add({
                          assignedById: userData?.id,
                          assignedToId: "",
                          date: formatDate(),
                          preWorkout: {
                            workoutName,
                            workoutDescription,
                            equipmentsNeeded: equipmentsNeeded,
                            targetedMuscleGroup: targetedMuscleGroup,
                            workoutDuration,
                            caloriesBurnEstimate,
                            workoutDifficulty,
                            selectedExercises: group[0].exercises,
                          },
                          saved: true,
                          timestamp:
                            firebase.firestore.FieldValue.serverTimestamp(),
                        })
                        .then(() => {
                          setModal(false);
                          setModal1(true);
                        })
                        .catch((e) => console.error(e));
                    } else {
                      setModal(false);
                      alert("Please add a workoutName");
                    }
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 14,
                      textAlign: "center",
                    }}
                  >
                    SAVE
                  </Text>
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
                  backgroundColor: "white",
                  elevation: 2, // Android
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
                onPress={() => setModal(false)}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: RFValue(14, 816),
                    textAlign: "center",
                  }}
                >
                  RETURN HOME
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal animationType="slide" transparent={true} visible={modal1}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.body}>
                <Text
                  style={{
                    fontSize: RFValue(15, 816),
                    fontWeight: "700",
                    color: "black",
                    marginTop: -10,
                    textAlign: "center",
                  }}
                >
                  Would you like to assign this workout to your athletes?
                </Text>
                <Text
                  style={{
                    fontSize: RFValue(12, 816),
                    fontWeight: "700",
                    color: "white",
                    marginTop: RFValue(10, 816),
                    textAlign: "center",
                  }}
                >
                  You can complete this step later from the workout screen
                </Text>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: RFValue(15, 816),
                }}
              >
                <TouchableOpacity
                  style={{
                    height: RFValue(40, 816),
                    width: ScreenWidth / 4,
                    marginBottom: RFValue(8, 816),
                    borderRadius: RFValue(8, 816),
                    shadowColor: "rgba(0,0,0, .4)", // IOS
                    shadowOffset: { height: 1, width: 1 }, // IOS
                    shadowOpacity: 1, // IOS
                    shadowRadius: 1, //IOS
                    backgroundColor: "#808080",
                    elevation: 2, // Android
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    marginRight: RFValue(15, 816),
                  }}
                  onPress={() => setModal1(false)}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 14,
                      textAlign: "center",
                    }}
                  >
                    NO
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    height: RFValue(40, 816),
                    width: ScreenWidth / 4,
                    marginBottom: RFValue(8, 816),
                    borderRadius: RFValue(8, 816),
                    shadowColor: "rgba(0,0,0, .4)", // IOS
                    shadowOffset: { height: 1, width: 1 }, // IOS
                    shadowOpacity: 1, // IOS
                    shadowRadius: 1, //IOS
                    backgroundColor: "#C19F1E",
                    elevation: 2, // Android
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    marginLeft: RFValue(15, 816),
                  }}
                  onPress={() => {
                    let compliance = 0;
                    group.map((grp) => {
                      grp.exercises.map((ex) => {
                        ex.sets.map((s) => {
                          if (s.time) {
                            compliance = compliance + s.time;
                          } else if (s.weights) {
                            compliance = compliance + s.reps * s.weights;
                          } else {
                            compliance = compliance + s.reps;
                          }
                        });
                      });
                    });
                    navigation.navigate("AssignWorkout", {
                      workout: {
                        data: {
                          assignedById: userData?.id,
                          assignedToId: "",
                          date: "",
                          preWorkout: {
                            workoutName,
                            workoutDescription,
                            equipmentsNeeded: equipmentsNeeded,
                            targetedMuscleGroup: targetedMuscleGroup,
                            workoutDuration,
                            caloriesBurnEstimate,
                            workoutDifficulty,
                            group,
                            compliance,
                          },
                        },
                      },
                    });
                    setModal1(false);
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: RFValue(14, 816),
                      textAlign: "center",
                    }}
                  >
                    YES
                  </Text>
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
                  backgroundColor: "white",
                  elevation: 2, // Android
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
                onPress={() => {
                  setModal1(false);
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: RFValue(14, 816),
                    textAlign: "center",
                  }}
                >
                  SAVE AND RETURN HOME
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal animationType="slide" transparent={true} visible={modal2}>
          <View style={styles.centeredView1}>
            <View style={styles.modalView1}>
              <WebView
                style={{ height: 700, width: ScreenWidth }}
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
                  onPress={() => setModal2(false)}
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

export default AddWorkout;
