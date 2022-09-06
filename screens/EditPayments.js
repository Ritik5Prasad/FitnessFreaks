import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
  Dimensions,
  Platform,
  Alert,
  DatePickerIOS,
} from "react-native";
let ScreenHeight = Dimensions.get("window").height;

let ScreenWidth = Dimensions.get("window").width;
import { useDispatch, useSelector } from "react-redux";
import {
  selectUserData,
  selectUser,
  selectTemperoryId,
  selectUserType,
  setTemperoryData,
  selectTemperoryData,
} from "../features/userSlice";
import DatePicker from "react-native-datepicker";
import moment from "moment";
import { db } from "../firebase";
import firebase from "firebase";
import WorkoutCard from "./components/WorkoutCard";
import NutritionCard from "./components/NutritionCard";
import { Picker } from "@react-native-picker/picker";
import { TextInput as RNTextInput } from "react-native-paper";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Icon } from "react-native-elements";
import { deleteDoc } from "./functions/deleteDoc";
import { copyDoc } from "./functions/copyDoc";
import { moveDoc } from "./functions/moveDoc";
import RNPickerSelect from "react-native-picker-select";
import Notification from "./components/Notification";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button } from "react-native";

export default function EditPayments({ props, navigation }) {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const userType = useSelector(selectUserType);
  const temperoryId = useSelector(selectTemperoryId);
  const [phone, setphone] = useState("");
  const [email, setemail] = useState("");
  const [editable, seteditable] = useState(false);
  const [userData, setUserData] = useState(null);
  const userDataCoach = useSelector(selectUserData);
  const [requestDate, setRequestDate] = useState(formatDate());
  const [pending, setPending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [today, setToday] = useState([]);
  const temperoryData = useSelector(selectTemperoryData);

  const [reload, setreload] = useState(false);
  const [amount, setAmount] = useState(0);
  const [upcomingId, setUpcomingId] = useState([]);
  const [startDate, setStartDate] = useState(
    moment(new Date()).format("DD-MM-YYYY")
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).add(30, "days").format("DD-MM-YYYY")
  );
  const [isLoading, setisLoading] = useState(true);
  const [frequency, setFrequency] = useState("once in a week");

  useEffect(() => {
    if (userType == "coach") {
      if (temperoryData?.data?.payments) {
        setAmount(temperoryData?.data?.payments?.amount);
        setFrequency(temperoryData?.data?.payments?.frequency);
        //seteditable(true);
      }
    } else {
      console.log("td2", userDataCoach);
      setAmount(temperoryData?.data?.payments?.amount);
      setFrequency(temperoryData?.data?.payments?.frequency);
      seteditable(false);
    }
  }, [userData, temperoryData]);

  const ChangePayments = async () => {
    if (!amount) {
      Alert.alert("Fitness App", "Please enter the amount!");
    } else {
      setisLoading(true);

      db.collection("athletes")
        .doc(temperoryId)
        .update({
          payments: {
            amount: amount,
            frequency: frequency,
          },
        })
        .then(async (id) => {
          var days;
          var Difference_In_Time;
          var Difference_In_Days;

          if (frequency == "once in a week") {
            days = 7;
          } else if (frequency == "once in 2 weeks") {
            days = 14;
          } else if (frequency == "once in a month") {
            days = 30;
          } else {
            days = 90;
          }
          Difference_In_Time =
            moment(endDate, "DD-MM-YYYY").valueOf() -
            moment(startDate, "DD-MM-YYYY").valueOf();
          Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
          for (var i = days; i < Difference_In_Days; i = i + days) {
            var temp_date = new Date(moment(new Date()).add(i, "days"));
            temp_date = new Date(
              temp_date.getFullYear(),
              temp_date.getMonth(),
              temp_date.getDate(),
              17,
              0,

              0,
              0
            );
            const newCityRef = db.collection("payments").doc();

            // const res = await newCityRef.set({
            //   athleteName: athleteData.name,
            //   date: firebase.firestore.Timestamp.fromDate(new Date(temp_date)),
            //   athlete: data.athlete,
            //   coach: userData?.id,
            //   amt: amount,
            //   status: "not paid",
            // });
            //  console.log(userDataCoach, amount, temperoryId);
            const res1 = await newCityRef.set({
              athleteName: "athlete",
              date: firebase.firestore.Timestamp.fromDate(new Date(temp_date)),
              athlete: temperoryId,
              coach: userDataCoach?.id,
              amt: amount,
              status: "not paid",
            });

            // var docid = [];
            // const data = await db
            //   .collection("payments")
            //   .where("athlete", "==", temperoryId)
            //   .where("status", "!=", "paid")
            //   .get()
            //   .then((querySnapshot) => {
            //     console.log(1);
            //     querySnapshot.docs.forEach((data) => {
            //       console.log(data.id);
            //       docid.push(data.id);
            //     });
            //   });

            upcomingId?.map((id) => {
              let res = db
                .collection("payments")
                .doc(id)
                .delete()
                .then((snap) => {});
            });
            setreload(!reload);
            seteditable(false);
          }
        })
        .catch(function (error) {
          console.log("Error getting documents 1: ", error);
          alert("failed the change payments, please provide correct input");
        });
      alert("all the upcoming payments changed successfully");
    }
  };

  useEffect(() => {
    console.log(2, temperoryId);

    if (temperoryId) {
      db.collection("payments")
        .where("athlete", "==", temperoryId)
        .get()
        .then((snap) => {
          var payments_data = [];
          var completed = [];
          var upcoming = [];
          var pending = [];
          var today = [];
          var DocId = [];
          snap.docs.forEach((doc) => {
            let appObj = { ...doc.data(), ["id"]: doc.id };
            payments_data.push(appObj);
          });

          payments_data.sort((a, b) => {
            return (
              new Date(a.date.seconds * 1000) - new Date(b.date.seconds * 1000)
            );
          });
          payments_data.forEach((id) => {
            if (id.status == "paid") {
              completed.push({
                editable: false,
                amount: id.amt,
                date: id.date.seconds * 1000,
              });
            } else {
              if (
                moment(
                  moment(new Date()).format("DD-MM-YYYY"),
                  "DD-MM-YYYY"
                ).valueOf() <=
                  id.date.seconds * 1000 &&
                moment(
                  moment(new Date()).add(1, "days").format("DD-MM-YYYY"),
                  "DD-MM-YYYY"
                ).valueOf() >=
                  id.date.seconds * 1000
              ) {
                DocId.push(id.id);

                upcoming.push({
                  editable: true,
                  amount: id.amt,
                  date: id.date.seconds * 1000,
                  id: id.id,
                });
              } else if (
                id.date.seconds * 1000 <
                moment(new Date()).valueOf()
              ) {
                DocId.push(id.id);
                pending.push({
                  editable: true,
                  amount: id.amt,
                  id: id.id,
                  date: id.date.seconds * 1000,
                });
              } else {
                DocId.push(id.id);
                upcoming.push({
                  editable: true,
                  amount: id.amt,
                  id: id.id,
                  date: id.date.seconds * 1000,
                });
              }
            }
          });

          setPending(pending);
          setUpcoming(upcoming);

          setCompleted(completed);
          setToday(today);

          setUpcomingId(DocId);
          setisLoading(false);
        });
    }
  }, [userData?.id, reload]);

  function formatDate() {
    var d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  useEffect(() => {}, [user, temperoryId]);

  function formatSpecificDate(d) {
    var d = new Date(d),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  // useEffect(() => {
  //   if (userType === "coach") {
  //     db.collection("athletes")
  //       .doc(temperoryId)
  //       .get()
  //       .then(function (snap) {
  //         setUserData({
  //           id: temperoryId,
  //           data: snap.data(),
  //         });
  //         setphone(snap.data().phone);
  //         setemail(snap.data().email);
  //         setDiet(
  //           snap.data()?.diet ? snap.data().diet.name : "weight maintainance"
  //         );
  //         setCarbs(snap?.data()?.diet ? snap.data().diet.carbs : "300");
  //         setFat(snap.data()?.diet ? snap.data().diet.fat : "50");
  //         setProtein(snap.data()?.diet ? snap.data().diet.protein : "70");
  //         setCalories(snap?.data()?.diet ? snap.data().diet.calories : "1930");
  //         setWeight(snap?.data()?.weight ? snap.data().weight : "80");
  //         dispatch(
  //           setTemperoryData({
  //             id: temperoryId,
  //             data: snap.data(),
  //           })
  //         );
  //         ChangeDiet();
  //       })
  //       .catch(function (error) {
  //         console.log("Error getting documents: ", error);
  //       });
  //   } else {
  //     db.collection("athletes")
  //       .where("email", "==", user)
  //       .get()
  //       .then(function (querySnapshot) {
  //         querySnapshot.forEach(function (doc) {
  //           setUserData({
  //             id: doc.id,
  //             data: doc.data(),
  //           });
  //           setphone(doc.data().phone);
  //           setemail(doc.data().email);
  //           setDiet(
  //             doc.data()?.diet?.name
  //               ? doc.data().diet.name
  //               : "weight maintainance"
  //           );
  //           setCarbs(doc?.data()?.diet?.carbs ? doc.data().diet.carbs : "300");
  //           setFat(doc.data()?.diet?.fat ? doc.data().diet.fat : "60");
  //           setProtein(
  //             doc.data()?.diet?.protein ? doc.data().diet.protein : "100"
  //           );
  //           setCalories(
  //             doc?.data()?.diet?.calories ? doc.data().diet.calories : "2140"
  //           );
  //           setWeight(doc?.data()?.weight ? doc.data().weight : "80");
  //         });
  //       })
  //       .catch(function (error) {
  //         console.log("Error getting documents: ", error);
  //       });
  //   }
  // }, [user, temperoryId]);

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: "#F6F6F6" }}
      contentContainerStyle={{ padding: 0, backgroundColor: "#F6F6F6" }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          marginTop: 20,
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
              fontSize: RFValue(20, 816),
              fontFamily: "SF-Pro-Text-regular",
              width: "50%",
              marginLeft: RFValue(20, 816),
            }}
          >
            Payments
          </Text>
        </View>
        <Notification navigation={navigation} />
      </View>
      {console.log(userData)}
      {/* <Button
        onPress={() => {
          setreload(!reload);
        }}
        title="reload"
      /> */}

      <View
        style={{
          backgroundColor: "white",
          padding: RFValue(10, 816),
          borderRadius: RFValue(10, 816),
          marginTop: RFValue(20, 816),
          paddingBottom: RFValue(15, 816),
          marginHorizontal: 20,
        }}
      >
        <Text
          style={{
            fontSize: RFValue(18, 816),
            marginBottom: RFValue(10, 816),
            fontWeight: "bold",
            color: "black",
          }}
        >
          Payment
        </Text>
        <Text
          style={{
            fontSize: RFValue(18, 816),
            marginBottom: RFValue(10, 816),
            color: "black",
          }}
        >
          Amount
        </Text>
        <TextInput
          style={{
            backgroundColor: "white",
            paddingVertical: Platform.OS === "ios" ? 15 : RFValue(10, 816),
            borderRadius: 5,
            paddingLeft: RFValue(20, 816),
            borderWidth: 0.5,
            bordercolor: "white",
            padding: RFValue(10, 816),
            fontSize: RFValue(18, 816),
          }}
          value={amount}
          placeholder="Enter Amount"
          onChangeText={(text) => {
            setAmount(text);
          }}
          keyboardType={"numeric"}
          editable={editable}
        />

        <Text
          style={{
            fontSize: RFValue(18, 816),
            marginBottom: RFValue(10, 816),
            marginTop: RFValue(20, 816),
            color: "black",
          }}
        >
          Frequency of Payment
        </Text>
        <View>
          {Platform.OS === "ios" ? (
            <RNPickerSelect
              enabled={editable}
              value={frequency}
              style={{ paddingVertical: 5 }}
              onValueChange={(itemValue, itemIndex) => {
                setFrequency(itemValue);
              }}
              items={[
                { label: "Once in a week", value: "Once in a week" },
                { label: "Once in 2 weeks", value: "Once in 2 weeks" },
                { label: "Once in a month", value: "Once in a month" },
                { label: "Once in 3 month", value: "Once in 3 month" },
              ]}
            />
          ) : (
            <Picker
              enabled={editable}
              selectedValue={frequency}
              onValueChange={(itemValue, itemIndex) => {
                setFrequency(itemValue);
              }}
            >
              <Picker.Item label="Once in a week" value="once in a week" />
              <Picker.Item label="Once in 2 weeks" value="once in 2 weeks" />
              <Picker.Item label="Once in a month" value="once in a month" />
              <Picker.Item label="Once in 3 months" value="once in 3 months" />
            </Picker>
          )}
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <View style={{ width: "40%", alignItems: "center" }}>
          <Text
            style={{
              fontSize: RFValue(18, 816),
              marginTop: RFValue(10, 816),
              color: "black",
            }}
          >
            Start Date
          </Text>
          {/*Platform.OS === 'ios'?
               <DatePickerIOS
               date={new Date(moment(startDate,"DD-MM-YYYY"))}
               //style={{marginTop:-RFValue(80,816),marginBottom:-RFValue(80,816)}}
               onDateChange={(date) => {setStartDate(moment(date).format("DD-MM-YYYY"));}}
               timeZoneOffsetInMinutes={5*60 + 30}
             />
            : */}
          <DatePicker
            style={{
              width: "100%",
              marginTop: RFValue(10, 816),
              alignSelf: "flex-start",
              backgroundColor: "white",
              borderWidth: 0.5,
              bordercolor: "white",
              borderRadius: RFValue(5, 816),
            }}
            disabled={!editable}
            date={startDate}
            mode="date"
            placeholder="select date"
            format="DD-MM-YYYY"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            minDate={moment(new Date()).utc().format("DD-MM-YYYY")}
            customStyles={{
              dateIcon: {
                position: "absolute",
                height: 0,
                width: 0,
              },
              dateInput: {
                borderWidth: 0,
                borderRadius: RFValue(5, 816),
              },
              dateText: {
                alignSelf: "center",
                marginLeft: RFValue(10, 816),
              },
            }}
            onDateChange={(date) => {
              setStartDate(date);
            }}
          />
        </View>

        <View style={{ width: "40%", alignItems: "center" }}>
          <Text
            style={{
              fontSize: RFValue(18, 816),
              marginTop: RFValue(10, 816),
              color: "black",
            }}
          >
            End Date
          </Text>
          <DatePicker
            style={{
              width: "100%",
              marginTop: RFValue(10, 816),
              alignSelf: "flex-start",
              backgroundColor: "white",
              borderWidth: 0.5,
              bordercolor: "white",
              borderRadius: RFValue(5, 816),
            }}
            disabled={!editable}
            date={endDate}
            mode="date"
            placeholder="select date"
            format="DD-MM-YYYY"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            minDate={startDate}
            customStyles={{
              dateIcon: {
                position: "absolute",
                height: 0,
                width: 0,
              },
              dateInput: {
                borderWidth: 0,
                borderRadius: RFValue(5, 816),
              },
              dateText: {
                alignSelf: "center",
                marginLeft: RFValue(10, 816),
              },
            }}
            onDateChange={(date) => {
              setEndDate(date);
            }}
          />
        </View>
      </View>
      {userType == "coach" &&
        (editable ? (
          <TouchableOpacity
            onPress={() => ChangePayments()}
            style={{
              backgroundColor: "#C19F1E",
              padding: RFValue(10, 816),
              width: "90%",
              borderRadius: 25,
              alignSelf: "center",
              marginTop: 20,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                color: "black",
                textAlign: "center",
              }}
            >
              Save upcoming Payments
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => seteditable(true)}
            style={{
              backgroundColor: "#C19F1E",
              padding: RFValue(10, 816),
              width: "90%",
              borderRadius: 25,
              alignSelf: "center",
              marginTop: 20,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                color: "black",
                textAlign: "center",
              }}
            >
              Edit Payments
            </Text>
          </TouchableOpacity>
        ))}

      <Text
        style={{
          fontSize: RFValue(18, 816),
          marginBottom: RFValue(10, 816),
          fontWeight: "bold",
          color: "black",
          margin: 20,
        }}
      >
        completed Payments
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <View style={{ flex: 0.47, justifyContent: "center" }}>
          <Text style={{ textAlign: "center" }}>Amount</Text>
        </View>
        <View style={{ flex: 0.47 }}>
          <Text style={{ textAlign: "center" }}>Date</Text>
        </View>
      </View>

      {completed?.length > 0 ? (
        completed.map((payment) => (
          <View
            key={payment.id}
            style={{
              display: "flex",
              flexDirection: "row",
              margin: 20,
            }}
          >
            <View
              style={{
                flex: 0.47,
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
              }}
            >
              <TextInput
                editable={false}
                style={{
                  backgroundColor: "white",
                  borderRadius: RFValue(5, 816),
                  //paddingLeft: RFValue(20, 816),
                  borderWidth: userType == "athlete" && editable ? 1 : 0,
                  bordercolor: "white",
                  padding: RFValue(10, 816),
                  fontSize: RFValue(18, 816),
                  color: "black",
                  textAlign: "center",
                  paddingVertical: Platform.OS === "ios" ? 15 : 10,
                }}
                onChangeText={(text) => {
                  setphone(text);
                }}
                // value={phone}
                placeholder="Amount"
                value={payment.amount}
                //editable={userType == "athlete" ? editable : false}
              />
            </View>
            <View style={{ flex: 0.47, textAlign: "center" }}>
              <Text
                style={{
                  textAlign: "center",
                  padding: RFValue(10, 816),
                  color: "black",
                }}
              >
                {moment(payment.date).format("DD-MM-YYYY")}
              </Text>
            </View>
          </View>
        ))
      ) : (
        <Text
          style={{
            fontSize: RFValue(10, 816),
            marginBottom: RFValue(10, 816),
            fontWeight: "bold",
            color: "black",
            margin: 20,
            backgroundColor: "white",
            padding: RFValue(12, 816),
            textAlign: "center",
            borderRadius: RFValue(5, 816),
          }}
        >
          No Completed Payments
        </Text>
      )}
      <Text
        style={{
          fontSize: RFValue(18, 816),
          marginBottom: RFValue(10, 816),
          fontWeight: "bold",
          color: "black",
          margin: 20,
        }}
      >
        Pending Payments
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <View style={{ flex: 0.47, justifyContent: "center" }}>
          <Text style={{ textAlign: "center" }}>Amount</Text>
        </View>
        <View style={{ flex: 0.47 }}>
          <Text style={{ textAlign: "center" }}>Date</Text>
        </View>
      </View>

      {pending?.length > 0 ? (
        pending.map((payment) => (
          <View
            key={payment.id}
            style={{
              display: "flex",
              flexDirection: "row",
              margin: 20,
              position: "relative",
            }}
          >
            <View
              style={{
                flex: 0.47,
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
              }}
            >
              <TextInput
                editable={false}
                style={{
                  backgroundColor: "white",
                  borderRadius: RFValue(5, 816),
                  //paddingLeft: RFValue(20, 816),
                  borderWidth: userType == "athlete" && editable ? 1 : 0,
                  bordercolor: "white",
                  padding: RFValue(10, 816),
                  fontSize: RFValue(18, 816),
                  color: "black",
                  textAlign: "center",
                  paddingVertical: Platform.OS === "ios" ? 15 : 10,
                }}
                onChangeText={(text) => {
                  setphone(text);
                }}
                // value={phone}
                placeholder="Amount"
                value={payment.amount}
                //editable={userType == "athlete" ? editable : false}
              />
            </View>
            <View style={{ flex: 0.47, textAlign: "center" }}>
              <Text
                style={{
                  textAlign: "center",
                  padding: RFValue(10, 816),
                  color: "black",
                }}
              >
                {moment(payment.date).format("DD-MM-YYYY")}
              </Text>
            </View>
            {userType == "coach" && (
              <TouchableOpacity
                style={{
                  textAlign: "center",
                  position: "absolute",
                  right: 0,
                  marginTop: 10,
                }}
              >
                {/* <Text
                
                style={{
                  textAlign: "center",
                  padding: RFValue(10, 816),
                  color: "black",
                }}
              >
                DELETE
              </Text> */}
                <Icon
                  name="trash"
                  type="font-awesome-5"
                  size={24}
                  style={{ paddingLeft: 100 }}
                  onPress={() => {
                    console.log(1);
                    db.collection("payments")
                      .doc(payment.id)
                      .delete()
                      .then(() => {
                        setreload(!reload);
                        alert("deleted");
                      })
                      .catch(() => {
                        alert("failed to delete");
                        setreload(!reload);
                      });
                    // setreload(!reload)
                  }}
                />
              </TouchableOpacity>
            )}
          </View>
        ))
      ) : (
        <Text
          style={{
            fontSize: RFValue(10, 816),
            marginBottom: RFValue(10, 816),
            fontWeight: "bold",
            color: "black",
            margin: 20,
            backgroundColor: "white",
            padding: RFValue(12, 816),
            textAlign: "center",
            borderRadius: RFValue(5, 816),
          }}
        >
          No Pending Payments
        </Text>
      )}

      <Text
        style={{
          fontSize: RFValue(18, 816),
          marginBottom: RFValue(10, 816),
          fontWeight: "bold",
          color: "black",
          margin: 20,
        }}
      >
        Upcoming Payments
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <View style={{ flex: 0.47, justifyContent: "center" }}>
          <Text style={{ textAlign: "center" }}>Amount</Text>
        </View>
        <View style={{ flex: 0.47 }}>
          <Text style={{ textAlign: "center" }}>Date</Text>
        </View>
      </View>

      {upcoming?.length > 0 ? (
        upcoming.map((payment) => (
          <View
            key={payment.id}
            style={{
              display: "flex",
              flexDirection: "row",
              margin: 20,
            }}
          >
            <View
              style={{
                flex: 0.47,
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
              }}
            >
              <TextInput
                editable={false}
                style={{
                  backgroundColor: "white",
                  borderRadius: RFValue(5, 816),
                  //paddingLeft: RFValue(20, 816),
                  borderWidth: userType == "athlete" && editable ? 1 : 0,
                  bordercolor: "white",
                  padding: RFValue(10, 816),
                  fontSize: RFValue(18, 816),
                  color: "black",
                  textAlign: "center",
                  paddingVertical: Platform.OS === "ios" ? 15 : 10,
                }}
                onChangeText={(text) => {
                  setphone(text);
                }}
                // value={phone}
                placeholder="Amount"
                value={payment.amount}
                //editable={userType == "athlete" ? editable : false}
              />
            </View>
            <View style={{ flex: 0.47, textAlign: "center" }}>
              <Text
                style={{
                  textAlign: "center",
                  padding: RFValue(10, 816),
                  color: "black",
                }}
              >
                {moment(payment.date).format("DD-MM-YYYY")}
              </Text>
            </View>
          </View>
        ))
      ) : (
        <Text
          style={{
            fontSize: RFValue(10, 816),
            marginBottom: RFValue(10, 816),
            fontWeight: "bold",
            color: "black",
            margin: 20,
            backgroundColor: "white",
            padding: RFValue(12, 816),
            textAlign: "center",
            borderRadius: RFValue(5, 816),
          }}
        >
          No Upcoming Payments
        </Text>
      )}
    </KeyboardAwareScrollView>
  );
}
