import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
let ScreenWidth = Dimensions.get("window").width;
let ScreenHeight = Dimensions.get("window").height;
import { useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { selectUserData, selectUserType } from "../features/userSlice";
import { db } from "../utils/firebase";
import { Icon } from "react-native-elements";
import WorkoutCard from "./components/WorkoutCard";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Notification from "./components/Notification";


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3",
    marginBottom: 0,
    paddingTop: RFValue(20, 816),
    height: ScreenHeight,
  },
});

function AthleteWorkoutList({ route, navigation }) {
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const [workouts, setWorkouts] = useState([]);
  const [pastWorkouts, setPastWorkouts] = useState([]);
  const [upcomingWorkouts, setupcomingWorkouts] = useState([]);
  const [completedWorkouts, setCompletedWorkouts] = useState("");
  const [averageWorkoutTime, setAverageWorkoutTime] = useState("");
  const [requestDate, setRequestDate] = useState(formatDate());
  const isFocused = useIsFocused();

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
    if (userData?.id && userType === "athlete") {
      var unsub1 = db
        .collection("athletes")
        .doc(userData?.id)
        .onSnapshot((doc) => {
          setCompletedWorkouts(
            doc.data().completedWorkouts ? doc.data().completedWorkouts : 0
          );
          setAverageWorkoutTime(
            doc.data().averageWorkoutTime
              ? doc.data().averageWorkoutTime?.toFixed(2)
              : 0
          );
        });
      return () => {
        unsub1();
      };
    }
  }, [userData?.id, isFocused]);

  useEffect(() => {
    if (userData) {
      var unsub2 = db
        .collection("workouts")
        .where("assignedToId", "==", userData?.id)

        .where("completed", "==", false)
        .onSnapshot((snapshot) => {
          setWorkouts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });

      var unsub2 = db
        .collection("workouts")
        .where("assignedToId", "==", userData?.id)
        .where("completed", "==", false)
        .where("date", "==", requestDate)
        .orderBy("selectedDay", "desc")
        .limit(3)
        .onSnapshot((snapshot) => {
          setupcomingWorkouts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });

      var unsub3 = db
        .collection("workouts")
        .where("assignedToId", "==", userData?.id)
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

      return () => {
        unsub2();
        unsub3();
      };
    }
  }, [userData?.id, isFocused]);

  // useEffect(() => {
  //   if (workouts.length > 0) {
  //     console.log("ss", workouts);
  //     let workouts_list = [];

  //     workouts?.forEach((data) => {
  //       //console.log("aa", data.data.date);
  //       let dt = new Date(data.data.date);
  //       let todaydate = new Date(formatDate());

  //       console.log("1", data.data.date, dt, todaydate);
  //       if (dt > todaydate) {
  //         workouts_list.push(data);
  //         console.log("high", dt, todaydate);
  //       }
  //       if (workouts_list.length > 0) {
  //         setupcomingWorkouts(workouts_list);
  //         console.log("s", upcomingWorkouts);
  //       }
  //     });
  //   }
  // }, [workouts]);

  // useEffect(() => {
  //   if (userData) {
  //     db.collection("workouts")
  //       .where("assignedToId", "==", userData?.id)
  //       //.where("date", "==", formatDate())
  //       .where("completed", "==", false)
  //       .onSnapshot((snapshot) => {
  //         setWorkouts(
  //           snapshot.docs.map((doc) => ({
  //             id: doc.id,
  //             data: doc.data(),
  //           }))
  //         );
  //       });

  //     db.collection("workouts")
  //       .where("assignedToId", "==", userData?.id)
  //       .where("completed", "==", true)
  //       .limit(4)
  //       .onSnapshot((snapshot) => {
  //         setPastWorkouts(
  //           snapshot.docs.map((doc) => ({
  //             id: doc.id,
  //             data: doc.data(),
  //           }))
  //         );
  //       });
  //   }
  // }, [isFocused]);

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
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
              <Icon name="chevron-left" type="font-awesome-5" color="black" />
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
                color: "black",
                marginLeft: RFValue(20, 816),
              }}
            >
              Workouts
            </Text>
          </View>
          <Notification navigation={navigation} />
        </View>
        {/* <TouchableOpacity
          style={{
            marginLeft: "80%",
            backgroundColor: "#C19F1E",
            borderRadius: 100,
            padding: RFValue(10, 816),
            width: RFValue(60, 816),
            height: RFValue(60, 816),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => navigation.navigate("AthleteCreateWorkout")}
        >
          <Icon name="plus" type="font-awesome-5" color="white" size={20} />
        </TouchableOpacity> */}
        <View
          style={{
            width: "100%",
            marginHorizontal: RFValue(10, 816),
            marginTop: RFValue(40, 816),
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: -40,
            }}
          >
            <Text
              style={{
                fontSize: RFValue(16, 816),
                fontWeight: "700",
                color: "black",
              }}
            >
              upcoming Workouts
            </Text>
            {/* <TouchableHighlight
              style={{
                paddingVertical: RFValue(5, 816),
                paddingHorizontal: RFValue(10, 816),
                borderRadius: RFValue(12, 816),
              }}
              activeOpacity={0.6}
              underlayColor="#DDDDDD"
              onPress={() =>
                navigation.navigate("ViewAllUpcomingWorkouts", { type: "view" })
              }
            >
              <Text
                style={{
                  fontSize: RFValue(12, 816),
                  marginRight: RFValue(10, 816),
                }}
              >
                View All
              </Text>
            </TouchableHighlight> */}
          </View>

          <View
            style={{
              width: "100%",
              marginHorizontal: 0,
              marginVertical: RFValue(20, 816),
            }}
          >
            {upcomingWorkouts?.length > 0 ? (
              upcomingWorkouts
                .slice(0, 3)
                ?.map((item, idx) => (
                  <WorkoutCard
                    key={idx}
                    workouts={workouts}
                    item={item}
                    idx={idx}
                    navigation={navigation}
                    type="view"
                    selecteddate={item.data.date}
                  />
                ))
            ) : (
              <Text
                style={{
                  fontSize: RFValue(12, 816),
                  backgroundColor: "#fff",
                  width: "95%",
                  paddingVertical: RFValue(10, 816),
                  textAlign: "center",
                  borderRadius: RFValue(8, 816),
                }}
              >
                There are no upcoming workouts for now
              </Text>
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              marginBottom: RFValue(10, 816),
            }}
          >
            <Text
              style={{
                fontSize: RFValue(16, 816),
                fontWeight: "700",
                position: "absolute",
                left: 0,
                color: "black",
              }}
            >
              Workout History
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: RFValue(10, 816),
              backgroundColor: "#fff",
              width: "95%",
              height: RFValue(68, 816),
              borderRadius: RFValue(8, 816),
              paddingHorizontal: RFValue(20, 816),
              paddingVertical: RFValue(10, 816),
              marginVertical: RFValue(25, 816),
            }}
          >
            <View
              style={{
                display: "flex",
                alignItems: "center",
                paddingHorizontal: RFValue(10, 816),

                width: "33.3%",
                borderRightWidth: 1,
                borderColor: "#94A5A6",
              }}
            >
              <Text
                style={{
                  color: "black",
                  fontSize: RFValue(12, 816),
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {completedWorkouts}
              </Text>
              <Text style={{ fontSize: RFValue(12, 816), textAlign: "center" }}>
                Completed Workouts
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "33.3%",
                paddingHorizontal: RFValue(10, 816),
                borderRightWidth: 1,
                borderColor: "#94A5A6",
              }}
            >
              <Text
                style={{
                  color: "black",
                  fontSize: RFValue(12, 816),
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {averageWorkoutTime} min
              </Text>
              <Text style={{ fontSize: RFValue(12, 816), textAlign: "center" }}>
                Average Workout
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "33.3%",
                paddingHorizontal: RFValue(10, 816),
              }}
            >
              <Text
                style={{
                  color: "black",
                  fontSize: RFValue(12, 816),
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                0
              </Text>
              <Text style={{ fontSize: RFValue(12, 816), textAlign: "center" }}>
                Goals Met
              </Text>
            </View>
          </View>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
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
              Past Workouts
            </Text>
            <TouchableHighlight
              style={{
                paddingVertical: RFValue(5, 816),
                paddingHorizontal: RFValue(10, 816),
                borderRadius: RFValue(12, 816),
              }}
              activeOpacity={0.6}
              underlayColor="#DDDDDD"
              onPress={() =>
                navigation.navigate("ViewAllWorkouts", { type: "view" })
              }
            >
              <Text
                style={{
                  fontSize: RFValue(12, 816),
                  marginRight: RFValue(10, 816),
                }}
              >
                View All
              </Text>
            </TouchableHighlight>
          </View>

          <View
            style={{
              width: "95%",
              marginHorizontal: 0,
              marginVertical: RFValue(10, 816),
              display: "flex",
              alignItems: "center",
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
                There are no past workouts for now
              </Text>
            )}
          </View>

         
        </View>
      </KeyboardAwareScrollView>
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
        onPress={() => navigation.navigate("AthleteCreateWorkout")}
      >
        <Icon name="plus" type="font-awesome-5" color="white" size={20} />
      </TouchableOpacity>
    </View>
  );
}

export default AthleteWorkoutList;
