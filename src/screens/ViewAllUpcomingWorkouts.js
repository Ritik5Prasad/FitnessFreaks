import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  TextInput,
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
import firebase from "firebase";
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

function ViewAllUpcomingWorkouts({ route, navigation }) {
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const [workouts, setWorkouts] = useState([]);
  const [pastWorkouts, setPastWorkouts] = useState([]);
  const [upcomingWorkouts, setupcomingWorkouts] = useState([]);
  const [completedWorkouts, setCompletedWorkouts] = useState("");
  const [averageWorkoutTime, setAverageWorkoutTime] = useState("");
  const isFocused = useIsFocused();
  const [workoutSearch, setWorkoutSearch] = useState("");
  const [filterAsc, setFilterAsc] = React.useState(false);
  const [searchedWorkouts, setSearchedWorkouts] = React.useState([]);
  const [requestDate, setRequestDate] = useState(formatDate());

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
        .where("date", "==", requestDate)
        .orderBy("selectedDay", "desc")

        .onSnapshot((snapshot) => {
          setupcomingWorkouts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });

      return () => {
        unsub2();
      };
    }
  }, [userData?.id, isFocused]);

  //   useEffect(() => {
  //     if (workouts.length > 0) {
  //       console.log("ss", workouts);
  //       let workouts_list = [];

  //       workouts?.forEach((data) => {
  //         //console.log("aa", data.data.date);
  //         let dt = new Date(data.data.date);
  //         let todaydate = new Date(formatDate());

  //         console.log("1", data.data.date, dt, todaydate);
  //         if (dt > todaydate) {
  //           workouts_list.push(data);
  //           console.log("high", dt, todaydate);
  //         }
  //         if (workouts_list.length > 0) {
  //           setupcomingWorkouts(workouts_list);
  //           console.log("s", upcomingWorkouts);
  //         }
  //       });
  //     }
  //   }, [workouts]);

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
  useEffect(() => {
    if (workoutSearch == null || workoutSearch == "") {
      setSearchedWorkouts(upcomingWorkouts);
    } else {
      setSearchedWorkouts(
        upcomingWorkouts.filter((id) => {
          return id.data?.preWorkout?.workoutName
            .toLowerCase()
            .includes(workoutSearch.toLowerCase());
        })
      );
    }
  }, [workoutSearch]);

  React.useEffect(() => {
    setSearchedWorkouts(upcomingWorkouts);
  }, [upcomingWorkouts]);

  React.useEffect(() => {
    setupcomingWorkouts(workouts.reverse());
  }, [filterAsc]);

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
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
              Workouts
            </Text>
          </View>
          <Notification navigation={navigation} />
        </View>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "white",
            borderRadius: 6,
            borderColor: "rgba(0,0,0,9)",
            alignItems: "center",
            marginVertical: RFValue(10, 816),
            justifyContent: "space-between",
          }}
        >
          <TextInput
            value={workoutSearch}
            onChangeText={(text) => setWorkoutSearch(text)}
            style={{
              width: "80%",
              paddingLeft: RFValue(10, 816),
              paddingVertical: Platform.OS === "ios" ? 15 : 10,
            }}
            placeholder={"Search Workout"}
          />
          <TouchableOpacity
            onPress={() => setModal(true)}
            style={{ marginRight: 10 }}
          >
            {/* <Image source={require("../../../assets/filter.png")} /> */}
          </TouchableOpacity>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            width: "100%",
            marginTop: RFValue(15, 816),
            marginLeft: RFValue(15, 850),
          }}
        >
          <View
            style={{
              width: ScreenWidth - RFValue(25, 816),
              marginHorizontal: 0,
              marginVertical: RFValue(20, 816),
              paddingHorizontal: RFValue(15, 816),
              display: "flex",
              alignItems: "center",
            }}
          >
            {searchedWorkouts.length > 0 ? (
              searchedWorkouts?.map((item, idx) => (
                <WorkoutCard
                  key={idx}
                  workouts={searchedWorkouts}
                  item={item}
                  idx={idx}
                  navigation={navigation}
                  showDate={true}
                  type="non-editable"
                  completed={false}
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
                There are no workouts for now
              </Text>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

export default ViewAllUpcomingWorkouts;
