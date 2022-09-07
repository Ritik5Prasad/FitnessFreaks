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
} from "react-native";

let ScreenWidth = Dimensions.get("window").width;
let ScreenHeight = Dimensions.get("window").height;
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Icon } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import {
  selectShowData,
  selectUser,
  selectUserData,
  selectUserDetails,
  setDbID,
  setUserDetails,
  selectTemperoryId,
  selectUserType,
} from "../features/userSlice";
import { db } from "../utils/firebase";
import { Picker } from "@react-native-picker/picker";
import RNPickerSelect from "react-native-picker-select";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const PreviousPhysiotherapy = ({ route, navigation }) => {
  const user = useSelector(selectUser);
  const userType = useSelector(selectUserType);
  const userData = useSelector(selectUserData);
  const temperoryId = useSelector(selectTemperoryId);
  const [getTherapys, setGetTheraphys] = useState([]);

  useEffect(() => {
    if (temperoryId) {
      db.collection("athletes")
        .doc(temperoryId)
        .collection("Physiotheraphy")
        // .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) =>
          setGetTheraphys(
            snapshot.docs.map((doc) => ({ id: doc.id, therapys: doc.data() }))
          )
        );
    } else {
      db.collection("athletes")
        .doc(userData?.id)
        .collection("Physiotheraphy")
        // .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) =>
          setGetTheraphys(
            snapshot.docs.map((doc) => ({ id: doc.id, therapys: doc.data() }))
          )
        );
    }
  }, [temperoryId]);

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      enableResetScrollToCoords={false}
    >
      <View
        style={{
          flex: 1,
          padding: RFValue(20, 816),
          marginBottom: 0,
          paddingTop: RFValue(20, 816),
          //   minHeight: ScreenHeight,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: RFValue(10, 816),
          }}
        >
          <TouchableOpacity
            style={{
              paddingRight: RFValue(20, 816),
            }}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Icon name="chevron-left" type="font-awesome-5" />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: RFValue(22, 816),
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
            }}
          >
            Previous Physiotherapy's
          </Text>
          {userType == "coach" && (
            <TouchableOpacity
              style={{
                marginLeft: 20,
                width: 40,
                height: 40,
                backgroundColor: "#C19F1E",
                borderRadius: 24,
              }}
              onPress={() => navigation.navigate("AddNewPhysioAss")}
            >
              <Icon
                name="plus"
                type="font-awesome-5"
                color="white"
                size={20}
                style={{
                  marginTop: 10,
                }}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {getTherapys.map(({ id, therapys }) => (
        <TouchableOpacity
          style={{
            width: 200,
            height: 50,
            borderRadius: 24,
            alignItems: "center",
            backgroundColor: "#ee664f",
            marginLeft: 20,
            marginTop: 20,
            textAlign: "center",
          }}
          onPress={() => {
            navigation.navigate("ParticularPhysiotherapy", {
              therapy: therapys,
            });
          }}
        >
          <Text
            style={{
              marginTop: 13,
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "white",
            }}
          >
            {therapys.Name} ({therapys.Date})
          </Text>
        </TouchableOpacity>
      ))}
    </KeyboardAwareScrollView>
  );
};

export default PreviousPhysiotherapy;
