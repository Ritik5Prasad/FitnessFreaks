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
  StatusBar,
  ScrollView,
} from "react-native";
import { StackActions } from "@react-navigation/native";
//import { NavigationActions, StackActions } from 'react-navigation';
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import OwnWorkout from "../src/screens/OwnWorkout";
import {
  DrawerItemList,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { useDispatch, useSelector } from "react-redux";
import { selectUserData, logout } from "../src/features/userSlice";
import { auth } from "../src/utils/firebase";
//import NetInfo from "@react-native-community/";

import { Icon } from "react-native-elements";
import Home from "../src/screens/Home";
import Chat from "../src/screens/Chat";
import Settings from "../src/screens/Settings";
import CoachHomeScreen from "../src/screens/coach/CoachHomeScreen";
import Athletes from "../src/screens/coach/Athletes";
import AddWorkout from "../src/screens/coach/AddWorkout";
import WorkoutList from "../src/screens/coach/WorkoutList";
import Admin from "../src/screens/coach/Admin";
import Accounts from "../src/screens/coach/Accounts";
import AccountsHomeScreen from "../src/screens/coach/AccountsHomeScreen";
import ChatHomeScreen from "../src/screens/coach/ChatHomeScreen";
import CoachNutrition from "../src/screens/coach/CoachNutrition";
import CoachAddMeal from "../src/screens/coach/CoachAddMeal";
import AssignNutrition from "../src/screens/coach/AssignNutrition";
import CoachProfile from "../src/screens/coach/CoachProfile";
import EditOwnWorkout from "../src/screens/coach/EditOwnWorkout";
import OwnWorkouts from "../src/screens/coach/OwnWorkouts";
import Profile from "../src/screens/Profile";
import PostWorkoutDetails from "../src/screens/PostWorkoutDetails";
import PersonalDetails from "../src/screens/PersonalDetails";
import Anthropometric from "../src/screens/Anthropometric";
import MedicalAssessment from "../src/screens/MedicalAssessment";
import LifestyleAssessment from "../src/screens/LifestyleAssessment";
import AddNewPhysioAss from "../src/screens/AddNewPhysioAss";
import TrainingAssessment from "../src/screens/TrainingAssessment";
import PreviousPhysiotherapy from "../src/screens/PreviousPhysiotherapy";
import ParticularPhysiotherapy from "../src/screens/ParticularPhysiotherapy";
import AthletePayments from "../src/screens/Payments";

import PostAddScreen from "../src/screens/PostAddScreen";

import AssignWorkout from "../src/screens/coach/AssignWorkout";
import WorkoutDetails from "../src/screens/coach/WorkoutDetails";
import InvitesList from "../src/screens/coach/InvitesList";
import InviteScreen from "../src/screens/coach/InviteScreen";
import InviteAthlete from "../src/screens/coach/InviteAthlete";
import AthletesList from "../src/screens/coach/AthletesList";
import Reports from "../src/screens/Reports";
import Photos from "../src/screens/Photos";
import ViewAllWorkouts from "../src/screens/coach/ViewAllWorkouts";
import ViewAllSavedWorkouts from "../src/screens/coach/ViewAllSavedWorkouts";
import ViewAllLongTermWorkouts from "../src/screens/coach/ViewAllLongTermWorkouts";
import ViewAllNutrition from "../src/screens/coach/ViewAllNutrition";
import ViewAllSavedNutrition from "../src/screens/coach/ViewAllSavedNutrition";
import MealHistory from "../src/screens/MealHistory";
import AddMeal from "../src/screens/AddMeal";
import CoachInfo from "../src/screens/CoachInfo";
import Notification from "../src/screens/components/Notification";
import NotificationsScreen from "../src/screens/coach/NotificationsScreen";
import AthleteHistory from "../src/screens/AthleteHistory";
import Support from "../src/screens/Support";
import CreateOwnWorkout from "../src/screens/coach/CreateOwnWorkout";
import Auth from "../src/screens/coach/auth";
import LongTermWorkout from "../src/screens/coach/LongTermWorkout";
import { removeTokenFromFirestore } from "../src/utils/tokenUtils";
import EditPaymentDetailsScreen from "../src/screens/coach/EditPaymentDetailsScreen";
import AddOwnFood from "../src/screens/coach/AddOwnFood";
import OwnFoodList from "../src/screens/coach/OwnFoodList";

const HomeStack = createStackNavigator();
const MediaStack = createStackNavigator();
const WorkoutStack = createStackNavigator();
const AdminStack = createStackNavigator();
const ChatStack = createStackNavigator();
const NutritionStack = createStackNavigator();
const AthleteStack = createStackNavigator();


//const Tabs = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const AthletesNavigator = ({ navigation }) => {
  return (
    <AthleteStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AthleteStack.Screen
        name="Athletes"
        component={Athletes}
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
      <AthleteStack.Screen
        name="InvitesList"
        component={InvitesList}
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
      <AthleteStack.Screen
        name="InviteScreen"
        component={InviteScreen}
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
      <AthleteStack.Screen
        name="InviteAthlete"
        component={InviteAthlete}
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
      <AthleteStack.Screen
        name="Home"
        component={Home}
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
      <AthleteStack.Screen
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

      <AthleteStack.Screen
        name="AthletePayments"
        component={AthletePayments}
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

      <AthleteStack.Screen
        name="EditPaymentDetailsScreen"
        component={EditPaymentDetailsScreen}
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
    </AthleteStack.Navigator>
  );
};



const HomeNavigator = ({ navigation }) => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
      defaultNavigationOptions={{
        gestureEnabled: false,
      }}
    >
      <HomeStack.Screen
        name="CoachHomeScreen"
        component={CoachHomeScreen}
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

      <HomeStack.Screen name="AddOwnFood" component={AddOwnFood} />
      <HomeStack.Screen name="OwnFoodList" component={OwnFoodList} />

      <HomeStack.Screen
        name="CoachInfo"
        component={CoachInfo}
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
        name="WorkoutDetails"
        component={WorkoutDetails}
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
      {/* <HomeStack.Screen
        name="EditPayments"
        component={EditPayments}
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
        name="AthleteHistory"
        component={AthleteHistory}
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
        name="Anthropometric"
        component={Anthropometric}
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
        name="MedicalAssessment"
        component={MedicalAssessment}
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
        name="LifestyleAssessment"
        component={LifestyleAssessment}
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
        name="AddNewPhysioAss"
        component={AddNewPhysioAss}
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
        name="TrainingAssessment"
        component={TrainingAssessment}
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
        name="Home"
        component={Home}
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
    </HomeStack.Navigator>
  );
};

const ChatNavigator = ({ navigation }) => {
  return (
    <ChatStack.Navigator
      initialRouteName="ChatHomeScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <ChatStack.Screen
        name="ChatHomeScreen"
        component={ChatHomeScreen}
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
      <ChatStack.Screen
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
      <ChatStack.Screen
        name="AthletesList"
        component={AthletesList}
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
    </ChatStack.Navigator>
  );
};

const NutritionNavigator = ({ navigation }) => {
  return (
    <NutritionStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <NutritionStack.Screen
        name="CoachNutrition"
        component={CoachNutrition}
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
        name="ViewAllNutrition"
        component={ViewAllNutrition}
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
        name="ViewAllSavedNutrition"
        component={ViewAllSavedNutrition}
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
        name="AssignNutrition"
        component={AssignNutrition}
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
      <NutritionStack.Screen
        name="Home"
        component={CoachHomeScreen}
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
      initialRouteName="WorkoutList"
      screenOptions={{
        headerShown: false,
      }}
    >
      <WorkoutStack.Screen
        name="WorkoutList"
        component={WorkoutList}
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
        name="CreateOwnWorkout"
        component={CreateOwnWorkout}
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
        name="OwnWorkouts"
        component={OwnWorkouts}
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
        name="EditOwnWorkout"
        component={EditOwnWorkout}
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
        name="LongTermWorkout"
        component={LongTermWorkout}
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
        name="Home"
        component={CoachHomeScreen}
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
        name="ViewAllSavedWorkouts"
        component={ViewAllSavedWorkouts}
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
        name="ViewAllLongTermWorkouts"
        component={ViewAllLongTermWorkouts}
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
        name="AddWorkout"
        component={AddWorkout}
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
    </WorkoutStack.Navigator>
  );
};

// const AdminNavigator = ({ navigation }) => {
//   return <AdminStack.Navigator></AdminStack.Navigator>;
// };

const CustomDrawerContentComponent = (props) => {
  const dispatch = useDispatch();
  const userData = useSelector(selectUserData);
  const [showSettings, setShowSettings] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  return (
    <SafeAreaView
      style={styles.container}
      forceInset={{ top: "always", horizontal: "never" }}
    >
      <ScrollView>
        <View style={styles.drawerHeader}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => props.navigation.navigate("CoachProfile")}
          >
            <Image
              style={styles.profileImage}
              source={{
                uri: userData?.data.imageUrl
                  ? userData?.data.imageUrl
                  : "https://firebasestorage.googleapis.com/v0/b/fitnessapp0.appspot.com/o/userImage.jpeg?alt=media&token=02e8cfe5-c866-4a4f-93ab-8c5930a5cd3c",
              }}
            />
          </TouchableOpacity>
          <View style={{ flex: 2, display: "flex", flexDirection: "column" }}>
            <Text style={styles.drawerHeaderText}>{userData?.data.name}</Text>
            <Text style={styles.drawerSubHeaderText}>Coach</Text>
            <TouchableHighlight
              onPress={() => {
                props.navigation.navigate("CoachProfile");
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
            props.navigation.navigate("Home", { screen: "CoachHomeScreen" });
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
            marginLeft: 10,
            borderRadius: 10,
            flexDirection: "row",
            marginTop: 10,
            paddingHorizontal: 10,
          }}
          activeOpacity={0.6}
          onPress={() => {
            props.navigation.navigate("Workout", { screen: "WorkoutList" });
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
            props.navigation.navigate("Nutrition", {
              screen: "CoachNutrition",
            });
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
            props.navigation.navigate("Athletes", { screen: "Athletes" });
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
            Athletes
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
            props.navigation.navigate("Messaging", {
              screen: "ChatHomeScreen",
            });
          }}
        >
          <Icon
            name="message"
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
          alignSelf:'center',
          borderRadius:10,
          bottom:100,
          width: "60%",
          backgroundColor: "#C19F1E",
          height: RFValue(52, 816),
          alignItems: "center",
          justifyContent: "center",
        }}
        // hitSlop={{
        //   top: RFValue(30, 816),
        //   bottom: RFValue(30, 816),
        //   left: RFValue(30, 816),
        //   right: RFValue(30, 816),
        // }}
        onPress={async () => {
          await removeTokenFromFirestore(userData.id);
          auth.signOut();
          dispatch(logout());
          /*
            const resetAction = StackActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({ routeName: 'LoginScreen' })],
            });
            props.navigation.dispatch(resetAction); 
            */
          props.navigation.dispatch(
            StackActions.replace("LoginScreen", { test: "Test Params" })
          );

          props.navigation.navigate("LoginScreen");
          props.navigation.closeDrawer();
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
        activeTintColor: "black",
        inactivebackgroundColor: "#C19F1E",
        inactiveTintColor: "black",
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
          drawerIcon: ({ tintColor }) => (
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
            <Image source={require("../assets/dumbell.png")} />
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
        name="Athletes"
        component={AthletesNavigator}
        options={{
          drawerIcon: ({ tintColor }) => (
            <Image
              source={require("../assets/user.png")}
              style={{ marginLeft: RFValue(5, 816), marginRight: 5 }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Messaging"
        component={ChatNavigator}
        options={{
          drawerIcon: ({ tintColor }) => (
            <Image
              source={require("../assets/message.png")}
              style={{
                marginLeft: RFValue(5, 816),
                marginRight: RFValue(10, 816),
              }}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="EditPaymentDetailsScreen"
        component={EditPaymentDetailsScreen}
        style={{ color: "black", backgroundColor: "#006D77" }}
        options={{
          drawerIcon: ({ tintColor }) => (
            <Image
              source={require("../assets/settings.png")}
              style={{ marginLeft: RFValue(5, 816), marginRight: 5 }}
            />
          ),
        }}
      />

      {/* <Drawer.Screen
        name="Settings"
        component={AdminNavigator}
        style={{ color: "black", backgroundColor: "#006D77" }}
        options={{
          drawerIcon: ({ tintColor }) => (
            <Image
              source={require("../assets/settings.png")}
              style={{ marginLeft:RFValue(5, 816), marginRight: 5 }}
            />
          ),
        }}
      /> */}
    </Drawer.Navigator>
  );
};

function CoachFlow() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "black",
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
    width: 60,
    textAlign: "center",
    height: 30,
  },
});

export default CoachFlow;
