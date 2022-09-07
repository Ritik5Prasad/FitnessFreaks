import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Platform,
  Dimensions,
} from "react-native";
import { selectUser, login, logout } from "../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { TouchableOpacity, TextInput } from "react-native";
import { Icon } from "react-native-elements";
import firebase from "firebase";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

function ForgotPassword({ navigation }) {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);

  const handle = () => {
    if (email && email != "") {
      firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(function (user) {
          //navigation.navigate("ForgotPassword2")
          alert("A reset password link has been sent to your email.");
        })
        .catch(function (e) {
          alert("Please enter a valid email to reset your password.");
        });
    } else {
      alert("Please enter a valid email to reset your password.");
    }
  };

  return (
    <View style={[styles.container, { padding: RFValue(20, 816) }]}>
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
            fontSize: RFValue(24, 816),
          }}
        >
          Forgot Password
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          width: "100%",
          marginTop: RFValue(30, 816),
        }}
      >
        <View
          style={{
            width: "100%",
            backgroundColor: "white",
            padding: RFValue(10, 816),
            borderRadius: RFValue(10, 816),
            marginTop: RFValue(20, 816),
            paddingBottom: RFValue(15, 816),
            marginHorizontal: 20,
          }}
        >
          <Text style={{ color: "#253274", marginVertical: 10 }}>Email</Text>
          <TextInput
            style={{
              borderColor: "#ddd",
              borderWidth: 1,
              borderRadius: RFValue(5, 816),
              padding: RFValue(10, 816),
              backgroundColor: "white",
              paddingVertical: Platform.OS === "ios" ? 15 : 10,
            }}
            placeholder={"Email"}
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <TouchableOpacity
          onPress={() => handle()}
          style={{
            backgroundColor: "#C19F1E",
            borderRadius: 25,
            padding: RFValue(15, 816),
            width: "100%",
            marginTop: RFValue(30, 816),
          }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ForgotPassword;
