import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Dimensions,
} from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import { selectUser, login, logout } from "../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { TouchableOpacity, TextInput } from "react-native";
import { Icon } from "react-native-elements";

let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

function ForgotPassword3({ navigation }) {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [password, setPassword] = useState(null);
  const [password2, setPassword2] = useState(null);

  return (
    <View style={[styles.container, { padding: 20 }]}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 40,
        }}
      >
        <TouchableOpacity
          style={{
            marginRight: RFValue(20, 816),
          }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Icon name="chevron-left" type="font-awesome-5" color="black" />
        </TouchableOpacity>

        <Text
          style={{
            fontFamily: "SF-Pro-Text-regular",
            textAlign: "center",
            fontWeight: "bold",
            color: "black",
            fontSize: 24,
          }}
        >
          Forgot Password
        </Text>
      </View>
      <View
        style={{ flex: 1, alignItems: "center", width: "100%", marginTop: 30 }}
      >
        <View
          style={{
            width: "100%",
            alignItems: "center",
            marginTop: RFValue(10, 816),
            borderBottomWidth: 0.5,
            paddingBottom: 15,
          }}
        >
          <Text style={{ color: "black", fontWeight: "bold", fontSize: 28 }}>
            Welcome Back Ann
          </Text>
          <Text style={{ color: "rgba(0,0,0,0.5)", marginTop: 10 }}>
            Enter your New Password
          </Text>
        </View>

        <View style={{ width: "100%" }}>
          <Text
            style={{
              color: "black",
              marginVertical: RFValue(15, 816),
              fontSize: 16,
            }}
          >
            Enter Password
          </Text>
          <TextInput
            style={{
              height: 45,
              borderColor: "#ddd",
              borderWidth: 1,
              borderRadius: RFValue(5, 816),
              padding: RFValue(10, 816),
              backgroundColor: "white",
            }}
            placeholder={"Enter your desired password"}
            secureTextEntry
            autoCompleteType="off"
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={{ width: "100%" }}>
          <Text
            style={{
              color: "black",
              marginVertical: RFValue(15, 816),
              fontSize: 16,
            }}
          >
            Re-enter Password
          </Text>
          <TextInput
            style={{
              height: 45,
              borderColor: "#ddd",
              borderWidth: 1,
              borderRadius: RFValue(5, 816),
              padding: RFValue(10, 816),
              backgroundColor: "white",
            }}
            placeholder={"Enter your Password again"}
            secureTextEntry
            autoCompleteType="off"
            value={password2}
            onChangeText={setPassword2}
          />
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: "#C19F1E",
            borderRadius: 25,
            padding: RFValue(15, 816),
            width: "100%",
            marginTop: 30,
          }}
        >
          <Text style={{ color: "black", textAlign: "center" }}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ForgotPassword3;
