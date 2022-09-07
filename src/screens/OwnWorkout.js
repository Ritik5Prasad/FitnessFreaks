import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableHighlight,
  Modal,
  Platform,
  Switch,
} from "react-native";
import { db } from "../utils/firebase";
import firebase from "firebase";
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
import { useDispatch, useSelector } from "react-redux";
import { selectUserData } from "../features/userSlice";
import { Icon } from "react-native-elements";
import Axios from "axios";
import SearchableDropdown from "react-native-searchable-dropdown";
import TextInputMask from "react-native-masked-input";
import { Picker } from "@react-native-picker/picker";
import WebView from "react-native-webview";
import sendPushNotification from "./components/SendNotification";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import RNPickerSelect from "react-native-picker-select";
import Notification from "./components/Notification";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ActivityIndicator } from "react-native-paper";
import DatePicker from "react-native-datepicker";
import DropDownPicker from "react-native-dropdown-picker";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3",
    marginBottom: 0,
    paddingTop: RFValue(20, 816),
    height: ScreenHeight,
  },
});

const OwnWorkout = ({ navigation, route }) => {
  const { workout } = route.params;

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [workoutDuration, setWorkoutDuration] = useState("");
  const [fatigueLevel, setFatigueLevel] = useState(workout.preWorkout.fatigue);
  const [description, setDescription] = useState("");
  const userData = useSelector(selectUserData);

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
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
                navigation.goBack();
              }}
            >
              <Image source={require("../../assets/left_arrow.png")} />
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
                color: "black",
              }}
            >
              Own Workout
            </Text>
          </View>

          <Notification navigation={navigation} />
        </View>
        <View
          style={{
            marginVertical: RFValue(10, 816),
            marginTop: ScreenHeight * 0.04,
          }}
        >
          <Image
            style={{
              width: ScreenWidth,
              height: RFValue(200, 816),
              marginVertical: RFValue(10, 816),
            }}
            source={require("../../assets/illustration.jpeg")}
          />
          <View
            style={{
              padding: RFValue(10, 816),
              backgroundColor: "white",
              margin: RFValue(10, 816),
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                fontSize: RFValue(16, 816),
                marginVertical: RFValue(10, 816),
                color: "black",
              }}
            >
              Title
            </Text>
            <TextInput
              style={{
                borderWidth: 0.4,
                bordercolor: "white",
                backgroundColor: "#fff",
                borderRadius: RFValue(5, 816),
                padding: RFValue(7, 816),
                color: "black",
                paddingVertical: Platform.OS === "ios" ? 10 : 7,
              }}
              value={workout.preWorkout.workoutName}
              placeholder={"Workout Name"}
              editable={false}
              //   keyboardType={keyboardType}
            />
          </View>
          {/* <View
            style={{
              padding: RFValue(10, 816),
              backgroundColor: "white",
              margin: RFValue(10, 816),
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                fontSize: RFValue(16, 816),
                marginVertical: RFValue(10, 816),
                color: "black",
              }}
            >
              Date
            </Text>
            <TextInput
              style={{
                borderWidth: 0.4,
                bordercolor: "white",
                backgroundColor: "#fff",
                borderRadius: RFValue(5, 816),
                padding: RFValue(7, 816),
                color: "black",
                paddingVertical: Platform.OS === "ios" ? 10 : 7,
              }}
              value={workout.p}
              placeholder={"Workout Name"}
              editable={false}
              //   keyboardType={keyboardType}
            />
          </View> */}
          <View
            style={{
              padding: RFValue(10, 816),
              backgroundColor: "white",
              margin: RFValue(10, 816),
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                fontSize: RFValue(14, 816),
                marginVertical: RFValue(10, 816),
                color: "black",
              }}
            >
              Workout Duration
            </Text>
            <TextInputMask
              style={{
                borderWidth: 0.4,
                bordercolor: "white",
                backgroundColor: "#fff",
                width: "100%",
                borderRadius: RFValue(5, 816),
                paddingLeft: RFValue(10, 816),
                paddingVertical: Platform.OS === "ios" ? 10 : 0,
              }}
              type={"datetime"}
              options={{
                format: "hh:mm:ss",
              }}
              value={workout.preWorkout.workoutDuration}
              placeholder="HH : MM : SS"
              editable={false}
            />
          </View>
          <View
            style={{
              padding: RFValue(10, 816),
              backgroundColor: "white",
              margin: RFValue(10, 816),
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                fontSize: RFValue(16, 816),
                marginVertical: RFValue(10, 816),
                color: "black",
              }}
            >
              Description
            </Text>
            <TextInput
              style={{
                borderWidth: 0.4,
                bordercolor: "white",
                backgroundColor: "#fff",
                borderRadius: RFValue(5, 816),
                padding: RFValue(7, 816),
                color: "black",
                textAlignVertical: "top",
                paddingVertical: Platform.OS === "ios" ? 10 : 7,
              }}
              numberOfLines={4}
              multiline={true}
              value={workout.preWorkout.description}
              editable={false}
              placeholder={"Description"}
              //   keyboardType={keyboardType}
            />
          </View>
          <View
            style={{
              padding: RFValue(10, 816),
              backgroundColor: "white",
              margin: RFValue(10, 816),
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                fontSize: RFValue(16, 816),
                marginVertical: RFValue(10, 816),
                color: "black",
              }}
            >
              PostWorkout fatigue level
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: 10,
              }}
            >
              <TouchableOpacity>
                <Icon
                  name="tired"
                  type="font-awesome-5"
                  color={fatigueLevel === "very-sore" ? "red" : "black"}
                  size={RFValue(40, 816)}
                  solid
                />
              </TouchableOpacity>
              <TouchableOpacity style={{ marginLeft: 20 }}>
                <Icon
                  name="meh"
                  type="font-awesome-5"
                  color={
                    fatigueLevel === "moderately-sore" ? "#f5dd4b" : "black"
                  }
                  size={RFValue(40, 816)}
                  solid
                />
              </TouchableOpacity>
              <TouchableOpacity style={{ marginLeft: 20 }}>
                <Icon
                  name="laugh-beam"
                  type="font-awesome-5"
                  color={fatigueLevel === "not-sore" ? "green" : "black"}
                  size={RFValue(40, 816)}
                  solid
                />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "#C19F1E",
              padding: RFValue(10, 816),
              borderRadius: RFValue(15, 816),
              width: ScreenWidth - RFValue(80, 816),
              height: RFValue(50, 816),
              marginVertical: RFValue(20, 816),
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
            }}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Text
              style={{
                fontSize: RFValue(16, 816),
                color: "white",
                fontWeight: "bold",
              }}
            >
              Return
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default OwnWorkout;
