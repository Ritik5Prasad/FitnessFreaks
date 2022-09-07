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
import { db } from "../../utils/firebase";
import { Icon } from "react-native-elements";
import NutritionCard from "../components/NutritionCard";
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
  },
});

function CoachNutrition({ route, navigation }) {
  const userData = useSelector(selectUserData);
  const [nutrition1, setNutrition1] = useState([]);
  const [nutrition, setNutrition] = useState([]);
  const [savedNutrition, setSavedNutrition] = useState([]);
  const isFocused = useIsFocused();
  const [coachDetails, setCoachDetails] = useState([]);

  useEffect(() => {
    if (nutrition1) {
      let temp = [];

      nutrition1.map((n, i) => {
        if (temp.length === 0) {
          temp.push(n);
        } else {
          temp.map((t, idx) => {
            if (t.data.id !== n.data.id) {
              temp.push(n);
            }
          });
        }
      });
      setNutrition(temp);
    }
  }, [nutrition1]);

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
    //   if (userData) {
    //     if (userData?.data?.HeadCoach) {
    //       var unsub1 = db
    //         .collection("Food")
    //         .where("from_id", "in", [
    //           ...userData?.data?.listOfCoaches,
    //           userData?.id,
    //         ])
    //         .where("saved", "==", false)
    //         .limit(4)
    //         .onSnapshot((snapshot) => {
    //           if (snapshot) {
    //             setNutrition(
    //               snapshot.docs.map((doc) => ({
    //                 id: doc.id,
    //                 data: doc.data(),
    //               }))
    //             );
    //           }
    //         });
    //     } else {
    //       var unsub1 = db
    //         .collection("Food")
    //         .where("from_id", "in", [
    //           ...userData?.data?.listOfCoaches,
    //           userData?.id,
    //         ])
    //         .where("saved", "==", false)
    //         .limit(4)
    //         .onSnapshot((snapshot) => {
    //           if (snapshot) {
    //             setNutrition(
    //               snapshot.docs.map((doc) => ({
    //                 id: doc.id,
    //                 data: doc.data(),
    //               }))
    //             );
    //           }
    //         });
    //     }

    const userIds = [userData?.id];
    if (userData?.data?.listOfCoaches?.length) {
      userIds.push(...userData.data.listOfCoaches);
    }
    let tempNutrition = [];
    db.collection("CoachFood")
      // .where("from_id", "in", userIds)
      .where("saved", "==", false)
      .limit(4)
      // .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        if (snapshot) {
          snapshot.docs.map((doc) => {
            tempNutrition.push({
              id: doc.id,
              data: doc.data(),
            });
          });
        }

        let filtered = tempNutrition.filter((nut) =>
          userIds.includes(nut.data.from_id)
        );
        setNutrition(filtered);
      });

    db.collection("CoachFood")
      .where("from_id", "==", userData?.id)
      .where("assignedTo_id", "==", "")
      .where("saved", "==", true)
      .limit(4)
      .onSnapshot((snapshot) => {
        setSavedNutrition(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      });

    // return () => {
    //   unsub1();
    //   unsub2();
    // };
    //   }
  }, [userData?.id, isFocused]);

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

  function getCoach(coachId) {
    return coachDetails.find((c) => c.id === coachId);
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{ paddingBottom: 50 }}
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
                navigation.navigate("Home", { screen: "CoachHomeScreen" });
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
                marginLeft: RFValue(20, 816),
              }}
            >
              Nutrition
            </Text>
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
              navigation.navigate("CoachAddMeal");
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
              <Text style={{ color: "black" }}>ADD MEAL</Text>
            </View>
            </TouchableOpacity>*/}
          <Notification navigation={navigation} />
        </View>
        <TouchableOpacity
          style={{
            margin: RFValue(10, 816),
          }}
          onPress={() => navigation.navigate("OwnFoodList")}
        >
          <Text
            style={{
              padding: 10,
              backgroundColor: "#C19F1E",
              borderRadius: 6,
              marginBottom: RFValue(10, 816),
              color: "white",
            }}
          >
            Add Own Food
          </Text>
        </TouchableOpacity>
        <View
          style={{
            width: "100%",
            padding: RFValue(10, 816),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: RFValue(16, 816),
                color: "black",
                fontWeight: "bold",
              }}
            >
              Assigned Meal Plans
            </Text>
            <TouchableHighlight
              style={{
                borderRadius: RFValue(12, 816),
              }}
              activeOpacity={0.6}
              underlayColor="#DDDDDD"
              onPress={() => navigation.navigate("ViewAllNutrition")}
            >
              <Text style={{ fontSize: RFValue(12, 816) }}>View All</Text>
            </TouchableHighlight>
          </View>

          <View
            style={{
              width: "100%",
              marginHorizontal: 0,
              marginVertical: RFValue(10, 816),
              alignItems: "center",
            }}
          >
            {nutrition.length > 0 ? (
              nutrition?.map((food, idx) => (
                <NutritionCard
                  key={idx}
                  nutrition={nutrition}
                  food={food}
                  idx={idx}
                  navigation={navigation}
                  type="view"
                  coach={getCoach(food.data?.from_id)}
                />
              ))
            ) : (
              <Text
                style={{
                  fontSize: RFValue(12, 816),
                  backgroundColor: "#fff",
                  width: ScreenWidth - RFValue(60, 816),
                  paddingVertical: RFValue(10, 816),
                  textAlign: "center",
                  borderRadius: RFValue(8, 816),
                }}
              >
                There are no assigned meal plans.
              </Text>
            )}
          </View>

          <View
            style={{
              flexDirection: "row",
              marginBottom: RFValue(10, 816),
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
              Saved Meal Plans
            </Text>
            <TouchableHighlight
              style={{
                borderRadius: RFValue(12, 816),
              }}
              activeOpacity={0.6}
              underlayColor="#DDDDDD"
              onPress={() => navigation.navigate("ViewAllSavedNutrition")}
            >
              <Text style={{ fontSize: RFValue(12, 816) }}>View All</Text>
            </TouchableHighlight>
          </View>

          <View
            style={{
              width: "100%",
              marginHorizontal: 0,
              alignItems: "center",
            }}
          >
            {savedNutrition.length > 0 ? (
              savedNutrition?.map((food, idx) => (
                <NutritionCard
                  key={idx}
                  savedNutrition={savedNutrition}
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
                  width: ScreenWidth - RFValue(60, 816),
                  paddingVertical: RFValue(10, 816),
                  textAlign: "center",
                  borderRadius: RFValue(8, 816),
                }}
              >
                There are no saved meal plans.
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
        onPress={() => navigation.navigate("CoachAddMeal")}
      >
        <Icon name="plus" type="font-awesome-5" color="white" size={20} />
      </TouchableOpacity>
    </View>
  );
}

export default CoachNutrition;
