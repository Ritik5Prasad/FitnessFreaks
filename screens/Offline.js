import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
  Dimensions,
  Platform,
  Alert,
} from "react-native";
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
import { useDispatch, useSelector } from "react-redux";
import {
  selectUserData,
  selectUser,
  selectTemperoryId,
  selectUserType,
  setTemperoryData,
} from "../features/userSlice";
import { db } from "../firebase";
//import NetInfo from "@react-native-community/netinfo";

import WorkoutCard from "./components/WorkoutCard";
import NutritionCard from "./components/NutritionCard";
import { Picker } from "@react-native-picker/picker";
import { TextInput as RNTextInput } from "react-native-paper";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Icon } from "react-native-elements";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import Marker from "react-native-image-marker";
import Share from "react-native-share";
import { deleteDoc } from "./functions/deleteDoc";
import { copyDoc } from "./functions/copyDoc";
import { moveDoc } from "./functions/moveDoc";
import RNPickerSelect from "react-native-picker-select";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import Notification from "./components/Notification";
import DocumentPicker from "react-native-document-picker";
import * as firebase from "firebase";
import { ActivityIndicator } from "react-native-paper";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Offline({ navigation }) {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const userType = useSelector(selectUserType);
  const temperoryId = useSelector(selectTemperoryId);
  const [phone, setphone] = useState("");
  const [email, setemail] = useState("");
  const [editable, seteditable] = useState(false);
  const [userData, setUserData] = useState(null);
  const [requestDate, setRequestDate] = useState();
  const [nutrition, setNutrition] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [pastWorkouts, setPastWorkouts] = useState([]);
  const [diet, setDiet] = useState("");
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);
  const [protein, setProtein] = useState(0);
  const [calories, setCalories] = useState(0);
  const [weight, setWeight] = useState(0);
  const [mealHistory, setMealHistory] = useState([]);

  const [imageUrl, setImageUrl] = useState(null);
  const [reload, setreload] = useState(true);
  const [isLoading, setisLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(null);

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: "#F6F6F6" }}
      contentContainerStyle={{ padding: 0, backgroundColor: "#F6F6F6" }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          padding: RFValue(20, 816),
          flex: 1,
          minHeight: ScreenHeight,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/*
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            style={{ paddingRight: 20 }}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-left" type="font-awesome-5" />
          </TouchableOpacity>

         
        <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                onPress={() => navigation.toggleDrawer()}
        />
        </View>

        <Notification navigation={navigation} />
       */}

        <Text>Please connect to a Network to continue</Text>
      </View>
    </KeyboardAwareScrollView>
  );
}
