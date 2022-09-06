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
import { db } from "../firebase";
import CheckBox from "@react-native-community/checkbox";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
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
        paddingVertical: Platform.OS === "ios" ? 15 : 5,
      }}
      {...props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
      editable={props.isEnabled}
      maxLength={500}
      multiline={true}
    />
  );
};

function MedicalAssessment({ route, navigation }) {
  const user = useSelector(selectUser);
  const userType = useSelector(selectUserType);
  const temperoryId = useSelector(selectTemperoryId);
  const [userData, setUserData] = useState(null);
  const [editable, setEditable] = useState(false);
  const [heartCondition, setHeartCondition] = useState(false);
  const [chestPain, setChestPain] = useState(false);
  const [chestPain1, setChestPain1] = useState(false);
  const [dizziness, setDizziness] = useState(false);
  const [dizziness1, setDizziness1] = useState(false);
  const [jointProblem, setJointProblem] = useState(false);
  const [medicationForHeartProblem, setMedicationForHeartProblem] =
    useState(false);
  const [knowReason, setKnowReason] = useState(false);

  const [hadPain, setHadPain] = useState(false);
  const [applicableAreas, setApplicableAreas] = useState([
    "Ankle",
    "Knee",
    "Hip",
    "Back",
    "Shoulders",
    "Other",
  ]);
  const [selectedApplicableAreas, setSelectedApplicableAreas] = useState([]);
  const [hadSurgeries, setHadSurgeries] = useState(false);
  const [surgery, setSurgery] = useState("");
  const [medicalCondition, setMedicalCondition] = useState("");

  const [chronicDisease, setChronicDisease] = useState(false);
  const [otherAilments, setOtherAilments] = useState("");
  const [otherPainAreas, setOtherPainAreas] = useState("");
  const [applicableAilments, setApplicableAilments] = useState([
    "Diabetes",
    "Hepatitis",
    "Pneumonia",
    "High Blood Pressure",
    "Low Blood Pressure",
    "Back/joint pains",
    "Kidney infection",
    "Heart murmur",
    "Heart Disease",
    "Other",
  ]);
  const [selectedApplicableAilments, setSelectedApplicableAilments] = useState(
    []
  );

  const [takingMedication, setTakingMedication] = useState(false);
  const [medicationDetails, setMedicationDetails] = useState("");

  const dispatch = useDispatch();

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
          console.log("23");
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
      db.collection("athletes")
        .doc(userData?.id)
        .collection("Medical")
        .doc("medical")
        .get()
        .then(function (doc) {
          if (doc.exists) {
            console.log("Document data:", doc.data());
            setHeartCondition(doc.data().heartCondition);
            setChestPain(doc.data().chestPain);
            setChestPain1(doc.data().chestPain1);
            setSelectedApplicableAilments(
              doc.data().selectedApplicableAilments
            );
            setMedicalCondition(doc.data().medicalCondition);
            setSelectedApplicableAreas(doc.data().selectedApplicableAreas);
            setDizziness(doc.data().dizziness);
            setDizziness1(doc.data().dizziness1);
            setJointProblem(doc.data().jointProblem);
            setMedicationForHeartProblem(doc.data().medicationForHeartProblem);
            setKnowReason(doc.data().knowReason);
            setHadPain(doc.data().hadPain);
            setHadSurgeries(doc.data().hadSurgeries);
            setSurgery(doc.data().surgery);
            setChronicDisease(doc.data().chronicDisease);
            setOtherAilments(
              doc.data().otherAilments ? doc.data().otherAilments : ""
            );
            setOtherPainAreas(
              doc.data().otherPainAreas ? doc.data().otherPainAreas : ""
            );
            setTakingMedication(doc.data().takingMedication);
            setMedicationDetails(doc.data().medicationDetails);
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch((e) => console.log(e));
    }
  }, [userData?.id]);

  const isItemChecked = (abilityName) => {
    return selectedApplicableAreas.indexOf(abilityName) > -1;
  };

  const isAilmentChecked = (abilityName) => {
    return selectedApplicableAilments.indexOf(abilityName) > -1;
  };

  const handleCheckBoxChange = (evt, abilityName) => {
    if (isItemChecked(abilityName)) {
      setSelectedApplicableAreas(
        selectedApplicableAreas.filter((i) => i !== abilityName)
      );
    } else {
      setSelectedApplicableAreas([...selectedApplicableAreas, abilityName]);
    }
  };

  const handleAilmentsCheckBoxChange = (evt, abilityName) => {
    if (isAilmentChecked(abilityName)) {
      setSelectedApplicableAilments(
        selectedApplicableAilments.filter((i) => i !== abilityName)
      );
    } else {
      setSelectedApplicableAilments([
        ...selectedApplicableAilments,
        abilityName,
      ]);
    }
  };

  const saveDetails = () => {
    dispatch(setSaved(true));
    db.collection("athletes")
      .doc(userData?.id)
      .collection("Medical")
      .get()
      .then((snap) => {
        if (!snap.empty) {
          db.collection("athletes")
            .doc(userData?.id)
            .collection("Medical")
            .doc("medical")
            .update({
              heartCondition,
              chestPain,
              chestPain1,
              dizziness,
              dizziness1,
              jointProblem,
              medicationForHeartProblem,
              knowReason,
              hadPain,
              medicalCondition,
              hadSurgeries,
              surgery,
              chronicDisease,
              otherAilments,
              otherPainAreas,
              takingMedication,
              medicationDetails,
              selectedApplicableAilments,
              selectedApplicableAreas,
            })
            .then((res) => {})
            .catch((e) => console.log(e));
        } else {
          db.collection("athletes")
            .doc(userData?.id)
            .collection("Medical")
            .doc("medical")
            .set({
              heartCondition,
              chestPain,
              chestPain1,
              dizziness,
              dizziness1,
              jointProblem,
              medicationForHeartProblem,
              knowReason,
              hadPain,
              hadSurgeries,
              otherAilments,
              otherPainAreas,
              surgery,
              chronicDisease,
              takingMedication,
              medicalCondition,
              medicationDetails,
              selectedApplicableAilments,
              selectedApplicableAreas,
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
                    fontSize: RFValue(25, 816),
                    fontFamily: "SF-Pro-Text-regular",
                    fontWeight: "bold",
                    color: "black",
                    marginLeft: RFValue(20, 816),
                  }}
                >
                  Medical Assessment
                </Text>
              </View>
            </View>
            {userType == "coach" ? null : (
              <TouchableOpacity
                style={{ marginRight: RFValue(20, 816) }}
                onPress={() => setEditable(true)}
              >
                <Image source={require("../assets/edit.png")} />
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
              <Text style={{ color: "black" }}>
                Has your doctor ever said that you have a heart condition and
                that you should only perform physical activity recommended by a
                doctor?
              </Text>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 0,
                }}
              >
                {editable === true ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-evenly",
                      marginVertical: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        width: "50%",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => setHeartCondition("yes")}
                        style={{
                          padding: 5,
                          borderRadius: 100,
                          borderWidth: 1,
                          marginRight: 10,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor:
                              heartCondition == "yes" ? "black" : "white",
                            width: RFValue(10, 816),
                            height: RFValue(10, 816),
                            borderRadius: 100,
                          }}
                        ></View>
                      </TouchableOpacity>
                      <Text style={{ color: "black" }}>Yes</Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <TouchableOpacity
                        onPress={() => setHeartCondition("no")}
                        style={{
                          padding: 5,
                          borderRadius: 100,
                          borderWidth: 1,
                          marginRight: 10,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor:
                              heartCondition == "no" ? "black" : "white",
                            width: RFValue(10, 816),
                            height: RFValue(10, 816),
                            borderRadius: 100,
                          }}
                        ></View>
                      </TouchableOpacity>
                      <Text style={{ color: "black" }}>No</Text>
                    </View>
                  </View>
                ) : (
                  <Text
                    style={{
                      marginTop: RFValue(15, 816),
                      marginBottom: RFValue(15, 816),
                      fontSize: RFValue(15, 816),
                      textTransform: "capitalize",
                    }}
                  >
                    {heartCondition}
                  </Text>
                )}
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
              <Text style={{ color: "black" }}>
                Do you feel pain in your chest when you perform physical
                activity?
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 0,
                }}
              >
                {editable === true ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-evenly",
                      marginVertical: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        width: "50%",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => setChestPain("yes")}
                        style={{
                          padding: 5,
                          borderRadius: 100,
                          borderWidth: 1,
                          marginRight: 10,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor:
                              chestPain == "yes" ? "black" : "white",
                            width: RFValue(10, 816),
                            height: RFValue(10, 816),
                            borderRadius: 100,
                          }}
                        ></View>
                      </TouchableOpacity>
                      <Text style={{ color: "black" }}>Yes</Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <TouchableOpacity
                        onPress={() => setChestPain("no")}
                        style={{
                          padding: 5,
                          borderRadius: 100,
                          borderWidth: 1,
                          marginRight: 10,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor:
                              chestPain == "no" ? "black" : "white",
                            width: RFValue(10, 816),
                            height: RFValue(10, 816),
                            borderRadius: 100,
                          }}
                        ></View>
                      </TouchableOpacity>
                      <Text style={{ color: "black" }}>No</Text>
                    </View>
                  </View>
                ) : (
                  <Text
                    style={{
                      marginTop: RFValue(15, 816),
                      marginBottom: RFValue(15, 816),
                      fontSize: RFValue(15, 816),
                      textTransform: "capitalize",
                    }}
                  >
                    {chestPain}
                  </Text>
                )}
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
              <Text style={{ color: "black" }}>
                In the past month, have you had chest pain when you were not
                performing any physical activity?
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 0,
                }}
              >
                {editable === true ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-evenly",
                      marginVertical: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        width: "50%",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => setChestPain1("yes")}
                        style={{
                          padding: 5,
                          borderRadius: 100,
                          borderWidth: 1,
                          marginRight: 10,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor:
                              chestPain1 == "yes" ? "black" : "white",
                            width: RFValue(10, 816),
                            height: RFValue(10, 816),
                            borderRadius: 100,
                          }}
                        ></View>
                      </TouchableOpacity>
                      <Text style={{ color: "black" }}>Yes</Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <TouchableOpacity
                        onPress={() => setChestPain1("no")}
                        style={{
                          padding: 5,
                          borderRadius: 100,
                          borderWidth: 1,
                          marginRight: 10,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor:
                              chestPain1 == "no" ? "black" : "white",
                            width: RFValue(10, 816),
                            height: RFValue(10, 816),
                            borderRadius: 100,
                          }}
                        ></View>
                      </TouchableOpacity>
                      <Text style={{ color: "black" }}>No</Text>
                    </View>
                  </View>
                ) : (
                  <Text
                    style={{
                      marginTop: RFValue(15, 816),
                      marginBottom: RFValue(15, 816),
                      fontSize: RFValue(15, 816),
                      textTransform: "capitalize",
                    }}
                  >
                    {chestPain1}
                  </Text>
                )}
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
              <Text style={{ color: "black" }}>
                Do you lose your balance because of dizziness or do you ever
                lose consciousness?
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 0,
                }}
              >
                {editable === true ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-evenly",
                      marginVertical: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        width: "50%",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => setDizziness("yes")}
                        style={{
                          padding: 5,
                          borderRadius: 100,
                          borderWidth: 1,
                          marginRight: 10,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor:
                              dizziness == "yes" ? "black" : "white",
                            width: RFValue(10, 816),
                            height: RFValue(10, 816),
                            borderRadius: 100,
                          }}
                        ></View>
                      </TouchableOpacity>
                      <Text style={{ color: "black" }}>Yes</Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <TouchableOpacity
                        onPress={() => setDizziness("no")}
                        style={{
                          padding: 5,
                          borderRadius: 100,
                          borderWidth: 1,
                          marginRight: 10,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor:
                              dizziness == "no" ? "black" : "white",
                            width: RFValue(10, 816),
                            height: RFValue(10, 816),
                            borderRadius: 100,
                          }}
                        ></View>
                      </TouchableOpacity>
                      <Text style={{ color: "black" }}>No</Text>
                    </View>
                  </View>
                ) : (
                  <Text
                    style={{
                      marginTop: RFValue(15, 816),
                      marginBottom: RFValue(15, 816),
                      fontSize: RFValue(15, 816),
                      textTransform: "capitalize",
                    }}
                  >
                    {dizziness}
                  </Text>
                )}
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
              <Text style={{ color: "black" }}>
                Do you have a bone or joint problem that could be made worse by
                a change in your physical activity?
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 0,
                }}
              >
                {editable === true ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-evenly",
                      marginVertical: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        width: "50%",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => setJointProblem("yes")}
                        style={{
                          padding: 5,
                          borderRadius: 100,
                          borderWidth: 1,
                          marginRight: 10,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor:
                              jointProblem == "yes" ? "black" : "white",
                            width: RFValue(10, 816),
                            height: RFValue(10, 816),
                            borderRadius: 100,
                          }}
                        ></View>
                      </TouchableOpacity>
                      <Text style={{ color: "black" }}>Yes</Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <TouchableOpacity
                        onPress={() => setJointProblem("no")}
                        style={{
                          padding: 5,
                          borderRadius: 100,
                          borderWidth: 1,
                          marginRight: 10,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor:
                              jointProblem == "no" ? "black" : "white",
                            width: RFValue(10, 816),
                            height: RFValue(10, 816),
                            borderRadius: 100,
                          }}
                        ></View>
                      </TouchableOpacity>
                      <Text style={{ color: "black" }}>No</Text>
                    </View>
                  </View>
                ) : (
                  <Text
                    style={{
                      marginTop: RFValue(15, 816),
                      marginBottom: RFValue(15, 816),
                      fontSize: RFValue(15, 816),
                      textTransform: "capitalize",
                    }}
                  >
                    {jointProblem}
                  </Text>
                )}
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
              <Text style={{ color: "black" }}>
                Is your doctor currently prescribing any medication for your
                blood pressure or for a heart condition?
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 0,
                }}
              >
                {editable === true ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-evenly",
                      marginVertical: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        width: "50%",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => setMedicationForHeartProblem("yes")}
                        style={{
                          padding: 5,
                          borderRadius: 100,
                          borderWidth: 1,
                          marginRight: 10,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor:
                              medicationForHeartProblem == "yes"
                                ? "black"
                                : "white",
                            width: RFValue(10, 816),
                            height: RFValue(10, 816),
                            borderRadius: 100,
                          }}
                        ></View>
                      </TouchableOpacity>
                      <Text style={{ color: "black" }}>Yes</Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <TouchableOpacity
                        onPress={() => setMedicationForHeartProblem("no")}
                        style={{
                          padding: 5,
                          borderRadius: 100,
                          borderWidth: 1,
                          marginRight: 10,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor:
                              medicationForHeartProblem == "no"
                                ? "black"
                                : "white",
                            width: RFValue(10, 816),
                            height: RFValue(10, 816),
                            borderRadius: 100,
                          }}
                        ></View>
                      </TouchableOpacity>
                      <Text style={{ color: "black" }}>No</Text>
                    </View>
                  </View>
                ) : (
                  <Text
                    style={{
                      marginTop: RFValue(15, 816),
                      marginBottom: RFValue(15, 816),
                      fontSize: RFValue(15, 816),
                      textTransform: "capitalize",
                    }}
                  >
                    {medicationForHeartProblem}
                  </Text>
                )}
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
              <Text style={{ color: "black" }}>
                Do you know of any other reason why you should not engage in
                physical activity?
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 0,
                }}
              >
                {editable === true ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-evenly",
                      marginVertical: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        width: "50%",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => setKnowReason("yes")}
                        style={{
                          padding: 5,
                          borderRadius: 100,
                          borderWidth: 1,
                          marginRight: 10,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor:
                              knowReason == "yes" ? "black" : "white",
                            width: RFValue(10, 816),
                            height: RFValue(10, 816),
                            borderRadius: 100,
                          }}
                        ></View>
                      </TouchableOpacity>
                      <Text style={{ color: "black" }}>Yes</Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <TouchableOpacity
                        onPress={() => setKnowReason("no")}
                        style={{
                          padding: 5,
                          borderRadius: 100,
                          borderWidth: 1,
                          marginRight: 10,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor:
                              knowReason == "no" ? "black" : "white",
                            width: RFValue(10, 816),
                            height: RFValue(10, 816),
                            borderRadius: 100,
                          }}
                        ></View>
                      </TouchableOpacity>
                      <Text style={{ color: "black" }}>No</Text>
                    </View>
                  </View>
                ) : (
                  <Text
                    style={{
                      marginTop: RFValue(15, 816),
                      marginBottom: RFValue(15, 816),
                      fontSize: RFValue(15, 816),
                      textTransform: "capitalize",
                    }}
                  >
                    {knowReason}
                  </Text>
                )}
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
              <Text style={{ fontSize: RFValue(13, 816), color: "black" }}>
                If you have answered “Yes” to one or more of the above
                questions, consult your physician before engaging in physical
                activity. Tell your physician which questions you answered “Yes”
                to. After a medical evaluation, seek advice from your physician
                on what type of activity is suitable for your current condition.
              </Text>
            </View>

            <View
              style={{
                backgroundColor: "white",
                padding: RFValue(10, 816),
                borderRadius: RFValue(10, 816),
                marginTop: 20,
              }}
            >
              <View>
                <Text style={{ color: "black" }}>
                  Have you ever had any pain or injuries?
                </Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 0,
                  }}
                >
                  {editable === true ? (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-evenly",
                        marginVertical: 10,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          width: "50%",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => setHadPain("yes")}
                          style={{
                            padding: 5,
                            borderRadius: 100,
                            borderWidth: 1,
                            marginRight: 10,
                          }}
                        >
                          <View
                            style={{
                              backgroundColor:
                                hadPain == "yes" ? "black" : "white",
                              width: RFValue(10, 816),
                              height: RFValue(10, 816),
                              borderRadius: 100,
                            }}
                          ></View>
                        </TouchableOpacity>
                        <Text style={{ color: "black" }}>Yes</Text>
                      </View>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <TouchableOpacity
                          onPress={() => setHadPain("no")}
                          style={{
                            padding: 5,
                            borderRadius: 100,
                            borderWidth: 1,
                            marginRight: 10,
                          }}
                        >
                          <View
                            style={{
                              backgroundColor:
                                hadPain == "no" ? "black" : "white",
                              width: RFValue(10, 816),
                              height: RFValue(10, 816),
                              borderRadius: 100,
                            }}
                          ></View>
                        </TouchableOpacity>
                        <Text style={{ color: "black" }}>No</Text>
                      </View>
                    </View>
                  ) : (
                    <Text
                      style={{
                        marginTop: RFValue(15, 816),
                        marginBottom: RFValue(15, 816),
                        fontSize: RFValue(15, 816),
                        textTransform: "capitalize",
                      }}
                    >
                      {hadPain}
                    </Text>
                  )}
                </View>
              </View>
              {hadPain == "yes" ? (
                <View>
                  <Text style={{ color: "black" }}>
                    Please select applicable areas
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
                    {applicableAreas.map((area, idx) => (
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
                          value={isItemChecked(area)}
                          onValueChange={(evt) =>
                            handleCheckBoxChange(evt, area)
                          }
                        />
                        <Text style={{ marginLeft: RFValue(10, 816) }}>
                          {area}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {selectedApplicableAreas.includes("Other") ? (
                    <View>
                      <Text style={{ color: "black" }}>Please Explains</Text>
                      <View
                        style={{
                          borderColor: "#999",
                          marginVertical: RFValue(10, 816),
                          backgroundColor: "white",
                          borderRadius: 5,
                          borderWidth: 0.5,
                        }}
                      >
                        <UselessTextInput
                          multiline
                          numberOfLines={4}
                          placeholder="Please list any other Pain Applicable ares"
                          onChangeText={(text) => setOtherPainAreas(text)}
                          value={otherPainAreas}
                          isEnabled={editable ? true : false}
                        />
                      </View>
                    </View>
                  ) : null}
                </View>
              ) : null}
            </View>

            <View
              style={{
                backgroundColor: "white",
                padding: RFValue(10, 816),
                borderRadius: RFValue(10, 816),
                marginTop: 20,
              }}
            >
              <View>
                <Text style={{ color: "black" }}>
                  Have you ever had any surgeries?
                </Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 0,
                  }}
                >
                  {editable === true ? (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-evenly",
                        marginVertical: 10,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          width: "50%",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => setHadSurgeries("yes")}
                          style={{
                            padding: 5,
                            borderRadius: 100,
                            borderWidth: 1,
                            marginRight: 10,
                          }}
                        >
                          <View
                            style={{
                              backgroundColor:
                                hadSurgeries == "yes" ? "black" : "white",
                              width: RFValue(10, 816),
                              height: RFValue(10, 816),
                              borderRadius: 100,
                            }}
                          ></View>
                        </TouchableOpacity>
                        <Text style={{ color: "black" }}>Yes</Text>
                      </View>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <TouchableOpacity
                          onPress={() => setHadSurgeries("no")}
                          style={{
                            padding: 5,
                            borderRadius: 100,
                            borderWidth: 1,
                            marginRight: 10,
                          }}
                        >
                          <View
                            style={{
                              backgroundColor:
                                hadSurgeries == "no" ? "black" : "white",
                              width: RFValue(10, 816),
                              height: RFValue(10, 816),
                              borderRadius: 100,
                            }}
                          ></View>
                        </TouchableOpacity>
                        <Text style={{ color: "black" }}>No</Text>
                      </View>
                    </View>
                  ) : (
                    <Text
                      style={{
                        marginTop: RFValue(15, 816),
                        marginBottom: RFValue(15, 816),
                        fontSize: RFValue(15, 816),
                        textTransform: "capitalize",
                      }}
                    >
                      {hadSurgeries}
                    </Text>
                  )}
                </View>
              </View>
              {hadSurgeries == "yes" ? (
                <View>
                  <Text style={{ color: "black" }}>Please Explain</Text>
                  <View
                    style={{
                      borderColor: "#999",
                      marginVertical: RFValue(10, 816),
                      borderRadius: 5,
                      backgroundColor: "white",
                      borderWidth: 0.5,
                    }}
                  >
                    <UselessTextInput
                      multiline
                      numberOfLines={4}
                      placeholder="Please provide additional details of your surgery"
                      onChangeText={(text) => setSurgery(text)}
                      value={surgery}
                      isEnabled={editable ? true : false}
                    />
                  </View>
                </View>
              ) : null}
            </View>

            <View
              style={{
                backgroundColor: "white",
                padding: RFValue(10, 816),
                borderRadius: RFValue(10, 816),
                marginTop: 20,
              }}
            >
              <View>
                <Text style={{ color: "black" }}>
                  Has a medical doctor ever diagnosed you with a chronic
                  disease?
                </Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 0,
                  }}
                >
                  {editable === true ? (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-evenly",
                        marginVertical: 10,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          width: "50%",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => setChronicDisease("yes")}
                          style={{
                            padding: 5,
                            borderRadius: 100,
                            borderWidth: 1,
                            marginRight: 10,
                          }}
                        >
                          <View
                            style={{
                              backgroundColor:
                                chronicDisease == "yes" ? "black" : "white",
                              width: RFValue(10, 816),
                              height: RFValue(10, 816),
                              borderRadius: 100,
                            }}
                          ></View>
                        </TouchableOpacity>
                        <Text style={{ color: "black" }}>Yes</Text>
                      </View>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <TouchableOpacity
                          onPress={() => setChronicDisease("no")}
                          style={{
                            padding: 5,
                            borderRadius: 100,
                            borderWidth: 1,
                            marginRight: 10,
                          }}
                        >
                          <View
                            style={{
                              backgroundColor:
                                chronicDisease == "no" ? "black" : "white",
                              width: RFValue(10, 816),
                              height: RFValue(10, 816),
                              borderRadius: 100,
                            }}
                          ></View>
                        </TouchableOpacity>
                        <Text style={{ color: "black" }}>No</Text>
                      </View>
                    </View>
                  ) : (
                    <Text
                      style={{
                        marginTop: RFValue(15, 816),
                        marginBottom: RFValue(15, 816),
                        fontSize: RFValue(15, 816),
                        textTransform: "capitalize",
                      }}
                    >
                      {chronicDisease}
                    </Text>
                  )}
                </View>
              </View>

              {chronicDisease == "yes" ? (
                <View>
                  <Text style={{ color: "black" }}>
                    Please select applicable ailments
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
                    {applicableAilments.map((ailment, idx) => (
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
                          value={isAilmentChecked(ailment)}
                          onValueChange={(evt) =>
                            handleAilmentsCheckBoxChange(evt, ailment)
                          }
                        />
                        <Text style={{ marginLeft: RFValue(10, 816) }}>
                          {ailment}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {selectedApplicableAilments.includes("Other") ? (
                    <View>
                      <Text style={{ color: "black" }}>Please Explains</Text>
                      <View
                        style={{
                          borderColor: "#999",
                          marginVertical: RFValue(10, 816),
                          backgroundColor: "white",
                          borderRadius: 5,
                          borderWidth: 0.5,
                        }}
                      >
                        <UselessTextInput
                          multiline
                          numberOfLines={4}
                          placeholder="Please list any medication you are currently taking"
                          onChangeText={(text) => setOtherAilments(text)}
                          value={otherAilments}
                          isEnabled={editable ? true : false}
                        />
                      </View>
                    </View>
                  ) : null}
                </View>
              ) : null}
            </View>

            <View
              style={{
                backgroundColor: "white",
                padding: RFValue(10, 816),
                borderRadius: RFValue(10, 816),
                marginTop: 20,
              }}
            >
              <View>
                <Text style={{ color: "black" }}>
                  Are you currently taking any medication?
                </Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 0,
                  }}
                >
                  {editable === true ? (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-evenly",
                        marginVertical: 10,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          width: "50%",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => setTakingMedication("yes")}
                          style={{
                            padding: 5,
                            borderRadius: 100,
                            borderWidth: 1,
                            marginRight: 10,
                          }}
                        >
                          <View
                            style={{
                              backgroundColor:
                                takingMedication == "yes" ? "black" : "white",
                              width: RFValue(10, 816),
                              height: RFValue(10, 816),
                              borderRadius: 100,
                            }}
                          ></View>
                        </TouchableOpacity>
                        <Text style={{ color: "black" }}>Yes</Text>
                      </View>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <TouchableOpacity
                          onPress={() => setTakingMedication("no")}
                          style={{
                            padding: 5,
                            borderRadius: 100,
                            borderWidth: 1,
                            marginRight: 10,
                          }}
                        >
                          <View
                            style={{
                              backgroundColor:
                                takingMedication == "no" ? "black" : "white",
                              width: RFValue(10, 816),
                              height: RFValue(10, 816),
                              borderRadius: 100,
                            }}
                          ></View>
                        </TouchableOpacity>
                        <Text style={{ color: "black" }}>No</Text>
                      </View>
                    </View>
                  ) : (
                    <Text
                      style={{
                        marginTop: RFValue(15, 816),
                        marginBottom: RFValue(15, 816),
                        fontSize: RFValue(15, 816),
                        textTransform: "capitalize",
                      }}
                    >
                      {takingMedication}
                    </Text>
                  )}
                </View>
              </View>
              {takingMedication == "yes" ? (
                <View>
                  <Text style={{ color: "black" }}>Please Explains</Text>
                  <View
                    style={{
                      borderColor: "#999",
                      marginVertical: RFValue(10, 816),
                      backgroundColor: "white",
                      borderRadius: 5,
                      borderWidth: 0.5,
                    }}
                  >
                    <UselessTextInput
                      multiline
                      numberOfLines={4}
                      placeholder="Please list any medication you are currently taking"
                      onChangeText={(text) => setMedicationDetails(text)}
                      value={medicationDetails}
                      isEnabled={editable ? true : false}
                    />
                  </View>
                </View>
              ) : null}
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
               Any medical condition 
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
                placeholder="Describe your medical condition"
                defaultValue={userData?.data?.medicalCondition}
                value={medicalCondition}
                onChangeText={setMedicalCondition}
              />
            </View>


            {editable && (
              <View style={{ alignItems: "center" }}>
                <TouchableOpacity
                  style={{
                    height: RFValue(52, 816),
                    width: ScreenWidth - RFValue(100, 816),
                    marginTop: RFValue(15, 816),
                    marginBottom: 25,
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
                        color: "white",
                        fontFamily: "SF-Pro-Display-regular",
                        fontSize: RFValue(18, 816),
                        textAlign: "center",
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

export default MedicalAssessment;
