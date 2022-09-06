import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ProgressBarAndroid,
  ProgressViewIOS,
  Dimensions,
} from "react-native";
import { db } from "../../firebase";
let ScreenWidth = Dimensions.get("window").width;
import { ProgressCircle } from "react-native-svg-charts";
import { useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { selectUserData } from "../../features/userSlice";
import ProgressBarComponent from "./ProgressComponent";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

function NutritionGoalProgress({ navigation, requestDate }) {
  const userData = useSelector(selectUserData);
  const isFocused = useIsFocused();
  const [calories, setCalories] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [userFat, setUserFat] = useState(
    userData?.data?.diet ? userData.data.diet.fat : 50
  );
  const [userCarbs, setUserCarbs] = useState(
    userData?.data?.diet ? userData.data.diet.carbs : 300
  );
  const [userProtein, setUserProtein] = useState(
    userData?.data?.diet ? userData.data.diet.protein : 70
  );
  const [userCalories, setUserCalories] = useState(
    userData?.data?.diet ? userData.data.diet.calories : 1930
  );

  const [protein, setProtein] = useState("");
  const [entireFood, setEntireFood] = useState([]);
  const [caloriesBarColor, setCaloriesBarColor] = useState("");
  const [todaysFoodId, setTodaysFoodId] = useState("");

  useEffect(() => {
    if (userData?.data) {
      var unsub1 = db
        .collection("athletes")
        .doc(userData?.id)
        .onSnapshot((doc) => {
          setUserProtein(doc.data()?.diet?.protein);
          setUserFat(doc.data()?.diet?.fat);
          setUserCarbs(doc.data()?.diet?.carbs);
          setUserCalories(doc.data()?.diet?.calories);
        });
      return () => {
        unsub1();
      };
    }
  }, [userData?.id, isFocused]);

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
    let tempCal = 0;
    let tempCarbs = 0;
    let tempFat = 0;
    let tempProtein = 0;
    console.log("useEffect in nutrition goal");
    if (userData) {
      let tempDate;
      if (requestDate) {
        tempDate = requestDate;
      } else {
        tempDate = formatDate();
      }
      var unsub2 = db
        .collection("AthleteNutrition")
        .doc(userData?.id)
        .collection("nutrition")
        .doc(tempDate)
        .onSnapshot((doc) => {
          tempCal = 0;
          tempCarbs = 0;
          tempFat = 0;
          tempProtein = 0;

          if (doc.data()?.entireFood) {
            setEntireFood(doc.data()?.entireFood);
            setTodaysFoodId(doc.id);
            doc.data()?.entireFood.map((foodContainer) => {
              foodContainer.food.map((f) => {
                tempCal = tempCal + f.calories;
                tempCarbs = tempCarbs + f.carbs;
                tempFat = tempFat + f.fat;
                tempProtein = tempProtein + f.proteins;
              });
            });
          }

          console.log(tempCal);
          setCalories(tempCal.toFixed(2));
          setCarbs(tempCarbs.toFixed(2));
          setFat(tempFat.toFixed(2));
          setProtein(tempProtein.toFixed(2));
        });

      return () => {
        unsub2();
      };
    }
  }, ["", userData?.id, requestDate, isFocused]);

  return (
    <TouchableOpacity
      style={{
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: RFValue(8, 816),
        marginBottom: RFValue(15, 816),
      }}
      onPress={() => {
        //console.log("requestDate->", requestDate);
        navigation.navigate("AddMeal", {
          entireFood: entireFood,
          todaysFoodId: todaysFoodId,
          todaysFoodId: requestDate,
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
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "40%",
          }}
        >
          <ProgressCircle
            style={{
              height: RFValue(170, 816),
              width: RFValue(130, 816),
            }}
            strokeWidth={RFValue(20, 816)}
            progress={calories / userCalories}
            progressColor={
              (calories < (90 / 100) * userCalories && "#FFE66D") ||
              (calories > (90 / 100) * userCalories &&
                calories < (110 / 100) * userCalories &&
                "#006D77") ||
              (calories > (110 / 100) * userCalories && "#FF0000")
            }
          />

          <Text
            style={{
              position: "absolute",
              width: RFValue(70, 816),
              textAlign: "center",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {calories} / {userCalories} Calories
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "60%",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ width: RFValue(220, 816), marginVertical: 5 }}>
              {carbs} Carbs of {userCarbs}g
            </Text>
            <ProgressBarComponent
              containerWidth={RFValue(220, 816)}
              progress={(carbs / userCarbs) * 100}
              progressColor={
                (carbs < (90 / 100) * userCarbs && "#FFE66D") ||
                (carbs > (90 / 100) * userCarbs &&
                  carbs < (110 / 100) * userCarbs &&
                  "#006D77") ||
                (carbs > (110 / 100) * userCarbs && "#FF0000")
              }
            />
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ width: RFValue(220, 816), marginVertical: 5 }}>
              {fat} Fat of {userFat}g
            </Text>
            <ProgressBarComponent
              containerWidth={RFValue(220, 816)}
              progress={(fat / userFat) * 100}
              progressColor={
                (fat < (90 / 100) * userFat && "#FFE66D") ||
                (fat > (90 / 100) * userFat &&
                  fat < (110 / 100) * userFat &&
                  "#006D77") ||
                (fat > (110 / 100) * userFat && "#FF0000")
              }
            />
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ width: RFValue(220, 816), marginVertical: 5 }}>
              {protein} Proteins of {userProtein}g
            </Text>
            <ProgressBarComponent
              containerWidth={RFValue(220, 816)}
              progress={(protein / userProtein) * 100}
              progressColor={
                (protein < (90 / 100) * userProtein && "#FFE66D") ||
                (protein > (90 / 100) * userProtein &&
                  protein < (110 / 100) * userProtein &&
                  "#006D77") ||
                (protein > (110 / 100) * userProtein && "#FF0000")
              }
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default NutritionGoalProgress;
