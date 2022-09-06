import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  login,
  setDbID,
  setUserType,
  setUserData,
  logout,
  setTemperoryID,
  setUserVerified,
  setTemperoryData,
  selectLoading,
} from "./features/userSlice";
import { useDispatch, useSelector } from "react-redux";

import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import VerifyAthlete from "./screens/VerifyAthlete";
import AthleteFlow from "./AthleteFlow";
import CoachFlow from "./CoachFlow";
import Chat from "./screens/Chat";
import Anthropometric from "./screens/Anthropometric";
import TrainingAssessment from "./screens/TrainingAssessment";
import LifestyleAssessment from "./screens/LifestyleAssessment";
import MedicalAssessment from "./screens/MedicalAssessment";
import OnBoarding from "./screens/OnBoarding";
import ForgotPassword from "./screens/ForgotPassword";
import ForgotPassword2 from "./screens/ForgotPassword2";
import ForgotPassword3 from "./screens/ForgotPassword3";
import CoachInfo from "./screens/CoachInfo";
import OnboardingAthlete from "./screens/OnboardingAthlete";
import { ActivityIndicator } from "react-native-paper";
import Offline from "./screens/Offline";
import messaging from "@react-native-firebase/messaging";
import { saveTokenInFirestore } from "./utils/tokenUtils";
import FlashMessage, {
  showMessage,
  hideMessage,
} from "react-native-flash-message";
import SplashScreen from "./screens/SplashScreen";
import { SafeAreaView } from "react-native";

const Stack = createStackNavigator();

const MainNavigator = ({ navigationRef }) => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OnBoarding"
          component={OnBoarding}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Offline"
          component={Offline}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OnboardingAthlete"
          component={OnboardingAthlete}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VerifyAthlete"
          component={VerifyAthlete}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword2"
          component={ForgotPassword2}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword3"
          component={ForgotPassword3}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Anthropometric"
          component={Anthropometric}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TrainingAssessment"
          component={TrainingAssessment}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LifestyleAssessment"
          component={LifestyleAssessment}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MedicalAssessment"
          component={MedicalAssessment}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AthleteFlow"
          component={AthleteFlow}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CoachFlow"
          component={CoachFlow}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CoachInfo"
          component={CoachInfo}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

function MainFlow() {
  const isLoading = useSelector(selectLoading);
  const dispatch = useDispatch();
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    const getData = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        const userType = await AsyncStorage.getItem("userType");
        const userVerified = await AsyncStorage.getItem("userVerified");

        if (user != null) {
          dispatch(login(user));
        }
        if (userType != null) {
          dispatch(setUserType(userType));
        }
        if (userVerified != null) {
          dispatch(setUserVerified(userVerified == "true" ? true : false));
        }
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          await saveTokenInFirestore(user, userType);
        }
      } catch (e) {
        console.log("error" + e);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      if (remoteMessage.notification) {
        const { title, body } = remoteMessage.notification;
        showMessage({
          message: title,
          description: body,
          type: "default",
          backgroundColor: "#fcd54a",
          color: "#000",
          duration: 5000,
          titleStyle: {
            fontWeight: "bold",
          },
          onPress: () => {
            navigate(remoteMessage);
          },
        });
      }
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        navigate(remoteMessage);
      });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      navigate(remoteMessage);
    });

    return unsubscribe;
  }, []);

  function navigate(remoteMessage) {
    if (remoteMessage && remoteMessage.data) {
      const {
        data: { screenName, params: screenParams },
      } = remoteMessage;
      if (screenName) {
        const screens = screenName.split(":");
        const topLevelScreen = screens[0];
        const allParams = {};
        if (screens.length > 1) {
          let params = allParams;
          for (let i = 1; i < screens.length; i++) {
            params.screen = screens[i];
            params.params =
              i === screens.length - 1 && !!screenParams
                ? JSON.parse(screenParams)
                : {};
            params = params.params;
          }
        }
        navigationRef.navigate(topLevelScreen, allParams);
      }
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "grey",
        paddingTop: Platform.OS === "ios" ? 0 : 35,
      }}
    >
      <MainNavigator navigationRef={navigationRef} />
      <FlashMessage position="top" />
    </SafeAreaView>
  );
}

export default MainFlow;
