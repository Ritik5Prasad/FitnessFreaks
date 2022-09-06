import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
let ScreenWidth = Dimensions.get("window").width;
let ScreenHeight = Dimensions.get("window").height;
import { useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { selectUserData } from "../../features/userSlice";
import { db } from "../../firebase";
import { Icon } from "react-native-elements";
import WorkoutCard from "../components/WorkoutCard";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Notification from "../components/Notification";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3",
    marginBottom: 0,
    paddingTop: RFValue(20, 816),
    height: ScreenHeight,
    padding: RFValue(10, 816),
  },
});

function WorkoutList({ route, navigation }) {
  const userData = useSelector(selectUserData);
  const [workouts, setWorkouts] = useState([]);
  const [savedWorkouts, setSavedWorkouts] = useState([]);
  const isFocused = useIsFocused();
  const [LongTermWorkouts, setLongTermWorkouts] = useState([]);
  const [coachDetails, setCoachDetails] = useState([]);

  function formatDate() {
    var d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  React.useEffect(() => {
    if (userData?.data?.listOfCoaches?.length) {
      const data = [];
      db.collection("coaches")
        .orderBy("name", "asc")
        .get()
        .then((snapshot) => {
          snapshot.docs.forEach((coach) => {
            if (userData?.data?.listOfCoaches?.includes(coach.id)) {
              let appObj = { ...coach.data(), id: coach.id };
              data.push(appObj);
            }
          });
          data.push({ ...userData?.data, id: userData?.id });
          setCoachDetails(data);
        });
    }
  }, [userData]);

  useEffect(async () => {
    if (userData) {
      if (userData.data?.listOfCoaches?.length) {
        let tempWorkouts = [];
        var unsub1 = await db
          .collection("CoachWorkouts")
          // .where("assignedById", "in", [
          //   ...userData?.data?.listOfCoaches,
          //   userData?.id,
          // ])
          .where("saved", "==", false)
          // .where("selectedDates", "array-contains", formatDate())
          .limit(3)
          .onSnapshot((snapshot) => {
            snapshot.docs.map((doc) => {
              // console.log(doc.data())
              tempWorkouts.push({
                id: doc.id,
                data: doc.data(),
              });
            });

            let filtered1 = tempWorkouts.filter((workout) =>
              [...userData?.data?.listOfCoaches, userData?.id].includes(
                workout.data.assignedById
              )
            );
            console.log(filtered1, "temmp");
            setWorkouts(filtered1);
          });
      } else {
        var unsub1 = db
          .collection("CoachWorkouts")
          .where("assignedById", "==", userData?.id)
          .where("saved", "==", false)
          // .where("selectedDates", "array-contains", formatDate())
          .limit(3)
          .onSnapshot((snapshot) => {
            setWorkouts(
              snapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data(),
              }))
            );
          });
      }

      var unsub2 = db
        .collection("CoachWorkouts")
        .where("assignedById", "==", userData?.id)
        .where("saved", "==", true)
        .orderBy("timestamp", "desc")
        // .where("assignedToId", "==", "")
        // .orderBy("timestamp", "desc")
        // .where("date", "==", formatDate()) // replace with formatDate() for realtime data
        .limit(3)
        .onSnapshot((snapshot) => {
          setSavedWorkouts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });

      db.collection("longTermWorkout")
        .where("assignedById", "==", userData?.id)
        .where("saved", "==", false)
        .where("isLongTerm", "==", true)
        .orderBy("timestamp", "desc")
        // .where("date", "==", formatDate()) // replace with formatDate() for realtime data
        .limit(3)
        .onSnapshot((snapshot) => {
          setLongTermWorkouts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });

      return () => {
        unsub1();
        unsub2();
      };
    }
  }, [userData?.id, isFocused]);

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
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
                navigation.navigate("Home", { screen: "CoachHomeScreen" });
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
                fontSize: RFValue(24, 816),
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                marginLeft: 20,
              }}
            >
              Workouts
            </Text>
          </View>

          {/*
          <TouchableOpacity
            style={{
              backgroundColor: "#C19F1E",
              paddingHorizontal:RFValue(15, 816),
              paddingVertical:RFValue(8, 816),
              borderRadius: 50,
            }}
            onPress={() => {
              navigation.navigate("AddWorkout");
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
                size={15}
                style={{ marginRight: RFValue(10, 816)}}
                color="black"
                type="font-awesome-5"
              />
              <Text style={{ color: "black",fontSize:12 }}>CREATE WORKOUT</Text>
            </View>
            </TouchableOpacity>*/}
          <Notification navigation={navigation} />
        </View>
        <View
          style={{
            width: "100%",
            marginTop: RFValue(10, 816),
            marginBottom: RFValue(10, 816),
          }}
        >
          <Text
            onPress={() => navigation.navigate("OwnWorkouts")}
            style={{
              padding: 10,
              backgroundColor: "#C19F1E",
              borderRadius: 6,
              marginBottom: RFValue(10, 816),
              color: "white",
            }}
          >
            Exercise Library
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: RFValue(16, 816),
                fontWeight: "bold",
                color: "black",
              }}
            >
              Workouts
            </Text>
            <TouchableHighlight
              style={{
                borderRadius: RFValue(12, 816),
              }}
              activeOpacity={0.6}
              underlayColor="#DDDDDD"
              onPress={() =>
                navigation.navigate("ViewAllWorkouts", { type: "view" })
              }
            >
              <Text style={{ fontSize: RFValue(12, 816) }}>View All</Text>
            </TouchableHighlight>
          </View>

          <View
            style={{
              width: "100%",
              marginHorizontal: 0,
              paddingHorizontal: RFValue(15, 816),
              alignItems: "center",
            }}
          >
            {workouts.length > 0 ? (
              workouts?.map((item, idx) => (
                <WorkoutCard
                  key={idx}
                  workouts={workouts}
                  item={item}
                  idx={idx}
                  navigation={navigation}
                  type="non-editable"
                  coach={coachDetails.filter(
                    (coach) => coach.id === item.data.assignedById
                  )}
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
                There are no upcoming workouts for now
              </Text>
            )}
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: RFValue(10, 816),
            }}
          >
            <Text
              style={{
                fontSize: RFValue(16, 816),
                fontWeight: "700",
                color: "black",
              }}
            >
              Saved Templates
            </Text>
            <TouchableHighlight
              style={{
                borderRadius: RFValue(12, 816),
              }}
              activeOpacity={0.6}
              underlayColor="#DDDDDD"
              onPress={() => navigation.navigate("ViewAllSavedWorkouts")}
            >
              <Text style={{ fontSize: RFValue(12, 816) }}>View All</Text>
            </TouchableHighlight>
          </View>

          <View
            style={{
              width: "100%",
              marginHorizontal: 0,
              marginVertical: RFValue(20, 816),
              alignItems: "center",
            }}
          >
            {savedWorkouts.length > 0 ? (
              savedWorkouts?.map((item, idx) => (
                <WorkoutCard
                  key={idx}
                  workouts={savedWorkouts}
                  isSaved={true}
                  item={item}
                  idx={idx}
                  navigation={navigation}
                  type="update"
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
                There are no upcoming workouts for now
              </Text>
            )}
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: RFValue(10, 816),
            }}
          >
            <Text
              style={{
                fontSize: RFValue(16, 816),
                fontWeight: "700",
                color: "black",
              }}
            >
              Long Term Workout Plans
            </Text>
            <TouchableHighlight
              style={{
                borderRadius: RFValue(12, 816),
              }}
              activeOpacity={0.6}
              underlayColor="#DDDDDD"
              onPress={() => navigation.navigate("ViewAllLongTermWorkouts")}
            >
              <Text style={{ fontSize: RFValue(12, 816) }}>View All</Text>
            </TouchableHighlight>
          </View>

          <View
            style={{
              width: "100%",
              marginHorizontal: 0,
              marginVertical: RFValue(20, 816),
              alignItems: "center",
            }}
          >
            {LongTermWorkouts.length > 0 ? (
              LongTermWorkouts?.map((item, idx) => (
                <WorkoutCard
                  key={idx}
                  workouts={LongTermWorkouts}
                  item={item}
                  idx={idx}
                  navigation={navigation}
                  // type="non-editable"
                  longTerm={true}
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
                There are no upcoming workouts for now
              </Text>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>
      <TouchableOpacity
        style={{
          position: "absolute",
          right: RFValue(30, 816),
          bottom: RFValue(30, 816),
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
        onPress={() => navigation.navigate("AddWorkout")}
      >
        <Icon name="plus" type="font-awesome-5" color="white" size={20} />
      </TouchableOpacity>
    </View>
  );
}

export default WorkoutList;
