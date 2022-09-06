import React, { useRef, useState, useEffect } from "react";
import { View, SafeAreaView, Text, Image } from "react-native";
import { CommonActions } from "@react-navigation/routers";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "OnBoarding" }],
        })
      );
    }, 2000);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
      }}
    >
      <Image
        source={require("../assets/logo.jpeg")}
        style={{ flex:1, resizeMode: "contain" }}
      />
    </View>
  );
}
