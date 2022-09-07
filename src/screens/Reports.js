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
  Platform,
  DatePickerIOS,
} from "react-native";

import { db } from "../utils/firebase";
import firebase from "firebase";
import { PieChart } from "react-native-svg-charts";

let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;

import { useDispatch, useSelector } from "react-redux";
import {
  selectTemperoryId,
  selectUserData,
  selectUserType,
} from "../features/userSlice";

import { Icon } from "react-native-elements";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { LineChart } from "react-native-chart-kit";
import { Text as SvgText } from "react-native-svg";
import { Picker } from "@react-native-picker/picker";
import moment from "moment";
import DatePicker from "react-native-datepicker";
import "moment/locale/en-in";
import { BarChart, XAxis, YAxis, Grid } from "react-native-svg-charts";
import ComplianceCard from "./components/ComplianceCard";
import RNPickerSelect from "react-native-picker-select";
import Notification from "./components/Notification";
import { RFValue } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 0,
    padding: RFValue(20, 816),
    minHeight: ScreenHeight,
  },
  progressBar: {
    height: RFValue(20, 816),
    width: "100%",
    backgroundColor: "white",
    borderColor: "#000",
    borderWidth: 2,
    borderRadius: RFValue(5, 816),
  },
});

const Reports = ({ route, navigation }) => {
  const userType = useSelector(selectUserType);

  const userData = useSelector(selectUserData);
  const temperoryId = useSelector(selectTemperoryId);
  const [athleteDetails, setAthleteDetails] = useState(null);

  const isFocused = useIsFocused();
  moment.locale("en-in");
  const [metric, setMetric] = useState("weight");
  const [metricData, setMetricData] = useState([0, 0]);
  const [currentStartWeek, setCurrentStartWeek] = useState(
    moment(new Date()).subtract(30, "days").utc().format("DD-MM-YYYY")
  );
  const [currentEndWeek, setCurrentEndWeek] = useState(
    moment(new Date()).utc().format("DD-MM-YYYY")
  );
  const [currentStartWeek1, setCurrentStartWeek1] = useState(null);
  const [currentEndWeek1, setCurrentEndWeek1] = useState(null);
  const [currentStartWeek2, setCurrentStartWeek2] = useState(null);
  const [currentEndWeek2, setCurrentEndWeek2] = useState(null);
  const [complianceData, setComplianceData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [graph2Options, setGraph2Options] = useState("water");
  const [graph2Data, setGraph2Data] = useState([]);
  const [graph3Options, setGraph3Options] = useState("weight");
  const [graph3Data1, setGraph3Data1] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [graph3Data2, setGraph3Data2] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [graph3Data3, setGraph3Data3] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [graph3Data4, setGraph3Data4] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [graph3Data5, setGraph3Data5] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [graph3Data6, setGraph3Data6] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [graph3Data7, setGraph3Data7] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [graph3Data8, setGraph3Data8] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [graph3Data9, setGraph3Data9] = useState([0, 0, 0, 0, 0, 0, 0]);

  const [mindate, setmindate] = useState();
  const [maxdate, setmaxdate] = useState(null);
  const [Tdiff, settdiff] = useState(null);

  useEffect(() => {
    if (userData || (tempData && tempData)) {
      if (userType === "coach") {
        db.collection("athletes")
          .doc(temperoryId)
          .get()
          .then(function (snap) {
            setAthleteDetails({
              id: temperoryId,
              data: snap.data(),
            });
            if (snap.data().metrics) {
              let key = Object.keys(snap.data().metrics);
              let dates = [];
              key.forEach((item) => {
                if (dates.length == key.length) {
                  var minimumDate = new Date(Math.min.apply(null, dates));
                  if (minimumDate) {
                    setmindate(minimumDate);
                  } else {
                    setmindate(new Date());
                  }
                }
                dates.push(new Date(moment(item)));
              });
            }
          })
          .catch(function (error) {
            console.log("Error getting documents: ", error);
          });
      } else {
        setAthleteDetails(userData);
      }
    }
  }, [userData, temperoryId, isFocused]);
  useEffect(() => {
    if (mindate) {
      let a = moment(new Date());
      let b = moment(mindate);
      let diff = a.diff(b, "days");

      if (diff > 32) {
        setCurrentStartWeek(
          moment(new Date()).subtract(30, "days").utc().format("DD-MM-YYYY")
        );
      } else {
        setCurrentStartWeek(
          moment(new Date()).subtract(diff, "days").utc().format("DD-MM-YYYY")
        );
      }
    }
  }, [mindate]);
  useEffect(() => {
    var curr = new Date(); // get current date
    var first = curr.getDate() - curr.getDay(); // First day is the  day of the month - the day of the week \

    var firstday = new Date(curr.setDate(first)).toUTCString();
    var lastday = new Date(curr.setDate(curr.getDate() + 6)).toUTCString();

    setCurrentStartWeek1(formatSpecificDate(firstday));
    setCurrentEndWeek1(formatSpecificDate(lastday));
    setCurrentStartWeek2(formatSpecificDate(firstday));
    setCurrentEndWeek2(formatSpecificDate(lastday));
  }, []);

  function formatSpecificDate(d) {
    var d = new Date(d),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  function formatSpecificDay(d) {
    var d = new Date(d),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return day;
  }

  useEffect(() => {
    if (currentStartWeek1 && athleteDetails) {
      var compliance = [];
      var tempDate = currentStartWeek1;
      var total = 0;
      var count = 0;
      console.log("Inside compliance graph useEffect");

      db.collection("workouts")
        .where("assignedToId", "==", athleteDetails?.id)
        .where("date", ">=", currentStartWeek1)
        .where("date", "<=", currentEndWeek1)
        .orderBy("date")
        .get()
        .then((querySnapshot) => {
          while (count < 7) {
            querySnapshot.forEach((doc) => {
              if (doc.data().postWorkout) {
                if (tempDate === doc.data().date && doc.data().compliance) {
                  if (doc.data().compliance === "Non compliant") {
                    total = 2;
                  } else if (doc.data().compliance === "Partially compliant") {
                    total = 6;
                  } else {
                    total = 10;
                  }
                } else {
                  total = 0;
                }
              } else {
                total = 0;
              }
            });
            compliance.push(total);
            let tDate = new Date(tempDate);
            tempDate = formatSpecificDate(
              new Date(tDate.setDate(tDate.getDate() + 1)).toUTCString()
            );
            count = count + 1;
            total = 0;
          }
          setComplianceData(compliance);
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }
  }, [
    currentStartWeek1,
    currentEndWeek1,
    temperoryId,
    athleteDetails,
    isFocused,
  ]);

  useEffect(() => {
    if (currentStartWeek2 && athleteDetails) {
      var temp = [];
      var tempDate = currentStartWeek2;
      var total = 0;
      var count = 0;
      console.log("Inside water graph useEffect");

      if (athleteDetails?.data?.metrics) {
        while (count < 7) {
          if (athleteDetails?.data?.metrics[tempDate]) {
            if (
              athleteDetails?.data?.metrics[tempDate].water &&
              graph2Options === "water"
            ) {
              total = athleteDetails?.data?.metrics[tempDate].water;
            } else if (
              athleteDetails?.data?.metrics[tempDate].sleep &&
              graph2Options === "sleep"
            ) {
              total = athleteDetails?.data?.metrics[tempDate].sleep;
            } else if (
              athleteDetails?.data?.metrics[tempDate].soreness &&
              graph2Options === "soreness"
            ) {
              if (
                athleteDetails?.data?.metrics[tempDate].soreness &&
                athleteDetails?.data?.metrics[tempDate].soreness === "very-sore"
              ) {
                total = 9;
              } else if (
                athleteDetails?.data?.metrics[tempDate].soreness &&
                athleteDetails?.data?.metrics[tempDate].soreness ===
                "moderately-sore"
              ) {
                total = 6;
              } else if (athleteDetails?.data?.metrics[tempDate].soreness) {
                total = 3;
              }
            }
          } else {
            total = 0;
          }
          temp.push(total);
          let tDate = new Date(tempDate);
          tempDate = formatSpecificDate(
            new Date(tDate.setDate(tDate.getDate() + 1)).toUTCString()
          );
          count = count + 1;
          total = 0;
        }
        setGraph2Data(temp);
      } else {
        temp = [];
        total = 0;
        setGraph2Data(temp);
      }
    }
  }, [
    currentStartWeek2,
    currentEndWeek2,
    graph2Options,
    athleteDetails,
    isFocused,
  ]);

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
  function decr_date(date_str) {
    var parts = date_str.split("-");
    var dt = new Date(
      parseInt(parts[0], 10), // year
      parseInt(parts[1], 10) - 1, // month (starts with 0)
      parseInt(parts[2], 10) // date
    );
    dt.setDate(dt.getDate() - 1);
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
    if (athleteDetails?.data?.metrics) {
      let key = Object.keys(athleteDetails?.data?.metrics);
      let dates = [];
      key.forEach((item) => {
        dates.push(new Date(moment(item)));
        console.log(dates, "date");
        if (dates.length == key.length) {
          var minimumDate = new Date(Math.min.apply(null, dates));
          console.log(minimumDate, "mindate");
          if (minimumDate) {
            setmindate(minimumDate);
            var a = moment(new Date());
            var b = moment(minimumDate);
            var diff = a.diff(b, "days");

            console.log("s", diff);
            settdiff(diff);
          } else {
            settdiff(300);
          }
        } else {
          settdiff(300);
        }
      });
    }
  }, [athleteDetails]);

  useEffect(() => {
    if (currentStartWeek && athleteDetails) {
      var temp1 = [];
      var temp2 = [];
      var temp3 = [];
      var temp4 = [];
      var temp4 = [];
      var temp5 = [];
      var temp6 = [];
      var temp7 = [];
      var temp8 = [];
      var temp9 = [];

      var tempDate = currentStartWeek.split("-").reverse().join("-");
      var weight = 0;
      var fat = 0;
      var neck = 0;
      var chest = 0;
      var waist = 0;
      var glutes = 0;
      var quads = 0;
      var arms = 0;
      var muscle = 0;
      var count = 0;
      var total_diff = Tdiff;
      var start = moment(currentStartWeek.split("-").reverse().join("-"));
      var end = moment(currentEndWeek.split("-").reverse().join("-"));
      var diff = end.diff(start, "days");
      console.log(total_diff);
      //var total_diff = 1600;

      console.log("Inside weight graph useEffect");
      console.log("Second one");

      console.log("Tthird one");
      console.log(mindate);

      if (athleteDetails?.data?.metrics) {
        if (graph3Options === "weight") {
          while (count <= diff) {
            console.log(athleteDetails?.data?.metrics[tempDate], "tempDate");
            if (athleteDetails?.data?.metrics[tempDate]) {
              if (athleteDetails?.data.metrics[tempDate].weight) {
                weight = athleteDetails?.data?.metrics[tempDate].weight;
              } else {
                let c = 0;
                let val = 0;
                let tDate = decr_date(tempDate);
                while (c < total_diff) {
                  if (
                    athleteDetails?.data?.metrics[tDate] &&
                    athleteDetails?.data.metrics[tDate].weight
                  ) {
                    val = athleteDetails?.data.metrics[tDate].weight;
                    if (val) {
                      break;
                    }
                  }
                  c = c + 1;
                  tDate = decr_date(tDate);
                }
                weight = val;
              }
            } else {
              let val = 0;
              let c = 0;
              let tDate = decr_date(tempDate);
              while (c < total_diff) {
                if (
                  athleteDetails?.data?.metrics[tDate] &&
                  athleteDetails?.data.metrics[tDate].weight
                ) {
                  val = athleteDetails?.data.metrics[tDate].weight;
                  if (val) {
                    break;
                  }
                }
                c = c + 1;
                tDate = decr_date(tDate);
              }
              weight = val;
            }
            temp1.push(weight);
            temp2.push(fat);
            temp3.push(muscle);
            temp4.push(neck);
            temp5.push(chest);
            temp6.push(waist);
            temp7.push(glutes);
            temp8.push(quads);
            temp9.push(arms);
            //console.log({ temp1 });
            tempDate = incr_date(tempDate);
            count = count + 1;
            weight = 0;
            fat = 0;
            muscle = 0;
            neck = 0;
            chest = 0;
            waist = 0;
            glutes = 0;
            quads = 0;
            arms = 0;

          }
        }

        //neck Graph 

        else if (graph3Options === "neck") {
          while (count <= diff) {
            if (athleteDetails?.data?.metrics[tempDate]) {
              if (athleteDetails?.data?.metrics[tempDate].neck) {
                neck = athleteDetails?.data?.metrics[tempDate].neck;
              } else {
                let val = 0;
                let c = 0;
                let tDate = decr_date(tempDate);
                while (c < total_diff) {
                  if (
                    athleteDetails?.data?.metrics[tDate] &&
                    athleteDetails?.data.metrics[tDate].neck
                  ) {
                    val = athleteDetails?.data.metrics[tDate].neck;
                    if (val) {
                      break;
                    }
                  }
                  c = c + 1;
                  tDate = decr_date(tDate);
                }
                neck = val;
              }
            } else {
              let val = 0;
              let c = 0;
              let tDate = decr_date(tempDate);
              while (c < total_diff) {
                if (
                  athleteDetails?.data?.metrics[tDate] &&
                  athleteDetails?.data.metrics[tDate].neck
                ) {
                  val = athleteDetails?.data.metrics[tDate].neck;
                  if (val) {
                    break;
                  }
                }
                c = c + 1;
                tDate = decr_date(tDate);
              }
              neck = val;
            }
            temp1.push(weight);
            temp2.push(fat);
            temp3.push(muscle);
            temp4.push(neck)
            temp5.push(chest);
            temp6.push(waist);
            temp7.push(glutes);
            temp8.push(quads);
            temp9.push(arms);
            //console.log({ temp1 });
            tempDate = incr_date(tempDate);
            count = count + 1;
            weight = 0;
            neck = 0;
            fat = 0;
            muscle = 0;
            chest = 0;
            waist = 0;
            glutes = 0;
            quads = 0;
            arms = 0;
          }
        }

        //Chest Graph 

        else if (graph3Options === "chest") {
          while (count <= diff) {
            if (athleteDetails?.data?.metrics[tempDate]) {
              if (athleteDetails?.data?.metrics[tempDate].chest) {
                chest = athleteDetails?.data?.metrics[tempDate].chest;
              } else {
                let val = 0;
                let c = 0;
                let tDate = decr_date(tempDate);
                while (c < total_diff) {
                  if (
                    athleteDetails?.data?.metrics[tDate] &&
                    athleteDetails?.data.metrics[tDate].chest
                  ) {
                    val = athleteDetails?.data.metrics[tDate].chest;
                    if (val) {
                      break;
                    }
                  }
                  c = c + 1;
                  tDate = decr_date(tDate);
                }
                chest = val;
              }
            } else {
              let val = 0;
              let c = 0;
              let tDate = decr_date(tempDate);
              while (c < total_diff) {
                if (
                  athleteDetails?.data?.metrics[tDate] &&
                  athleteDetails?.data.metrics[tDate].chest
                ) {
                  val = athleteDetails?.data.metrics[tDate].chest;
                  if (val) {
                    break;
                  }
                }
                c = c + 1;
                tDate = decr_date(tDate);
              }
              chest = val;
            }
            temp1.push(weight);
            temp2.push(fat);
            temp3.push(muscle);
            temp4.push(neck);
            temp5.push(chest);
            temp6.push(waist);
            temp7.push(glutes);
            temp8.push(quads);
            temp9.push(arms);

            //console.log({ temp1 });
            tempDate = incr_date(tempDate);
            count = count + 1;
            weight = 0;
            neck = 0;
            fat = 0;
            muscle = 0;
            chest = 0;
            waist = 0;
            glutes = 0;
            quads = 0;
            arms = 0;

          }
        }

        //Wasit Graph

        else if (graph3Options === "waist") {
          while (count <= diff) {
            if (athleteDetails?.data?.metrics[tempDate]) {
              if (athleteDetails?.data?.metrics[tempDate].waist) {
                waist = athleteDetails?.data?.metrics[tempDate].waist;
              } else {
                let val = 0;
                let c = 0;
                let tDate = decr_date(tempDate);
                while (c < total_diff) {
                  if (
                    athleteDetails?.data?.metrics[tDate] &&
                    athleteDetails?.data.metrics[tDate].waist
                  ) {
                    val = athleteDetails?.data.metrics[tDate].waist;
                    if (val) {
                      break;
                    }
                  }
                  c = c + 1;
                  tDate = decr_date(tDate);
                }
                waist = val;
              }
            } else {
              let val = 0;
              let c = 0;
              let tDate = decr_date(tempDate);
              while (c < total_diff) {
                if (
                  athleteDetails?.data?.metrics[tDate] &&
                  athleteDetails?.data.metrics[tDate].waist
                ) {
                  val = athleteDetails?.data.metrics[tDate].waist;
                  if (val) {
                    break;
                  }
                }
                c = c + 1;
                tDate = decr_date(tDate);
              }
              waist = val;
            }
            temp1.push(weight);
            temp2.push(fat);
            temp3.push(muscle);
            temp4.push(neck);
            temp5.push(chest);
            temp6.push(waist);
            temp7.push(glutes);
            temp8.push(quads);
            temp9.push(arms);

            //console.log({ temp1 });
            tempDate = incr_date(tempDate);
            count = count + 1;
            weight = 0;
            neck = 0;
            fat = 0;
            muscle = 0;
            chest = 0;
            waist = 0;
            glutes = 0;
            quads = 0;
            arms = 0;

          }
        }

        //Glutes Graph

        else if (graph3Options === "glutes") {
          while (count <= diff) {
            if (athleteDetails?.data?.metrics[tempDate]) {
              if (athleteDetails?.data?.metrics[tempDate].glutes) {
                glutes = athleteDetails?.data?.metrics[tempDate].glutes;
              } else {
                let val = 0;
                let c = 0;
                let tDate = decr_date(tempDate);
                while (c < total_diff) {
                  if (
                    athleteDetails?.data?.metrics[tDate] &&
                    athleteDetails?.data.metrics[tDate].glutes
                  ) {
                    val = athleteDetails?.data.metrics[tDate].glutes;
                    if (val) {
                      break;
                    }
                  }
                  c = c + 1;
                  tDate = decr_date(tDate);
                }
                glutes = val;
              }
            } else {
              let val = 0;
              let c = 0;
              let tDate = decr_date(tempDate);
              while (c < total_diff) {
                if (
                  athleteDetails?.data?.metrics[tDate] &&
                  athleteDetails?.data.metrics[tDate].glutes
                ) {
                  val = athleteDetails?.data.metrics[tDate].glutes;
                  if (val) {
                    break;
                  }
                }
                c = c + 1;
                tDate = decr_date(tDate);
              }
              glutes = val;
            }
            temp1.push(weight);
            temp2.push(fat);
            temp3.push(muscle);
            temp4.push(neck);
            temp5.push(chest);
            temp6.push(waist);
            temp7.push(glutes);
            temp8.push(quads);
            temp9.push(arms);

            //console.log({ temp1 });
            tempDate = incr_date(tempDate);
            count = count + 1;
            weight = 0;
            neck = 0;
            fat = 0;
            muscle = 0;
            chest = 0;
            waist = 0;
            glutes = 0;
            quads = 0;
            arms = 0;

          }
        }

        //Quads Graph

        else if (graph3Options === "quads") {
          while (count <= diff) {
            if (athleteDetails?.data?.metrics[tempDate]) {
              if (athleteDetails?.data?.metrics[tempDate].quads) {
                quads = athleteDetails?.data?.metrics[tempDate].quads;
              } else {
                let val = 0;
                let c = 0;
                let tDate = decr_date(tempDate);
                while (c < total_diff) {
                  if (
                    athleteDetails?.data?.metrics[tDate] &&
                    athleteDetails?.data.metrics[tDate].quads
                  ) {
                    val = athleteDetails?.data.metrics[tDate].quads;
                    if (val) {
                      break;
                    }
                  }
                  c = c + 1;
                  tDate = decr_date(tDate);
                }
                quads = val;
              }
            } else {
              let val = 0;
              let c = 0;
              let tDate = decr_date(tempDate);
              while (c < total_diff) {
                if (
                  athleteDetails?.data?.metrics[tDate] &&
                  athleteDetails?.data.metrics[tDate].quads
                ) {
                  val = athleteDetails?.data.metrics[tDate].quads;
                  if (val) {
                    break;
                  }
                }
                c = c + 1;
                tDate = decr_date(tDate);
              }
              quads = val;
            }
            temp1.push(weight);
            temp2.push(fat);
            temp3.push(muscle);
            temp4.push(neck);
            temp5.push(chest);
            temp6.push(waist);
            temp7.push(glutes);
            temp8.push(quads);
            temp9.push(arms);

            //console.log({ temp1 });
            tempDate = incr_date(tempDate);
            count = count + 1;
            weight = 0;
            neck = 0;
            fat = 0;
            muscle = 0;
            chest = 0;
            waist = 0;
            glutes = 0;
            quads = 0;
            arms = 0;

          }
        }

        //Arms graph

        else if (graph3Options === "arms") {
          while (count <= diff) {
            if (athleteDetails?.data?.metrics[tempDate]) {
              if (athleteDetails?.data?.metrics[tempDate].arms) {
                arms = athleteDetails?.data?.metrics[tempDate].arms;
              } else {
                let val = 0;
                let c = 0;
                let tDate = decr_date(tempDate);
                while (c < total_diff) {
                  if (
                    athleteDetails?.data?.metrics[tDate] &&
                    athleteDetails?.data.metrics[tDate].arms
                  ) {
                    val = athleteDetails?.data.metrics[tDate].arms;
                    if (val) {
                      break;
                    }
                  }
                  c = c + 1;
                  tDate = decr_date(tDate);
                }
                arms = val;
              }
            } else {
              let val = 0;
              let c = 0;
              let tDate = decr_date(tempDate);
              while (c < total_diff) {
                if (
                  athleteDetails?.data?.metrics[tDate] &&
                  athleteDetails?.data.metrics[tDate].arms
                ) {
                  val = athleteDetails?.data.metrics[tDate].arms;
                  if (val) {
                    break;
                  }
                }
                c = c + 1;
                tDate = decr_date(tDate);
              }
              arms = val;
            }
            temp1.push(weight);
            temp2.push(fat);
            temp3.push(muscle);
            temp4.push(neck);
            temp5.push(chest);
            temp6.push(waist);
            temp7.push(glutes);
            temp8.push(quads);
            temp9.push(arms);

            //console.log({ temp1 });
            tempDate = incr_date(tempDate);
            count = count + 1;
            weight = 0;
            neck = 0;
            fat = 0;
            muscle = 0;
            chest = 0;
            waist = 0;
            glutes = 0;
            quads = 0;
            arms = 0;

          }
        }

        else if (graph3Options === "fat") {
          while (count <= diff) {
            if (athleteDetails?.data?.metrics[tempDate]) {
              if (athleteDetails?.data?.metrics[tempDate].fat) {
                fat = athleteDetails?.data?.metrics[tempDate].fat;
              } else {
                let val = 0;
                let c = 0;
                let tDate = decr_date(tempDate);
                while (c < total_diff) {
                  if (
                    athleteDetails?.data?.metrics[tDate] &&
                    athleteDetails?.data.metrics[tDate].fat
                  ) {
                    val = athleteDetails?.data.metrics[tDate].fat;
                    if (val) {
                      break;
                    }
                  }
                  c = c + 1;
                  tDate = decr_date(tDate);
                }
                fat = val;
              }
            } else {
              let val = 0;
              let c = 0;
              let tDate = decr_date(tempDate);
              while (c < total_diff) {
                if (
                  athleteDetails?.data?.metrics[tDate] &&
                  athleteDetails?.data.metrics[tDate].fat
                ) {
                  val = athleteDetails?.data.metrics[tDate].fat;
                  if (val) {
                    break;
                  }
                }
                c = c + 1;
                tDate = decr_date(tDate);
              }
              fat = val;
            }
            temp1.push(weight);
            temp2.push(fat);
            temp3.push(muscle);
            temp4.push(neck)
            temp5.push(chest);
            temp6.push(waist);
            temp7.push(glutes);
            temp8.push(quads);
            temp9.push(arms);
            //console.log({ temp1 });
            tempDate = incr_date(tempDate);
            count = count + 1;
            weight = 0;
            fat = 0;
            muscle = 0;
            neck = 0;
            chest = 0;
            waist = 0;
            glutes = 0;
            quads = 0;
            arms = 0;
          }
        } else if (graph3Options === "muscle") {
          while (count <= diff) {
            if (athleteDetails?.data?.metrics[tempDate]) {
              if (athleteDetails?.data?.metrics[tempDate].muscle) {
                muscle = athleteDetails?.data?.metrics[tempDate].muscle;
              } else {
                let val = 0;
                let c = 0;
                let tDate = decr_date(tempDate);
                while (c < total_diff) {
                  if (
                    athleteDetails?.data?.metrics[tDate] &&
                    athleteDetails?.data.metrics[tDate].muscle
                  ) {
                    val = athleteDetails?.data.metrics[tDate].muscle;
                    if (val) {
                      break;
                    }
                  }
                  c = c + 1;
                  tDate = decr_date(tDate);
                }

                muscle = val;
              }
            } else {
              let val = 0;
              let c = 0;
              let tDate = decr_date(tempDate);
              while (c < total_diff) {
                if (
                  athleteDetails?.data?.metrics[tDate] &&
                  athleteDetails?.data.metrics[tDate].muscle
                ) {
                  val = athleteDetails?.data.metrics[tDate].muscle;
                  if (val) {
                    break;
                  }
                }
                c = c + 1;
                tDate = decr_date(tDate);
              }
              muscle = val;
            }
            temp1.push(weight);
            temp2.push(fat);
            temp3.push(muscle);
            temp4.push(neck)
            temp5.push(chest);
            temp6.push(waist);
            temp7.push(glutes);
            temp8.push(quads);
            temp9.push(arms);
            //console.log({ temp1 });
            tempDate = incr_date(tempDate);
            count = count + 1;
            weight = 0;
            fat = 0;
            muscle = 0;
            neck = 0;
            chest = 0;
            waist = 0;
            glutes = 0;
            quads = 0;
            arms = 0;
          }
        } else {
          while (count <= diff) {
            if (athleteDetails?.data?.metrics[tempDate]) {
              if (athleteDetails?.data.metrics[tempDate].weight) {
                weight = athleteDetails?.data?.metrics[tempDate].weight;
              } else {
                let val = 0;
                let c = 0;
                let tDate = decr_date(tempDate);
                while (c < total_diff) {
                  if (
                    athleteDetails?.data?.metrics[tDate] &&
                    athleteDetails?.data.metrics[tDate].weight
                  ) {
                    val = athleteDetails?.data.metrics[tDate].weight;
                    if (val) {
                      break;
                    }
                  }
                  c = c + 1;
                  tDate = decr_date(tDate);
                }
                weight = val;
              }
              if (athleteDetails?.data?.metrics[tempDate].fat) {
                fat = athleteDetails?.data?.metrics[tempDate].fat;
              } else {
                let val = 0;
                let tDate = decr_date(tempDate);
                let c = 0;
                while (c < total_diff) {
                  if (
                    athleteDetails?.data?.metrics[tDate] &&
                    athleteDetails?.data.metrics[tDate].fat
                  ) {
                    val = athleteDetails?.data.metrics[tDate].fat;
                    if (val) {
                      break;
                    }
                  }
                  c = c + 1;
                  tDate = decr_date(tDate);
                }
                fat = val;
              }
              if (athleteDetails?.data?.metrics[tempDate].muscle) {
                muscle = athleteDetails?.data?.metrics[tempDate].muscle;
              } else {
                let val = 0;
                let c = 0;
                let tDate = decr_date(tempDate);
                while (c < total_diff) {
                  if (
                    athleteDetails?.data?.metrics[tDate] &&
                    athleteDetails?.data.metrics[tDate].muscle
                  ) {
                    val = athleteDetails?.data.metrics[tDate].muscle;
                    if (val) {
                      break;
                    }
                  }
                  c = c + 1;
                  tDate = decr_date(tDate);
                }

                muscle = val;
              }

              if (athleteDetails?.data?.metrics[tempDate].neck) {
                neck = athleteDetails?.data?.metrics[tempDate].neck;
              } else {
                let val = 0;
                let c = 0;
                let tDate = decr_date(tempDate);
                while (c < total_diff) {
                  if (
                    athleteDetails?.data?.metrics[tDate] &&
                    athleteDetails?.data.metrics[tDate].neck
                  ) {
                    val = athleteDetails?.data.metrics[tDate].neck;
                    if (val) {
                      break;
                    }
                  }
                  c = c + 1;
                  tDate = decr_date(tDate);
                }

                neck = val;
              }

              if (athleteDetails?.data.metrics[tempDate].chest) {
                chest = athleteDetails?.data?.metrics[tempDate].chest;
              } else {
                let val = 0;
                let c = 0;
                let tDate = decr_date(tempDate);
                while (c < total_diff) {
                  if (
                    athleteDetails?.data?.metrics[tDate] &&
                    athleteDetails?.data.metrics[tDate].chest
                  ) {
                    val = athleteDetails?.data.metrics[tDate].chest;
                    if (val) {
                      break;
                    }
                  }
                  c = c + 1;
                  tDate = decr_date(tDate);
                }
                chest = val;
              }

              if (athleteDetails?.data.metrics[tempDate].waist) {
                waist = athleteDetails?.data?.metrics[tempDate].waist;
              } else {
                let val = 0;
                let c = 0;
                let tDate = decr_date(tempDate);
                while (c < total_diff) {
                  if (
                    athleteDetails?.data?.metrics[tDate] &&
                    athleteDetails?.data.metrics[tDate].waist
                  ) {
                    val = athleteDetails?.data.metrics[tDate].waist;
                    if (val) {
                      break;
                    }
                  }
                  c = c + 1;
                  tDate = decr_date(tDate);
                }
                waist = val;
              }

              if (athleteDetails?.data.metrics[tempDate].glutes) {
                glutes = athleteDetails?.data?.metrics[tempDate].glutes;
              } else {
                let val = 0;
                let c = 0;
                let tDate = decr_date(tempDate);
                while (c < total_diff) {
                  if (
                    athleteDetails?.data?.metrics[tDate] &&
                    athleteDetails?.data.metrics[tDate].glutes
                  ) {
                    val = athleteDetails?.data.metrics[tDate].glutes;
                    if (val) {
                      break;
                    }
                  }
                  c = c + 1;
                  tDate = decr_date(tDate);
                }
                glutes = val;
              }

              if (athleteDetails?.data.metrics[tempDate].quads) {
                quads = athleteDetails?.data?.metrics[tempDate].quads;
              } else {
                let val = 0;
                let c = 0;
                let tDate = decr_date(tempDate);
                while (c < total_diff) {
                  if (
                    athleteDetails?.data?.metrics[tDate] &&
                    athleteDetails?.data.metrics[tDate].quads
                  ) {
                    val = athleteDetails?.data.metrics[tDate].quads;
                    if (val) {
                      break;
                    }
                  }
                  c = c + 1;
                  tDate = decr_date(tDate);
                }
                quads = val;
              }

              if (athleteDetails?.data.metrics[tempDate].arms) {
                arms = athleteDetails?.data?.metrics[tempDate].arms;
              } else {
                let val = 0;
                let c = 0;
                let tDate = decr_date(tempDate);
                while (c < total_diff) {
                  if (
                    athleteDetails?.data?.metrics[tDate] &&
                    athleteDetails?.data.metrics[tDate].arms
                  ) {
                    val = athleteDetails?.data.metrics[tDate].arms;
                    if (val) {
                      break;
                    }
                  }
                  c = c + 1;
                  tDate = decr_date(tDate);
                }
                arms = val;
              }

            } else {
              let val1 = 0;
              let val2 = 0;
              let val3 = 0;
              let val4 = 0;
              let val5 = 0;
              let val6 = 0;
              let val7 = 0;
              let val8 = 0;
              let val9 = 0;
              let tDate1 = decr_date(tempDate);
              let tDate2 = decr_date(tempDate);
              let tDate3 = decr_date(tempDate);
              let tDate4 = decr_date(tempDate);
              let tDate5 = decr_date(tempDate);
              let tDate6 = decr_date(tempDate);
              let tDate7 = decr_date(tempDate);
              let tDate8 = decr_date(tempDate);
              let tDate9 = decr_date(tempDate);

              let a1 = 0;
              let a2 = 0;
              let a3 = 0;
              let a4 = 0;
              let a5 = 0;
              let a6 = 0;
              let a7 = 0;
              let a8 = 0;
              let a9 = 0;

              while (a1 < total_diff) {
                if (
                  athleteDetails?.data.metrics[tDate1] &&
                  athleteDetails?.data.metrics[tDate1].weight
                ) {
                  val1 = athleteDetails?.data.metrics[tDate1].weight;
                  if (val1) {
                    break;
                  }
                }

                a1 = a1 + 1;
                tDate1 = decr_date(tDate1);
              }


              while (a2 < total_diff) {
                if (
                  athleteDetails?.data.metrics[tDate2] &&
                  athleteDetails?.data.metrics[tDate2].fat
                ) {
                  val2 = athleteDetails?.data.metrics[tDate2].fat;
                  if (val2) {
                    break;
                  }
                }

                a2 = a2 + 1;
                tDate2 = decr_date(tDate2);
              }
              while (a3 < total_diff) {
                if (
                  athleteDetails?.data.metrics[tDate3] &&
                  athleteDetails?.data.metrics[tDate3].muscle
                ) {
                  val3 = athleteDetails?.data.metrics[tDate3].muscle;
                  if (val3) {
                    break;
                  }
                }
                a3 = a3 + 1;
                tDate3 = decr_date(tDate3);
              }

              while (a4 < total_diff) {
                if (
                  athleteDetails?.data.metrics[tDate4] &&
                  athleteDetails?.data.metrics[tDate4].neck
                ) {
                  val4 = athleteDetails?.data.metrics[tDate4].neck;
                  if (val4) {
                    break;
                  }
                }

                a4 = a4 + 1;
                tDate4 = decr_date(tDate4);
              }

              while (a5 < total_diff) {
                if (
                  athleteDetails?.data.metrics[tDate5] &&
                  athleteDetails?.data.metrics[tDate5].chest
                ) {
                  val5 = athleteDetails?.data.metrics[tDate5].chest;
                  if (val5) {
                    break;
                  }
                }

                a5 = a5 + 1;
                tDate5 = decr_date(tDate5);
              }


              while (a6 < total_diff) {
                if (
                  athleteDetails?.data.metrics[tDate6] &&
                  athleteDetails?.data.metrics[tDate6].waist
                ) {
                  val6 = athleteDetails?.data.metrics[tDate6].waist;
                  if (val6) {
                    break;
                  }
                }

                a6 = a6 + 1;
                tDate6 = decr_date(tDate6);
              }

              while (a7 < total_diff) {
                if (
                  athleteDetails?.data.metrics[tDate7] &&
                  athleteDetails?.data.metrics[tDate7].glutes
                ) {
                  val7 = athleteDetails?.data.metrics[tDate7].glutes;
                  if (val7) {
                    break;
                  }
                }

                a7 = a7 + 1;
                tDate7 = decr_date(tDate7);
              }

              while (a8 < total_diff) {
                if (
                  athleteDetails?.data.metrics[tDate8] &&
                  athleteDetails?.data.metrics[tDate8].quads
                ) {
                  val8 = athleteDetails?.data.metrics[tDate8].quads;
                  if (val8) {
                    break;
                  }
                }

                a8 = a8 + 1;
                tDate8 = decr_date(tDate8);
              }
              while (a9 < total_diff) {
                if (
                  athleteDetails?.data.metrics[tDate8] &&
                  athleteDetails?.data.metrics[tDate8].arms
                ) {
                  val8 = athleteDetails?.data.metrics[tDate8].arms;
                  if (val8) {
                    break;
                  }
                }

                a8 = a8 + 1;
                tDate8 = decr_date(tDate8);
              }
              weight = val1;
              fat = val2;
              muscle = val3;
              neck = val4;
              chest = val5;
              waist = val6;
              glutes = val7;
              quads = val8;
              arms = val9;
            }
            temp1.push(weight);
            temp2.push(fat);
            temp3.push(muscle);
            temp4.push(neck);
            temp5.push(chest);
            temp6.push(waist);
            temp7.push(glutes);
            temp8.push(quads);
            temp9.push(arms);
            //console.log({ temp1 });
            tempDate = incr_date(tempDate);
            count = count + 1;
            weight = 0;
            fat = 0;
            muscle = 0;
            neck = 0;
            chest = 0;
            waist = 0;
            glutes = 0;
            quads = 0;
            arms = 0;

          }
        }
        setGraph3Data1(temp1);
        setGraph3Data2(temp2);
        setGraph3Data3(temp3);
        setGraph3Data4(temp4);
        setGraph3Data5(temp5);
        setGraph3Data6(temp6);
        setGraph3Data7(temp7);
        setGraph3Data8(temp8);
        setGraph3Data9(temp9);

      } else {
        temp1 = [];
        temp2 = [];
        temp3 = [];
        temp4 = [];
        temp5 = [];
        temp6 = [];
        temp7 = [];
        temp8 = [];
        temp9 = [];
        setGraph3Data1(temp1);
        setGraph3Data2(temp2);
        setGraph3Data3(temp3);
        setGraph3Data4(temp4);
        setGraph3Data5(temp5);
        setGraph3Data6(temp6);
        setGraph3Data7(temp7);
        setGraph3Data8(temp8);
        setGraph3Data9(temp9);

      }
    }
  }, [
    currentStartWeek,
    currentEndWeek,
    graph3Options,
    athleteDetails,
    isFocused,
    mindate,
    Tdiff,
  ]);

  function formatDate2(date) {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    month = monthNames[d.getMonth()];
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join(" ");
  }

  return (
    <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
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
                paddingRight: RFValue(20, 816),
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
            <View>
              <Text
                style={{
                  fontSize: 30,
                  fontFamily: "SF-Pro-Text-regular",
                  fontWeight: "bold",
                  color: "#003049",
                  marginLeft: RFValue(20, 816),
                }}
              >
                Reports
              </Text>
            </View>
          </View>
          <Notification navigation={navigation} />
        </View>

        {/* <View
          style={{
            padding: RFValue(20, 816),
            backgroundColor: "white",
            marginVertical: RFValue(20, 816),
            borderRadius: RFValue(20, 816),
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: "SF-Pro-Text-regular",
              alignSelf: "center",
            }}
          >
            Compliance Weekly Report
          </Text>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "center",
              marginVertical: RFValue(10, 816),
            }}
          >
            <TouchableOpacity
              style={{
                marginRight: RFValue(20, 816),
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => {
                var curr = new Date(currentStartWeek1); // get current date
                var first = curr.getDate() - curr.getDay() - 7; // First day is the  day of the month - the day of the week \

                var firstday = new Date(curr.setDate(first)).toUTCString();
                var lastday = new Date(
                  curr.setDate(curr.getDate() + 6)
                ).toUTCString();

                setCurrentStartWeek1(formatSpecificDate(firstday));
                setCurrentEndWeek1(formatSpecificDate(lastday));
              }}
            >
              <Icon
                name="chevron-left"
                size={15}
                style={{ marginRight: RFValue(10, 816) }}
                type="font-awesome-5"
              />
            </TouchableOpacity>
            <Text style={{ width: ScreenWidth / 2.2, textAlign: "center" }}>
              {formatDate2(currentStartWeek1)} - {formatDate2(currentEndWeek1)}
            </Text>
            <TouchableOpacity
              style={{
                marginLeft: RFValue(20, 816),
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => {
                var curr = new Date(currentStartWeek1); // get current date
                var first = curr.getDate() - curr.getDay() + 7; // First day is the  day of the month - the day of the week \

                var firstday = new Date(curr.setDate(first)).toUTCString();
                var lastday = new Date(
                  curr.setDate(curr.getDate() + 6)
                ).toUTCString();

                setCurrentStartWeek1(formatSpecificDate(firstday));
                setCurrentEndWeek1(formatSpecificDate(lastday));
              }}
            >
              <Icon
                name="chevron-right"
                size={15}
                style={{ marginRight: RFValue(10, 816) }}
                type="font-awesome-5"
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              height: 250,
              width: "100%",
              marginLeft: -15,
              paddingBottom: 50,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <YAxis
              data={complianceData}
              contentInset={{ top: RFValue(5, 816), bottom: 5 }}
              svg={{
                fill: "grey",
                fontSize: RFValue(12, 816),
              }}
              style={{
                height: 150,
                marginRight: RFValue(5, 816),
                marginLeft: RFValue(20, 816),
              }}
              formatLabel={(value) => `${value}`}
              numberOfTicks={6}
            />
            <View style={{ height: 220, width: ScreenWidth / 1.5 }}>
              <BarChart
                style={{ height: 200, paddingBottom: 0 }}
                data={complianceData}
                svg={{ fill: `#ffe486` }}
                spacingInner={0.45}
                spacingOuter={0.3}
                contentInset={{ top: 30, bottom: RFValue(10, 816) }}
              >
                {/* #7388A9 */}
        {/* </BarChart>
              <XAxis
                style={{ marginHorizontal: RFValue(10, 816) }}
                data={complianceData}
                formatLabel={(value, index) =>
                  formatSpecificDay(
                    new Date(
                      new Date(currentStartWeek1).setDate(
                        new Date(currentStartWeek1).getDate() + index
                      )
                    ).toUTCString()
                  )
                }
                contentInset={{
                  left: RFValue(10, 816),
                  right: RFValue(10, 816),
                }}
                svg={{
                  fontSize: RFValue(12, 816),
                  fill: "#333",
                  fontWeight: "600",
                }}
              />
              {complianceData.length > 1 ? (
                <Text
                  style={{ textAlign: "center", marginTop: RFValue(10, 816) }}
                >
                  Days{" "}
                </Text>
              ) : null}
            </View>
          </View>
        </View>  */}

        <View
          style={{
            padding: RFValue(20, 816),
            backgroundColor: "white",
            marginVertical: RFValue(20, 816),
            borderRadius: RFValue(20, 816),
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: "SF-Pro-Text-regular",
              alignSelf: "center",
            }}
          >
            Weekly Report
          </Text>
          {Platform.OS === "ios" ? (
            <View
              style={{
                alignItems: "center",
                backgroundColor: "#fff",
                borderWidth: 0.4,
                borderRadius: RFValue(5, 816),
                padding: 10,
                marginVertical: 10,
              }}
            >
              <RNPickerSelect
                value={graph2Options}
                style={{ paddingVertical: 5 }}
                onValueChange={(value) => setGraph2Options(value)}
                items={[
                  { label: "Water", value: "water" },
                  { label: "Sleep", value: "sleep" },
                  { label: "Soreness", value: "soreness" },
                ]}
              />
            </View>
          ) : (
            <Picker
              selectedValue={graph2Options}
              style={{
                width: "50%",
                alignSelf: "center",
              }}
              onValueChange={(itemValue, itemIndex) => {
                setGraph2Options(itemValue);
              }}
            >
              <Picker.Item label="Water" value="water" />
              <Picker.Item label="Sleep" value="sleep" />
              <Picker.Item label="Soreness" value="soreness" />
            </Picker>
          )}

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "center",
              marginVertical: RFValue(10, 816),
            }}
          >
            <TouchableOpacity
              style={{
                marginRight: RFValue(20, 816),
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => {
                var curr = new Date(currentStartWeek2); // get current date
                var first = curr.getDate() - curr.getDay() - 7; // First day is the  day of the month - the day of the week \

                var firstday = new Date(curr.setDate(first)).toUTCString();
                var lastday = new Date(
                  curr.setDate(curr.getDate() + 6)
                ).toUTCString();

                setCurrentStartWeek2(formatSpecificDate(firstday));
                setCurrentEndWeek2(formatSpecificDate(lastday));
              }}
            >
              <Icon
                name="chevron-left"
                size={15}
                style={{ marginRight: RFValue(10, 816) }}
                type="font-awesome-5"
              />
            </TouchableOpacity>
            <Text style={{ width: ScreenWidth / 2.2, textAlign: "center" }}>
              {formatDate2(currentStartWeek2)} - {formatDate2(currentEndWeek2)}
            </Text>
            <TouchableOpacity
              style={{
                marginLeft: RFValue(20, 816),
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => {
                var curr = new Date(currentStartWeek2); // get current date
                var first = curr.getDate() - curr.getDay() + 7; // First day is the  day of the month - the day of the week \

                var firstday = new Date(curr.setDate(first)).toUTCString();
                var lastday = new Date(
                  curr.setDate(curr.getDate() + 6)
                ).toUTCString();

                setCurrentStartWeek2(formatSpecificDate(firstday));
                setCurrentEndWeek2(formatSpecificDate(lastday));
              }}
            >
              <Icon
                name="chevron-right"
                size={15}
                style={{ marginRight: RFValue(10, 816) }}
                type="font-awesome-5"
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              height: 250,
              width: "100%",
              marginLeft: -15,
              paddingBottom: 50,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <YAxis
              data={graph2Data}
              contentInset={{ top: RFValue(5, 816), bottom: 5 }}
              svg={{
                fill: "grey",
                fontSize: RFValue(12, 816),
              }}
              style={{
                height: 150,
                marginRight: RFValue(5, 816),
                marginLeft: RFValue(20, 816),
              }}
              formatLabel={(value) => `${value}`}
              numberOfTicks={6}
            />
            <View style={{ height: 220, width: ScreenWidth / 1.5 }}>
              <BarChart
                style={{ height: 200 }}
                data={graph2Data}
                svg={{ fill: `#ffe486` }}
                spacingInner={0.45}
                spacingOuter={0.3}
                contentInset={{ top: 30, bottom: RFValue(10, 816) }}
              >
                {/* #7388A9 */}
              </BarChart>
              <XAxis
                style={{ marginHorizontal: RFValue(10, 816) }}
                data={graph2Data}
                formatLabel={(value, index) =>
                  formatSpecificDay(
                    new Date(
                      new Date(currentStartWeek2).setDate(
                        new Date(currentStartWeek2).getDate() + index
                      )
                    ).toUTCString()
                  )
                }
                contentInset={{
                  left: RFValue(10, 816),
                  right: RFValue(10, 816),
                }}
                svg={{
                  fontSize: RFValue(12, 816),
                  fill: "#333",
                  fontWeight: "600",
                }}
              />
              {graph2Data.length > 1 ? (
                <Text
                  style={{ textAlign: "center", marginTop: RFValue(10, 816) }}
                >
                  Days{" "}
                </Text>
              ) : null}
            </View>
          </View>
        </View>

        <View
          style={{
            padding: RFValue(10, 816),
            borderRadius: RFValue(10, 816),
            backgroundColor: "white",
            marginBottom: 15,
          }}
        >
          <Text style={{ fontWeight: "bold", color: "black" }}>
            Athlete Photos
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: RFValue(20, 816),
              justifyContent: "space-around",
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("Photos", { type: "front" })}
              style={{
                backgroundColor: "#C19F1E",
                padding: RFValue(10, 816),
                borderRadius: RFValue(20, 816),
                width: "20%",
                margin:5
              }}
            >
              <Text style={{ textAlign: "center", color: "white" }}>
                Front Photos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Photos", { type: "back" })}
              style={{
                backgroundColor: "#C19F1E",
                padding: RFValue(10, 816),
                borderRadius: RFValue(20, 816),
                width: "20%",
                margin:5
              }}
            >
              <Text style={{ textAlign: "center", color: "white" }}>
                Back Photos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Photos", { type: "side" })}
              style={{
                backgroundColor: "#C19F1E",
                padding: RFValue(10, 816),
                borderRadius: RFValue(20, 816),
                width: "20%",
                marginHorizontal:5
              }}
            >
              <Text style={{ textAlign: "center", color: "white" }}>
                Side Photos
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            padding: RFValue(20, 816),
            backgroundColor: "white",
            borderRadius: RFValue(20, 816),
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: "SF-Pro-Text-regular",
              alignSelf: "center",
              marginBottom: 5,
            }}
          >
            Measurement Report
          </Text>

          {Platform.OS === "ios" ? (
            <View
              style={{
                alignItems: "center",
                backgroundColor: "#fff",
                borderWidth: 0.4,
                borderRadius: RFValue(5, 816),
                padding: 10,
                marginVertical: 10,
              }}
            >
              <RNPickerSelect
                value={graph3Options}
                style={{ paddingVertical: 5 }}
                onValueChange={(value) => setGraph3Options(value)}
                items={[
                  // { label: "All", value: "all" },
                  { label: "Weight", value: "weight" },
                  { label: "Fat Percentage", value: "fat" },
                  { label: "Muscle Percentage", value: "muscle" },
                  { label: "Neck", value: "neck" },
                  { label: "Chest", value: "chest" },
                  { label: "Waist", value: "waist" },
                  { label: "Glutes", value: "glutes" },
                  { label: "Quads", value: "quads" },
                  { label: "Arms", value: "arms" },
                ]}
              />
            </View>
          ) : (
            <Picker
              selectedValue={graph3Options}
              style={{
                width: "50%",
                alignSelf: "center",
              }}
              onValueChange={(itemValue, itemIndex) => {
                setGraph3Options(itemValue);
              }}
            >
              {/* <Picker.Item label="All" value="all" /> */}
              <Picker.Item label="Weight" value="weight" />
              <Picker.Item label="Fat Percentage" value="fat" />
              <Picker.Item label="Muscle Percentage" value="muscle" />
              <Picker.Item label="Neck" value="neck" />
              <Picker.Item label="Chest" value="chest" />
              <Picker.Item label="Waist" value="waist" />
              <Picker.Item label="Glutes" value="glutes" />
              <Picker.Item label="Quads" value="quads" />
              <Picker.Item label="Arms" value="arms" />

            </Picker>
          )}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "center",
              marginBottom: RFValue(10, 816),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                justifyContent: "center",
              }}
            >
              {/*Platform.OS === "ios" ? (
                <DatePickerIOS
                  date={new Date(moment(currentStartWeek,"DD-MM-YYYY"))}
                  style={{width:"40%"}}
                  onDateChange={(date) =>
                    setCurrentStartWeek(moment(date).format("DD-MM-YYYY"))
                  }
                  timeZoneOffsetInMinutes={5 * 60 + 30}
                />
                ) : ( */}
              <DatePicker
                style={{ width: "40%", alignSelf: "flex-start" }}
                date={currentStartWeek}
                mode="date"
                placeholder="select date"
                format="DD-MM-YYYY"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                maxDate={new Date()}
                customStyles={{
                  dateIcon: {
                    position: "absolute",
                    height: 0,
                    width: 0,
                  },
                  dateInput: {
                    borderWidth: 0,
                  },
                  dateText: {
                    alignSelf: "center",
                  },
                }}
                onDateChange={(date) => {
                  setCurrentStartWeek(date);
                }}
              />

              <Text> - </Text>
              {/*Platform.OS === "ios" ? (
                <DatePickerIOS
                  date={new Date(moment(currentEndWeek,"DD-MM-YYYY"))}
                  style={{width:"40%"}}
                  onDateChange={(date) =>
                    setCurrentEndWeek(moment(date).format("DD-MM-YYYY"))
                  }
                  timeZoneOffsetInMinutes={5 * 60 + 30}
                />
                ) : ( */}
              <DatePicker
                style={{ width: "40%", alignSelf: "flex-start" }}
                date={currentEndWeek}
                mode="date"
                placeholder="select date"
                format="DD-MM-YYYY"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                maxDate={new Date()}
                minDate={currentStartWeek}
                customStyles={{
                  dateIcon: {
                    position: "absolute",
                    height: 0,
                    width: 0,
                  },
                  dateInput: {
                    borderWidth: 0,
                  },
                  dateText: {
                    alignSelf: "center",
                  },
                }}
                onDateChange={(date) => {
                  setCurrentEndWeek(date);
                }}
              />
            </View>
          </View>
          <LineChart
            bezier
            withHorizontalLabels={true}
            withVerticalLabels={true}
            data={
              (graph3Options === "all" && {
                //labels: [" 1", " 2", " 3", " 4", " 5", " 6"],
                datasets: [
                  {
                    data: graph3Data1,
                    strokeWidth: 2,
                    color: (opacity = 0) => `rgba(30,30,30,${opacity})`, // optional
                  },
                  {
                    data: graph3Data2,
                    strokeWidth: 2,
                    color: (opacity = 0) => `rgba(255, 230, 109, ${opacity})`, // optional
                  },
                  {
                    data: graph3Data3,
                    strokeWidth: 2,
                    color: (opacity = 0) => `rgba(164, 176, 190, ${opacity})`, // optional
                  },
                  {
                    data: graph3Data4,
                    strokeWidth: 2,
                    color: (opacity = 0) => `rgba(164, 176, 190, ${opacity})`, // optional
                  },
                  {
                    data: graph3Data5,
                    strokeWidth: 2,
                    color: (opacity = 0) => `rgba(164, 176, 190, ${opacity})`, // optional
                  },
                  {
                    data: graph3Data6,
                    strokeWidth: 2,
                    color: (opacity = 0) => `rgba(164, 176, 190, ${opacity})`, // optional
                  },
                  {
                    data: graph3Data7,
                    strokeWidth: 2,
                    color: (opacity = 0) => `rgba(164, 176, 190, ${opacity})`, // optional
                  },
                  {
                    data: graph3Data8,
                    strokeWidth: 2,
                    color: (opacity = 0) => `rgba(164, 176, 190, ${opacity})`, // optional
                  },
                  {
                    data: graph3Data9,
                    strokeWidth: 2,
                    color: (opacity = 0) => `rgba(164, 176, 190, ${opacity})`, // optional
                  },
                ],
                legend: ["Weight (kg)", "Fat (%)", "Muscle (%)", "Neck (inch)","Chest (inch)","Waist (inch)",
                "Glutes (inch)","Quads (inch)","Arms (inch)",],
              }) ||
              ((graph3Options === "weight" || graph3Options === "all") && {
                //labels: [" 1", " 2", " 3", " 4", " 5", " 6"],
                datasets: [
                  {
                    data: graph3Data1,
                    strokeWidth: 2,
                    color: (opacity = 1) => `rgba(30,30,30,${opacity})`, // optional
                  },
                ],
                legend: ["Weight (kg)"],
              })
              ||
              ((graph3Options === "neck" || graph3Options === "all") && {
                //labels: [" 1", " 2", " 3", " 4", " 5", " 6"],
                datasets: [
                  {
                    data: graph3Data4,
                    strokeWidth: 2,
                    color: (opacity = 1) => `rgba(30,30,30,${opacity})`, // optional
                  },
                ],
                legend: ["Neck (inch)"],
              })
              ||
              ((graph3Options === "chest" || graph3Options === "all") && {
                //labels: [" 1", " 2", " 3", " 4", " 5", " 6"],
                datasets: [
                  {
                    data: graph3Data5,
                    strokeWidth: 2,
                    color: (opacity = 1) => `rgba(30,30,30,${opacity})`, // optional
                  },
                ],
                legend: ["Chest (inch)"],
              })
              ||
              ((graph3Options === "waist" || graph3Options === "all") && {
                //labels: [" 1", " 2", " 3", " 4", " 5", " 6"],
                datasets: [
                  {
                    data: graph3Data6,
                    strokeWidth: 2,
                    color: (opacity = 1) => `rgba(30,30,30,${opacity})`, // optional
                  },
                ],
                legend: ["Wasit (inch)"],
              })
              ||
              ((graph3Options === "glutes" || graph3Options === "all") && {
                //labels: [" 1", " 2", " 3", " 4", " 5", " 6"],
                datasets: [
                  {
                    data: graph3Data7,
                    strokeWidth: 2,
                    color: (opacity = 1) => `rgba(30,30,30,${opacity})`, // optional
                  },
                ],
                legend: ["glutes (inch)"],
              })
              ||
              ((graph3Options === "quads" || graph3Options === "all") && {
                //labels: [" 1", " 2", " 3", " 4", " 5", " 6"],
                datasets: [
                  {
                    data: graph3Data8,
                    strokeWidth: 2,
                    color: (opacity = 1) => `rgba(30,30,30,${opacity})`, // optional
                  },
                ],
                legend: ["Quads (inch)"],
              })
              ||
              ((graph3Options === "arms" || graph3Options === "all") && {
                //labels: [" 1", " 2", " 3", " 4", " 5", " 6"],
                datasets: [
                  {
                    data: graph3Data9,
                    strokeWidth: 2,
                    color: (opacity = 1) => `rgba(30,30,30,${opacity})`, // optional
                  },
                ],
                legend: ["Arms (inch)"],
              })
              ||
              (graph3Options === "fat" && {
                //labels: [" 1", " 2", " 3", " 4", " 5", " 6"],
                datasets: [
                  {
                    data: graph3Data2,
                    strokeWidth: RFValue(5, 816),
                    color: (opacity = 1) => `rgba(255, 230, 109,${opacity})`, // optional
                  },
                ],
                legend: ["Fat (%)"],
              }) ||
              (graph3Options === "muscle" && {
                //labels: [" 1", " 2", " 3", " 4", " 5", " 6"],
                datasets: [
                  {
                    data: graph3Data3,
                    strokeWidth: 2,
                    color: (opacity = 1) => `rgba(164, 176, 190,${opacity})`, // optional
                  },
                ],
                legend: ["Muscle (%)"],
              })
            }
            width={ScreenWidth - 70}
            height={200}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#ffff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 2,
              color: (opacity = 0) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={{
              marginVertical: RFValue(8, 816),
              borderRadius: 16,
              marginLeft: -20,
            }}
            withInnerLines={false}
            withDots={false}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Reports;
