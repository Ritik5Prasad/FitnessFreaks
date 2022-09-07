import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { setSaved } from "../features/onboardingSlice";
let ScreenWidth = Dimensions.get("window").width;
let ScreenHeight = Dimensions.get("window").height;
import { Icon } from "react-native-elements";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";
import {
  selectShowData,
  selectUser,
  selectUserDetails,
  setDbID,
  setUserDetails,
  selectTemperoryId,
  selectUserType,
} from "../features/userSlice";
import { db } from "../utils/firebase";
import CheckBox from "@react-native-community/checkbox";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: RFValue(20, 816),
    marginBottom: 0,
    paddingTop: RFValue(20, 816),
    minHeight: ScreenHeight,
  },
});

const UselessTextInput = (props) => {
  return (
    <TextInput
      style={{
        textAlignVertical: "top",
        padding: RFValue(10, 816),
        paddingVertical: Platform.OS === "ios" ? 15 : 10,
      }}
      {...props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
      editable={props.isEnabled}
      maxLength={500}
      multiline={true}
    />
  );
};

function TrainingAssessment({ route, navigation }) {
  const user = useSelector(selectUser);
  const [userData, setUserData] = useState(null);
  const userType = useSelector(selectUserType);
  const temperoryId = useSelector(selectTemperoryId);
  const [editable, setEditable] = useState(false);
  const [trainingHours, setTrainingHours] = useState("");
  const [fitnessGoal, setFitnessGoal] = useState("");
  const [pastExperience, setPastExperience] = useState("");
  const [currentExercise, setCurrentExercise] = useState("");
  const [exerciseType, setExerciseType] = useState("");
  const [otherEquipments, setOtherEquipments] = useState("");

  const dispatch = useDispatch();

  const [daysList, setDaysList] = useState([
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ]);
  const [color, changeColor] = useState([]);
  const [selectedDaysOfTraining, setSelectedDaysOfTraining] = useState([]);

  const [checkboxValues, setCheckboxValues] = useState([
    "Gym",
    "Kettlebells",
    "Cycle",
    "Weights",
    "Dumbells",
    "Resistance Bands",
    "Swimming Pool",
    "Other",
  ]);
  const [selected, setSelected] = useState([]);

  const isItemChecked = (abilityName) => {
    return selected.indexOf(abilityName) > -1;
  };

  const handleCheckBoxChange = (evt, abilityName) => {
    if (isItemChecked(abilityName)) {
      setSelected(selected.filter((i) => i !== abilityName));
    } else {
      setSelected([...selected, abilityName]);
    }
  };

  useEffect(() => {
    if (userType === "coach") {
      db.collection("athletes")
        .doc(temperoryId)
        .get()
        .then(function (snap) {
          setUserData({
            id: temperoryId,
            data: snap.data(),
          });
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    } else {
      setEditable(true);
      db.collection("athletes")
        .where("email", "==", user)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            setUserData({
              id: doc.id,
              data: doc.data(),
            });
          });
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    }
  }, [user]);

  useEffect(() => {
    if (userData) {
      let temp1 = [];
      db.collection("athletes")
        .doc(userData?.id)
        .collection("Training")
        .doc("training")
        .get()
        .then(function (doc) {
          if (doc.exists) {
            setTrainingHours(doc.data().trainingHours);
            setFitnessGoal(doc.data().fitnessGoal);
            setCurrentExercise(doc.data().currentExercise);
            setExerciseType(doc.data().exerciseType);
            setPastExperience(doc.data().pastExperience);
            
            setSelected(doc.data().equipments);
            setOtherEquipments(
              doc.data()?.otherEquipments ? doc.data().otherEquipments : ""
            );
            setSelectedDaysOfTraining(doc.data().selectedDaysOfTraining);
            daysList.map((item, idx) => {
              if (doc.data().selectedDaysOfTraining.includes(item)) {
                temp1.push(idx);
              }
            });
            changeColor(temp1);
          } else {
            console.log("No such document!");
          }
        })
        .catch((e) => console.log(e));
    }
  }, [userData?.id]);

  useEffect(() => {
    daysList.map((item, idx) => {
      if (!selectedDaysOfTraining.includes(item)) {
        if (color.includes(idx)) {
          console.log("Adding...");
          setSelectedDaysOfTraining([...selectedDaysOfTraining, item]);
        }
      }
    });
  }, [color]);
  console.log({ selectedDaysOfTraining, color });

  const saveDetails = () => {
    dispatch(setSaved(true));
    db.collection("athletes")
      .doc(userData?.id)
      .collection("Training")
      .get()
      .then((snap) => {
        if (!snap.empty) {
          db.collection("athletes")
            .doc(userData?.id)
            .collection("Training")
            .doc("training")
            .update({
              trainingHours,
              selectedDaysOfTraining,
              fitnessGoal,
              pastExperience,
              exerciseType,
              currentExercise,
              equipments: selected,
              otherEquipments,
            })
            .then((res) => {})
            .catch((e) => console.log(e));
        } else {
          db.collection("athletes")
            .doc(userData?.id)
            .collection("Training")
            .doc("training")
            .set({
              trainingHours,
              selectedDaysOfTraining,
              fitnessGoal,
              pastExperience,
              exerciseType,
              currentExercise,
              equipments: selected,
              otherEquipments,
            })
            .then((res) => {})
            .catch((e) => console.log(e));
        }
      });

    setEditable(false);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView>
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
              <View>
                <Text
                  style={{
                    fontSize: RFValue(24, 816),
                    fontFamily: "SF-Pro-Text-regular",
                    fontWeight: "bold",
                    color: "black",
                    marginLeft: RFValue(20, 816),
                  }}
                >
                  Training
                </Text>
                <Text
                  style={{
                    fontSize: RFValue(24, 816),
                    fontFamily: "SF-Pro-Text-regular",
                    fontWeight: "bold",
                    color: "black",
                    marginLeft: RFValue(20, 816),
                  }}
                >
                  Assessment
                </Text>
              </View>
            </View>
            {userType == "coach" ? null : (
              <TouchableOpacity
                style={{ marginRight: RFValue(20, 816) }}
                onPress={() => setEditable(true)}
              >
                <Image source={require("../../assets/edit.png")} />
              </TouchableOpacity>
            )}
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              marginVertical: RFValue(10, 816),
              marginTop: RFValue(20, 816),
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: RFValue(10, 816),
                borderRadius: RFValue(10, 816),
                marginTop: 20,
              }}
            >
              <Text style={{ fontSize: RFValue(18, 816), color: "black" }}>
                Select Days you wish to train
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  flexWrap: "wrap",
                  marginVertical: RFValue(10, 816),
                  width: ScreenWidth - RFValue(20, 816),
                }}
              >
                {daysList.map((day, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => {
                      if (color.includes(idx)) {
                        var array = [...color];

                        var index = array.indexOf(idx);
                        if (index !== -1) {
                          array.splice(index, 1);

                          changeColor(array);
                        }
                        var list = selectedDaysOfTraining.filter(
                          (t) => t !== daysList[idx]
                        );
                        setSelectedDaysOfTraining(list);
                      } else {
                        changeColor([...color, idx]);
                      }
                    }}
                    disabled={!editable}
                    style={
                      color.includes(idx)
                        ? {
                            backgroundColor: "#C19F1E",
                            width: RFValue(45, 816),
                            height: RFValue(30, 816),
                            justifyContent: "center",
                            alignItems: "center",
                            position: "relative",
                            borderRadius: RFValue(10, 816),
                            marginRight: RFValue(8, 816),
                            marginBottom: RFValue(5, 816),
                          }
                        : {
                            backgroundColor: "#fff",
                            width: RFValue(45, 816),
                            height: RFValue(30, 816),
                            justifyContent: "center",
                            alignItems: "center",
                            position: "relative",
                            borderRadius: RFValue(10, 816),
                            marginRight: RFValue(8, 816),
                            marginBottom: RFValue(5, 816),
                          }
                    }
                  >
                    <View>
                      <Text
                        style={
                          color.includes(idx)
                            ? {
                                fontSize: RFValue(13, 816),
                                fontFamily: "SF-Pro-Display-regular",
                                width: "80%",
                                textAlign: "center",
                                color: "black",
                                fontWeight: "bold",
                              }
                            : {
                                fontSize: RFValue(13, 816),
                                fontFamily: "SF-Pro-Display-regular",
                                width: "80%",
                                textAlign: "center",
                                color: "black",
                                fontWeight: "bold",
                              }
                        }
                      >
                        {day}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View
              style={{
                backgroundColor: "white",
                padding: RFValue(10, 816),
                borderRadius: RFValue(10, 816),
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  fontSize: RFValue(18, 816),
                  color: "black",
                  marginVertical: RFValue(10, 816),
                }}
              >
                Training Hours per day
              </Text>
              <TextInput
                style={
                  editable
                    ? {
                        borderWidth: 1,
                        width: ScreenWidth - RFValue(60, 816),
                        borderColor: "grey",
                        borderRadius: RFValue(5, 816),
                        paddingVertical: Platform.OS === "ios" ? 15 : 5,
                        paddingHorizontal: RFValue(10, 816),
                      }
                    : {
                        borderWidth: 0,
                        width: ScreenWidth - RFValue(60, 816),
                        borderColor: "grey",
                        borderRadius: RFValue(5, 816),
                        paddingVertical:
                          Platform.OS === "ios" ? 15 : RFValue(5, 816),
                        paddingHorizontal: RFValue(10, 816),
                      }
                }
                editable={editable}
                placeholder="No. of hours you wish to train per day"
                defaultValue={userData?.data?.trainingHours}
                value={trainingHours}
                onChangeText={setTrainingHours}
              />
            </View>
            <View
              style={{
                backgroundColor: "white",
                padding: RFValue(10, 816),
                borderRadius: RFValue(10, 816),
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  fontSize: RFValue(18, 816),
                  color: "black",
                  marginTop: RFValue(15, 816),
                }}
              >
                Select equipment you have access to
              </Text>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: RFValue(10, 816),
                  width: ScreenWidth - RFValue(40, 816),
                  flexWrap: "wrap",
                }}
              >
                {checkboxValues.map((disease, idx) => (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      margin: RFValue(20, 816),
                      width: ScreenWidth / 3,
                    }}
                    key={idx}
                  >
                    <CheckBox
                      tintColors={{ true: "#C19F1E", false: "#C19F1E" }}
                      style={{
                        margin: 0,
                        padding: 0,
                      }}
                      key={idx}
                      disabled={editable ? false : true}
                      value={isItemChecked(disease)}
                      onValueChange={(evt) =>
                        handleCheckBoxChange(evt, disease)
                      }
                    />
                    <Text
                      style={{ marginLeft: RFValue(10, 816), color: "black" }}
                    >
                      {disease}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {selected.includes("Other") ? (
              <View>
                <View
                  style={{
                    borderColor: "#999",
                    marginVertical: RFValue(10, 816),
                    backgroundColor: "white",
                    borderRadius: 5,
                  }}
                >
                  <UselessTextInput
                    multiline
                    numberOfLines={4}
                    placeholder="Please list any other equipments"
                    onChangeText={(text) => setOtherEquipments(text)}
                    value={otherEquipments}
                    isEnabled={editable ? true : false}
                  />
                </View>
              </View>
            ) : null}

            <View
              style={{
                backgroundColor: "white",
                padding: RFValue(10, 816),
                borderRadius: RFValue(10, 816),
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  fontSize: RFValue(18, 816),
                  color: "black",
                  marginVertical: RFValue(10, 816),
                }}
              >
                Your fitness goal
              </Text>
              <TextInput
                style={
                  editable
                    ? {
                        borderWidth: 1,
                        width: ScreenWidth - RFValue(60, 816),
                        borderColor: "grey",
                        borderRadius: RFValue(5, 816),
                        paddingVertical: Platform.OS === "ios" ? 15 : 5,
                        paddingHorizontal: RFValue(10, 816),
                      }
                    : {
                        borderWidth: 0,
                        width: ScreenWidth - RFValue(60, 816),
                        borderColor: "grey",
                        borderRadius: RFValue(5, 816),
                        paddingVertical:
                          Platform.OS === "ios" ? 15 : RFValue(5, 816),
                        paddingHorizontal: RFValue(10, 816),
                      }
                }
                editable={editable}
                placeholder="Describe your fitness goal"
                defaultValue={userData?.data?.fitnessGoal}
                value={fitnessGoal}
                onChangeText={setFitnessGoal}
              />
            </View>
              
                 
          
              

              
            <View
              style={{
                backgroundColor: "white",
                padding: RFValue(10, 816),
                borderRadius: RFValue(10, 816),
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  fontSize: RFValue(18, 816),
                  color: "black",
                  marginVertical: RFValue(10, 816),
                }}
              >
              Please provide your past experience with diet and exercise
              </Text>
              <TextInput
                style={
                  editable
                    ? {
                        borderWidth: 1,
                        width: ScreenWidth - RFValue(60, 816),
                        borderColor: "grey",
                        borderRadius: RFValue(5, 816),
                        paddingVertical: Platform.OS === "ios" ? 15 : 5,
                        paddingHorizontal: RFValue(10, 816),
                      }
                    : {
                        borderWidth: 0,
                        width: ScreenWidth - RFValue(60, 816),
                        borderColor: "grey",
                        borderRadius: RFValue(5, 816),
                        paddingVertical:
                          Platform.OS === "ios" ? 15 : RFValue(5, 816),
                        paddingHorizontal: RFValue(10, 816),
                      }
                }
                editable={editable}
                placeholder="Describe your past experience diet"
                defaultValue={userData?.data?.pastExperience}
                value={pastExperience}
                onChangeText={setPastExperience}
              />
            </View>

             
            <View
              style={{
                backgroundColor: "white",
                padding: RFValue(10, 816),
                borderRadius: RFValue(10, 816),
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  fontSize: RFValue(18, 816),
                  color: "black",
                  marginVertical: RFValue(10, 816),
                }}
              >
              What does your current exercise plan look like?
              </Text>
              <TextInput
                style={
                  editable
                    ? {
                        borderWidth: 1,
                        width: ScreenWidth - RFValue(60, 816),
                        borderColor: "grey",
                        borderRadius: RFValue(5, 816),
                        paddingVertical: Platform.OS === "ios" ? 15 : 5,
                        paddingHorizontal: RFValue(10, 816),
                      }
                    : {
                        borderWidth: 0,
                        width: ScreenWidth - RFValue(60, 816),
                        borderColor: "grey",
                        borderRadius: RFValue(5, 816),
                        paddingVertical:
                          Platform.OS === "ios" ? 15 : RFValue(5, 816),
                        paddingHorizontal: RFValue(10, 816),
                      }
                }
                editable={editable}
                placeholder="Describe your current exercise plan"
                defaultValue={userData?.data?.currentExercise}
                value={currentExercise}
                onChangeText={setCurrentExercise}
              />
            </View>


            <View
              style={{
                backgroundColor: "white",
                padding: RFValue(10, 816),
                borderRadius: RFValue(10, 816),
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  fontSize: RFValue(18, 816),
                  color: "black",
                  marginVertical: RFValue(10, 816),
                }}
              >
              Home exercise or Gym what do you prefer
              </Text>
              <TextInput
                style={
                  editable
                    ? {
                        borderWidth: 1,
                        width: ScreenWidth - RFValue(60, 816),
                        borderColor: "grey",
                        borderRadius: RFValue(5, 816),
                        paddingVertical: Platform.OS === "ios" ? 15 : 5,
                        paddingHorizontal: RFValue(10, 816),
                      }
                    : {
                        borderWidth: 0,
                        width: ScreenWidth - RFValue(60, 816),
                        borderColor: "grey",
                        borderRadius: RFValue(5, 816),
                        paddingVertical:
                          Platform.OS === "ios" ? 15 : RFValue(5, 816),
                        paddingHorizontal: RFValue(10, 816),
                      }
                }
                editable={editable}
                placeholder="Home or Gym exercise"
                defaultValue={userData?.data?.exerciseType}
                value={exerciseType}
                onChangeText={setExerciseType}
              />
            </View>

            {editable && (
              <View style={{ alignItems: "center" }}>
                <TouchableOpacity
                  style={{
                    height: RFValue(52, 816),
                    width: ScreenWidth - RFValue(100, 816),
                    marginTop: RFValue(15, 816),
                    marginBottom: RFValue(25, 816),
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 50,
                    backgroundColor: "#C19F1E",
                  }}
                  onPress={saveDetails}
                >


                 


                  <View>
                    <Text
                      style={{
                        fontFamily: "SF-Pro-Display-regular",
                        fontSize: RFValue(18, 816),
                        textAlign: "center",
                        color: "white",
                      }}
                    >
                      Complete Form
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default TrainingAssessment;
