import * as React from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TextInput,
  Modal,
  Image,
  Platform,
} from "react-native";
let ScreenWidth = Dimensions.get("window").width;
let ScreenHeight = Dimensions.get("window").height;
import SearchableDropdown from "react-native-searchable-dropdown";
import { Icon } from "react-native-elements";
import { useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { selectUserData, selectUserType } from "../../features/userSlice";
import { db } from "../../utils/firebase";
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

const ViewAllWorkouts = ({ route, navigation }) => {
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const [workouts, setWorkouts] = React.useState([]);
  const [type, setType] = React.useState("");
  const [athleteId, setAthleteId] = React.useState("");
  const [completed, setCompleted] = React.useState(false);
  const [workoutSearch, setWorkoutSearch] = React.useState("");
  const [searchedWorkouts, setSearchedWorkouts] = React.useState([]);
  const [modal, setModal] = React.useState(false);
  const [filterAsc, setFilterAsc] = React.useState(false);
  const [CoachDetails, setCoachDetails] = React.useState([]);

  const isFocused = useIsFocused();

  // React.useEffect(() => {
  //   setSearchedWorkouts(workouts);
  // }, [workouts]);

  React.useEffect(() => {
    if (route?.params?.type) {
      setType(route.params.type);
    }
  }, [route?.params?.type]);

  React.useEffect(() => {
    if (route.params.assignedToId) {
      setAthleteId(route.params.assignedToId);
    }
  }, [route.params.assignedToId]);

  React.useEffect(() => {
    if (route.params.completed) {
      setCompleted(route.params.completed);
    }
  }, [route.params.completed]);

  React.useEffect(() => {
    if (userData?.data?.listOfCoaches?.length) {
      const data = [];
      let temp = [];
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

  React.useEffect(() => {
    if (userData) {
      var unsub1;
      var unsub2;

      var unsub3;
      var unsub4;

      if (userType === "athlete") {
        var unsub1 = db
          .collection("workouts")
          .where("assignedToId", "==", userData?.id)
          .where("completed", "==", true)
          .orderBy("timestamp", "desc")
          .onSnapshot((snapshot) => {
            setWorkouts(
              snapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data(),
              }))
            );
          });
      } else {
        if (type && athleteId) {
          var unsub1 = db
            .collection("workouts")
            .where("assignedToId", "==", athleteId)
            .where("saved", "==", false)
            .where("completed", "==", completed)
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) => {
              if (snapshot) {
                console.log("Inside snapshot");
                setWorkouts(
                  snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                  }))
                );
              } else {
                console.log("outside snapshot");
                setWorkouts([]);
              }
            });
        } else {
          if (userData?.data?.listOfCoaches?.length) {
            let tempWorkouts = [];
            var unsub1 = db
              .collection("CoachWorkouts")
              // .where("assignedById", "in", [
              //   ...userData?.data?.listOfCoaches,
              //   userData?.id,
              // ])
              .where("saved", "==", false)
              // .where("selectedDates", "array-contains", formatDate())
              .onSnapshot((snapshot) => {
                snapshot.docs.map((doc) =>
                  tempWorkouts.push({
                    id: doc.id,
                    data: doc.data(),
                  })
                );
                let filtered = tempWorkouts.filter((nut) =>
                  [...userData?.data?.listOfCoaches, userData?.id].includes(
                    nut.data.assignedById
                  )
                );
                setWorkouts(filtered);
              });
          } else {
            var unsub1 = db
              .collection("CoachWorkouts")
              .where("assignedById", "==", userData?.id)
              .where("saved", "==", false)
              .orderBy("timestamp", "desc")
              .onSnapshot((snapshot) => {
                setWorkouts(
                  snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                  }))
                );
              });
          }
        }
      }
    }
    return () => {
      unsub1();
    };
  }, [userData?.id, athleteId, isFocused]);

  React.useEffect(() => {
    if (workoutSearch == null || workoutSearch == "") {
      setSearchedWorkouts(workouts);
    } else {
      setSearchedWorkouts(
        workouts.filter((id) => {
          return id.data?.preWorkout?.workoutName
            .toLowerCase()
            .includes(workoutSearch.toLowerCase());
        })
      );
    }
  }, [workoutSearch]);

  React.useEffect(() => {
    setSearchedWorkouts(workouts);
  }, [workouts]);

  React.useEffect(() => {
    setWorkouts(workouts.reverse());
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
            <Image source={require("../../../assets/filter.png")} />
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
            {console.log("working")}
            {searchedWorkouts.length > 0 ? (
              searchedWorkouts?.map((item, idx) => (
                <WorkoutCard
                  key={idx}
                  workouts={searchedWorkouts}
                  item={item}
                  idx={idx}
                  navigation={navigation}
                  showDate={true}
                  // type="view"
                  type="non-editable"
                  completed={
                    userType === "athlete" || completed === true ? true : false
                  }
                  coach={CoachDetails?.filter((coach) => {
                    return coach.id === item.data.assignedById;
                  })}
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
      <Modal
        visible={modal}
        transparent={true}
        animationType="fade"
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "blue",
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              height: 170,
              width: 220,
              alignSelf: "center",
              borderRadius: 10,
            }}
          >
            <View
              style={{
                height: "33%",
                padding: RFValue(20, 816),
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  borderRadius: 100,
                  marginRight: RFValue(10, 816),
                  height: 23,
                  width: 23,
                  borderWidth: 1,
                  bordercolor: "white",
                  justifyContent: "center",
                }}
                onPress={() => {
                  setFilterAsc(true);
                }}
              >
                <View
                  style={{
                    backgroundColor: filterAsc ? "#C19F1E" : "white",
                    height: 13,
                    width: 13,
                    borderRadius: 100,
                    alignSelf: "center",
                  }}
                ></View>
              </TouchableOpacity>
              <Text style={{ fontSize: 16, textAlign: "center" }}>
                Oldest to latest
              </Text>
            </View>
            <View
              style={{
                height: "33%",
                padding: RFValue(20, 816),
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  borderRadius: 100,
                  marginRight: RFValue(10, 816),
                  height: 23,
                  width: 23,
                  borderWidth: 1,
                  bordercolor: "white",
                  justifyContent: "center",
                }}
                onPress={() => {
                  setFilterAsc(false);
                }}
              >
                <View
                  style={{
                    backgroundColor: filterAsc ? "white" : "#C19F1E",
                    height: 13,
                    width: 13,
                    borderRadius: 100,
                    alignSelf: "center",
                  }}
                ></View>
              </TouchableOpacity>
              <Text style={{ fontSize: 16, textAlign: "center" }}>
                latest to Oldest
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setModal(false)}
              style={{
                marginTop: RFValue(15, 816),
                width: "90%",
                borderRadius: RFValue(10, 816),
                padding: 5,
                backgroundColor: "#C19F1E",
                alignSelf: "center",
                justifyContent: "flex-end",
              }}
            >
              <Text
                style={{ fontSize: 16, color: "black", textAlign: "center" }}
              >
                Apply
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ViewAllWorkouts;
