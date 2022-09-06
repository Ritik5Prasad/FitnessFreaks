import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  DatePickerIOS,
  Linking,
} from "react-native";
import { sendEmail } from "react-native-email-action";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as firebase from "firebase";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";
let ScreenWidth = Dimensions.get("window").width;
let ScreenHeight = Dimensions.get("window").height;
import {
  selectShowData,
  selectUser,
  selectUserDetails,
  setDbID,
  setUserDetails,
} from "../features/userSlice";
import { db } from "../firebase";
import DatePicker from "react-native-datepicker";
import moment from "moment";
import { Icon } from "react-native-elements";
import Notification from "./components/Notification";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3",
    marginBottom: 0,
    paddingTop: RFValue(20, 816),
    height: ScreenHeight,
  },

  profileLabels: {
    color: "black",
    marginVertical: RFValue(20, 816),
    fontSize: RFValue(20, 816),
    width: RFValue(200, 816),
    fontWeight: "bold",
  },
  profileData: {
    color: "black",
    margin: RFValue(20, 816),
    fontSize: RFValue(20, 816),
  },

  imageContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});

export default function Support({ route, navigation }) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [userData, setUserData] = useState(null);
  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
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
                navigation.navigate("Home", { screen: "CoachHomeScreen" });
              }}
            >
              <Icon name="chevron-left" type="font-awesome-5" color="black" />
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
                color: "black",
                marginLeft: RFValue(20, 816),
              }}
            >
              Support
            </Text>
          </View>
          <Notification navigation={navigation} />
        </View>

        <View>
          <View style={{ padding: RFValue(20, 816) }}>
            <TouchableOpacity
              onPress={() => {
                if (Platform.OS === "android") {
                  Linking.openURL(
                    `mailto:rv724405@gmail.com?subject=Fitness Help`
                  );
                } else {
                  const options = {
                    to: "rv724405@gmail.com",
                    subject: "Fitness App Help",
                    body: "",
                  };
                  sendMail(options);
                }
              }}
            >
              <Text
                style={{
                  padding: RFValue(5, 816),
                  fontSize: RFValue(20, 816),
                  color: "black",
                }}
              >
                Email
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  padding: RFValue(10, 816),
                }}
              >
                rv724405@gmail.com
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (Platform.OS === "android") {
                  Linking.openURL(`tel:+919886555563`);
                } else {
                  Linking.openURL(`telprompt:++919886555563`);
                }
              }}
              style={{
                marginTop: RFValue(20, 816),
              }}
            >
              <Text
                style={{
                  padding: RFValue(5, 816),
                  fontSize: RFValue(20, 816),
                  color: "black",
                }}
              >
                Phone
              </Text>
              <Text
                style={{
                  fontSize: RFValue(20, 816),
                  padding: RFValue(10, 816),
                }}
              >
                +91 8922897556
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
