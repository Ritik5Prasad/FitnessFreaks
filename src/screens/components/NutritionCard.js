import React, { useEffect, useState } from "react";
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
import { selectUserType } from "../../features/userSlice";
import { db } from "../../utils/firebase";
let ScreenWidth = Dimensions.get("window").width;
let ScreenHeight = Dimensions.get("window").height;
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

function formatDate() {
  var d = new Date(),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

const NutritionCard = ({
  nutrition,
  food,
  idx,
  type,
  navigation,
  selecteddate,
  coach,
}) => {
  const userType = useSelector(selectUserType);

  const [pcf, setPcf] = useState({ p: 0, c: 0, f: 0, cal: 0 });
  // console.log(food?.data?.selectedAthletes, 'nnnnnn')
  useEffect(() => {
    let tempCal = 0;
    let tempCarbs = 0;
    let tempFat = 0;
    let tempProtein = 0;
    food.data.nutrition.entireFood.map((foodContainer) => {
      foodContainer.addFood &&
        foodContainer.food.map((f) => {
          tempCal = tempCal + f.calories;
          tempCarbs = tempCarbs + f.carbs;
          tempFat = tempFat + f.fat;
          tempProtein = tempProtein + f.proteins;
        });
    });
    setPcf({
      p: tempProtein.toFixed(2),
      c: tempCarbs.toFixed(2),
      f: tempFat.toFixed(2),
      cal: tempCal.toFixed(2),
    });
  }, [food]);

  return (
    <TouchableOpacity
      key={idx}
      style={{
        width: "100%",
        height: RFValue(100, 816),
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        marginVertical: RFValue(10, 816),
        padding: RFValue(10, 816),
        borderRadius: RFValue(8, 816),
      }}
      onPress={() => {
        if (userType === "coach") {
          if (type === "view") {
            navigation.navigate("Nutrition", {
              screen: "AssignNutrition",
              params: {
                nutrition: food,
                type: "view",
                coach,
              },
            });
          } else {
            if (food?.data?.assignedTo_id === "") {
              navigation.navigate("Nutrition", {
                screen: "AssignNutrition",
                params: {
                  nutrition: food,
                  type: "create",
                },
              });
            } else {
              navigation.navigate("Nutrition", {
                screen: "AssignNutrition",
                params: {
                  nutrition: food,
                  type: "update",
                },
              });
            }
          }
        } else {
          navigation.navigate("CoachAddMeal", {
            nutrition: food,
          });
        }
      }}
      onLongPress={() => {
        if (userType === "coach") {
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
                  db.collection("CoachFood")
                    .doc(food.id)
                    .delete()
                    .then(async () => {
                      console.log("Document successfully deleted!");
                      if (food.data.selectedAthletes) {
                        let foodIdsAtFoodDB = [];
                        await db
                          .collection("Food")
                          .where("coachFoodId", "==", food.id)
                          .get()
                          .then((querySnapshot) => {
                            querySnapshot.forEach((doc) => {
                              // doc.data() is never undefined for query doc snapshots
                              // console.log(doc.id, " => ", doc.data());
                              foodIdsAtFoodDB.push(doc.id);
                            });
                          });
                        console.log(foodIdsAtFoodDB, "foodsid");
                        try {
                          foodIdsAtFoodDB.forEach((id) => {
                            db.collection("Food").doc(id).delete();
                          });
                        } catch (error) {
                          console.log(error, "here");
                        }
                      }
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
        source={require("../../../assets/nutrition.jpeg")}
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
          {/* {food?.data?.nutrition?.nutritionName} */}
          {food?.data?.isLongTerm
            ? food?.data?.nutritionName
            : food?.data?.nutrition?.nutritionName}
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: RFValue(12, 816) }}>
            {/* {selecteddate ? selecteddate : formatDate()} */}
            {food.data.nutrition.entireFood[0].addFood && (
              <View style={{ flexDirection: "row" }}>
                <View>
                  <Text
                    style={{
                      fontSize: RFValue(12, 816),
                      marginRight: RFValue(10, 816),
                    }}
                  >
                    Calories:
                  </Text>
                  <Text
                    style={{
                      fontSize: RFValue(12, 816),
                      marginRight: RFValue(10, 816),
                    }}
                  >
                    Carbs:
                  </Text>
                  <Text
                    style={{
                      fontSize: RFValue(12, 816),
                      marginRight: RFValue(10, 816),
                    }}
                  >
                    Fat:
                  </Text>
                  <Text
                    style={{
                      fontSize: RFValue(12, 816),
                      marginRight: RFValue(10, 816),
                    }}
                  >
                    Protiens:
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: RFValue(12, 816),
                      marginRight: RFValue(10, 816),
                    }}
                  >
                    {pcf.cal}
                  </Text>
                  <Text
                    style={{
                      fontSize: RFValue(12, 816),
                      marginRight: RFValue(10, 816),
                    }}
                  >
                    {pcf.c}
                  </Text>
                  <Text
                    style={{
                      fontSize: RFValue(12, 816),
                      marginRight: RFValue(10, 816),
                    }}
                  >
                    {pcf.f}
                  </Text>
                  <Text
                    style={{
                      fontSize: RFValue(12, 816),
                      marginRight: RFValue(10, 816),
                    }}
                  >
                    {pcf.p}
                  </Text>
                </View>
              </View>
            )}
          </Text>
        </View>
        {coach && (
          <Text style={{ fontSize: RFValue(12, 816) }}>{coach.name}</Text>
        )}
      </View>
      <TouchableOpacity
        style={{
          position: "absolute",
          right: RFValue(25, 816),
        }}
        onPress={() =>
          navigation.navigate("CoachAddMeal", {
            nutrition: food,
          })
        }
      >
        <Icon name="chevron-right" color="black" type="font-awesome-5" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default NutritionCard;