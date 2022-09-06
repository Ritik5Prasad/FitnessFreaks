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
  Alert,
} from "react-native";
import { Checkbox } from "react-native-paper";

let ScreenWidth = Dimensions.get("window").width;
let ScreenHeight = Dimensions.get("window").height;
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Icon } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import {
  selectShowData,
  selectUser,
  selectUserDetails,
  setDbID,
  setUserDetails,
  selectTemperoryId,
  selectUserType,
} from "../features/userSlice";
import { db } from "../firebase";
import { Picker } from "@react-native-picker/picker";
import RNPickerSelect from "react-native-picker-select";
import { RadioButton } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Slider } from "react-native-elements";

const ParticularPhysiotherapy = ({ route, navigation }) => {
  const { therapy } = route.params;
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
            {therapy.Name} ({therapy.Date})
          </Text>
        </View>
        <View
          style={{
            marginTop: 40,
          }}
        >
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Sport Played/Recreational Activity:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.sports}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Physical Activity level:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Proficiency}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Hand/Foot Dominance:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.LimbUsage}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Uploaded Image:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.File}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Injury History:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.InjuryHistory.boolean}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Injury Name:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.InjuryHistory.InjuryHistoryText}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Current Complaints:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Complaints}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Current Illnesses:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.CurrentIllness}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Past Injuries:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.PastInjuries}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Past Illnesses:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.PastIllness}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Medical Conditions:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.MedicalCondition}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Current Medications:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.CurrentMedications}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Past Surgery:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.PastSurgery}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Allergies:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Allergies}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Orthotics:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Orthotics}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Your Sleep Score: {therapy.Psychosocial.Sleep}/5
          </Text>
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Your Work Pattern Score: {therapy.Psychosocial.WorkPattern}/5
          </Text>
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Your Stress and Anxiety Score:{" "}
            {therapy.Psychosocial.Stress_And_Anxiety}/5
          </Text>
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 20,
            }}
          >
            Timing of Pain:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Timing}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Sequence of Pain:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Sequence}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Mechanism of Injury:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Mechanism.Type}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Type of traumatic:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Mechanism.Reason}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Sequence of Pain:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Sequence}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Time to Increase:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.TimeToIncrease}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Time to Stay:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.TimeToStay}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Time to Reduce:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.TimeToReduce}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Nature of Pain:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Nature_Of_Pain}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Aggravating Causes:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Aggravating_Causes}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Relieving Causes:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Relieving_Causes}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Head Posture:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Head_Posture}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Left Shoulder Posture:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Left_Shoulder}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Right Shoulder Posture:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Right_Shoulder}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Thoracic Spine Posture:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Thoracic_Spine}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Lumbar Spine Posture:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Lumbar_Spine}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Left Knee Posture:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Left_Knee}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Right Knee Posture:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Right_Knee}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Right Foot Posture:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Right_Foot}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Left Foot Posture:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Left_Foot}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Foot Index:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.FootIndex}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 20,
            }}
          >
            Upper Quarter Tests:
          </Text>
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Internal Rotation at 90° Abduction in Supine ({">"}90):
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Internal_Rotation}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            External Rotation at 90° Abduction in Supine({">"}90):
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.External_Rotation}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Glenohumeral Internal Rotation Deficit (GIRD):
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Glenohumeral_Internal_Rotation}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            External Rotation Gain (ERG) +’ve when GIRD {">"} Ratio – Dominant
            Arm only :
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Internal_Rotation_Gain}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            H-K Impingement Test:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.HK_Impingement_Test}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Full Can Test:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Full_Can_Test}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Infraspinatus Strength Test :
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Infraspinatus_Strength_Test}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Kibler Lateral Slide Test :
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Kibler_Lateral_Side_Test}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Position 1 (≤ 1.5cms +/-) :
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Positionone}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Position 2 (≤ 1.5cms +/-) :
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Positiontwo}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Position 3 (≤ 1.5cms +/-) :
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Positionthree}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            SSMP/Scapular Balancing Index :
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Scapular}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Horizontal adduction test/ dugas sign - :
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Horizontal_Adduction}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Kims :
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Kims}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Biceps load 1 and 2 :
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Biceps_Load}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            O’brien test :
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Obrien_Test}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            CKUEST:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Ckuest}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Y-balance :
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Y_Balance}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Quadrant Test:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Quadrant_Test}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Trunk Side Flexion ROM:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Trunk_Side_Flexion_ROM}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Lumbar Spine ROM:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Lumbarspine}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Notes :
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Notes}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 20,
            }}
          >
            TEST LOWER Quarter:
          </Text>
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Hamstring Length at 90/90 - (≥ 160):
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Hamstring_Length_At_90_By_90}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Iliopsoas Muscle Length (≤ 5):
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Iliopsoas_Length}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Rectus Femoris Muscle Length (≥ 80):
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Recturs_Femoris_Length}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Hip Internal Rotation – Prone (≥ 30)
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Internalhip_Rotation}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Hip External Rotation – Prone (≥ 45)
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Externalhip_Rotation}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Hip Quadrant Test :
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Quadranthip}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Piriformis Muscle Length ({">"} 10) :
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Piriformis_Length}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            DF Lunge Test (≥ 10 cms):
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Lunge}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Posterior Impingement Test :
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Impingement_Posterior}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Single leg standing balance (eyes open/closed):
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Singleleg_Standing_Balance}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            OH Deep Squat:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.OH_Deep_Squat}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Single Leg Squat :
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Singlelegsquat}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Core stability push up/Core stability score:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Core_Stability_Push}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Ottawa Ankle Rule:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.Ottawa_Ankle_Rule}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 20,
            }}
          >
            Neural Testing
          </Text>
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            SLUMP:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.SLUMP}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            SLR:
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.SLR}
            editable={false}
          />
          <Text
            style={{
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            ULTTs :
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            value={therapy.ULTTs}
            editable={false}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default ParticularPhysiotherapy;
