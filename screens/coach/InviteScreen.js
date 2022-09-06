import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  TextInput,
  BackHandler,
  Button,
  Share,
  Dimensions,
  Alert,
  Platform,
  DatePickerIOS,
} from "react-native";
import { auth, db } from "../../firebase";
import * as firebase from "firebase";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";
import {
  setDbID,
  selectDbId,
  selectUser,
  setUserDetails,
  selectShowData,
  logout,
  setUserData,
  selectUserData,
} from "../../features/userSlice";
import { Picker } from "@react-native-picker/picker";
import DatePicker from "react-native-datepicker";
import moment from "moment";
import { TextInput as RNTextInput } from "react-native-paper";
import RNPickerSelect from "react-native-picker-select";
import Notification from "../components/Notification";
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
import { Icon } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import sendPushNotification from "../../utils/sendPushNotification";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 0,
    padding: RFValue(20, 816),
    minHeight: ScreenHeight,
  },
  athlete_card: {
    width: ScreenWidth / 1.05,
    height: RFValue(180, 816),
    backgroundColor: "#2E2E2E",
    // borderWidth: 1,
    // borderColor: "white",
    borderRadius: RFValue(12, 816),
    marginVertical: RFValue(15, 816),
    padding: RFValue(15, 816),
  },
  athlete_cardHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: RFValue(10, 816),
    marginVertical: RFValue(10, 816),
  },
  athlete_image: {
    marginHorizontal: RFValue(10, 816),
    width: ScreenWidth * 0.35,
    height: ScreenWidth * 0.35,
    borderRadius: 100,
    backgroundColor: "white",
    marginRight: RFValue(20, 816),
    marginTop: 0,
  },
  athlete_name: {
    fontSize: RFValue(18, 816),
    color: "black",
    margin: RFValue(15, 816),
    marginBottom: RFValue(5, 816),
  },
  athlete__cardBody: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: RFValue(20, 816),
  },
  share: {
    position: "absolute",
    top: RFValue(20, 816),
    right: RFValue(70, 816),
  },
});

function InviteScreen({ route, navigation }) {
  const user = useSelector(selectUser);
  const userData = useSelector(selectUserData);
  const dispatch = useDispatch();
  // const [amount, setAmount] = useState(null);
  // const [startDate, setStartDate] = useState(
  //   moment(new Date()).format("DD-MM-YYYY")
  // );
  // const [endDate, setEndDate] = useState(
  //   moment(new Date()).add(30, "days").format("DD-MM-YYYY")
  // );
  // const [frequency, setFrequency] = useState("once in a week");
  // const [followUpFrequency, setFollowUpFrequency] = useState("once in a week");
  const [diet, setDiet] = useState("");
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);
  const [protein, setProtein] = useState(0);
  const [calories, setCalories] = useState(0);
  const [weight, setWeight] = useState(0);
  const [athleteData, setAtheleteData] = useState(null);

  const [data, setdata] = useState(route.params?.data);

  useEffect(() => {
    if (data) {
      db.collection("athletes")
        .doc(data.athlete)
        .get()
        .then((snap) => {
          if (snap.data().diet) {
            setDiet(snap.data().diet.name);
            setCarbs(snap.data().diet.carbs);
            setFat(snap.data().diet.fat);
            setProtein(snap.data().diet.protein);
            setCalories(snap.data().diet.calories);
            setWeight(snap.data().weight);
            setAtheleteData(snap.data());
          }
        });
    }
  }, [data]);

  const decline = () => {
    Alert.alert(
      "Fitness App",
      "Confirm decline request",
      [
        {
          text: "yes",
          onPress: () => {
            db.collection("declinedInvites")
              .add(data)
              .then((id) => {
                db.collection("invites")
                  .doc(route.params.id)
                  .delete()
                  .catch(function (error) {
                    console.log("Error getting documents: ", error);
                  });
                db.collection("coaches")
                  .doc(data.coach)
                  .update({
                    pendingInvites: firebase.firestore.FieldValue.increment(-1),
                  });
                navigation.navigate("Athletes");
              })
              .catch(function (error) {
                console.log("Error getting documents: ", error);
              });
          },
        },
        {
          text: "no",
          onPress: () => {},
        },
      ],
      { cancelable: false }
    );
  };

  const ChangeDiet = (diet) => {
    if (weight && weight != 0) {
      if (diet == "Weight Maintainance") {
        setCalories(
          String(4 * 1.5 * weight + 4 * 3.5 * weight + 9 * 1 * weight)
        );
        setCarbs(String(3.5 * weight));
        setFat(String(1 * weight));
        setProtein(String(1.5 * weight));
      } else if (diet == "High Performance") {
        setCalories(
          String(4 * 1.5 * weight + 4 * 6 * weight + 0.8 * 9 * weight)
        );
        setCarbs(String(6 * weight));
        setFat(String(0.8 * weight));
        setProtein(String(1.5 * weight));
      } else if (diet == "Fat Loss") {
        setCalories(String(4 * 2 * weight + 4 * 3 * weight + 1 * 9 * weight));
        setCarbs(String(2 * weight));
        setFat(String(1 * weight));
        setProtein(String(2 * weight));
      }
    }
  };

  useEffect(() => {
    if (protein != 0 && carbs != 0 && fat != 0) {
      setCalories(
        String(4 * Number(protein) + 4 * Number(carbs) + 9 * Number(fat))
      );
    }
  }, [fat, protein, carbs]);

  const accept = async () => {
    db.collection("athletes")
      .doc(data.athlete)
      .update({
        listOfCoaches: [data.coach],

        verified: true,
        diet: {
          name: diet,
          carbs,
          protein,
          fat,
          calories,
        },
      })
      .then((id) => {
        db.collection("coaches")
          .doc(data.coach)
          .update({
            listOfAthletes: firebase.firestore.FieldValue.arrayUnion(
              data.athlete
            ),
          });

        var userIdList = [];
        userIdList.push(data.athlete);
        sendPushNotification(userIdList, {
          title: `Invite Accepted`,
          body: `Your request has been accepted!`,
        });

        db.collection("coaches")
          .doc(data.coach)
          .update({
            pendingInvites: firebase.firestore.FieldValue.increment(-1),
          })
          .then(async () => {
            navigation.navigate("Athletes");
            dispatch(
              setUserData({
                data: {
                  ...userData.data,
                  listOfAthletes: [
                    ...userData.data.listOfAthletes,
                    data.athlete,
                  ],
                },
                id: userData?.id,
              })
            );

            // var days;
            // if (followUpFrequency == "once in a week") {
            //   days = 7;
            // } else if (followUpFrequency == "once in 2 weeks") {
            //   days = 14;
            // } else if (followUpFrequency == "once in a month") {
            //   days = 30;
            // } else {
            //   days = 90;
            // }
            // var Difference_In_Time =
            //   moment(endDate, "DD-MM-YYYY").valueOf() -
            //   moment(startDate, "DD-MM-YYYY").valueOf();
            // var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
            // for (var i = days; i < Difference_In_Days; i = i + days) {
            // var temp_date = new Date(moment(new Date()).add(i, "days"));
            // temp_date = new Date(
            //   temp_date.getFullYear(),
            //   temp_date.getMonth(),
            //   temp_date.getDate(),
            //   17,
            //   0,
            //   0,
            //   0
            // );
            // const newCityRef = db.collection("events").doc();
            // const res = await newCityRef.set({
            //   name: "Follow up with " + data.name,
            //   date: firebase.firestore.Timestamp.fromDate(
            //     new Date(temp_date)
            //   ),
            //   description: "routine followup",
            //   athletes: [data.athlete],
            //   coachID: userData?.id,
            //   showVideoLink: true,
            //   videolink: userData?.data?.videoURL
            //     ? userData?.data?.videoURL
            //     : "",
            // });
            // }

            // if (frequency == "once in a week") {
            //   days = 7;
            // } else if (frequency == "once in 2 weeks") {
            //   days = 14;
            // } else if (frequency == "once in a month") {
            //   days = 30;
            // } else {
            //   days = 90;
            // }
            // Difference_In_Time =
            //   moment(endDate, "DD-MM-YYYY").valueOf() -
            //   moment(startDate, "DD-MM-YYYY").valueOf();
            // Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
            // for (var i = days; i < Difference_In_Days; i = i + days) {
            //   var temp_date = new Date(moment(new Date()).add(i, "days"));
            //   temp_date = new Date(
            //     temp_date.getFullYear(),
            //     temp_date.getMonth(),
            //     temp_date.getDate(),
            //     17,
            //     0,
            //     0,
            //     0
            //   );
            //   const newCityRef = db.collection("payments").doc();
            //   const res = await newCityRef.set({
            //     athleteName: athleteData.name,
            //     date: firebase.firestore.Timestamp.fromDate(
            //       new Date(temp_date)
            //     ),
            //     athlete: data.athlete,
            //     coach: userData?.id,
            //     amt: amount,
            //     status: "not paid",
            //   });
            // }
          })
          .catch(function (error) {
            console.log("Error getting documents: ", error);
          });

        db.collection("invites")
          .doc(route.params.id)
          .delete()
          .catch(function (error) {
            console.log("Error getting documents: ", error);
          });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  };

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: "#F6F6F6" }}
      contentContainerStyle={{
        padding: 0,
        backgroundColor: "#F6F6F6",
        paddingBottom: RFValue(40, 816),
      }}
    >
      <View
        style={{
          flexDirection: "row",
          padding: RFValue(20, 816),
          paddingBottom: 0,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="chevron-left"
            size={24}
            style={{ marginRight: RFValue(20, 816) }}
            type="font-awesome-5"
          />
        </TouchableOpacity>
        <Icon
          name="bars"
          type="font-awesome-5"
          size={24}
          onPress={() => navigation.toggleDrawer()}
        />
      </View>

      <View style={{ padding: RFValue(20, 816), alignItems: "center" }}>
        <Image
          source={{
            uri: data.imageUrl
              ? data.imageUrl
              : "https://firebasestorage.googleapis.com/v0/b/fitnessapp0.appspot.com/o/userImage.jpeg?alt=media&token=02e8cfe5-c866-4a4f-93ab-8c5930a5cd3c",
          }}
          style={{
            width: RFValue(120, 816),
            height: RFValue(120, 816),
            borderRadius: 100,
            alignSelf: "center",
          }}
        />
        <Text
          style={{
            fontSize: RFValue(32, 816),
            fontWeight: "bold",
            color: "black",
            marginTop: 10,
          }}
        >
          {data.name}
        </Text>
        <Text
          style={{
            fontSize: RFValue(18, 816),
            fontWeight: "bold",
            color: "black",
            marginTop: 5,
          }}
        >
          Athlete
        </Text>
        <Text
          style={{
            fontSize: RFValue(24, 816),
            fontWeight: "bold",
            color: "black",
            marginTop: 20,
          }}
        >
          Invite Request
        </Text>
        <View
          style={{
            flexDirection: "row",
            marginTop: RFValue(20, 816),
            justifyContent: "space-evenly",
            width: "100%",
          }}
        >
          <TouchableOpacity
            onPress={() => decline()}
            style={{
              backgroundColor: "#808080",
              borderRadius: RFValue(20, 816),
              padding: RFValue(10, 816),
              paddingHorizontal: 15,
            }}
          >
            <Text style={{ color: "black", fontWeight: "bold" }}>DECLINE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => accept()}
            style={{
              backgroundColor: "#C19F1E",
              borderRadius: RFValue(20, 816),
              padding: RFValue(10, 816),
              paddingHorizontal: 15,
            }}
          >
            <Text style={{ color: "black", fontWeight: "bold" }}>ACCEPT</Text>
          </TouchableOpacity>
        </View>
      </View>

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
            color: "black",
          }}
        >
          Mobile Number
        </Text>
        <TextInput
          style={{
            backgroundColor: "white",
            paddingVertical: Platform.OS === "ios" ? 15 : RFValue(10, 816),
            borderRadius: 5,
            paddingLeft: RFValue(20, 816),
            borderWidth: 1,
            bordercolor: "white",
            padding: RFValue(10, 816),
            fontSize: RFValue(18, 816),
          }}
          value={data.phone}
          placeholder="Phone Numer"
          editable={false}
        />
      </View>

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
            color: "black",
          }}
        >
          Email ID
        </Text>
        <TextInput
          style={{
            backgroundColor: "white",
            borderRadius: 5,
            paddingVertical: Platform.OS === "ios" ? 15 : RFValue(10, 816),
            paddingLeft: RFValue(20, 816),
            borderWidth: 1,
            bordercolor: "white",
            padding: RFValue(10, 816),
            fontSize: RFValue(18, 816),
          }}
          value={data.email}
          placeholder="Email ID"
          editable={false}
        />
      </View>

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
        <Text style={{ color: "black" }}>Diet Options</Text>

        <View
          style={{ flexDirection: "row", alignItems: "center", width: "100%" }}
        >
          {Platform.OS === "ios" ? (
            <RNPickerSelect
              value={diet}
              style={{ paddingVertical: 5 }}
              onValueChange={(itemValue, itemIndex) => {
                setDiet(itemValue);
                ChangeDiet(itemValue);
              }}
              items={[
                { label: "Weight Maintainance", value: "Weight Maintainance" },
                { label: "High Performance", value: "High Performance" },
                { label: "Fat Loss", value: "Fat Loss" },
              ]}
            />
          ) : (
            <Picker
              selectedValue={diet}
              style={{
                marginBottom: RFValue(20, 816),
                width: "100%",
              }}
              onValueChange={(itemValue, itemIndex) => {
                setDiet(itemValue);
                ChangeDiet(itemValue);
              }}
            >
              <Picker.Item
                label="Weight Maintainance"
                value="Weight Maintainance"
              />
              <Picker.Item label="High Performance" value="High Performance" />
              <Picker.Item label="Fat Loss" value="Fat Loss" />
            </Picker>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <RNTextInput
            style={{
              backgroundColor: "white",
              borderRadius: RFValue(8, 816),
              borderWidth: 0,
              fontSize: RFValue(18, 816),
              width: "45%",
            }}
            theme={{
              colors: {
                primary: "rgba(0,0,0,0.7)",
                underlineColor: "transparent",
              },
            }}
            label="Carbs"
            mode={"outlined"}
            value={String(carbs)}
            onChangeText={(text) => {
              setCarbs(text);
            }}
          />
          <RNTextInput
            style={{
              backgroundColor: "white",
              borderRadius: RFValue(8, 816),
              fontSize: RFValue(18, 816),
              width: "45%",
            }}
            theme={{
              colors: {
                primary: "rgba(0,0,0,0.7)",
                underlineColor: "transparent",
              },
            }}
            label="Protein"
            mode={"outlined"}
            value={String(protein)}
            onChangeText={(text) => {
              setProtein(text);
            }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
            marginTop: RFValue(10, 816),
            marginBottom: 15,
          }}
        >
          <RNTextInput
            style={{
              backgroundColor: "white",
              borderRadius: RFValue(8, 816),
              fontSize: RFValue(18, 816),
              width: "45%",
            }}
            theme={{
              colors: {
                primary: "rgba(0,0,0,0.7)",
                underlineColor: "transparent",
              },
            }}
            label="Fats"
            mode={"outlined"}
            value={String(fat)}
            onChangeText={(text) => {
              setFat(text);
            }}
          />
          <RNTextInput
            style={{
              backgroundColor: "white",
              borderRadius: RFValue(8, 816),
              fontSize: RFValue(18, 816),
              width: "45%",
            }}
            theme={{
              colors: {
                primary: "rgba(0,0,0,0)",
                underlineColor: "transparent",
                text: "#C7C7CD",
              },
            }}
            label="Calories"
            mode={"outlined"}
            value={String(calories)}
            editable={false}
          />
        </View>
      </View>

      {/* <View
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
        {Platform.OS === "ios" ? (
          <RNPickerSelect
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
      </View> */}

      {/* <View
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
            marginTop: RFValue(20, 816),
            color: "black",
          }}
        >
          Frequency of Followup
        </Text>
        {Platform.OS === "ios" ? (
          <RNPickerSelect
            style={{ paddingVertical: 5 }}
            value={followUpFrequency}
            onValueChange={(itemValue, itemIndex) => {
              setFollowUpFrequency(itemValue);
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
            selectedValue={followUpFrequency}
            onValueChange={(itemValue, itemIndex) => {
              setFollowUpFrequency(itemValue);
            }}
          >
            <Picker.Item label="Once in a week" value="once in a week" />
            <Picker.Item label="Once in 2 weeks" value="once in 2 weeks" />
            <Picker.Item label="Once in a month" value="once in a month" />
            <Picker.Item label="Once in 3 months" value="once in 3 months" />
          </Picker>
        )}

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
            {Platform.OS === 'ios'?
               <DatePickerIOS
               date={new Date(moment(startDate,"DD-MM-YYYY"))}
               //style={{marginTop:-RFValue(80,816),marginBottom:-RFValue(80,816)}}
               onDateChange={(date) => {setStartDate(moment(date).format("DD-MM-YYYY"));}}
               timeZoneOffsetInMinutes={5*60 + 30}
             />
            : 
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
      </View> */}
    </KeyboardAwareScrollView>
  );
}

export default InviteScreen;
