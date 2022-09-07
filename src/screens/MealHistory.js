import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
  ScrollView,
} from "react-native";
let ScreenWidth = Dimensions.get("window").width;
let ScreenHeight = Dimensions.get("window").height;
import { db } from "../utils/firebase";
import { LinearGradient } from "expo-linear-gradient";
import firebase from "firebase";
import { Icon } from "react-native-elements";
import { useSelector } from "react-redux";
import {
  selectTemperoryId,
  selectUserData,
  selectUserType,
} from "../features/userSlice";
import { useIsFocused } from "@react-navigation/native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
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
    padding: RFValue(10, 816),
  },
});

const MealHistory = ({ route, navigation }) => {
  const [data, setData] = useState(null);
  const userData = useSelector(selectUserData);
  const temperoryId = useSelector(selectTemperoryId);
  const userType = useSelector(selectUserType);
  const [type, setType] = useState("");

  const isFocused = useIsFocused();

  useEffect(() => {
    if (route.params?.type) {
      setType(route.params?.type);
    }
  }, [route.params?.type]);

  useEffect(() => {
    let temp = [];

    if (userData?.id || temperoryId) {
      db.collection("AthleteNutrition")
        .doc(userType === "athlete" ? userData?.id : temperoryId)
        .collection("nutrition")
        .get()
        .then((querySnapshot) => {
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
          setData(temp);
        });
    }
  }, [userData?.id, temperoryId, isFocused]);

  function formatDate1(day) {
    var d = new Date(day),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month].join("/");
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
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
                paddingHorizontal: RFValue(10, 816),
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
                fontSize: RFValue(20, 816),
                fontFamily: "SF-Pro-Text-regular",
                width: ScreenWidth / 2,
                marginLeft: RFValue(20, 816),
              }}
            >
              Meal History
            </Text>
          </View>
          <Notification navigation={navigation} />
        </View>

        <View
          style={{
            marginVertical: RFValue(10, 816),
            marginTop: RFValue(20, 816),
            marginLeft: RFValue(5, 816),
          }}
        >
          {data?.map((food, idx) => (
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
                if (userType === "athlete") {
                  navigation.navigate("AddMeal", {
                    entireFood: food.data.entireFood,
                    type: type,
                    todaysFoodId: food.id,
                  });
                } else {
                  navigation.navigate("AddMeal", {
                    entireFood: food.data.entireFood,
                    type: type,
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
                            .doc(
                              userType === "athlete"
                                ? userData?.id
                                : temperoryId
                            )
                            .collection("nutrition")
                            .doc(food.id)
                            .delete()
                            .then(() => {
                              console.log("Document successfully deleted!");
                            })
                            .catch((error) => {
                              console.error("Error removing document: ", error);
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
                    marginBottom: 8,
                  }}
                >
                  {food.id}
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
                <Icon name="chevron-right" color="#555" type="font-awesome-5" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default MealHistory;
