import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ProgressBarAndroid,
  ProgressViewIOS,
  Dimensions,
  Platform,
  DatePickerIOS,
} from "react-native";
import { db } from "../../firebase";
let ScreenWidth = Dimensions.get("window").width;
import { ProgressCircle } from "react-native-svg-charts";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { selectUserData } from "../../features/userSlice";
import ProgressBarComponent from "./ProgressComponent";
import DatePicker from "react-native-datepicker";
import firebase from "firebase";
import moment from "moment";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

function NutritionWeekGoal({ navigation }) {
  const userData = useSelector(selectUserData);
  const isFocused = useIsFocused();
  const [calories, setCalories] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [protein, setProtein] = useState("");
  const [nutrition, setNutrition] = useState([]);
  const [startDate, setStartDate] = useState(
    new Date(moment(new Date()).subtract(7, "days"))
  );

  const [endDate, setEndDate] = useState(new Date());

  var today = new Date();

  const min_date = {
    year: 2021,
    month: "05",
    day: 10,
  };
  const max_date = {
    year: today.getFullYear(),
    month:
      today.getMonth().toString().length == 1
        ? "0" + (today.getMonth() + 1).toString()
        : today.getMonth,

    day:
      today.getDate().toString().length == 1
        ? "0" + today.getDate().toString()
        : today.getDate(),
  };

  function formatDate() {
    var d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  function incr_date(date_str) {
    var parts = date_str.split("-");
    var dt = new Date(
      parseInt(parts[0], 10), // year
      parseInt(parts[1], 10) - 1, // month (starts with 0)
      parseInt(parts[2], 10) // date
    );
    dt.setDate(dt.getDate() + 1);
    parts[0] = "" + dt.getFullYear();
    parts[1] = "" + (dt.getMonth() + 1);
    if (parts[1].length < 2) {
      parts[1] = "0" + parts[1];
    }
    parts[2] = "" + dt.getDate();
    if (parts[2].length < 2) {
      parts[2] = "0" + parts[2];
    }
    return parts.join("-");
  }

  useEffect(() => {
    db.collection("Food")
      // .where("date", ">=", new Date(startDate))
      // .where("date", "<=", new Date(endDate))
      .orderBy("date")
      .get()
      .then((querySnapshot) => {
        let data = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        console.log(querySnapshot.empty);
        querySnapshot.docs.map((d) => {
          console.log("aa", d.data());
        });
        console.log(1, userData?.id);

        data = data.filter((d) => {
          console.log(d.nutrition.entireFood);
          // if (temperoryId) {
          //   return d.assignedTo_id === temperoryId && d.nutrition;
          // } else {
          return d.assignedTo_id === userData?.id && d.nutrition;
          // }
        });
        console.log(data);
        setNutrition(data);
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  }, [startDate, endDate, userData]);
  useEffect(() => {
    // console.log(nutrition, 'nttttt')
    if (nutrition.length > 0) {
      let tDate = formatDate(startDate);
      let tempCount = 0;
      let tempCal = 0;
      let tempCarbs = 0;
      let tempFat = 0;
      let tempProtein = 0;
      var start = moment(startDate);

      var end = moment(endDate);

      var diff = end.diff(start, "days") + 1;
      console.log(diff, "diff");
      for (let i = 1; i < diff; i++) {
        let t1 = nutrition.filter(
          (w) => formatDate(new Date(w.date.seconds * 1000)) === tDate
        );
        t1.map((t) => {
          console.log(t);
          t.nutrition?.entireFood.map((foodContainer) => {
            foodContainer.food.map((f) => {
              tempCal = tempCal + f.calories;
              tempCarbs = tempCarbs + f.carbs;
              tempFat = tempFat + f.fat;
              tempProtein = tempProtein + f.proteins;
            });
          });
        });

        tDate = incr_date(tDate);
        tempCount = tempCount + 1;
      }
      console.log(tempCal, tempCarbs, tempFat, tempProtein);
      setCalories((tempCal / tempCount).toFixed(1));
      setCarbs((tempCarbs / tempCount).toFixed(1));
      setFat((tempFat / tempCount).toFixed(1));
      setProtein((tempProtein / tempCount).toFixed(1));
      console.log(calories);
    }
  }, [nutrition, startDate, endDate]);

  return (
    <View
      style={{
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: RFValue(8, 816),
        padding: 10,
      }}
    >
      <Text
        style={{
          fontSize: RFValue(17, 816),
          fontFamily: "SF-Pro-Text-regular",
          marginBottom: RFValue(15, 816),
        }}
      >
        Average Macronutrients consumed
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: RFValue(12, 816),
              fontFamily: "SF-Pro-Text-regular",
            }}
          >
            From Date
          </Text>
          {/*Platform.OS === 'ios'?
               <DatePickerIOS
               date={new Date(moment(startDate,"YYYY-MM-DD"))}
               //style={{marginTop:-RFValue(80,816),marginBottom:-RFValue(80,816)}}
               onDateChange={(date) => {setStartDate(moment(date).format("YYYY-MM-DD"));}}
               //timeZoneOffsetInMinutes={5*60 + 30}
             />
          : */}
          <DatePicker
            style={{ width: RFValue(150, 816), marginBottom: RFValue(20, 816) }}
            date={startDate}
            mode="date"
            placeholder="From Date"
            format="YYYY-MM-DD"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            showIcon={false}
            customStyles={{
              dateInput: {
                borderWidth: 1,
                borderColor: "#DBE2EA",
                backgroundColor: "#fff",
                width: ScreenWidth - RFValue(80, 816),
                borderRadius: RFValue(8, 816),
                padding: RFValue(7, 816),
                height: RFValue(40, 816),
              },
            }}
            onDateChange={(date) => setStartDate(date)}
          />
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: RFValue(12, 816),
              fontFamily: "SF-Pro-Text-regular",
            }}
          >
            To Date
          </Text>
          <DatePicker
            style={{ width: RFValue(150, 816), marginBottom: RFValue(20, 816) }}
            date={endDate}
            mode="date"
            placeholder="To Date"
            format="YYYY-MM-DD"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            showIcon={false}
            customStyles={{
              dateInput: {
                borderWidth: 1,
                borderColor: "#DBE2EA",
                backgroundColor: "#fff",
                width: ScreenWidth - RFValue(80, 816),
                borderRadius: RFValue(8, 816),
                padding: RFValue(7, 816),
                height: RFValue(40, 816),
              },
            }}
            onDateChange={(date) => setEndDate(date)}
          />
        </View>
      </View>

      <TouchableOpacity
        style={{
          marginBottom: RFValue(15, 816),
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: ScreenWidth / 1.15,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              width: "70%",
            }}
          >
            <Text style={{ width: RFValue(160, 816), marginVertical: 5 }}>
              Average Calories
            </Text>
            <Text style={{ width: RFValue(160, 816), marginVertical: 5 }}>
              Average Carbs
            </Text>
            <Text style={{ width: RFValue(160, 816), marginVertical: 5 }}>
              Average Fat
            </Text>
            <Text style={{ width: RFValue(160, 816), marginVertical: 5 }}>
              Average Protein
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              width: "30%",
            }}
          >
            <Text style={{ width: RFValue(160, 816), marginVertical: 5 }}>
              {calories} kcal
            </Text>
            <Text style={{ width: RFValue(160, 816), marginVertical: 5 }}>
              {carbs} grams
            </Text>
            <Text style={{ width: RFValue(160, 816), marginVertical: 5 }}>
              {fat} grams
            </Text>
            <Text style={{ width: RFValue(160, 816), marginVertical: 5 }}>
              {protein} grams
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default NutritionWeekGoal;
