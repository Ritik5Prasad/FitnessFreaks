import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { Icon } from "react-native-elements";
import { useSelector } from "react-redux";
import { selectUserData, selectUserType } from "../../features/userSlice";
import { db } from "../../utils/firebase";
let ScreenWidth = Dimensions.get("window").width;
let ScreenHeight = Dimensions.get("window").height;
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const WorkoutCard = ({
  workouts,
  item,
  type,
  showDate,
  completed,
  idx,
  isSaved,
  navigation,
  athlete_id,
  selecteddate,
  coach,
  longTerm,
}) => {
  const userType = useSelector(selectUserType);
  const [date, setDate] = useState("");

  useEffect(() => {
    if (showDate) {
      if (item?.data?.date) {
        setDate(item?.data?.date.split("-").reverse().join("-"));
      }
    }
  }, [type, item]);

  return (
    <TouchableOpacity
      key={idx}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: RFValue(15, 816),
        width: ScreenWidth - RFValue(20, 816),
        borderRadius: RFValue(8, 816),
        marginVertical: RFValue(5, 816),
      }}
      onPress={() => {
        if (userType === "coach") {
          if (type === "non-editable" && !completed) {
            navigation.navigate("AssignWorkout", {
              workout: item,
              workoutName: item?.data?.preWorkout?.workoutName,
              assignType: "non-editable",
              coach: coach?.length ? coach[0] : null,
            });
          } else if (completed === true) {
            navigation.navigate("PostWorkoutDetails", {
              workout: item,
              workoutName: item?.data?.preWorkout?.workoutName,
              completed: true,
            });
          } else {
            if (item.data?.assignedToId) {
              navigation.navigate("AssignWorkout", {
                workout: workouts[idx],
                workoutName: item?.data?.preWorkout?.workoutName,
                assignType: "update",
                athlete_id: athlete_id,
              });
            } else if (longTerm === true) {
              navigation.navigate("LongTermWorkout", {
                item: item,
              });
            } else {
              navigation.navigate("AssignWorkout", {
                workout: workouts[idx],
                workoutName: item?.data?.preWorkout?.workoutName,
                assignType: "create",
                isSaved: isSaved,
              });
            }
          }
        } else {
          if (completed == true) {
            navigation.navigate("PostWorkoutDetails", {
              workout: item,
              workoutName: item?.data?.preWorkout?.workoutName,
              completed: true,
            });
          } else {
            navigation.navigate("AssignWorkout", {
              workout: item,
              workoutName: item?.data?.preWorkout?.workoutName,
            });
          }
        }
      }}
      onLongPress={() => {
        if (userType === "coach") {
          Alert.alert(
            "Delete this Workout",
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
                  db.collection("CoachWorkouts")
                    .doc(item.id)
                    .delete()
                    .then(() => {
                      console.log("Document successfully deleted!");
                    })
                    .catch((error) => {
                      console.error("Error removing document: ", error);
                    });

                  db.collection("workouts")
                    .where("coachWorkoutId", "==", item.id)
                    .get()
                    .then(function (querySnapshot) {
                      // Once we get the results, begin a batch
                      var batch = db.batch();

                      querySnapshot.forEach(function (doc) {
                        // For each doc, add a delete operation to the batch
                        batch.delete(doc.ref);
                      });

                      // Commit the batch
                      return batch.commit();
                    })
                    .then(function () {
                      // Delete completed!
                      // ...
                      console.log("Delete completed");
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
          backgroundColor: "grey",
          borderRadius: RFValue(12, 816),
          marginRight: RFValue(20, 816),
        }}
        source={require("../../../assets/illustration.jpeg")}
      />
      <View
        style={{
          width: "60%",
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
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
            {/* {item?.data?.preWorkout?.workoutName} {showDate && `   ${date}`} */}
            {item?.data?.isLongTerm
              ? item?.data?.workoutName
              : item?.data?.preWorkout?.workoutName}{" "}
            {showDate && `   ${date}`}
          </Text>
          {coach?.length > 0 && (
            <Text
              style={{
                fontSize: RFValue(15, 816),
                fontWeight: "700",
                marginBottom: RFValue(10, 816),
              }}
            >
              by {coach[0]?.name}
            </Text>
          )}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: RFValue(12, 816), width: RFValue(60, 816) }}
            >
              Calories
            </Text>
            <Text style={{ fontSize: RFValue(12, 816) }}>
              {item?.data?.preWorkout?.caloriesBurnEstimate}
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
              style={{ fontSize: RFValue(12, 816), width: RFValue(60, 816) }}
            >
              Difficulty
            </Text>
            <Text style={{ fontSize: RFValue(12, 816) }}>
              {item?.data?.preWorkout?.workoutDifficulty}
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
              style={{ fontSize: RFValue(12, 816), width: RFValue(60, 816) }}
            >
              Duration
            </Text>
            <Text style={{ fontSize: RFValue(12, 816) }}>
              {item?.data?.preWorkout?.workoutDuration}
            </Text>
          </View>
        </View>
        <View
          style={{
            marginLeft: 140,
            position: "absolute",
          }}
        >
          <Text>{selecteddate && selecteddate}</Text>
        </View>
      </View>

      <Icon
        name="chevron-right"
        type="font-awesome-5"
        color="black"
        size={RFValue(20, 816)}
      />
    </TouchableOpacity>
  );
};

export default WorkoutCard;
