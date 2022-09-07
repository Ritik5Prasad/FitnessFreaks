import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  BackHandler,
  Dimensions,
  Modal,
  TouchableHighlight,
  Image,
  Linking,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
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
  selectTemperoryId,
} from "../features/userSlice";
import { auth, db } from "../utils/firebase";
import { useFocusEffect } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import moment from "moment";
import Slider from "@react-native-community/slider";
import WorkoutCard from "./components/WorkoutCard";
import NutritionCard from "./components/NutritionCard";
import NutritionGoalProgress from "./components/NutritionGoalProgress";
import ProgressBarComponent from "./components/ProgressComponent";
import firebase from "firebase";
import WaterCard from "./components/WaterCard";
import CalendarComponent from "./components/CalendarComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import sendPushNotification from "../screens/components/SendNotification";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Notification from "./components/Notification";

const styles = StyleSheet.create({
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

function AthleteHistory({ route, navigation }) {
  const userType = useSelector(selectUserType);
  const [workouts, setWorkouts] = useState([]);
  const [requestDate, setRequestDate] = useState(formatDate());
  const [nutrition, setNutrition] = useState([]);
  const temperoryId = useSelector(selectTemperoryId);
  const [mealHistory, setMealHistory] = useState([]);
  const [pastWorkouts, setPastWorkouts] = useState([]);
  const [ownWorkouts, setOwnWorkouts] = useState([]);
  const userData = useSelector(selectUserData);

  function formatDate() {
    var d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

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
    if (temperoryId) {
      db.collection("AthleteWorkouts")
        .doc(temperoryId)
        .collection(requestDate)
        .onSnapshot((snapshot) =>
          setOwnWorkouts(
            snapshot.docs.map((doc) => ({ id: doc.id, workouts: doc.data() }))
          )
        );
      console.log("hey", ownWorkouts);
    } else {
      db.collection("AthleteWorkouts")
        .doc(userData?.id)
        .collection(requestDate)
        .onSnapshot((snapshot) =>
          setOwnWorkouts(
            snapshot.docs.map((doc) => ({ id: doc.id, workouts: doc.data() }))
          )
        );
      console.log("hey", ownWorkouts);
    }
  }, [temperoryId, userData?.id, requestDate]);

  useEffect(() => {
    if (temperoryId) {
      db.collection("workouts")
        .where("assignedToId", "==", temperoryId)
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

      db.collection("workouts")
        .where("assignedToId", "==", temperoryId)
        .where("postWorkout.date", "==", requestDate)
        .where("completed", "==", true)
        .limit(3)
        .onSnapshot((snapshot) => {
          setPastWorkouts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });

      db.collection("Food")
        .where("assignedTo_id", "==", temperoryId)
        .where("selectedDays", "array-contains", requestDate)
        .get()
        .then((snapshot) => {
          setNutrition(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    } else {
      db.collection("workouts")
        .where("assignedToId", "==", userData?.id)
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

      db.collection("workouts")
        .where("assignedToId", "==", userData?.id)
        .where("postWorkout.date", "==", requestDate)
        .where("completed", "==", true)
        .limit(3)
        .onSnapshot((snapshot) => {
          setPastWorkouts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });

      db.collection("Food")
        .where("assignedTo_id", "==", userData?.id)
        .where("selectedDays", "array-contains", requestDate)
        .get()
        .then((snapshot) => {
          setNutrition(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }
  }, [temperoryId, userData?.id, requestDate]);

  useEffect(() => {
    let temp = [];
    if (temperoryId) {
      db.collection("AthleteNutrition")
        .doc(temperoryId)
        .collection("nutrition")
        .doc(requestDate)
        .get()
        .then((doc) => {
          if (doc.data()?.entireFood) {
            let tempCal = 0;
            let tempCarbs = 0;
            let tempFat = 0;
            let tempProtein = 0;
            //setEntireFood(doc.data()?.entireFood);
            doc.data()?.entireFood.map((foodContainer) => {
              foodContainer.food.map((f) => {
                tempCal = tempCal + f.calories;
                tempCarbs = tempCarbs + f.carbs;
                tempFat = tempFat + f.fat;
                tempProtein = tempProtein + f.proteins;
              });
            });
            let t = { ...doc.data() };
            t.calories = tempCal;
            t.carbs = tempCarbs;
            t.fat = tempFat;
            t.proteins = tempProtein;
            temp.push({ id: doc.id, data: t });
          }
          setMealHistory(temp);
        });
    } else {
      db.collection("AthleteNutrition")
        .doc(userData?.id)
        .collection("nutrition")
        .doc(requestDate)
        .get()
        .then((doc) => {
          if (doc.data()?.entireFood) {
            let tempCal = 0;
            let tempCarbs = 0;
            let tempFat = 0;
            let tempProtein = 0;
            //setEntireFood(doc.data()?.entireFood);
            doc.data()?.entireFood.map((foodContainer) => {
              foodContainer.food.map((f) => {
                tempCal = tempCal + f.calories;
                tempCarbs = tempCarbs + f.carbs;
                tempFat = tempFat + f.fat;
                tempProtein = tempProtein + f.proteins;
              });
            });
            let t = { ...doc.data() };
            t.calories = tempCal;
            t.carbs = tempCarbs;
            t.fat = tempFat;
            t.proteins = tempProtein;
            temp.push({ id: doc.id, data: t });
          }
          setMealHistory(temp);
        });
    }
  }, [temperoryId, userData?.id, requestDate]);

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
              marginLeft: 15,
            }}
          >
            <TouchableOpacity
              style={{ paddingRight: 20 }}
              onPress={() => navigation.goBack()}
            >
              <Icon name="chevron-left" type="font-awesome-5" />
            </TouchableOpacity>
            <Icon
              name="bars"
              type="font-awesome-5"
              size={24}
              onPress={() => navigation.toggleDrawer()}
            />
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
                    screen: "ViewAllWorkouts",
                    params: {
                      type: "non-editable",
                      assignedToId: temperoryId,
                    },
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
                    type="update"
                  />
                ))
              ) : (
                <Text
                  style={{
                    fontSize: RFValue(12, 816),
                    width: ScreenWidth - RFValue(20, 816),
                    paddingVertical: RFValue(10, 816),
                    textAlign: "center",
                    backgroundColor: "white",
                    borderRadius: RFValue(8, 816),
                    color: "black",
                  }}
                >
                  There are no workouts for now
                </Text>
              )}
            </View>

            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: RFValue(5, 816),
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: RFValue(16, 816),
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                Completed Workouts
              </Text>
              <TouchableHighlight
                style={{
                  top: 0,
                  paddingVertical: RFValue(5, 816),
                  borderRadius: RFValue(12, 816),
                }}
                activeOpacity={0.6}
                underlayColor="#DDDDDD"
                onPress={() =>
                  navigation.navigate("ViewAllWorkouts", {
                    type: "view",
                    assignedToId: temperoryId,
                    completed: true,
                  })
                }
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
              {pastWorkouts.length > 0 ? (
                pastWorkouts?.map((item, idx) => (
                  <WorkoutCard
                    key={idx}
                    workouts={pastWorkouts}
                    item={item}
                    idx={idx}
                    navigation={navigation}
                    completed={true}
                    type="non-editable"
                  />
                ))
              ) : (
                <Text
                  style={{
                    fontSize: RFValue(12, 816),
                    width: ScreenWidth - RFValue(20, 816),
                    paddingVertical: RFValue(10, 816),
                    textAlign: "center",
                    backgroundColor: "white",
                    borderRadius: RFValue(8, 816),
                    color: "black",
                  }}
                >
                  There are no completed workouts for now
                </Text>
              )}
            </View>

            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: RFValue(5, 816),
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: RFValue(16, 816),
                  fontWeight: "bold",
                  color: "black",
                  left: 0,
                }}
              >
                Meal History
              </Text>
              <TouchableHighlight
                style={{
                  top: 0,
                  paddingVertical: RFValue(5, 816),
                  borderRadius: RFValue(12, 816),
                }}
                onPress={() => {
                  if (userType === "athlete") {
                    navigation.navigate("MealHistory", {
                      type: "editable",
                    });
                  } else {
                    navigation.navigate("MealHistory", {
                      type: "non-editable",
                      athlete: route.params.athlete,
                    });
                  }
                }}
                activeOpacity={0.6}
                underlayColor="#DDDDDD"
              >
                <Text
                  style={{
                    fontSize: RFValue(10, 816),
                  }}
                >
                  View more
                </Text>
              </TouchableHighlight>
            </View>

            <View
              style={{
                alignItems: "center",
                width: "100%",
                marginBottom: RFValue(10, 816),
              }}
            >
              {mealHistory.length > 0 ? (
                <View
                  style={{
                    width: "100%",
                    paddingHorizontal: RFValue(10, 816),
                  }}
                >
                  {mealHistory?.map((food, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={{
                        width: "100%",
                        height: 120,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#fff",
                        marginVertical: RFValue(10, 816),
                        padding: RFValue(10, 816),
                        borderRadius: RFValue(8, 816),
                      }}
                      onPress={() => {
                        if (userType === "athlete") {
                          navigation.navigate("AddMeal", {
                            entireFood: food.data.entireFood,
                            type: "editable",
                            todaysFoodId: food.id,
                          });
                        } else {
                          navigation.navigate("AddMeal", {
                            entireFood: food.data.entireFood,
                            type: "non-editable",
                            todaysFoodId: food.id,
                            athlete: route.params.athlete,
                          });
                        }
                      }}
                      onLongPress={() => {
                        if (userType === "athlete") {
                          Alert.alert(
                            "Delete this Meal plan",
                            "Are you sure you want to delete it?",
                            [
                              {
                                text: "Cancel",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel",
                              },
                              {
                                text: "OK",
                                onPress: () => {
                                  db.collection("AthleteNutrition")
                                    .collection("nutrition")
                                    .doc(formatSpecificDate(new Date()))
                                    .delete()
                                    .then(() => {
                                      console.log(
                                        "Document successfully deleted!"
                                      );
                                    })
                                    .catch((error) => {
                                      console.error(
                                        "Error removing document: ",
                                        error
                                      );
                                    });
                                },
                              },
                            ],
                            { cancelable: false }
                          );
                        }
                      }}
                    >
                      <Image
                        style={{
                          width: 80,
                          height: 80,
                          margin: RFValue(5, 816),
                          borderRadius: RFValue(8, 816),
                          backgroundColor: "#ddd",
                        }}
                        source={require("../../assets/nutrition.jpeg")}
                      />
                      <View
                        style={{
                          flexDirection: "column",
                          marginHorizontal: RFValue(15, 816),
                        }}
                      >
                        <Text
                          style={{
                            fontSize: RFValue(15, 816),
                            fontWeight: "700",
                            marginBottom: RFValue(8, 816),
                          }}
                        >
                          {moment(food.id, "YYYY-MM-DD").format("DD-MM-YYYY")}
                        </Text>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{ fontSize: RFValue(12, 816), width: 60 }}
                          >
                            Calories
                          </Text>
                          <Text style={{ fontSize: 12 }}>
                            {food.data.calories}
                          </Text>
                        </View>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{ fontSize: RFValue(12, 816), width: 60 }}
                          >
                            Carbs
                          </Text>
                          <Text style={{ fontSize: 12 }}>
                            {food.data.carbs.toFixed(2)}
                          </Text>
                        </View>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{ fontSize: RFValue(12, 816), width: 60 }}
                          >
                            Fat
                          </Text>
                          <Text style={{ fontSize: 12 }}>
                            {food.data.fat.toFixed(2)}
                          </Text>
                        </View>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{ fontSize: RFValue(12, 816), width: 60 }}
                          >
                            Proteins
                          </Text>
                          <Text style={{ fontSize: 12 }}>
                            {food.data.proteins.toFixed(2)}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={{
                          position: "absolute",
                          right: 25,
                        }}
                        // onPress={() => {
                        //   navigation.navigate("AddMeal");
                        // }}
                      >
                        <Icon
                          name="chevron-right"
                          color="black"
                          type="font-awesome-5"
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Text
                  style={{
                    fontSize: RFValue(12, 816),
                    width: ScreenWidth - RFValue(20, 816),
                    paddingVertical: RFValue(10, 816),
                    textAlign: "center",
                    backgroundColor: "white",
                    borderRadius: RFValue(8, 816),
                    color: "black",
                  }}
                >
                  There are no meals
                </Text>
              )}
            </View>

            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: RFValue(5, 816),
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: RFValue(16, 816),
                  fontWeight: "bold",
                  color: "black",
                  left: 0,
                }}
              >
                Own Workouts
              </Text>
              {/* <TouchableHighlight
                style={{
                  top: 0,
                  paddingVertical: RFValue(5, 816),
                  borderRadius: RFValue(12, 816),
                }}
                // onPress={() =>

                // }
                activeOpacity={0.6}
                underlayColor="#DDDDDD"
              >
                <Text
                  style={{
                    fontSize: RFValue(10, 816),
                  }}
                >
                  View more
                </Text>
              </TouchableHighlight> */}
            </View>

            <View
              style={{
                alignItems: "center",
                width: "100%",
                marginBottom: RFValue(10, 816),
              }}
            >
              {ownWorkouts.length > 0 ? (
                <View
                  style={{
                    width: "100%",
                    paddingHorizontal: RFValue(10, 816),
                  }}
                >
                  <TouchableOpacity
                    style={{
                      width: "100%",
                      height: 120,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#fff",
                      marginVertical: RFValue(10, 816),
                      padding: RFValue(10, 816),
                      borderRadius: RFValue(8, 816),
                    }}
                    onPress={() => {
                      navigation.navigate("OwnWorkout", {
                        workout: ownWorkouts[0].workouts,
                        navigation: navigation,
                      });
                    }}
                  >
                    <Image
                      style={{
                        width: 80,
                        height: 80,
                        margin: RFValue(5, 816),
                        borderRadius: RFValue(8, 816),
                        backgroundColor: "#ddd",
                      }}
                      source={require("../../assets/illustration.jpeg")}
                    />
                    <View
                      style={{
                        flexDirection: "column",
                        marginHorizontal: RFValue(15, 816),
                      }}
                    >
                      <Text
                        style={{
                          fontSize: RFValue(15, 816),
                          fontWeight: "700",
                          marginBottom: RFValue(8, 816),
                        }}
                      >
                        {ownWorkouts[0].workouts.preWorkout.workoutName}
                      </Text>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ fontSize: RFValue(12, 816), width: 60 }}>
                          Duration
                        </Text>
                        <Text style={{ fontSize: 12 }}>
                          {ownWorkouts[0].workouts.preWorkout.workoutDuration}
                        </Text>
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      ></View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      ></View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      ></View>
                    </View>
                    <TouchableOpacity
                      style={{
                        position: "absolute",
                        right: 25,
                      }}
                      // onPress={() => {
                      //   navigation.navigate("AddMeal");
                      // }}
                    >
                      <Icon
                        name="chevron-right"
                        color="black"
                        type="font-awesome-5"
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text
                  style={{
                    fontSize: RFValue(12, 816),
                    width: ScreenWidth - RFValue(20, 816),
                    paddingVertical: RFValue(10, 816),
                    textAlign: "center",
                    backgroundColor: "white",
                    borderRadius: RFValue(8, 816),
                    color: "black",
                  }}
                >
                  There are no workouts
                </Text>
              )}
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
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

export default AthleteHistory;
