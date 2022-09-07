import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  Dimensions,
} from "react-native";
import { CommonActions } from "@react-navigation/routers";
import {
  selectUser,
  login,
  logout,
  selectUserType,
  selectUserVerified,
} from "../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { TouchableOpacity } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { useFocusEffect } from "@react-navigation/native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    color: "black",
  },
});

function OnBoarding({ navigation }) {
  const user = useSelector(selectUser);
  const userType = useSelector(selectUserType);
  const userVerified = useSelector(selectUserVerified);
  const dispatch = useDispatch();
  const [activeSlide, setactiveSlide] = useState(0);

  useEffect(() => {
    if (user !== null) {
      if (userType === "coach") {
        // navigation.navigate("CoachFlow");
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "CoachFlow" }],
          })
        );
      } else if (userType == "athlete") {
        // navigation.navigate("AthleteFlow");
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "AthleteFlow" }],
          })
        );
        /*
          if (userVerified == true) {
            navigation.navigate("AthleteFlow");
          } else if(userVerified == false) {
            //navigation.navigate("OnboardingAthlete");
          }*/
      } else {
        // navigation.navigate("LoginScreen");
      }
    }
  }, [user, userType, userVerified]);

  const carouselItems = [
    {
      image: require("../../assets/onboarding1.png"),
      text: "Easy Management",
    },
    {
      image: require("../../assets/onboarding2.png"),
      text: "Track Your Progress",
    },
    {
      image: require("../../assets/onboarding3.png"),
      text: "Guided Workouts",
    },
  ];
  const _renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          borderRadius: RFValue(5, 816),
          width: "100%",
          marginBottom: 0,
          paddingBottom: 0,
          alignItems: "center",
        }}
      >
        <Image
          source={item.image}
          style={{
            height: Platform.isPad ? 400 : 320,
            width: "90%",
            resizeMode: "contain",
          }}
        />
        <Text
          style={{
            textAlign: "center",
            fontWeight: "bold",
            color: "#303030",
            fontSize: 24,
            marginTop: 10,
          }}
        >
          {item.text}
        </Text>
      </View>
    );
  };
  return (
    <View style={[styles.container, { padding: 20 }]}>
      <View style={{ flex: 1, width: "100%", paddingTop: 50 }}>
        <Carousel
          layout={"default"}
          data={carouselItems}
          renderItem={_renderItem}
          sliderWidth={ScreenWidth - 40}
          itemWidth={ScreenWidth - 40}
          onSnapToItem={(index) => {
            setactiveSlide(index);
          }}
          autoplay={true}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          {activeSlide == 0 ? (
            <View
              style={{
                height: RFValue(10, 816),
                width: RFValue(10, 816),
                borderRadius: 50,
                backgroundColor: "#040404",
                marginHorizontal: 10,
              }}
            ></View>
          ) : (
            <View
              style={{
                height: RFValue(10, 816),
                width: RFValue(10, 816),
                borderRadius: 50,
                backgroundColor: "#707070",
                marginHorizontal: 10,
              }}
            ></View>
          )}
          {activeSlide == 1 ? (
            <View
              style={{
                height: RFValue(10, 816),
                width: RFValue(10, 816),
                borderRadius: 50,
                backgroundColor: "#040404",
                marginHorizontal: 10,
              }}
            ></View>
          ) : (
            <View
              style={{
                height: RFValue(10, 816),
                width: RFValue(10, 816),
                borderRadius: 50,
                backgroundColor: "#707070",
                marginHorizontal: 10,
              }}
            ></View>
          )}
          {activeSlide == 2 ? (
            <View
              style={{
                height: RFValue(10, 816),
                width: RFValue(10, 816),
                borderRadius: 50,
                backgroundColor: "#040404",
                marginHorizontal: 10,
              }}
            ></View>
          ) : (
            <View
              style={{
                height: RFValue(10, 816),
                width: RFValue(10, 816),
                borderRadius: 50,
                backgroundColor: "#707070",
                marginHorizontal: 10,
              }}
            ></View>
          )}
        </View>
      </View>
      <View style={{ flex: 1, alignItems: "center", width: "100%" }}>
        <Text
          style={{
            color: "black",
            fontSize: 26,
            marginVertical: 25,
            fontWeight: "bold",
          }}
        >
          Let's Get Started
        </Text>
        <Text style={{ color: "#646464" }}>Join Us To Enjoy</Text>
        <Text style={{ color: "#646464" }}>A One Stop Workout And</Text>
        <Text style={{ color: "#646464" }}>
          Nutrition Management Experience
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("RegisterScreen")}
          style={{
            backgroundColor: "#C19F1E",
            borderRadius: 25,
            padding: RFValue(15, 816),
            width: "100%",
            marginTop: 20,
          }}
        >
          <Text
            style={{
              color: "white",

              textAlign: "center",
            }}
          >
            Create Account
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("LoginScreen")}
          style={{
            borderWidth: 1,
            borderColor: "#C19F1E",
            borderRadius: 25,
            padding: RFValue(15, 816),
            width: "100%",
            marginTop: 20,
          }}
        >
          <Text style={{ color: "#343434", textAlign: "center" }}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default OnBoarding;
