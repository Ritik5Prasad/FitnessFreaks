import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  TextInput,
  Button,
  Share,
  TouchableHighlight,
} from "react-native";
import { Icon } from "react-native-elements";
import Notification from "../components/Notification";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import RNPickerSelect from "react-native-picker-select";
import { Picker } from "@react-native-picker/picker";
import DatePicker from "react-native-datepicker";
import moment from "moment";

import { auth, db } from "../../utils/firebase";
import * as firebase from "firebase";

import { useSelector } from "react-redux";
import { selectUserData } from "../../features/userSlice";

function EditPaymentDetailsScreen({ route, navigation }) {
  const userData = useSelector(selectUserData);

  const [athleteUser, setAthleteUser] = useState({});
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState(
    moment(new Date()).format("DD-MM-YYYY")
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).add(30, "days").format("DD-MM-YYYY")
  );
  const [frequency, setFrequency] = useState("Once in a week");
  const [followUpFrequency, setFollowUpFrequency] = useState("Once in a week");

  useEffect(() => {
    const user = route.params.athlete;
    console.log("EditPaymentDetailsScreen->", user);

    setAthleteUser(user);
    getPaymentDetails(user);
  }, []);

  const getPaymentDetails = (user) => {
    setAmount(user.data.payments.amount);
    setStartDate(user.data.startDate);
    setEndDate(user.data.endDate);
    setFrequency(user.data.payments.frequency);
    setFollowUpFrequency(user.data.followUpFrequency);
  };

  const updatePayment = async () => {
    db.collection("athletes")
      .doc(athleteUser.id)
      .update({
        payments: {
          amount: amount,
          frequency: frequency,
        },
        startDate,
        endDate,
        followUpFrequency,
      })
      .then(async () => {
        // console.log("AthleteUpdated->", id);

        var days;
        // console.log("frequency->", frequency);
        if (frequency == "Once in a week") {
          days = 7;
        } else if (frequency == "Once in 2 weeks") {
          days = 14;
        } else if (frequency == "Once in a month") {
          days = 30;
        } else {
          days = 90;
        }
        var Difference_In_Time =
          moment(endDate, "DD-MM-YYYY").valueOf() -
          moment(startDate, "DD-MM-YYYY").valueOf();
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
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

          // console.log("temp_date------>", temp_date);
          const newCityRef = db.collection("payments").doc();
          const res = await newCityRef.set({
            athleteName: athleteUser.data.name,
            date: firebase.firestore.Timestamp.fromDate(new Date(temp_date)),
            athlete: athleteUser.id,
            coach: userData?.id,
            amt: amount,
            status: "not paid",
          });

          navigation.goBack();
        }
      });
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            style={{ margin: 20 }}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-left" type="font-awesome-5" />
          </TouchableOpacity>

          <Text style={{ fontSize: 20 }}>Edit Payment</Text>
        </View>

        <Notification navigation={navigation} />
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
          Amount
        </Text>
        <TextInput
          style={{
            alignItems: "center",
            backgroundColor: "#fff",
            borderWidth: 0.4,
            borderRadius: RFValue(5, 816),
            padding: 10,
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
          <View
            style={{
              alignItems: "center",
              backgroundColor: "#fff",
              borderWidth: 0.4,
              borderRadius: RFValue(5, 816),
              padding: 10,
            }}
          >
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
          </View>
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
      </View>

      <View
        style={{
          backgroundColor: "white",
          padding: RFValue(10, 816),
          borderRadius: RFValue(10, 816),
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
          Frequency of Followup
        </Text>
        {Platform.OS === "ios" ? (
          <View
            style={{
              alignItems: "center",
              backgroundColor: "#fff",
              borderWidth: 0.4,
              borderRadius: RFValue(5, 816),
              padding: 10,
            }}
          >
            <RNPickerSelect
              style={{
                paddingVertical: 5,
                borderWidth: 1,
                borderColor: "black",
              }}
              value={followUpFrequency}
              onValueChange={(itemValue, itemIndex) => {
                setFollowUpFrequency(itemValue);
              }}
              items={[
                { label: "None", value: "Non" },
                { label: "Once in a week", value: "Once in a week" },
                { label: "Once in 2 weeks", value: "Once in 2 weeks" },
                { label: "Once in a month", value: "Once in a month" },
                { label: "Once in 3 month", value: "Once in 3 month" },
              ]}
            />
          </View>
        ) : (
          <Picker
            selectedValue={followUpFrequency}
            onValueChange={(itemValue, itemIndex) => {
              setFollowUpFrequency(itemValue);
            }}
            style={{
              borderWidth: 1,
              borderColor: "black",
            }}
          >
            <Picker.Item label="None" value="Non" />
            <Picker.Item label="Once in a week" value="once in a week" />
            <Picker.Item label="Once in 2 weeks" value="once in 2 weeks" />
            <Picker.Item label="Once in a month" value="once in a month" />
            <Picker.Item label="Once in 3 months" value="once in 3 months" />
          </Picker>
        )}
        {followUpFrequency != "Non" ? (
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
        ) : null}
      </View>

      <TouchableOpacity
        onPress={() => {
          updatePayment();
        }}
        style={{
          padding: RFValue(15, 816),
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#C19F1E",
          borderRadius: RFValue(40, 816),
          margin: RFValue(20, 816),
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            fontSize: RFValue(20, 816),
            color: "black",
            alignSelf: "center",
          }}
        >
          Update Payment
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default EditPaymentDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
