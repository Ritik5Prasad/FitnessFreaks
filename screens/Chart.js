import React, { useState, useEffect } from "react";
import {
  Linking,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Dimensions,
  Image,
  Switch,
  TouchableOpacity,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import RNPickerSelect from "react-native-picker-select";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import { db } from "../firebase";

import Axios from "axios";
import { Picker } from "@react-native-picker/picker";
// import {
//     LineChart,
//     BarChart,
//     PieChart,
//     ProgressChart,
//     ContributionGraph,
//     StackedBarChart
//   } from "react-native-chart-kit";
import { Grid, LineChart, XAxis, YAxis } from "react-native-svg-charts";

let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;

import { LinearGradient } from "expo-linear-gradient";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    marginBottom: 0,
    paddingTop: RFValue(20, 816),
    paddingBottom: 150,
  },
});

function Chart({ navigation, athId, workout, type }) {
  //so i am recieving the athelete id from previous screen
  //but for testing chart i am using harsha's athelete id only
  //you have to replace athelete id value to athId

  useEffect(() => {
    getAxx();
  }, [""]);

  //get the latest access token for this ath id
  const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80];
  const [infoArr, setInfoArr] = useState([]);
  const [lang, setLang] = useState("");
  const [accT, setAccT] = useState("");
  const [max, setMax] = useState(5);
  const [showPick, setShowPick] = useState(false);
  const [actId, setActId] = useState("");
  const [selectedIndex, setIndex] = useState(0);
  const [velo, setVelo] = useState([0, 0, 0, 0, 0]);
  const [time, setTime] = useState([0, 0, 0, 0, 0]);
  const [dist, setDist] = useState([0, 0, 0, 0, 0]);
  const axesSvg = { fontSize: RFValue(10, 816), fill: "grey" };
  const [timeVal, setTimeVal] = useState("");
  const [distVal, setDistVal] = useState("");
  const [bordCol, setBordCol] = useState("white");
  const [customM, setCustomM] = useState("");
  const verticalContentInset = {
    top: RFValue(10, 816),
    bottom: RFValue(10, 816),
  };
  const xAxisHeight = 30;

  const [compliance, setCompliance] = useState("");
  const [completion, setCompletion] = useState(false);

  const [workoutType, setWorkoutType] = useState("Run");
  const [total_param2, setTotalParam2] = useState(null);
  const [showFullList, setShowFullList] = useState(false);
  const [filteredWorkouts, setFilteredWorkouts] = useState(null);
  const toggleSwitch = () => setShowFullList((previousState) => !previousState);

  console.log({ completion, type });

  useEffect(() => {
    db.collection("workouts")
      .doc(workout.id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data().completion);
          if (doc.data().completion) {
            setCompletion(true);
            setTime(doc.data().time);
            setDist(doc.data().dist);
            setVelo(doc.data().velo);
            setCompliance(doc.data().compliance);
            setBordCol(doc.data().bordCol);
          }
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }, [workout]);

  const getAxx = async () => {
    await Axios.post("https://rongoeirnet.herokuapp.com/fetchStrava", {
      //here you have to use this
      //athId:{athId}
      athId: athId,
    }).then(function (res) {
      console.log(res.data);
      setAccT(res.data.access_token);
    });
  };

  useEffect(() => {
    if (workout.data.workout.param2Type === "Time") {
      setTimeVal(String(parseInt(workout.data.total_param2) / 60));
    } else {
      setDistVal(String(parseInt(workout.data.total_param2) / 60));
    }
  }, [workout]);

  useEffect(() => {
    if (workoutType === "Run") {
      let item = infoArr.filter((it) => it.workoutType === "Run");

      if (showFullList) {
        var arr = item;
      } else {
        var arr = item.slice(0, 5);
      }
    } else if (workoutType === "Ride") {
      let item = infoArr.filter((it) => it.workoutType === "Ride");

      if (showFullList) {
        var arr = item;
      } else {
        var arr = item.slice(0, 5);
      }
    } else if (workoutType === "Swim") {
      let item = infoArr.filter((it) => it.workoutType === "Swim");
      if (showFullList) {
        var arr = item;
      } else {
        var arr = item.slice(0, 5);
      }
    }
    setFilteredWorkouts(arr);
  }, [infoArr, workoutType, showFullList]);

  // console.log(filteredWorkouts);
  console.log(
    `Length of filtered workouts object is ${filteredWorkouts?.length}`
  );

  useEffect(() => {
    if (workout.data.workout.workoutType === "Run") {
      setWorkoutType("Run");
    } else if (workout.data.workout.workoutType === "Swim") {
      setWorkoutType("Swim");
    } else if (workout.data.workout.workoutType === "Bike") {
      setWorkoutType("Ride");
    }
    console.log(workout.data.workout.workoutType);
  }, [workout]);

  // console.log({ timeVal, distVal, infoArr });

  const getActi = async () => {
    console.log("AA");
    await Axios({
      method: "GET",
      url: "https://www.strava.com/api/v3/athlete/activities",
      headers: {
        Authorization: `Bearer ${accT}`,
      },
    }).then(function (res) {
      console.log(res.data.length);
      var maxim = res.data.length;
      for (var i = 0; i < res.data.length; i++) {
        console.log("vvb");
        var data = {
          workoutName: res.data[i].name,
          workoutId: res.data[i].id,
          workoutTime: res.data[i].start_date_local,
          workoutAverageSpeed: res.data[i].average_speed,
          workoutType: res.data[i].type,
        };

        setInfoArr((prev) => {
          return [...prev, data];
        });

        setActId(res.data[0].id);

        if (i === maxim - 1) {
          console.log("GG");
          setShowPick(true);
        }

        // if (i < 5) {
        //   setInfoArr((prev) => {
        //     return [...prev, data];
        //   });

        //   setActId(res.data[0].id);

        //   if (i === res.data.length - 1) {
        //     setShowPick(true);
        //     console.log("vvvv");
        //   }
        // }
      }
    });
    //  .catch(err=>console.log(err))
  };

  // useEffect(() => {
  //   console.log("infoArr : ", infoArr);
  // }, [infoArr]);

  const getChart = async (xy) => {
    console.log(xy);
    await Axios({
      method: "GET",
      url: `https://www.strava.com/api/v3/activities/${xy}/streams?keys=time,distance,velocity_smooth,heartrate&key_by_type=true`,
      headers: {
        Authorization: `Bearer ${accT}`,
      },
    })
      .then(function (res) {
        console.log("done");
        // console.log(res.data.velocity_smooth);
        setTime(res.data.time.data);
        setVelo(res.data.velocity_smooth.data);
        setDist(res.data.distance.data);
        // for(var i=0;i<10;i++){
        //     // setTime((prev)=>{
        //     //     return [...prev,res.data.time.data[i]]
        //     // });
        //     // setVelo((prev)=>{
        //     //     return [...prev,res.data.velocity_smooth.data[i]]
        //     // })
        //     console.log(res.data.time.data[i]);
        //     console.log("!!!----!!!");
        //     console.log(res.data.velocity_smooth.data[i]);
        // }
      })
      .then(
        // console.log(`Time is : ${time.slice(time.length - 6, time.length - 1)}`);
        console.log(
          `Distance is : ${dist.slice(dist.length - 6, dist.length - 1)}`
        )
      );
  };

  function timeComp() {
    // console.log(time.slice(0,10));
    // timeVal=5 minutes
    // we have to check last value of time array
    // x=last val
    // if x is greater or equal to 85% of timeval
    var hisTimeInsec = time[time.length - 1];
    var askedTimeInsec = timeVal * 60;

    if (hisTimeInsec >= 0.85 * askedTimeInsec) {
      setCustomM("Fully done");
      setBordCol("green");
    } else if (hisTimeInsec >= 0.5 * askedTimeInsec) {
      setCustomM("Partially done");
      setBordCol("orange");
    } else {
      setCustomM("Not done");
      setBordCol("red");
    }
    return hisTimeInsec;
  }

  function distanceComp() {
    // console.log(time.slice(0,10));
    // timeVal=5 minutes
    // we have to check last value of time array
    // x=last val
    // if x is greater or equal to 85% of timeval
    // console.log(timeVal*60);
    var hisDist = dist[dist.length - 1];
    var askedDist = distVal;

    if (hisDist >= 0.85 * askedDist) {
      setCustomM("Fully compliant");
      setBordCol("green");
    } else if (hisDist >= 0.5 * askedDist) {
      setCustomM("Partially compliant");
      setBordCol("orange");
    } else {
      setCustomM("Non compliant");
      setBordCol("red");
    }
    return String(hisDist);
  }

  // function filterit(){
  //   for(var i-0;)
  // }
  // workout.data.workout.param2Type
  const check_time = () => {
    let time_from_strava = time[time.length - 1];
    let time_from_workout = workout.data.total_param2;
    if (time_from_strava >= 0.85 * time_from_workout) {
      setCompliance("Fully compliant");
      setBordCol("green");
    } else if (time_from_strava >= 0.5 * time_from_workout) {
      setCompliance("Partially compliant");
      setBordCol("orange");
    } else {
      setCompliance("Not compliant");
      setBordCol("red");
    }
  };

  const check_dist = () => {
    let dist_from_strava = dist[dist.length - 1];
    let dist_from_workout = workout.data.total_param2;
    if (dist_from_strava >= 0.85 * dist_from_workout) {
      setCompliance("Fully compliant");
      setBordCol("green");
    } else if (dist_from_strava >= 0.5 * dist_from_workout) {
      setCompliance("Partially compliant");
      setBordCol("orange");
    } else {
      setCompliance("Not compliant");
      setBordCol("red");
    }
  };

  const check_param2 = () => {
    let total_workout_param2 = workout.data.total_param2;
    if (total_param2 >= 0.85 * total_workout_param2) {
      console.log("Fully done");
      setCompliance("Fully compliant");
      setBordCol("green");
    } else if (total_param2 >= 0.5 * total_workout_param2) {
      console.log("Partially done");
      setCompliance("Partially compliant");
      setBordCol("orange");
    } else {
      console.log("Not done");
      setCompliance("Not compliant");
      setBordCol("red");
    }
    setCompletion(true);
  };

  console.log(workout.data.workout);
  console.log(`Param 2 Value is : ${workout.data.total_param2}`);
  return (
    <View style={styles.container}>
      {completion === false && type !== "coach" ? (
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <Text style={{ color: "white" }}>
            This is passed from previous screen {athId}
          </Text>
          <Text>Athelete id = 63450337 (Harsha's)</Text>

          <TouchableOpacity
            activeOpacity={0.6}
            backgroundColor="steelblue"
            style={{
              width: "90%",
              backgroundColor: "steelblue",
              height: 55,
              marginBottom: 70,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: RFValue(8, 816),
              shadowColor: "#3895CE",
              marginHorizontal: RFValue(20, 816),
            }}
            onPress={getActi}
          >
            <LinearGradient
              colors={["#3895CE", "#004872"]}
              start={[0, 0]}
              end={[1, 0]}
              style={{
                width: "100%",
                height: "100%",
                paddingTop: RFValue(10, 816),
                borderRadius: RFValue(8, 816),
              }}
              onPress={getActi}
            >
              <View>
                <Text
                  style={{
                    color: "#E2E2E2",
                    fontSize: RFValue(20, 816),
                    fontFamily: "SF-Pro-Display-regular",
                    textAlign: "center",
                  }}
                >
                  Get your Strava Stream Data
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {showPick ? (
            <View>
              <Text style={{ color: "white" }}>
                {" "}
                Expected {workout.data.workout.param2Type}:{" "}
                {workout.data.total_param2}
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {Platform.OS === "ios" ? (
                  <RNPickerSelect
                    value={lang}
                    onValueChange={(itemValue, itemIndex) => {
                      if (itemValue !== "") {
                        setLang(itemValue);
                        setIndex(itemIndex);
                        setActId(filteredWorkouts[itemIndex - 1].workoutId);
                        getChart(filteredWorkouts[itemIndex - 1].workoutId);
                        setCompliance("Not applicable");
                        setBordCol("white");
                      }
                    }}
                    items={[
                      { label: "Please Select Workout", value: "" },
                      filteredWorkouts?.map((val, index) => {
                        return {
                          label: val.workoutName,
                          value: val.workoutName,
                        };
                      }),
                    ]}
                  />
                ) : (
                  <Picker
                    selectedValue={lang}
                    style={{
                      width: ScreenWidth * 0.6,
                      height: 50,
                      marginBottom: RFValue(20, 816),
                      color: "black",
                      backgroundColor: "#2E2E2E",
                    }}
                    onValueChange={(itemValue, itemIndex) => {
                      if (itemValue !== "") {
                        setLang(itemValue);
                        setIndex(itemIndex);
                        setActId(filteredWorkouts[itemIndex - 1].workoutId);
                        getChart(filteredWorkouts[itemIndex - 1].workoutId);
                        setCompliance("Not applicable");
                        setBordCol("white");
                      }
                    }}
                  >
                    <Picker.Item label="Please Select Workout" value="" />
                    {filteredWorkouts?.map((val, index) => {
                      return (
                        <Picker.Item
                          key={index}
                          label={val.workoutName}
                          value={val.workoutName}
                        />
                      );
                    })}
                  </Picker>
                )}
                <Text style={{ color: "black", margin: 5 }}>Show All</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={showFullList ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={showFullList}
                />
              </View>
              <Text style={{ textAlign: "center", color: "white" }}>
                {infoArr[selectedIndex].workoutTime}
              </Text>
            </View>
          ) : null}

          {showPick ? (
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {workout.data.workout.param2Type === "Time" ? (
                <View
                  style={{
                    width: 200,
                    marginBottom: 80,
                  }}
                >
                  <TextInput
                    style={{
                      height: 40,
                      borderColor: "white",
                      borderRadius: RFValue(8, 816),
                      borderWidth: 1,
                      paddingLeft: RFValue(20, 816),
                      color: "black",
                      backgroundColor: "black",
                      marginBottom: RFValue(10, 816),
                      paddingVertical:
                        Platform.OS === "ios" ? RFValue(15, 816) : 0,
                    }}
                    placeholder="Time in minutes"
                    ////placeholdertextColor="white"
                    keyboardType="number-pad"
                    value={String(time[time.length - 1])}
                    onChangeText={(text) => setTimeVal(text)}
                  />

                  <Button title="Confirm Time" onPress={check_time} />
                </View>
              ) : (
                <View
                  style={{
                    width: 200,
                    marginBottom: 80,
                  }}
                >
                  <TextInput
                    style={{
                      height: 40,
                      borderColor: "white",
                      borderWidth: 1,
                      paddingLeft: RFValue(20, 816),
                      color: "black",
                      backgroundColor: "black",
                      marginBottom: RFValue(10, 816),
                      borderRadius: RFValue(8, 816),
                      paddingVertical:
                        Platform.OS === "ios" ? RFValue(15, 816) : 0,
                    }}
                    placeholder="Distance in meteres"
                    ////placeholdertextColor="white"
                    keyboardType="number-pad"
                    value={dist ? String(dist[dist.length - 1]) : null}
                    onChangeText={(text) => setDistVal(text)}
                  />

                  <Button title="Confirm Distance" onPress={check_dist} />
                </View>
              )}
              <View
                style={{
                  height: 200,
                  padding: RFValue(20, 816),
                  flexDirection: "row",
                  width: "100%",
                  borderColor: bordCol,
                  borderWidth: RFValue(5, 816),
                  marginBottom: RFValue(20, 816),
                }}
              >
                <YAxis
                  data={dist}
                  style={{ marginBottom: xAxisHeight }}
                  contentInset={verticalContentInset}
                  svg={axesSvg}
                />
                <View style={{ flex: 1, marginLeft: RFValue(10, 816) }}>
                  <LineChart
                    style={{ flex: 1 }}
                    data={dist}
                    contentInset={verticalContentInset}
                    svg={{ stroke: "rgb(134, 65, 244)" }}
                  >
                    <Grid />
                  </LineChart>
                  {/* <XAxis
                        style={{ marginHorizontal: -10, height: xAxisHeight }}
                        data={data}
                        formatLabel={(value, index) => index}
                        contentInset={{ left:RFValue(10, 816), right: RFValue(10, 816)}}
                        svg={axesSvg}
                    /> */}
                </View>
              </View>

              <View
                style={{
                  height: 200,
                  padding: RFValue(20, 816),
                  flexDirection: "row",
                  width: "100%",
                  borderColor: bordCol,
                  borderWidth: RFValue(5, 816),
                  marginBottom: RFValue(20, 816),
                }}
              >
                <YAxis
                  data={velo}
                  style={{ marginBottom: xAxisHeight }}
                  contentInset={verticalContentInset}
                  svg={axesSvg}
                />
                <View style={{ flex: 1, marginLeft: RFValue(10, 816) }}>
                  <LineChart
                    style={{ flex: 1 }}
                    data={velo}
                    contentInset={verticalContentInset}
                    svg={{ stroke: "rgb(134, 65, 244)" }}
                  >
                    <Grid />
                  </LineChart>
                  <Text style={{ color: "white" }}>
                    Distance is : {dist[dist.length - 1]}
                    {"\n"}
                    Time is : {time[time.length - 1]}
                  </Text>
                  {/* <XAxis
                        style={{ marginHorizontal: -10, height: xAxisHeight }}
                        data={data}
                        formatLabel={(value, index) => index}
                        contentInset={{ left:RFValue(10, 816), right: RFValue(10, 816)}}
                        svg={axesSvg}
                    /> */}
                </View>
              </View>

              <Text style={{ color: "white" }}>
                Total distance from Strava data : {dist[dist.length - 1]}
              </Text>
              <Text style={{ color: "white" }}>
                Total time from Strava data : {time[time.length - 1]}
              </Text>
              <Text style={{ color: "white" }}>
                Compliance Status : {compliance}
              </Text>

              <TouchableOpacity
                activeOpacity={0.6}
                backgroundColor="steelblue"
                style={{
                  width: "90%",
                  backgroundColor: "steelblue",
                  height: 55,
                  marginBottom: 70,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: RFValue(8, 816),
                  shadowColor: "#3895CE",
                  marginHorizontal: RFValue(20, 816),
                  marginTop: RFValue(20, 816),
                }}
                onPress={() => {
                  setCompletion(true);
                  // Push Strava data to DB
                  db.collection("workouts")
                    .doc(workout.id)
                    .update({
                      total_distance: dist[dist.length - 1],
                      total_time: time[time.length - 1],
                      compliance,
                      completion: true,
                      bordCol,
                      dist,
                      time,
                      velo,
                    });
                }}
              >
                <LinearGradient
                  colors={["#3895CE", "#004872"]}
                  start={[0, 0]}
                  end={[1, 0]}
                  style={{
                    width: "100%",
                    height: "100%",
                    paddingTop: RFValue(10, 816),
                    borderRadius: RFValue(8, 816),
                  }}
                >
                  <View>
                    <Text
                      style={{
                        color: "#E2E2E2",
                        fontSize: RFValue(20, 816),
                        fontFamily: "SF-Pro-Display-regular",
                        textAlign: "center",
                      }}
                    >
                      End workout with Strava data
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : null}

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "black", width: 100 }}>
              Total {workout.data.workout.param2Type}
            </Text>
            <TextInput
              style={{
                borderColor: "white",
                borderWidth: 1,
                width: ScreenWidth * 0.5,
                color: "black",
                paddingHorizontal: RFValue(10, 816),
                marginLeft: RFValue(10, 816),
                paddingVertical: Platform.OS === "ios" ? 15 : 0,
              }}
              keyboardType={"decimal-pad"}
              value={total_param2}
              onChangeText={setTotalParam2}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.6}
            backgroundColor="steelblue"
            style={{
              width: "90%",
              backgroundColor: "steelblue",
              height: 55,
              marginBottom: 70,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: RFValue(8, 816),
              shadowColor: "#3895CE",
              marginHorizontal: RFValue(20, 816),
              marginTop: RFValue(20, 816),
            }}
            onPress={() => {
              check_param2();
              db.collection("workouts").doc(workout.id).update({
                total_param2: total_param2,
                compliance,
                completion: true,
                bordCol,
              });
            }}
          >
            <LinearGradient
              colors={["#3895CE", "#004872"]}
              start={[0, 0]}
              end={[1, 0]}
              style={{
                width: "100%",
                height: "100%",
                paddingTop: RFValue(10, 816),
                borderRadius: RFValue(8, 816),
              }}
            >
              <View>
                <Text
                  style={{
                    color: "#E2E2E2",
                    fontSize: RFValue(20, 816),
                    fontFamily: "SF-Pro-Display-regular",
                    textAlign: "center",
                  }}
                >
                  Manually End Workout
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* <TouchableOpacity
            activeOpacity={0.6}
            backgroundColor="steelblue"
            style={{
              width: "90%",
              backgroundColor: "steelblue",
              height: 55,
              marginBottom: 70,
              justifyContent: "center",
              alignItems: "center",
              borderRadius:RFValue(8, 816),
              shadowColor: "#3895CE",
              marginHorizontal:RFValue(20, 816),
              position: "absolute",
              bottom:RFValue(20, 816),
            }}
            onPress={() => {
              console.log("Clicked!");
            }}
          >
            <LinearGradient
              colors={["#3895CE", "#004872"]}
              start={[0, 0]}
              end={[1, 0]}
              style={{
                width: "100%",
                height: "100%",
                paddingTop:RFValue(10, 816),
                borderRadius:RFValue(8, 816),
              }}
              onPress={() => {
                console.log("Clicked!");
              }}
            >
              <View>
                <Text
                  style={{
                    color: "#E2E2E2",
                    fontSize:RFValue(20, 816),
                    fontFamily: "SF-Pro-Display-regular",
                    textAlign: "center",
                  }}
                >
                  Complete Workout With Strava
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity> */}
        </KeyboardAwareScrollView>
      ) : (
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <Text style={{ color: "white" }}>
            Total distance from Strava data : {dist[dist.length - 1]}
          </Text>
          <Text style={{ color: "white" }}>
            Total time from Strava data : {time[time.length - 1]}
          </Text>
          <Text style={{ color: "white" }}>
            Compliance Status : {compliance}
          </Text>

          <View
            style={{
              height: 200,
              padding: RFValue(20, 816),
              flexDirection: "row",
              width: "100%",
              borderColor: bordCol,
              borderWidth: RFValue(5, 816),
              marginBottom: RFValue(20, 816),
            }}
          >
            <YAxis
              data={dist}
              style={{ marginBottom: xAxisHeight }}
              contentInset={verticalContentInset}
              svg={axesSvg}
            />
            <View style={{ flex: 1, marginLeft: RFValue(10, 816) }}>
              <LineChart
                style={{ flex: 1 }}
                data={dist}
                contentInset={verticalContentInset}
                svg={{ stroke: "rgb(134, 65, 244)" }}
              >
                <Grid />
              </LineChart>
              {/* <XAxis
                        style={{ marginHorizontal: -10, height: xAxisHeight }}
                        data={data}
                        formatLabel={(value, index) => index}
                        contentInset={{ left:RFValue(10, 816), right: RFValue(10, 816)}}
                        svg={axesSvg}
                    /> */}
            </View>
          </View>

          <View
            style={{
              height: 200,
              padding: RFValue(20, 816),
              flexDirection: "row",
              width: "100%",
              borderColor: bordCol,
              borderWidth: RFValue(5, 816),
              marginBottom: RFValue(20, 816),
            }}
          >
            <YAxis
              data={velo}
              style={{ marginBottom: xAxisHeight }}
              contentInset={verticalContentInset}
              svg={axesSvg}
            />
            <View style={{ flex: 1, marginLeft: RFValue(10, 816) }}>
              <LineChart
                style={{ flex: 1 }}
                data={velo}
                contentInset={verticalContentInset}
                svg={{ stroke: "rgb(134, 65, 244)" }}
              >
                <Grid />
              </LineChart>
              <Text style={{ color: "white" }}>
                Distance is : {dist[dist.length - 1]}
                {"\n"}
                Time is : {time[time.length - 1]}
              </Text>
              {/* <XAxis
                        style={{ marginHorizontal: -10, height: xAxisHeight }}
                        data={data}
                        formatLabel={(value, index) => index}
                        contentInset={{ left:RFValue(10, 816), right: RFValue(10, 816)}}
                        svg={axesSvg}
                    /> */}
            </View>
          </View>
        </KeyboardAwareScrollView>
      )}
    </View>
  );
}

export default Chart;
