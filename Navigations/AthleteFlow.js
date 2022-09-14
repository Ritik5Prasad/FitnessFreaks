import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  Switch,
  Linking,
  ScrollView,
} from "react-native";
let ScreenHeight = Dimensions.get("window").height;
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
//import { NavigationActions, StackActions } from 'react-navigation';
import { StackActions } from "@react-navigation/native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {
  DrawerItemList,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import Animated from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import { selectUserData, logout } from "../src/features/userSlice";
//import NetInfo from "@react-native-community/netinfo";
import AthleteHistory from "../src/screens/AthleteHistory";
import { auth } from "../src/utils/firebase";
import AthleteCreateWorkout from "../src/screens/AthleteCreateWorkout";
import { Icon } from "react-native-elements";
import Home from "../src/screens/Home";
import Chat from "../src/screens/Chat";
import Settings from "../src/screens/Settings";
import Coaches from "../src/screens/Coaches";
import OwnWorkout from "../src/screens/OwnWorkout";
import AthleteWorkoutList from "../src/screens/AthleteWorkoutList";
import AddMeal from "../src/screens/AddMeal";
import MealHistory from "../src/screens/MealHistory";
import CoachMealHistory from "../src/screens/CoachMealHistory";
import Nutrition from "../src/screens/Nutrition";
import CoachAddMeal from "../src/screens/coach/CoachAddMeal";
import Profile from "../src/screens/Profile";
import Reports from "../src/screens/Reports";
import Photos from "../src/screens/Photos";
import PersonalDetails from "../src/screens/PersonalDetails";
import CoachProfile from "../src/screens/coach/CoachProfile";
import PostAddScreen from "../src/screens/PostAddScreen";
import AssignWorkout from "../src/screens/coach/AssignWorkout";
import PostWorkoutDetails from "../src/screens/PostWorkoutDetails";
import LogWeight from "../src/screens/LogWeight";
import ViewAllWorkouts from "../src/screens/coach/ViewAllWorkouts";
import OnboardingAthlete from "../src/screens/OnboardingAthlete";
import NotificationsScreen from "../src/screens/NotificationsScreen";
import Support from "../src/screens/Support";
import ViewAllUpcomingWorkouts from "../src/screens/ViewAllUpcomingWorkouts";
import { removeTokenFromFirestore } from "../src/utils/tokenUtils";
import PreviousPhysiotherapy from "../src/screens/PreviousPhysiotherapy";
import ParticularPhysiotherapy from "../src/screens/ParticularPhysiotherapy";
import AthleteChats from "../src/screens/AthleteChats";
import ListOfCoaches from "../src/screens/ListOfCoaches";
import LoginScreen from "../src/features/LoginScreen";
import CallScreen from '../src/features/CallScreen'
const HomeStack = createStackNavigator();
const SettingsStack = createStackNavigator();
const WorkoutStack = createStackNavigator();
const CoachStack = createStackNavigator();
const NutritionStack = createStackNavigator();
const MessagingStack = createStackNavigator();

const Drawer = createDrawerNavigator();

const HomeNavigator = ({ navigation }) => {
  return (
    <HomeStack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
      defaultNavigationOptions={{
        gestureEnabled: false,
      }}
    >
      <HomeStack.Screen
        name="Home"
        component={Home}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          gestureEnabled: false,

          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />

      <HomeStack.Screen
        name="OwnWorkout"
        component={OwnWorkout}
        options={{
          headerTintColor: "black",
          headerTitleStyle: {
            color: "black",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />

      <HomeStack.Screen
        name="Chat"
        component={Chat}
        options={{
          headerTintColor: "black",
          headerTitleStyle: {
            color: "black",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />

      <HomeStack.Screen
        name="Coaches"
        component={Coaches}
        options={{
          headerTintColor: "black",
          headerTitleStyle: {
            color: "black",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />

      <HomeStack.Screen
        name="PreviousPhysiotherapy"
        component={PreviousPhysiotherapy}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />
      <HomeStack.Screen
        name="AthleteHistory"
        component={AthleteHistory}
        options={{
          headerTintColor: "black",
          headerTitleStyle: {
            color: "black",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />

      <HomeStack.Screen
        name="OnboardingAthlete"
        component={OnboardingAthlete}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />
      <HomeStack.Screen
        name="ParticularPhysiotherapy"
        component={ParticularPhysiotherapy}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />
      <HomeStack.Screen
        name="AssignWorkout"
        component={AssignWorkout}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />

      <HomeStack.Screen
        name="AthleteCreateWorkout"
        component={AthleteCreateWorkout}
        options={{
          headerTintColor: "black",
          headerTitleStyle: {
            color: "black",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />

      <HomeStack.Screen
        name="PostWorkoutDetails"
        component={PostWorkoutDetails}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />

      <HomeStack.Screen
        name="Nutrition"
        component={Nutrition}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />
      <HomeStack.Screen
        name="AddMeal"
        component={AddMeal}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />
      <HomeStack.Screen
        name="CoachAddMeal"
        component={CoachAddMeal}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />

      <HomeStack.Screen
        name="MealHistory"
        component={MealHistory}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />

      <HomeStack.Screen
        name="CoachMealHistory"
        component={CoachMealHistory}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />
      <HomeStack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />
      <HomeStack.Screen
        name="Reports"
        component={Reports}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />
      <HomeStack.Screen
        name="Photos"
        component={Photos}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />
      <HomeStack.Screen
        name="LogWeight"
        component={LogWeight}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />
      <HomeStack.Screen
        name="PersonalDetails"
        component={PersonalDetails}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />
      <HomeStack.Screen
        name="CoachProfile"
        component={CoachProfile}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />

      <HomeStack.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />
      {/* <HomeStack.Screen
        name="VideoCall"
        component={VideoCall}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      /> */}
      <HomeStack.Screen
        name="PostAddScreen"
        component={PostAddScreen}
        options={{
          headerTintColor: "black",
          headerTitleStyle: {
            color: "black",
          },
        }}
      />
    </HomeStack.Navigator>
  );
};

const SettingsNavigator = ({ navigation }) => {
  return (
    <SettingsStack.Navigator initialRouteName="Settings">
      <SettingsStack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />
    </SettingsStack.Navigator>
  );
};

const NutritionNavigator = ({ navigation }) => {
  return (
    <NutritionStack.Navigator
      initialRouteName="Nutrition"
      screenOptions={{
        headerShown: false,
      }}
    >
      <NutritionStack.Screen
        name="Nutrition"
        component={Nutrition}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />

      <NutritionStack.Screen
        name="MealHistory"
        component={MealHistory}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />

      <NutritionStack.Screen
        name="CoachMealHistory"
        component={CoachMealHistory}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />
      <NutritionStack.Screen
        name="AddMeal"
        component={AddMeal}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />
      <NutritionStack.Screen
        name="CoachAddMeal"
        component={CoachAddMeal}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />
      <NutritionStack.Screen
        name="PostAddScreen"
        component={PostAddScreen}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />
    </NutritionStack.Navigator>
  );
};

const WorkoutNavigator = ({ navigation }) => {
  return (
    <WorkoutStack.Navigator
      initialRouteName="AthleteWorkoutList"
      screenOptions={{
        headerShown: false,
      }}
    >
      <WorkoutStack.Screen
        name="AthleteWorkoutList"
        component={AthleteWorkoutList}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />
      <WorkoutStack.Screen
        name="ViewAllUpcomingWorkouts"
        component={ViewAllUpcomingWorkouts}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />

      <WorkoutStack.Screen
        name="AssignWorkout"
        component={AssignWorkout}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />
      <WorkoutStack.Screen
        name="PostWorkoutDetails"
        component={PostWorkoutDetails}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />
      <WorkoutStack.Screen
        name="ViewAllWorkouts"
        component={ViewAllWorkouts}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />

      <WorkoutStack.Screen
        name="PostAddScreen"
        component={PostAddScreen}
        options={{
          headerTintColor: "black",
          headerTitleStyle: {
            color: "black",
          },
        }}
      />
    </WorkoutStack.Navigator>
  );
};

const CoachNavigator = ({ navigation }) => {
  return (
    <CoachStack.Navigator
      initialRouteName="ListOfCoaches"
      screenOptions={{
        headerShown: false,
      }}
    >
      <CoachStack.Screen
        name="Coaches"
        component={Coaches}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />

      <CoachStack.Screen
        name="ListOfCoaches"
        component={ListOfCoaches}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />

      <CoachStack.Screen
        name="AthleteWorkoutList"
        component={AthleteWorkoutList}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />
      <CoachStack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />

      <CoachStack.Screen
        name="Chat"
        component={Chat}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />
    </CoachStack.Navigator>
  );
};



const MessagingNavigator = ({ navigation }) => {
  return (
    <MessagingStack.Navigator
      initialRouteName="AthleteChats"
      screenOptions={{
        headerShown: false,
      }}
    >
      <MessagingStack.Screen
        name="AthleteChats"
        component={AthleteChats}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />

<MessagingStack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
              <Text>CAll</Text>
            </View>
          ),
        }}
      />
      <MessagingStack.Screen
        name="CallScreen"
        component={CallScreen}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
              <Text>CAll</Text>
            </View>
          ),
        }}
      />

      <MessagingStack.Screen
        name="Chat"
        component={Chat}
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <View style={{ marginLeft: RFValue(15, 816), marginTop: 5 }}>
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                style={{ paddingLeft: 100 }}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),
        }}
      />
    </MessagingStack.Navigator>
  );
};

const CustomDrawerContentComponent = (props) => {
  const dispatch = useDispatch();
  const userData = useSelector(selectUserData);

  return (
    <SafeAreaView
      style={styles.container}
      // forceInset={{ top: "always", horizontal: "never" }}
    >
      <ScrollView>
        <View style={styles.drawerHeader}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => props.navigation.navigate("Profile")}
          >
            <Image
              style={styles.profileImage}
              source={
                userData?.data.imageUrl
                  ? { uri: userData?.data.imageUrl }
                  : "https://firebasestorage.googleapis.com/v0/b/fitnessapp0.appspot.com/o/userImage.jpeg?alt=media&token=02e8cfe5-c866-4a4f-93ab-8c5930a5cd3c"
              }
            />
          </TouchableOpacity>

          <View style={{ flex: 2, display: "flex", flexDirection: "column" }}>
            <Text style={styles.drawerHeaderText}>{userData?.data.name}</Text>
            <Text style={styles.drawerSubHeaderText}>Athlete</Text>
            <TouchableHighlight
              onPress={() => {
                props.navigation.navigate("Profile");
              }}
              activeOpacity={0.6}
              underlayColor="#DDDDDD"
            >
              <Text style={styles.drawerSubHeaderText1}>View Profile</Text>
            </TouchableHighlight>
          </View>
        </View>

        <TouchableOpacity
          style={{
            bottom: 0,
            left: 0,
            width: RFValue(200, 816),
            backgroundColor: "#C19F1E",
            height: RFValue(45, 816),
            alignItems: "center",
            marginLeft: RFValue(10, 816),
            borderRadius: RFValue(10, 816),
            flexDirection: "row",
            marginTop: RFValue(10, 816),
            paddingHorizontal: RFValue(10, 816),
          }}
          activeOpacity={0.6}
          onPress={() => {
            props.navigation.navigate("Home", { screen: "Home" });
          }}
        >
          <Icon
            name="home"
            type="material"
            size={24}
            color="white"
            style={{ width: RFValue(40, 816) }}
          />
          <Text
            style={{
              textAlign: "center",
              fontSize: RFValue(16, 816),
              color: "white",
            }}
          >
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            bottom: 0,
            left: 0,
            width: RFValue(200, 816),
            backgroundColor: "#C19F1E",
            height: RFValue(45, 816),
            alignItems: "center",
            marginLeft: RFValue(10, 816),
            borderRadius: RFValue(10, 816),
            flexDirection: "row",
            marginTop: RFValue(10, 816),
            paddingHorizontal: RFValue(10, 816),
          }}
          activeOpacity={0.6}
          onPress={() => {
            props.navigation.navigate("Workout", {
              screen: "AthleteWorkoutList",
            });
          }}
        >
          <Icon
            name="fitness-center"
            type="material"
            size={24}
            color="white"
            style={{ width: RFValue(40, 816) }}
          />
          <Text
            style={{
              textAlign: "left",
              fontSize: RFValue(16, 816),
              color: "white",
            }}
          >
            Workout
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            bottom: 0,
            left: 0,
            width: RFValue(200, 816),
            backgroundColor: "#C19F1E",
            height: RFValue(45, 816),
            alignItems: "center",
            marginLeft: RFValue(10, 816),
            borderRadius: RFValue(10, 816),
            flexDirection: "row",
            marginTop: RFValue(10, 816),
            paddingHorizontal: RFValue(10, 816),
          }}
          activeOpacity={0.6}
          onPress={() => {
            props.navigation.navigate("Nutrition", { screen: "Nutrition" });
          }}
        >
          <Icon
            name="lunch-dining"
            type="material"
            size={24}
            color="white"
            style={{ width: RFValue(40, 816) }}
          />
          <Text
            style={{
              textAlign: "left",
              fontSize: RFValue(16, 816),
              color: "white",
            }}
          >
            Nutrition
          </Text>
        </TouchableOpacity>
      
        <TouchableOpacity
          style={{
            bottom: 0,
            left: 0,
            width: RFValue(200, 816),
            backgroundColor: "#C19F1E",
            height: RFValue(45, 816),
            alignItems: "center",
            marginLeft: RFValue(10, 816),
            borderRadius: RFValue(10, 816),
            flexDirection: "row",
            marginTop: RFValue(10, 816),
            paddingHorizontal: RFValue(10, 816),
          }}
          activeOpacity={0.6}
          onPress={() => {
            props.navigation.navigate("Coaches", { screen: "ListOfCoaches" });
          }}
        >
          <Icon
            name="person"
            type="material"
            size={24}
            color="white"
            style={{ width: RFValue(40, 816) }}
          />
          <Text
            style={{
              textAlign: "left",
              fontSize: RFValue(16, 816),
              color: "white",
            }}
          >
            Coaches
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            bottom: 0,
            left: 0,
            width: RFValue(200, 816),
            backgroundColor: "#C19F1E",
            height: RFValue(45, 816),
            alignItems: "center",
            marginLeft: RFValue(10, 816),
            borderRadius: RFValue(10, 816),
            flexDirection: "row",
            marginTop: RFValue(10, 816),
            paddingHorizontal: RFValue(10, 816),
          }}
          activeOpacity={0.6}
          onPress={() => {
            props.navigation.navigate("Messaging", { screen: "AthleteChats" });
          }}
        >
          <Icon
            name="chat"
            type="material"
            size={24}
            color="white"
            style={{ width: RFValue(40, 816) }}
          />
          <Text
            style={{
              textAlign: "left",
              fontSize: RFValue(16, 816),
              color: "white",
            }}
          >
            Messaging
          </Text>
        </TouchableOpacity>

       

        <TouchableOpacity
          style={{
            bottom: 0,
            left: 0,
            width: RFValue(200, 816),
            backgroundColor: "#C19F1E",
            height: RFValue(45, 816),
            alignItems: "center",
            marginLeft: RFValue(10, 816),
            borderRadius: RFValue(10, 816),
            flexDirection: "row",
            marginTop: RFValue(10, 816),
            paddingHorizontal: RFValue(10, 816),
          }}
          activeOpacity={0.6}
          onPress={() => {
            props.navigation.navigate("Support");
          }}
        >
          <Icon
            name="settings"
            type="material"
            size={24}
            color="white"
            style={{ width: RFValue(40, 816) }}
          />
          <Text
            style={{
              textAlign: "center",
              fontSize: RFValue(16, 816),
              color: "white",
            }}
          >
            Support
          </Text>
        </TouchableOpacity>
       
         
      </ScrollView>
     
      
          

      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 5,
          width: "100%",
          backgroundColor: "#C19F1E",
          height: RFValue(52, 816),
          alignItems: "center",
          justifyContent: "center",
        }}
       
        onPress={async () => {
          await removeTokenFromFirestore(userData.id);
          auth.signOut();
          dispatch(logout());
          props.navigation.dispatch(
            StackActions.replace("LoginScreen", { test: "Test Params" })
          );
          props.navigation.navigate("LoginScreen");
          props.navigation.closeDrawer();
          /*
            const resetAction = StackActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({ routeName: 'LoginScreen' })],
            });
            props.navigation.dispatch(resetAction); 
            */
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: RFValue(16, 816),
            color: "white",
          }}
        >
          Sign out
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const MainNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawerContentComponent {...props} />}
      drawerContentOptions={{
        activebackgroundColor: "#f5ce42",
        activeTintcolor: "white",
        inactivebackgroundColor: "#C19F1E",
        inactiveTintcolor: "white",
        backgroundColor: "#f6f6f6",
        itemStyle: {
          width: RFValue(200, 816),
          borderRadius: RFValue(12, 816),
          justifyContent: "space-around",
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          drawerIcon: () => (
            <Icon
              name="home"
              type="font-awesome-5"
              size={24}
              color="black"
              style={{ width: RFValue(40, 816) }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Workout"
        component={WorkoutNavigator}
        options={{
          drawerIcon: ({ tintColor }) => (
            <Image
              source={require("../assets/dumbell.png")}
              style={{ marginLeft: RFValue(5, 816), marginRight: 2 }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Nutrition"
        component={NutritionNavigator}
        options={{
          drawerIcon: ({ tintColor }) => (
            <Image
              source={require("../assets/hamburger.png")}
              style={{ marginLeft: RFValue(7, 816), marginRight: 3 }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Coaches"
        component={CoachNavigator}
        options={{
          drawerIcon: ({ tintColor }) => (
            <Image
              source={require("../assets/user.png")}
              style={{ marginLeft: RFValue(5, 816), marginRight: 2 }}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="Messaging"
        component={MessagingNavigator}
        options={{
          drawerIcon: ({ tintColor }) => (
            <Image
              source={require("../assets/message.png")}
              style={{ marginLeft: RFValue(7, 816), marginRight: 7 }}
            />
          ),
        }}
      />

     
      <Drawer.Screen
        name="Support"
        component={Support}
        options={{
          drawerIcon: ({ tintColor }) => (
            <Image
              source={require("../assets/rupee.png")}
              style={{
                marginLeft: RFValue(10, 816),
                marginRight: RFValue(10, 816),
              }}
            />
          ),
        }}
      />
      
      <Drawer.Screen
        name="Settings"
        component={SettingsNavigator}
        style={{ color: "black", backgroundColor: "#006D77" }}
        options={{
          drawerIcon: ({ tintColor }) => (
            <Image source={require("../assets/settings.png")} style={{ marginLeft:5,marginRight:2 }}/>
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

function AthleteFlow() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <MainNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    padding: 0,
    // height: ScreenHeight - StatusBar.currentHeight,
    backgroundColor: "#f6f6f6",
  },
  profileImage: {
    backgroundColor: "#888",
    width: RFValue(80, 816),
    height: RFValue(80, 816),
    borderRadius: 50,
    marginRight: RFValue(10, 816),
  },
  drawerHeader: {
    backgroundColor: "#f6f6f6",
    color: "black",
    height: RFValue(100, 816),
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginVertical: RFValue(30, 816),
    paddingHorizontal: RFValue(20, 816),
  },
  drawerHeaderText: {
    color: "black",
    fontSize: RFValue(18, 816),
    fontWeight: "bold",
    marginLeft: RFValue(5, 816),
    marginBottom: RFValue(5, 816),
  },
  drawerSubHeaderText: {
    color: "black",
    fontSize: RFValue(14, 816),
    fontWeight: "700",
    marginLeft: RFValue(5, 816),
    marginBottom: RFValue(5, 816),
  },
  drawerSubHeaderText1: {
    color: "black",
    fontSize: RFValue(12, 816),
    fontWeight: "600",
    marginLeft: RFValue(5, 816),
  },
});

export default AthleteFlow;
