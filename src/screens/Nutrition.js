import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  TouchableHighlight,
  Alert,
  Linking,
} from "react-native";
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
import { db } from "../utils/firebase";
import { useDispatch, useSelector } from "react-redux";
import { selectUserData, selectUserType } from "../features/userSlice";
import { Icon } from "react-native-elements";
import { BarChart, XAxis, YAxis, Grid } from "react-native-svg-charts";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import NutritionCard from "./components/NutritionCard";
import ProgressBarComponent from "./components/ProgressComponent";
import NutritionGoalProgress from "./components/NutritionGoalProgress";
import WaterCard from "./components/WaterCard";
import NutritionWeekGoal from "./components/NutritionWeekGoal";
import { useCallback } from "react";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import moment from "moment";
import Notification from "./components/Notification";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3",
    marginBottom: 0,
    paddingTop: RFValue(20, 816),
    paddingBottom: RFValue(50, 816),
    minHeight: ScreenHeight,
  },
  progressBar: {
    height: RFValue(20, 816),
    width: "100%",
    backgroundColor: "white",
    borderColor: "#000",
    borderWidth: 2,
    borderRadius: RFValue(5, 816),
  },
});

const Nutrition = ({ route, navigation }) => {
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const isFocused = useIsFocused();
  const [graphData, setGraphData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [upcomingMealHistory, setUpcomingMealHistory] = useState([]);
  const [mealHistory, setMealHistory] = useState([]);
  const [coachMealHistory, setCoachMealHistory] = useState([]);
  const [currentStartWeek, setCurrentStartWeek] = useState(null);
  const [currentEndWeek, setCurrentEndWeek] = useState(null);
  const [water, setWater] = useState(0);
  const [entireFood, setEntireFood] = useState([]);
  const [todaysFoodId, setTodaysFoodId] = useState("");

  useEffect(() => {
    if (userData?.data?.metrics) {
      if (userData?.data?.metrics[formatDate()]?.water) {
        setWater(userData?.data?.metrics[formatDate()]?.water);
      }
    }
  }, [userData?.data?.metrics, isFocused]);

  function formatDate() {
    var d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  function formatDate1(day) {
    var d = new Date(day),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month].join("/");
  }

  function formatDate2(date) {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    month = monthNames[d.getMonth()];
    if (day.length < 2) day = "0" + day;

    return [month, day].join(" ");
  }

  useEffect(() => {
    if (userData?.id) {
      getInitialData();
    }
  }, [userData?.id, isFocused]);

  const getInitialData = async () => {
    db.collection("AthleteNutrition")
      .doc(userData?.id)
      .collection("nutrition")
      .doc(formatDate())
      .get()
      .then((doc) => {
        if (doc.data()?.entireFood) {
          setEntireFood(doc.data()?.entireFood);
          setTodaysFoodId(doc.id);
        }
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  useEffect(() => {
    let temp = [];

    if (userData?.id) {
      db.collection("AthleteNutrition")
        .doc(userData?.id)
        .collection("nutrition")
        .limit(3)
        .onSnapshot((querySnapshot) => {
          querySnapshot.forEach((doc) => {
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
          });
          setMealHistory(temp);
          console.log(temp);
        });
    }
  }, [userData?.id, isFocused]);

  useEffect(() => {
    let temp = [];
    db.collection("Food")
      .where("assignedTo_id", "==", userData?.id)
      .where(
        "selectedDays",
        "array-contains",
        moment(new Date()).format("YYYY-MM-DD")
      )
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.data().nutrition) {
            temp.push({ id: doc.id, data: doc.data() });
          }
        });
        setCoachMealHistory(temp);
      });
  }, [userData, isFocused]);

  useEffect(() => {
    var cals = [];
    var tempDate = currentStartWeek;
    var total;
    var count = 0;

    db.collection("Food")
      // .where("date", ">=", currentStartWeek)
      // .where("date", "<=", currentEndWeek)
      .orderBy("date")
      .get()
      .then((querySnapshot) => {
        while (count < 7) {
          total = 0;
          querySnapshot.forEach((doc) => {
            if (
              doc.data()?.nutrition.entireFood &&
              doc.data().assignedTo_id === userData?.id &&
              formatSpecificDate(new Date(doc.data().date.seconds * 1000)) ==
                tempDate
            ) {
              doc.data()?.nutrition.entireFood.map((foodContainer) => {
                foodContainer.food.map((f) => {
                  total = total + f.calories;
                });
              });
            }
          });
          cals.push(parseInt(total));
          let tDate = new Date(tempDate);
          tempDate = formatSpecificDate(
            new Date(tDate.setDate(tDate.getDate() + 1)).toUTCString()
          );
          count = count + 1;
        }

        setGraphData(cals);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, [currentStartWeek, currentEndWeek, isFocused]);

  useEffect(() => {
    let temp = [];
    db.collection("Food")
      .where("assignedTo_id", "==", userData?.id)
      .where("selectedDays", "array-contains", formatSpecificDate(new Date()))
      .get()
      .then((snapshot) => {
        setUpcomingMealHistory(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, [userData?.id, isFocused]);

  useEffect(() => {
    var curr = new Date(); // get current date
    var first = curr.getDate() - curr.getDay(); // First day is the  day of the month - the day of the week \

    var firstday = new Date(curr.setDate(first)).toUTCString();
    var lastday = new Date(curr.setDate(curr.getDate() + 6)).toUTCString();

    setCurrentStartWeek(formatSpecificDate(firstday));
    setCurrentEndWeek(formatSpecificDate(lastday));
  }, []);

  function formatSpecificDate(d) {
    var d = new Date(d),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  function formatSpecificDay(d) {
    var d = new Date(d),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return day;
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
                navigation.navigate("Home", { screen: "Home" });
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
                fontSize: RFValue(25, 816),
                fontFamily: "SF-Pro-Text-regular",
                marginLeft: RFValue(20, 816),
                fontWeight: "bold",
                color: "black",
              }}
            >
              Nutrition
            </Text>

            <Text
              style={{
                color: "brown",
                fontSize: RFValue(18, 816),
                marginStart: 10,
              }}
              onPress={() =>
                Linking.openURL(
                  "https://firebasestorage.googleapis.com/v0/b/fitnessapp0.appspot.com/o/TMC-Nutritinist-Certification.jpeg?alt=media&token=437e6b28-29a2-4f75-8ffc-de83af50b5e3"
                )
              }
            >
              Coach Certificate
            </Text>
            <Icon
              name="document-outline"
              type="ionicon"
              size={24}
              onPress={() =>
                Linking.openURL(
                  "https://firebasestorage.googleapis.com/v0/b/fitnessapp0.appspot.com/o/TMC-Nutritinist-Certification.jpeg?alt=media&token=437e6b28-29a2-4f75-8ffc-de83af50b5e3"
                )
              }
            />
          </View>

          {/*
          <TouchableOpacity
            style={{
              backgroundColor: "#C19F1E",
              paddingHorizontal:RFValue(15, 816),
              paddingVertical:RFValue(8, 816),
              borderRadius: 50,
              marginRight:RFValue(20, 816),
            }}
            onPress={() => {
              navigation.navigate("AddMeal", {
                entireFood: entireFood,
                todaysFoodId: todaysFoodId,
                nutrition:coachMealHistory[0],
              });
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Icon
                name="plus"
                size={12}
                style={{ marginRight: RFValue(10, 816)}}
                color="black"
                type="font-awesome-5"
              />
              <Text
                style={{ fontSize:RFValue(12, 816), fontWeight: "bold", color: "black" }}
              >
                ADD MEAL
              </Text>
            </View>
            </TouchableOpacity>*/}
          <Notification navigation={navigation} />
        </View>

        <View
          style={{
            marginTop: RFValue(25, 816),
            padding: RFValue(10, 816),
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
            }}
          >
            <Text
              style={{
                fontSize: RFValue(16, 816),
                marginBottom: RFValue(10, 816),
                fontWeight: "700",
                color: "black",
              }}
            >
              Today's Stats and Goals
            </Text>
          </View>
          <NutritionGoalProgress
            navigation={navigation}
            requestDate={moment().format("YYYY-MM-DD")}
          />
          <WaterCard date={formatDate()} water={water} setWater={setWater} />
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "87%",
            }}
          >
            <Text
              style={{
                fontSize: RFValue(17, 816),
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
              }}
            >
              Upcoming Meals
            </Text>
          </View>

          <View
            style={{
              marginVertical: RFValue(10, 816),
              width: "100%",
            }}
          >
            {upcomingMealHistory.length > 0 ? (
              upcomingMealHistory?.map((food, idx) => (
                <NutritionCard
                  key={idx}
                  nutrition={upcomingMealHistory}
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
                There are no upcoming meals for now
              </Text>
            )}
          </View>

          <View
            style={{
              flexDirection: "row",
              width: "100%",
              marginTop: RFValue(15, 816),
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: RFValue(17, 816),
                fontFamily: "SF-Pro-Text-regular",
                color: "#303030",
              }}
            >
              Meal History
            </Text>
            <TouchableHighlight
              style={{
                paddingHorizontal: RFValue(10, 816),
                paddingVertical: RFValue(5, 816),
                borderRadius: RFValue(8, 816),
              }}
              onPress={() => navigation.navigate("MealHistory")}
              activeOpacity={0.6}
              underlayColor="#DDDDDD"
            >
              <Text
                style={{
                  fontSize: RFValue(12, 816),
                  color: "#303030",
                }}
              >
                View all
              </Text>
            </TouchableHighlight>
          </View>

          {mealHistory.length > 0 ? (
            <View
              style={{
                marginVertical: RFValue(10, 816),
                width: "100%",
              }}
            >
              {mealHistory?.map((food, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={{
                    width: "100%",
                    height: RFValue(120, 816),
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#fff",
                    marginVertical: RFValue(10, 816),
                    padding: RFValue(10, 816),
                    borderRadius: RFValue(8, 816),
                  }}
                  onPress={() => {
                    navigation.navigate("AddMeal", {
                      entireFood: food.data.entireFood,
                      todaysFoodId: food.id,
                      nutrition: coachMealHistory[0],
                    });
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
                                .doc(userData?.id)
                                .collection("nutrition")
                                .doc(food.id)
                                .delete()
                                .then(() => {
                                  console.log("Document successfully deleted!");
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
                      width: RFValue(80, 816),
                      height: RFValue(80, 816),
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
                        style={{
                          fontSize: RFValue(12, 816),
                          width: RFValue(60, 816),
                        }}
                      >
                        Calories
                      </Text>
                      <Text style={{ fontSize: RFValue(12, 816) }}>
                        {food.data.calories.toFixed(2)}
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
                        style={{
                          fontSize: RFValue(12, 816),
                          width: RFValue(60, 816),
                        }}
                      >
                        Carbs
                      </Text>
                      <Text style={{ fontSize: RFValue(12, 816) }}>
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
                        style={{
                          fontSize: RFValue(12, 816),
                          width: RFValue(60, 816),
                        }}
                      >
                        Fat
                      </Text>
                      <Text style={{ fontSize: RFValue(12, 816) }}>
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
                        style={{
                          fontSize: RFValue(12, 816),
                          width: RFValue(60, 816),
                        }}
                      >
                        Proteins
                      </Text>
                      <Text style={{ fontSize: RFValue(12, 816) }}>
                        {food.data.proteins.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      right: RFValue(25, 816),
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
                backgroundColor: "#fff",
                width: "100%",
                paddingVertical: RFValue(10, 816),
                textAlign: "center",
                borderRadius: RFValue(8, 816),
                marginTop: RFValue(10, 816),
              }}
            >
              There are no meals
            </Text>
          )}

          <View
            style={{
              flexDirection: "row",
              width: "100%",
              marginTop: RFValue(15, 816),
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: RFValue(17, 816),
                fontFamily: "SF-Pro-Text-regular",
                color: "#303030",
              }}
            >
              Assigned Meals By Coach
            </Text>
            <TouchableHighlight
              style={{
                paddingVertical: RFValue(5, 816),
                borderRadius: RFValue(8, 816),
                paddingHorizontal: RFValue(10, 816),
              }}
              onPress={() => navigation.navigate("CoachMealHistory")}
              activeOpacity={0.6}
              underlayColor="#DDDDDD"
            >
              <Text
                style={{
                  fontSize: RFValue(12, 816),
                  color: "#303030",
                }}
              >
                View all
              </Text>
            </TouchableHighlight>
          </View>

          <View
            style={{
              marginVertical: RFValue(10, 816),
            }}
          >
            {coachMealHistory.length > 0 ? (
              coachMealHistory?.map((food, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={{
                    width: "100%",
                    height: RFValue(80, 816),
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#fff",
                    marginVertical: RFValue(10, 816),
                    padding: RFValue(10, 816),
                    borderRadius: RFValue(8, 816),
                  }}
                  onPress={() =>
                    navigation.navigate("CoachAddMeal", {
                      type: "view",
                      nutrition: food,
                    })
                  }
                >
                  <Image
                    style={{
                      width: RFValue(60, 816),
                      height: RFValue(60, 816),
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
                      {food.data.nutrition.nutritionName}
                    </Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      {food.data.selectedDays.map((day, i) => (
                        <Text key={i} style={{ fontSize: RFValue(10, 816) }}>
                          {formatDate1(day)}
                          {i < food.data.selectedDays.length - 1 ? "," : null}
                        </Text>
                      ))}
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
                      color="#555"
                      type="font-awesome-5"
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
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
                  marginTop: RFValue(10, 816),
                }}
              >
                There are no assigned meals.
              </Text>
            )}
          </View>

          <View style={{ width: "100%" }}>
            <NutritionWeekGoal navigation={navigation} />
          </View>
          <View
            style={{
              backgroundColor: "white",
              alignItems: "center",
              borderRadius: RFValue(10, 816),
              marginBottom: 30,
              width: "100%",
              marginTop: RFValue(20, 816),
            }}
          >
            <Text
              style={{
                fontSize: RFValue(18, 816),
                fontFamily: "SF-Pro-Text-regular",
                marginVertical: RFValue(20, 816),
              }}
            >
              Weekly Report
            </Text>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  marginRight: RFValue(20, 816),
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPress={() => {
                  var curr = new Date(currentStartWeek); // get current date
                  var first = curr.getDate() - curr.getDay() - 7; // First day is the  day of the month - the day of the week \

                  var firstday = new Date(curr.setDate(first)).toUTCString();
                  var lastday = new Date(
                    curr.setDate(curr.getDate() + 6)
                  ).toUTCString();

                  setCurrentStartWeek(formatSpecificDate(firstday));
                  setCurrentEndWeek(formatSpecificDate(lastday));
                }}
              >
                <Icon
                  name="chevron-left"
                  size={15}
                  style={{ marginRight: RFValue(10, 816) }}
                  type="font-awesome-5"
                />
              </TouchableOpacity>
              <Text style={{ width: "46%", textAlign: "center" }}>
                {formatDate2(currentStartWeek)} - {formatDate2(currentEndWeek)}
              </Text>
              <TouchableOpacity
                style={{
                  marginLeft: RFValue(20, 816),
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPress={() => {
                  var curr = new Date(currentStartWeek); // get current date
                  var first = curr.getDate() - curr.getDay() + 7; // First day is the  day of the month - the day of the week \

                  var firstday = new Date(curr.setDate(first)).toUTCString();
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
                  style={{ marginRight: RFValue(10, 816) }}
                  type="font-awesome-5"
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                height: RFValue(250, 816),
                width: "100%",
                padding: RFValue(20, 816),
                paddingBottom: RFValue(50, 816),
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  position: "absolute",
                  zIndex: 1,
                  top: "50%",
                  left: -5,
                  transform: [{ rotate: "270deg" }],
                }}
              >
                Calories
              </Text>
              <YAxis
                data={graphData}
                contentInset={{ top: RFValue(5, 816), bottom: 5 }}
                svg={{
                  fill: "grey",
                  fontSize: RFValue(12, 816),
                }}
                style={{
                  height: RFValue(150, 816),
                  marginRight: RFValue(5, 816),
                  marginLeft: RFValue(20, 816),
                }}
                formatLabel={(value) => `${value}`}
                numberOfTicks={6}
              />
              <View style={{ height: RFValue(220, 816), width: "80%" }}>
                <BarChart
                  style={{ height: RFValue(200, 816), paddingBottom: 0 }}
                  data={[...graphData]}
                  svg={{ fill: `#C19F1E` }}
                  spacingInner={0.45}
                  spacingOuter={0.3}
                  contentInset={{
                    top: RFValue(30, 816),
                    bottom: RFValue(10, 816),
                  }}
                >
                  {/* #7388A9 */}
                </BarChart>
                <XAxis
                  style={{ marginHorizontal: RFValue(10, 816) }}
                  data={graphData}
                  formatLabel={(value, index) =>
                    formatSpecificDay(
                      new Date(
                        new Date(currentStartWeek).setDate(
                          new Date(currentStartWeek).getDate() + index
                        )
                      ).toUTCString()
                    )
                  }
                  contentInset={{
                    left: RFValue(10, 816),
                    right: RFValue(10, 816),
                  }}
                  svg={{
                    fontSize: RFValue(12, 816),
                    fill: "#333",
                    fontWeight: "600",
                  }}
                />
                {graphData.length > 1 ? (
                  <Text
                    style={{ textAlign: "center", marginTop: RFValue(10, 816) }}
                  >
                    Days{" "}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <TouchableOpacity
        style={{
          position: "absolute",
          right: RFValue(30, 816),
          bottom: RFValue(110, 816),
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
        onPress={() => {
          navigation.navigate("AddMeal", {
            entireFood: entireFood,
            todaysFoodId: moment().format("YYYY-MM-DD"),
            nutrition: coachMealHistory[0],
          });
        }}
      >
        <Icon name="plus" type="font-awesome-5" color="white" size={20} />
      </TouchableOpacity>
    </View>
  );
};

export default Nutrition;
