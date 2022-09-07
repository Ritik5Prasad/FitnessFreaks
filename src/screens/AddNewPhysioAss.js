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
import Checkbox from "@react-native-community/checkbox";
import RadioButtonRN from "radio-buttons-react-native";
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
import { db } from "../utils/firebase";
import { Picker } from "@react-native-picker/picker";
import RNPickerSelect from "react-native-picker-select";
import { RadioButton } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Slider } from "react-native-elements";
import DocumentPicker from "react-native-document-picker";
import firebase from "firebase";

const AddNewPhysioAss = ({ route, navigation }) => {
  const [name, setName] = useState("");
  const [sport, setSport] = useState("");
  const user = useSelector(selectUser);
  const userType = useSelector(selectUserType);
  const temperoryId = useSelector(selectTemperoryId);
  const [date, setDate] = useState();
  const [date1, setDate1] = useState();

  const [Proficiency, SetProficiency] = useState("");
  const [Limb, SetLimb] = useState("");
  const [InjuryHistory, SetInjuryHistory] = useState("");
  const [File, SetFile] = useState("No File Uploaded!!");

  const [Diagnosis, SetDiagnosis] = useState("");
  const [Complaints, SetComplaints] = useState("");
  const [CurrentIllness, SetCurrentIllness] = useState("");
  const [PastInjuries, SetPastInjuries] = useState("");
  const [PastIllness, SetPastIllness] = useState("");
  const [AsthmaSelected, SetAsthmaSelected] = useState(false);
  const [HeadInjurySelected, SetHeadInjurySelected] = useState(false);
  const [EpilepsySelected, SetEpilepsySelected] = useState(false);
  const [FamilyHistorySelected, SetFamilyHistorySelected] = useState(false);
  const [DMSelected, SetDMSelected] = useState(false);
  const [CardiacDiseaseSelected, SetCardiacDiseaseSelected] = useState(false);
  const [NoneSelected, SetNoneSelected] = useState(false);

  const [PastSurgery, SetPastSurgery] = useState("");
  const [Allergies, SetAllergies] = useState("");
  const [Orthotics, SetOrthotics] = useState("");
  const [CurrentMedications, SetCurrentMedications] = useState("");
  const [sleep, setSleep] = useState(0);
  const [WorkPattern, setWorkPattern] = useState(0);
  const [Stress_And_Anxiety, setStress_And_Anxiety] = useState(0);
  const [Timing, SetTiming] = useState("");
  const [Sequence, SetSequence] = useState("");
  const [Trauma, SetTrauma] = useState("");
  const [Atrauma, SetAtrauma] = useState("Repetitive");
  const [PostOperative, SetPostOperative] = useState("");
  const [Mechanism, SetMechanism] = useState("");
  const [PainScore, SetPainScore] = useState(3);
  const [TimeToIncrease, SetTimeToIncrease] = useState("");
  const [TimeToStay, SetTimeToStay] = useState("");
  const [TimeToReduce, SetTimeToReduce] = useState("");
  const [OthersTrauma, SetOthersTrauma] = useState("");
  const [OthersAtrauma, SetOthersAtrauma] = useState("");
  const [Nature, SetNature] = useState("Pulling");
  const [Pulling, SetPulling] = useState(false);
  const [Aching, SetAching] = useState(false);
  const [Pins, SetPins] = useState(false);
  const [Radiating, SetRadiating] = useState(false);
  const [Pinching, SetPinching] = useState(false);
  const [Catch, SetCatch] = useState(false);
  const [Sore, SetSore] = useState(false);
  const [Depth, SetDepth] = useState("");
  const [DepthOther, SetDepthOther] = useState("");
  const [Head, SetHead] = useState("");

  const [Aggravating, SetAggravating] = useState("");
  const [Relieving, SetRelieveing] = useState("");

  const [Rest, SetRest] = useState(false);
  const [Move, SetMove] = useState(false);
  const [Ice, SetIce] = useState(false);
  const [Heat, SetHeat] = useState(false);
  const [Medication, SetMedication] = useState(false);
  const [Taping, SetTaping] = useState(false);
  const [Foam, SetFoam] = useState(false);
  const [Strech, SetStrech] = useState(false);
  const [Thoracic, SetThoracic] = useState("");
  const [Lumbar, SetLumbar] = useState("");
  const [LShoulder, SetLShoulder] = useState("");
  const [RShoulder, SetRShoulder] = useState("");
  const [Knee, SetKnee] = useState("");
  const [Rknee, SetRknee] = useState("");
  const [Rfoot, SetRfoot] = useState("");
  const [Lfoot, SetLfoot] = useState("");

  const [FootIndex, SetFootIndex] = useState("");

  const [Posterior, SetPosterior] = useState(false);
  const [Posteromedial, SetPosteromedial] = useState(false);
  const [Medial, SetMedial] = useState(false);
  const [Anteromedial, SetAnteromedial] = useState(false);
  const [Anterior, SetAnterior] = useState(false);
  const [Anterolateral, SetAnterolateral] = useState(false);
  const [Posterolateral, SetPosterolateral] = useState(false);
  const [Lateral, SetLateral] = useState(false);
  // const [Medical, SetMedical] = useState("");
  // const [Sleep, SetSleep] = useState(3);
  // const [Anxiety, SetAnxiety] = useState(3);
  // const [WorkPressure, SetWorkPressure] = useState(3);

  // const [MechanismReason, SetMechanismReason] = useState("");
  // const [MechanismOther, SetMechanismOther] = useState("");
  // const [Mechanism, SetMechanism] = useState("null");
  //

  const [Abduction, SetAbdcution] = useState("");
  const [Exrotation, SetExrotation] = useState("");
  const [Glenohumeral, SetGlenohumeral] = useState("");
  const [Rotationgain, SetRotationgain] = useState("");
  const [Infraspinatus, SetInfraspinatus] = useState("");
  const [Fullcan, SetFullcan] = useState("");
  const [Kibler, SetKibler] = useState("");
  const [Positionone, SetPositionone] = useState("");
  const [Positiontwo, SetPositiontwo] = useState("");
  const [Positionthree, SetPositionthree] = useState("");
  const [Scapular, SetScapular] = useState("");
  const [Adduction, SetAdduction] = useState("");
  const [Kims, SetKims] = useState("");
  const [Biceps, SetBiceps] = useState("");
  const [Brien, SetBrien] = useState("");
  const [Ckuest, SetCkuest] = useState("");
  const [Balance, SetBalance] = useState("");
  const [Hamstring, SetHamstring] = useState("");
  const [Iliopsoas, SetIliopsoas] = useState("");
  const [Femoris, SetFemoris] = useState("");
  const [Internalhip, SetInternalhip] = useState("");
  const [Externalhip, SetExternalhip] = useState("");
  const [Quadranthip, SetQuadranthip] = useState("");
  const [Lunge, SetLunge] = useState("");
  const [Stability, SetStability] = useState("");
  const [Piriformis, SetPiriformis] = useState("");
  const [Singleleg, SetSingleleg] = useState("");
  const [Singlelegsquat, SetSinglelegsquat] = useState("");
  const [Ottawa, SetOttawa] = useState("");
  const [Impingement, SetImpingement] = useState("");
  const [Squat, SetSquat] = useState("");
  const [Impingementp, SetImpingementp] = useState("");
  const [Trunk, SetTrunk] = useState("");
  const [Lumbarspine, SetLumbarspine] = useState("");
  const [Quadranttest, SetQuadranttest] = useState("");
  const [Notes, SetNotes] = useState("");
  const [SLUMP, SetSLUMP] = useState("");
  const [SLR, SetSLR] = useState("");
  const [ULTTs, SetULTTs] = useState("");
  const [videoData, setVideoData] = useState({});
  // const [Sustainedp, SetSustainedp] = useState("");
  // const [Sustainedg, SetSustainedg] = useState("");
  // const [Sustaineds, SetSustaineds] = useState("");
  // const [Dippingp, SetDippingp] = useState("");
  // const [Dippingg, SetDippingg] = useState("");
  // const [Dippings, SetDippings] = useState("");
  // const [Cessationp, SetCessationp] = useState("");
  // const [Cessationg, SetCessationg] = useState("");
  // const [Cessations, SetCessations] = useState("");

  useEffect(() => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    setDate(year + "-" + month + "-" + date);
  }, []);

  useEffect(() => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    setDate1(date + "/" + month + "/" + year);
  }, []);

  let checkboxes = "";
  let checkboxesthree = "";
  let checkboxestwo = "";
  let checkboxesfour = "";
  // useEffect(() => {
  //   if (NoneSelected == true) {
  //     checkboxes += "None";
  //     SetAsthmaSelected(false);
  //     SetFamilyHistorySelected(false);
  //     SetEpilepsySelected(false);
  //     SetHeadInjurySelected(false);
  //     SetDMSelected(false);
  //     SetCardiacDiseaseSelected(false);
  //   } else {
  //     if (AsthmaSelected == true) checkboxes += "Asthma ";
  //     if (HeadInjurySelected == true) checkboxes += "HeadInjury ";
  //     if (EpilepsySelected == true) checkboxes += "Epilepsy ";
  //     if (FamilyHistorySelected == true) checkboxes += "FamilyHistory ";
  //     if (DMSelected == true) checkboxes += "DM ";
  //     if (CardiacDiseaseSelected == true) checkboxes += "CardiacDisease ";
  //   }
  // }, [
  //   AsthmaSelected,
  //   HeadInjurySelected,
  //   EpilepsySelected,
  //   FamilyHistorySelected,
  //   DMSelected,
  //   CardiacDiseaseSelected,
  //   NoneSelected,
  // ]);

  // useEffect(() => {
  //   if (Pulling == true) checkboxesthree += "Pulling ";
  //   if (Aching == true) checkboxesthree += "Aching ";
  //   if (Pins == true) checkboxesthree += "Pins and Needles ";
  //   if (Radiating == true) checkboxesthree += "Radiating ";
  //   if (Pinching == true) checkboxesthree += "Catch or hold ";
  //   if (Catch == true) checkboxesthree += "CardiacDisease ";
  //   if (Sore == true) checkboxesthree += "Soreness ";
  // }, [Pulling, Aching, Pins, Radiating, Pinching, Catch, Sore]);

  // useEffect(() => {
  //   if (Rest == true) checkboxestwo += "Rest ";
  //   if (Move == true) checkboxestwo += "Movement ";
  //   if (Ice == true) checkboxestwo += "Ice ";
  //   if (Heat == true) checkboxestwo += "Heat ";
  //   if (Medication == true) checkboxestwo += "Medication ";
  //   if (Taping == true) checkboxestwo += "Taping ";
  //   if (Foam == true) checkboxestwo += "Foam Rolling ";
  //   if (Strech == true) checkboxestwo += "Stretching ";
  // }, [Rest, Move, Ice, Heat, Medication, Taping, Foam, Strech]);

  // useEffect(() => {
  //   if (Posterior == true) checkboxesfour += "Posterior ";
  //   if (Posteromedial == true) checkboxesfour += "Posteromedial ";
  //   if (Medial == true) checkboxesfour += "Medial ";
  //   if (Anteromedial == true) checkboxesfour += "Anteromedial ";
  //   if (Anterior == true) checkboxesfour += "Anterior ";
  //   if (Anterolateral == true) checkboxesfour += "Anterolateral ";
  //   if (Posterolateral == true) checkboxesfour += "Posterolateral ";
  //   if (Lateral == true) checkboxesfour += "Lateral ";
  // }, [
  //   Posterior,
  //   Posteromedial,
  //   Medial,
  //   Anteromedial,
  //   Anterior,
  //   Anterolateral,
  //   Posterolateral,
  //   Lateral,
  // ]);

  const onSave = () => {
    if (NoneSelected == true) {
      checkboxes += "None";
    } else {
      if (AsthmaSelected == true) checkboxes += "Asthma ";
      if (HeadInjurySelected == true) checkboxes += "HeadInjury ";
      if (EpilepsySelected == true) checkboxes += "Epilepsy ";
      if (FamilyHistorySelected == true) checkboxes += "FamilyHistory ";
      if (DMSelected == true) checkboxes += "DM ";
      if (CardiacDiseaseSelected == true) checkboxes += "CardiacDisease ";
    }

    if (Pulling == true) checkboxesthree += "Pulling ";
    if (Aching == true) checkboxesthree += "Aching ";
    if (Pins == true) checkboxesthree += "Pins and Needles ";
    if (Radiating == true) checkboxesthree += "Radiating ";
    if (Pinching == true) checkboxesthree += "Catch or hold ";
    if (Catch == true) checkboxesthree += "CardiacDisease ";
    if (Sore == true) checkboxesthree += "Soreness ";

    if (Rest == true) checkboxestwo += "Rest ";
    if (Move == true) checkboxestwo += "Movement ";
    if (Ice == true) checkboxestwo += "Ice ";
    if (Heat == true) checkboxestwo += "Heat ";
    if (Medication == true) checkboxestwo += "Medication ";
    if (Taping == true) checkboxestwo += "Taping ";
    if (Foam == true) checkboxestwo += "Foam Rolling ";
    if (Strech == true) checkboxestwo += "Stretching ";

    if (Posterior == true) checkboxesfour += "Posterior ";
    if (Posteromedial == true) checkboxesfour += "Posteromedial ";
    if (Medial == true) checkboxesfour += "Medial ";
    if (Anteromedial == true) checkboxesfour += "Anteromedial ";
    if (Anterior == true) checkboxesfour += "Anterior ";
    if (Anterolateral == true) checkboxesfour += "Anterolateral ";
    if (Posterolateral == true) checkboxesfour += "Posterolateral ";
    if (Lateral == true) checkboxesfour += "Lateral ";

    db.collection("athletes")
      .doc(temperoryId)
      .collection("Physiotheraphy")
      .doc(date)
      .set({
        Name: name,
        temperoryId: temperoryId,
        sports: sport,
        Date: date1,
        Proficiency: Proficiency,
        LimbUsage: Limb,
        InjuryHistory: {
          boolean: InjuryHistory,
          InjuryHistoryText: Diagnosis,
        },
        Complaints: Complaints,
        File: File,
        CurrentIllness: CurrentIllness,
        PastInjuries: PastInjuries,
        PastIllness: PastIllness,
        MedicalCondition: checkboxes,
        PastSurgery: PastSurgery,
        Allergies: Allergies,
        Orthotics: Orthotics,
        CurrentMedications: CurrentMedications,
        Psychosocial: {
          Sleep: sleep,
          WorkPattern: WorkPattern,
          Stress_And_Anxiety: Stress_And_Anxiety,
        },
        Timing: Timing,
        Sequence: Sequence,
        TimeToIncrease: TimeToIncrease,
        TimeToStay: TimeToStay,
        TimeToReduce: TimeToReduce,
        Mechanism: {
          Type: Mechanism,
          Reason: Trauma || Atrauma,
          OtherReason: OthersTrauma || OthersAtrauma,
        },
        PostOperative: {
          Surgery_Name: PostOperative,
          Pain_Score: PainScore,
        },
        Depth: {
          Depth_Type: Depth,
          Other_type: DepthOther,
        },
        Aggravating_Causes: Aggravating,
        Relieving_Causes: checkboxestwo,
        Pain_diagram: checkboxesfour,
        Nature_Of_Pain: checkboxesthree,
        Head_Posture: Head,
        Left_Shoulder: LShoulder,
        Right_Shoulder: RShoulder,
        Thoracic_Spine: Thoracic,
        Lumbar_Spine: Lumbar,
        Right_Knee: Rknee,
        Left_Knee: Knee,
        Left_Foot: Lfoot,
        Right_Foot: Rfoot,
        FootIndex: FootIndex,
        //
        Internal_Rotation: Abduction,
        External_Rotation: Exrotation,
        Glenohumeral_Internal_Rotation: Glenohumeral,
        Internal_Rotation_Gain: Rotationgain,
        HK_Impingement_Test: Impingement,
        Full_Can_Test: Fullcan,
        Infraspinatus_Strength_Test: Infraspinatus,
        Kibler_Lateral_Side_Test: Kibler,
        Positionone: Positionone,
        Positionthree: Positionthree,
        Positiontwo: Positiontwo,
        Scapular: Scapular,
        Horizontal_Adduction: Adduction,
        Kims: Kims,
        Biceps_Load: Biceps,
        Obrien_Test: Brien,
        Ckuest: Ckuest,
        Y_Balance: Balance,
        Quadrant_Test: Quadranttest,
        Trunk_Side_Flexion_ROM: Trunk,
        Lumbarspine: Lumbarspine,
        Notes: Notes,
        Hamstring_Length_At_90_By_90: Hamstring,
        Iliopsoas_Length: Iliopsoas,
        Recturs_Femoris_Length: Femoris,
        Externalhip_Rotation: Externalhip,
        Internalhip_Rotation: Internalhip,
        Quadranthip: Quadranthip,
        Piriformis_Length: Piriformis,
        Lunge: Lunge,
        Impingement_Posterior: Impingementp,
        Singleleg_Standing_Balance: Singleleg,
        OH_Deep_Squat: Squat,
        Singlelegsquat: Singlelegsquat,
        Core_Stability_Push: Stability,
        Ottawa_Ankle_Rule: Ottawa,
        SLUMP: SLUMP,
        SLR: SLR,
        ULTTs: ULTTs,
        videoId: videoData.uri ? videoData.uri : "",
      })
      .then(() => {
        Alert.alert("Form Submitted Successfully");
        navigation.navigate("PreviousPhysiotherapy");
      });
  };

  const videoHandler = async () => {
    try {
      // const res = await DocumentPicker.pick({
      //   type: [DocumentPicker.types["video"]],
      // });
      const option = { mediaType: "video" };

      const res = await launchImageLibrary(option);
      var newData = res.assets[0];
      var filename = newData.uri.substring(newData.uri.lastIndexOf("/") + 1);
      newData.name = filename;

      // setVideoData(res);
      videoUploader(newData);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  const videoUploader = (video) => {
    var formData = new FormData();
    formData.append("title", "psycho-" + new Date().toString());
    formData.append("description", "psycho-" + new Date().toString());
    formData.append("video", {
      uri: video.uri,
      type: video.type,
      name: video.name,
    });
    let headers = {
      "Content-Type": "multipart/form-data", // this is a imp line
    };
    let obj = {
      method: "POST",
      headers: headers,
      body: formData,
    };
    let url1 = "https://ritikp-server.herokuapp.com/api/upload/video";
    fetch(url1, obj) // put your API URL here
      .then((resp) => {
        console.log(1);
        let json = null;

        console.log("r", resp);
        json = resp.json();
        console.log(" Response", json);
        if (resp.ok) {
          return json;
        }
        return json.then((err) => {
          console.log("error :", err);
          throw err;
        });
      })
      .then((json) => {
        if (json.success) {
          console.log(
            json,
            // firebase.firestore.FieldValue.serverTimestamp(),
            setVideoData(json)
          );
        }
      });
  };

  const data1 = [
    {
      label: "Professional",
    },
    {
      label: "Recreational",
    },
  ];

  const data2 = [
    {
      label: "Left",
    },
    {
      label: "Right",
    },
  ];

  const data3 = [
    {
      label: "Yes",
    },
    {
      label: "No",
    },
  ];

  const data4 = [
    {
      label: "Acute",
    },
    {
      label: "Chronic",
    },
    {
      label: "Acute and Chronic",
    },
  ];

  const data5 = [
    {
      label: "Traumatic",
    },
    {
      label: "Atraumatic",
    },
    {
      label: "Post Operative",
    },
  ];

  const data6 = [
    {
      label: "Superficial",
    },
    {
      label: "Deep",
    },
    {
      label: "Others",
    },
  ];

  const data7 = [
    {
      label: "Neutral",
    },
    {
      label: "Forward",
    },
  ];

  const data8 = [
    {
      label: "Neutral",
    },
    {
      label: "Elevated",
    },
    {
      label: "Depressed Neutral",
    },
    {
      label: "Rounded",
    },
  ];

  const data9 = [
    {
      label: "Neutral",
    },
    {
      label: "Elevated",
    },
    {
      label: "Depressed Neutral",
    },
    {
      label: "Rounded",
    },
  ];

  const data10 = [
    {
      label: "Neutral",
    },
    {
      label: "Flattened",
    },
    {
      label: "Kyphosis Scoliosis",
    },
  ];

  const data11 = [
    {
      label: "Neutral",
    },
    {
      label: "Increased",
    },
    {
      label: "Decreased Lordosis",
    },
  ];

  const data12 = [
    {
      label: "Neutral",
    },
    {
      label: "Varus",
    },
    {
      label: "Valgus",
    },
  ];

  const data13 = [
    {
      label: "Neutral",
    },
    {
      label: "Varus",
    },
    {
      label: "Valgus",
    },
  ];

  const data14 = [
    {
      label: "Flat",
    },
    {
      label: "Medical Arch",
    },
    {
      label: "Pronated",
    },
  ];

  const data15 = [
    {
      label: "Flat",
    },
    {
      label: "Medical Arch",
    },
    {
      label: "Pronated",
    },
  ];

  const data16 = [
    {
      label: "Positive",
    },
    {
      label: "Negative",
    },
  ];

  const data17 = [
    {
      label: "Positive",
    },
    {
      label: "Negative",
    },
  ];

  const data18 = [
    {
      label: "+≤ 3.0cms",
    },
    {
      label: "-≤ 3.0cms",
    },
  ];

  const data19 = [
    {
      label: "> +5.0cms",
    },
    {
      label: "-2.0cms",
    },
  ];

  const data20 = [
    {
      label: "Positive",
    },
    {
      label: "Negative",
    },
  ];

  const data21 = [
    {
      label: "Positive",
    },
    {
      label: "Negative",
    },
  ];

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
            Add a new assessment
          </Text>
          <TouchableOpacity
            style={{
              marginLeft: 20,
            }}
            onPress={() => {
              //   navigation.goBack();
            }}
          ></TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: 40,
          }}
        >
          <View>
            <Text
              style={{
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
              }}
            >
              Name
            </Text>
            <TextInput
              style={{
                height: 40,
                margin: 12,
                borderWidth: 1,
                padding: 10,
              }}
              placeholder="Physiotherapy Name"
              value={name}
              onChangeText={setName}
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
              Sport Played/Recreational Activity:
            </Text>
            <TextInput
              style={{
                height: 40,
                margin: 12,
                borderWidth: 1,
                padding: 10,
              }}
              placeholder="Sport Played/Recreational Activity:"
              value={sport}
              onChangeText={setSport}
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
            <View
              style={{
                marginTop: 10,
                marginLeft: 10,
                marginRight: 10,
              }}
            >
              {/* <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                  marginLeft: 10,
                }}
              >
                <RadioButton
                  value="Professional"
                  status={
                    Proficiency === "Professional" ? "checked" : "unchecked"
                  }
                  onPress={() => SetProficiency("Professional")}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Professional
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                  marginLeft: 10,
                }}
              >
                <RadioButton
                  value="Recreational"
                  status={
                    Proficiency === "Recreational" ? "checked" : "unchecked"
                  }
                  onPress={() => SetProficiency("Recreational")}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Recreational
                </Text>
              </View> */}
              <RadioButtonRN
                activeColor={"#C19F1E"}
                deactiveColor={"grey"}
                data={data1}
                box={false}
                selectedBtn={(e) => SetProficiency(e.label)}
              />
            </View>
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
            <View
              style={{
                marginTop: 10,
                marginLeft: 10,
                marginRight: 10,
              }}
            >
              {/* <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                  marginLeft: 10,
                }}
              >
                <RadioButton
                  value="Left"
                  status={Limb === "Left" ? "checked" : "unchecked"}
                  onPress={() => SetLimb("Left")}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Left
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                  marginLeft: 10,
                }}
              >
                <RadioButton
                  value="Right"
                  status={Limb === "Right" ? "checked" : "unchecked"}
                  onPress={() => SetLimb("Right")}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Right
                </Text>
              </View> */}
              <RadioButtonRN
                activeColor={"#C19F1E"}
                deactiveColor={"grey"}
                data={data2}
                box={false}
                selectedBtn={(e) => SetLimb(e.label)}
              />
            </View>
            <Text
              style={{
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
                marginTop: 10,
              }}
            >
              Injury/Illness History:
            </Text>
            <View
              style={{
                marginTop: 10,
                marginLeft: 10,
                marginRight: 10,
              }}
            >
              {/* <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                  marginLeft: 10,
                }}
              >
                <RadioButton
                  value="Yes"
                  status={InjuryHistory === "Yes" ? "checked" : "unchecked"}
                  onPress={() => SetInjuryHistory("Yes")}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Yes
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                  marginLeft: 10,
                }}
              >
                <RadioButton
                  value="No"
                  status={InjuryHistory === "No" ? "checked" : "unchecked"}
                  onPress={() => SetInjuryHistory("No")}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  No
                </Text>
              </View> */}
              <RadioButtonRN
                activeColor={"#C19F1E"}
                deactiveColor={"grey"}
                data={data3}
                box={false}
                selectedBtn={(e) => SetInjuryHistory(e.label)}
              />
            </View>
            {InjuryHistory == "Yes" && (
              <View
                style={{
                  marginTop: 10,
                }}
              >
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    fontWeight: "bold",
                    color: "black",
                    marginLeft: 10,
                  }}
                >
                  Provisional Diagnosis:
                </Text>
                <TextInput
                  style={{
                    height: 40,
                    margin: 12,
                    borderWidth: 1,
                    padding: 10,
                  }}
                  placeholder="Diagnosis Name"
                  value={Diagnosis}
                  onChangeText={SetDiagnosis}
                />
              </View>
            )}
            <View
              style={{
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: "SF-Pro-Text-regular",
                  fontWeight: "bold",
                  color: "black",
                  marginLeft: 10,
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
                placeholder="Current Complaints:"
                value={Complaints}
                onChangeText={SetComplaints}
              />
            </View>
            <View>
              <Text
                style={{
                  fontFamily: "SF-Pro-Text-regular",
                  fontWeight: "bold",
                  color: "black",
                  marginLeft: 10,
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
                placeholder="Current Illnesses:"
                value={CurrentIllness}
                onChangeText={SetCurrentIllness}
              />
            </View>
            <View>
              <Text
                style={{
                  fontFamily: "SF-Pro-Text-regular",
                  fontWeight: "bold",
                  color: "black",
                  marginLeft: 10,
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
                placeholder="Past Injuries:"
                value={PastInjuries}
                onChangeText={SetPastInjuries}
              />
            </View>
            <View>
              <Text
                style={{
                  fontFamily: "SF-Pro-Text-regular",
                  fontWeight: "bold",
                  color: "black",
                  marginLeft: 10,
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
                placeholder="Past Illnesses:"
                value={PastIllness}
                onChangeText={SetPastIllness}
              />
            </View>
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
            <View
              style={{
                marginTop: 10,
                marginLeft: 10,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Checkbox
                  tintColors={{ true: "#C19F1E", false: "#C19F1E" }}
                  disabled={false}
                  value={AsthmaSelected}
                  onValueChange={(newValue) => SetAsthmaSelected(newValue)}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Asthma
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: Platform.OS === "ios" ? 10 : 0,
                }}
              >
                <Checkbox
                  tintColors={{ true: "#C19F1E", false: "#C19F1E" }}
                  disabled={false}
                  value={HeadInjurySelected}
                  onValueChange={(newValue) => SetHeadInjurySelected(newValue)}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Head Injury
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: Platform.OS === "ios" ? 10 : 0,
                }}
              >
                <Checkbox
                  tintColors={{ true: "#C19F1E", false: "#C19F1E" }}
                  disabled={false}
                  value={EpilepsySelected}
                  onValueChange={(newValue) => SetEpilepsySelected(newValue)}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Epilepsy
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: Platform.OS === "ios" ? 10 : 0,
                }}
              >
                <Checkbox
                  tintColors={{ true: "#C19F1E", false: "#C19F1E" }}
                  disabled={false}
                  value={FamilyHistorySelected}
                  onValueChange={(newValue) =>
                    SetFamilyHistorySelected(newValue)
                  }
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Family History
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: Platform.OS === "ios" ? 10 : 0,
                }}
              >
                <Checkbox
                  tintColors={{ true: "#C19F1E", false: "#C19F1E" }}
                  disabled={false}
                  value={DMSelected}
                  onValueChange={(newValue) => SetDMSelected(newValue)}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  DM
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: Platform.OS === "ios" ? 10 : 0,
                }}
              >
                <Checkbox
                  tintColors={{ true: "#C19F1E", false: "#C19F1E" }}
                  disabled={false}
                  value={CardiacDiseaseSelected}
                  onValueChange={(newValue) =>
                    SetCardiacDiseaseSelected(newValue)
                  }
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Cardiac Disease
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: Platform.OS === "ios" ? 10 : 0,
                }}
              >
                <Checkbox
                  tintColors={{ true: "#C19F1E", false: "#C19F1E" }}
                  disabled={false}
                  value={NoneSelected}
                  onValueChange={(newValue) => SetNoneSelected(newValue)}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  None
                </Text>
              </View>
            </View>
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
              placeholder="Current Medications: Example aspirin"
              value={CurrentMedications}
              onChangeText={SetCurrentMedications}
            />
            <Text
              style={{
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
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
              placeholder="Past Surgery:"
              value={PastSurgery}
              onChangeText={SetPastSurgery}
            />
            <Text
              style={{
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
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
              placeholder=" Allergies:"
              value={Allergies}
              onChangeText={SetAllergies}
            />
            <Text
              style={{
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
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
              placeholder="Orthotics:"
              value={Orthotics}
              onChangeText={SetOrthotics}
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
              Psychosocial:
            </Text>
            <View
              style={{
                width: 300,
                marginLeft: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: "SF-Pro-Text-regular",
                  fontWeight: "bold",
                  color: "black",
                  marginLeft: 10,
                  marginTop: 15,
                }}
              >
                Rate Your Sleep Between 1 to 5
              </Text>
              <Slider
                value={sleep}
                onValueChange={setSleep}
                maximumValue={5}
                minimumValue={1}
                step={1}
                allowTouchTrack
                trackStyle={{ height: 5, backgroundColor: "transparent" }}
                thumbStyle={{
                  height: 10,
                  width: 10,
                  backgroundColor: "transparent",
                }}
                thumbProps={{
                  children: (
                    <Icon
                      name="circle"
                      type="font-awesome"
                      size={10}
                      reverse
                      containerStyle={{ bottom: 15, right: 10 }}
                    />
                  ),
                }}
              />
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  1
                </Text>
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  2
                </Text>
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  3
                </Text>
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  4
                </Text>
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  5
                </Text>
              </View>
            </View>
            <View
              style={{
                width: 300,
                marginLeft: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: "SF-Pro-Text-regular",
                  fontWeight: "bold",
                  color: "black",
                  marginLeft: 10,
                  marginTop: 15,
                }}
              >
                Rate Your Work Pattern Between 1 to 5
              </Text>
              <Slider
                value={WorkPattern}
                onValueChange={setWorkPattern}
                maximumValue={5}
                minimumValue={1}
                step={1}
                allowTouchTrack
                trackStyle={{ height: 5, backgroundColor: "transparent" }}
                thumbStyle={{
                  height: 10,
                  width: 10,
                  backgroundColor: "transparent",
                }}
                thumbProps={{
                  children: (
                    <Icon
                      name="circle"
                      type="font-awesome"
                      size={10}
                      reverse
                      containerStyle={{ bottom: 15, right: 10 }}
                    />
                  ),
                }}
              />
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  1
                </Text>
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  2
                </Text>
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  3
                </Text>
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  4
                </Text>
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  5
                </Text>
              </View>
            </View>
            <View
              style={{
                width: 300,
                marginLeft: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: "SF-Pro-Text-regular",
                  fontWeight: "bold",
                  color: "black",
                  marginLeft: 10,
                  marginTop: 15,
                }}
              >
                Rate Your Stress and Anxiety Between 1 to 5
              </Text>
              <Slider
                value={Stress_And_Anxiety}
                onValueChange={setStress_And_Anxiety}
                maximumValue={5}
                minimumValue={1}
                step={1}
                allowTouchTrack
                trackStyle={{ height: 5, backgroundColor: "transparent" }}
                thumbStyle={{
                  height: 10,
                  width: 10,
                  backgroundColor: "transparent",
                }}
                thumbProps={{
                  children: (
                    <Icon
                      name="circle"
                      type="font-awesome"
                      size={10}
                      reverse
                      containerStyle={{ bottom: 15, right: 10 }}
                    />
                  ),
                }}
              />
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  1
                </Text>
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  2
                </Text>
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  3
                </Text>
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  4
                </Text>
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  5
                </Text>
              </View>
            </View>
            <View
              style={{
                marginLeft: 10,
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: "SF-Pro-Text-regular",
                  fontWeight: "bold",
                  color: "black",
                  marginTop: 10,
                }}
              >
                Areas Of Pain:
              </Text>
              <Text
                style={{
                  fontFamily: "SF-Pro-Text-regular",

                  color: "black",
                  marginTop: 10,
                }}
              >
                Timing:
              </Text>
              <View
                style={{
                  marginTop: 10,
                }}
              >
                {/* <View
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <RadioButton
                    value="Acute"
                    status={Timing === "Acute" ? "checked" : "unchecked"}
                    onPress={() => SetTiming("Acute")}
                  />
                  <Text
                    style={{
                      fontFamily: "SF-Pro-Text-regular",
                      color: "black",
                    }}
                  >
                    Acute
                  </Text>
                </View> */}

                {/* <View
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <RadioButton
                    value="Chronic"
                    status={Timing === "Chronic" ? "checked" : "unchecked"}
                    onPress={() => SetTiming("Chronic")}
                  />
                  <Text
                    style={{
                      fontFamily: "SF-Pro-Text-regular",
                      color: "black",
                    }}
                  >
                    Chronic
                  </Text>
                </View> */}

                {/* <View
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <RadioButton
                    value="AcuteandChronic"
                    status={
                      Timing === "Acute and Chronic" ? "checked" : "unchecked"
                    }
                    onPress={() => SetTiming("Acute and Chronic")}
                  />
                  <Text
                    style={{
                      fontFamily: "SF-Pro-Text-regular",
                      color: "black",
                    }}
                  >
                    Acute and Chronic
                  </Text>
                </View> */}

                <RadioButtonRN
                  activeColor={"#C19F1E"}
                  deactiveColor={"grey"}
                  data={data4}
                  box={false}
                  selectedBtn={(e) => SetTiming(e.label)}
                />
              </View>
              <Text
                style={{
                  fontFamily: "SF-Pro-Text-regular",
                  fontWeight: "bold",
                  color: "black",
                  marginTop: 10,
                }}
              >
                Sequence of Pain Onset:
              </Text>
              <TextInput
                style={{
                  height: 40,
                  borderWidth: 1,
                  padding: 10,
                  marginTop: 10,
                  margin: 10,
                }}
                placeholder="Enter Sequence of Pain Onset:"
                value={Sequence}
                onChangeText={SetSequence}
              />
            </View>
            <Text
              style={{
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                color: "black",
                marginTop: 10,
                marginLeft: 10,
              }}
            >
              Mechanism of Injury:
            </Text>

            <View
              style={{
                marginTop: 10,
                marginLeft: 10,
              }}
            >
              {/* <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="Traumatic"
                  status={Mechanism == "Traumatic" ? "checked" : "unchecked"}
                  onPress={() => SetMechanism("Traumatic")}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Traumatic
                </Text>
              </View> */}

              {/* <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="Atraumatic"
                  status={Mechanism == "Atraumatic" ? "checked" : "unchecked"}
                  onPress={() => SetMechanism("Atraumatic")}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Atraumatic
                </Text>
              </View> */}
              {/* <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="Post Operative"
                  status={
                    Mechanism == "Post Operative" ? "checked" : "unchecked"
                  }
                  onPress={() => SetMechanism("Post Operative")}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Post Operative
                </Text>
              </View> */}
              <RadioButtonRN
                activeColor={"#C19F1E"}
                deactiveColor={"grey"}
                data={data5}
                box={false}
                selectedBtn={(e) => SetMechanism(e.label)}
              />
            </View>
            {Mechanism == "Traumatic" && (
              <View>
                <Picker
                  selectedValue={Trauma}
                  style={{ height: 50, width: 250 }}
                  onValueChange={(itemValue, itemIndex) => SetTrauma(itemValue)}
                >
                  <Picker.Item
                    label="Impact with equipment"
                    value="Impact with equipment"
                  />
                  <Picker.Item
                    label="Impact with person"
                    value="Impact with person"
                  />
                  <Picker.Item label="Fall" value="Fall" />
                  <Picker.Item
                    label="Surface Interaction"
                    value="Surface Interaction"
                  />
                  <Picker.Item label="Others" value="Others" />
                </Picker>
                {Trauma == "Others" && (
                  <View>
                    <Text
                      style={{
                        fontFamily: "SF-Pro-Text-regular",
                        fontWeight: "bold",
                        color: "black",
                        marginLeft: 10,
                      }}
                    >
                      Others
                    </Text>
                    <TextInput
                      style={{
                        height: 40,
                        margin: 12,
                        borderWidth: 1,
                        padding: 10,
                      }}
                      placeholder="Enter Orthotics"
                      value={OthersTrauma}
                      onChangeText={SetOthersTrauma}
                    />
                  </View>
                )}
              </View>
            )}
            {Mechanism == "Atraumatic" && (
              <View>
                <Picker
                  selectedValue={Atrauma}
                  style={{ height: 50, width: 250 }}
                  onValueChange={(itemValue, itemIndex) =>
                    SetAtrauma(itemValue)
                  }
                >
                  <Picker.Item label="Repetitive" value="Repetitive" />
                  <Picker.Item label="CTD/Overuse" value="CTD/Overuse" />
                  <Picker.Item label="Fall" value="Fall" />
                  <Picker.Item label="Equipment" value="Equipment" />
                  <Picker.Item label="Technique" value="Technique" />
                  <Picker.Item label="Systemic" value="Systemic" />
                  <Picker.Item label="Others" value="Others" />
                </Picker>
                {Atrauma == "Others" && (
                  <View>
                    <Text
                      style={{
                        fontFamily: "SF-Pro-Text-regular",
                        fontWeight: "bold",
                        color: "black",
                        marginLeft: 10,
                      }}
                    >
                      Others
                    </Text>
                    <TextInput
                      style={{
                        height: 40,
                        margin: 12,
                        borderWidth: 1,
                        padding: 10,
                      }}
                      placeholder="Atraumatic Injury"
                      value={OthersAtrauma}
                      onChangeText={SetOthersAtrauma}
                    />
                  </View>
                )}
              </View>
            )}
            {Mechanism == "Post Operative" && (
              <View>
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    fontWeight: "bold",
                    color: "black",
                    marginLeft: 10,
                    marginTop: 10,
                  }}
                >
                  Name Of Surgery
                </Text>
                <TextInput
                  style={{
                    height: 40,
                    margin: 12,
                    borderWidth: 1,
                    padding: 10,
                  }}
                  placeholder="Enter Name Of Surgery"
                  value={PostOperative}
                  onChangeText={SetPostOperative}
                />
                <View
                  style={{
                    width: 300,
                    marginLeft: 10,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "SF-Pro-Text-regular",
                      fontWeight: "bold",
                      color: "black",
                      marginLeft: 10,
                      marginTop: 15,
                    }}
                  >
                    Pain Score 0-10
                  </Text>
                  <Slider
                    value={PainScore}
                    onValueChange={SetPainScore}
                    maximumValue={10}
                    minimumValue={0}
                    step={1}
                    allowTouchTrack
                    trackStyle={{ height: 5, backgroundColor: "transparent" }}
                    thumbStyle={{
                      height: 10,
                      width: 10,
                      backgroundColor: "transparent",
                    }}
                    thumbProps={{
                      children: (
                        <Icon
                          name="circle"
                          type="font-awesome"
                          size={10}
                          reverse
                          containerStyle={{ bottom: 15, right: 10 }}
                        />
                      ),
                    }}
                  />
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginLeft: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "SF-Pro-Text-regular",
                        color: "black",
                      }}
                    >
                      0
                    </Text>
                    <Text
                      style={{
                        fontFamily: "SF-Pro-Text-regular",
                        color: "black",
                      }}
                    >
                      1
                    </Text>
                    <Text
                      style={{
                        fontFamily: "SF-Pro-Text-regular",
                        color: "black",
                      }}
                    >
                      2
                    </Text>
                    <Text
                      style={{
                        fontFamily: "SF-Pro-Text-regular",
                        color: "black",
                      }}
                    >
                      3
                    </Text>
                    <Text
                      style={{
                        fontFamily: "SF-Pro-Text-regular",
                        color: "black",
                      }}
                    >
                      4
                    </Text>
                    <Text
                      style={{
                        fontFamily: "SF-Pro-Text-regular",
                        color: "black",
                      }}
                    >
                      5
                    </Text>
                    <Text
                      style={{
                        fontFamily: "SF-Pro-Text-regular",
                        color: "black",
                      }}
                    >
                      6
                    </Text>
                    <Text
                      style={{
                        fontFamily: "SF-Pro-Text-regular",
                        color: "black",
                      }}
                    >
                      7
                    </Text>
                    <Text
                      style={{
                        fontFamily: "SF-Pro-Text-regular",
                        color: "black",
                      }}
                    >
                      8
                    </Text>
                    <Text
                      style={{
                        fontFamily: "SF-Pro-Text-regular",
                        color: "black",
                      }}
                    >
                      9
                    </Text>
                    <Text
                      style={{
                        fontFamily: "SF-Pro-Text-regular",
                        color: "black",
                      }}
                    >
                      10
                    </Text>
                  </View>
                </View>
              </View>
            )}
            <Text
              style={{
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
                marginTop: 10,
              }}
            >
              Time to increase:
            </Text>
            <TextInput
              style={{
                height: 40,
                margin: 12,
                borderWidth: 1,
                padding: 10,
              }}
              placeholder="Time to increase:"
              value={TimeToIncrease}
              onChangeText={SetTimeToIncrease}
            />
            <Text
              style={{
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
              }}
            >
              Time to stay:
            </Text>
            <TextInput
              style={{
                height: 40,
                margin: 12,
                borderWidth: 1,
                padding: 10,
              }}
              placeholder="
            Time to stay:"
              value={TimeToStay}
              onChangeText={SetTimeToStay}
            />
            <Text
              style={{
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
              }}
            >
              Time to reduce:
            </Text>
            <TextInput
              style={{
                height: 40,
                margin: 12,
                borderWidth: 1,
                padding: 10,
              }}
              placeholder="Time to reduce:"
              value={TimeToReduce}
              onChangeText={SetTimeToReduce}
            />
            <View
              style={{
                marginLeft: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: "SF-Pro-Text-regular",
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                Nature Of Pain
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <Checkbox
                  tintColors={{ true: "#C19F1E", false: "#C19F1E" }}
                  disabled={false}
                  value={Pulling}
                  onValueChange={(newValue) => SetPulling(newValue)}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Pulling
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: Platform.OS === "ios" ? 10 : 0,
                }}
              >
                <Checkbox
                  tintColors={{ true: "#C19F1E", false: "#C19F1E" }}
                  disabled={false}
                  value={Aching}
                  onValueChange={(newValue) => SetAching(newValue)}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Aching
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: Platform.OS === "ios" ? 10 : 0,
                }}
              >
                <Checkbox
                  tintColors={{ true: "#C19F1E", false: "#C19F1E" }}
                  disabled={false}
                  value={Pins}
                  onValueChange={(newValue) => SetPins(newValue)}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Pins and Needles
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: Platform.OS === "ios" ? 10 : 0,
                }}
              >
                <Checkbox
                  tintColors={{ true: "#C19F1E", false: "#C19F1E" }}
                  disabled={false}
                  value={Radiating}
                  onValueChange={(newValue) => SetRadiating(newValue)}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Radiating
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: Platform.OS === "ios" ? 10 : 0,
                }}
              >
                <Checkbox
                  tintColors={{ true: "#C19F1E", false: "#C19F1E" }}
                  disabled={false}
                  value={Pinching}
                  onValueChange={(newValue) => SetPinching(newValue)}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Pinching
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: Platform.OS === "ios" ? 10 : 0,
                }}
              >
                <Checkbox
                  tintColors={{ true: "#C19F1E", false: "#C19F1E" }}
                  disabled={false}
                  value={Catch}
                  onValueChange={(newValue) => SetCatch(newValue)}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Catch or hold
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: Platform.OS === "ios" ? 10 : 0,
                }}
              >
                <Checkbox
                  tintColors={{ true: "#C19F1E", false: "#C19F1E" }}
                  disabled={false}
                  value={Sore}
                  onValueChange={(newValue) => SetSore(newValue)}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Soreness
                </Text>
              </View>
            </View>
            <View>
              <Text
                style={{
                  fontFamily: "SF-Pro-Text-regular",
                  fontWeight: "bold",
                  color: "black",
                  marginLeft: 10,
                  marginTop: 10,
                }}
              >
                Depth of Injury
              </Text>
              <View
                style={{
                  marginTop: 10,
                  marginLeft: 10,
                }}
              >
                {/* <View
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <RadioButton
                    value="Superficial"
                    status={Depth == "Superficial" ? "checked" : "unchecked"}
                    onPress={() => SetDepth("Superficial")}
                  />
                  <Text
                    style={{
                      fontFamily: "SF-Pro-Text-regular",
                      color: "black",
                    }}
                  >
                    Superficial
                  </Text>
                </View> */}

                {/* <View
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <RadioButton
                    value="Deep"
                    status={Depth == "Deep" ? "checked" : "unchecked"}
                    onPress={() => SetDepth("Deep")}
                  />
                  <Text
                    style={{
                      fontFamily: "SF-Pro-Text-regular",
                      color: "black",
                    }}
                  >
                    Deep
                  </Text>
                </View> */}
                {/* <View
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <RadioButton
                    value="Others"
                    status={Depth == "Others" ? "checked" : "unchecked"}
                    onPress={() => SetDepth("Others")}
                  />
                  <Text
                    style={{
                      fontFamily: "SF-Pro-Text-regular",
                      color: "black",
                    }}
                  >
                    Others
                  </Text>
                </View> */}

                <RadioButtonRN
                  activeColor={"#C19F1E"}
                  deactiveColor={"grey"}
                  data={data6}
                  box={false}
                  selectedBtn={(e) => SetDepth(e.label)}
                />
              </View>
            </View>
            {Depth == "Others" && (
              <View>
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    fontWeight: "bold",
                    color: "black",
                    marginLeft: 10,
                    marginTop: 10,
                  }}
                >
                  Other:
                </Text>
                <TextInput
                  style={{
                    height: 40,
                    margin: 12,
                    borderWidth: 1,
                    padding: 10,
                  }}
                  placeholder="Other:"
                  value={DepthOther}
                  onChangeText={SetDepthOther}
                />
              </View>
            )}
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
              placeholder="Aggravating Causes::"
              value={Aggravating}
              onChangeText={SetAggravating}
            />
            <View>
              <Text
                style={{
                  fontFamily: "SF-Pro-Text-regular",
                  fontWeight: "bold",
                  color: "black",
                  marginLeft: 10,
                  marginTop: 10,
                }}
              >
                Relieving Factors:
              </Text>
              <View
                style={{
                  marginLeft: 10,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <Checkbox
                    tintColors={{ true: "#C19F1E", false: "#C19F1E" }}
                    disabled={false}
                    value={Rest}
                    onValueChange={(newValue) => SetRest(newValue)}
                  />
                  <Text
                    style={{
                      fontFamily: "SF-Pro-Text-regular",
                      color: "black",
                    }}
                  >
                    Rest
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: Platform.OS === "ios" ? 10 : 0,
                  }}
                >
                  <Checkbox
                    tintColors={{ true: "#C19F1E", false: "#C19F1E" }}
                    disabled={false}
                    value={Move}
                    onValueChange={(newValue) => SetMove(newValue)}
                  />
                  <Text
                    style={{
                      fontFamily: "SF-Pro-Text-regular",
                      color: "black",
                    }}
                  >
                    Movement
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: Platform.OS === "ios" ? 10 : 0,
                  }}
                >
                  <Checkbox
                    tintColors={{ true: "#C19F1E", false: "#C19F1E" }}
                    disabled={false}
                    value={Ice}
                    onValueChange={(newValue) => SetIce(newValue)}
                  />
                  <Text
                    style={{
                      fontFamily: "SF-Pro-Text-regular",
                      color: "black",
                    }}
                  >
                    Ice
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: Platform.OS === "ios" ? 10 : 0,
                  }}
                >
                  <Checkbox
                    tintColors={{ true: "#C19F1E", false: "#C19F1E" }}
                    disabled={false}
                    value={Heat}
                    onValueChange={(newValue) => SetHeat(newValue)}
                  />
                  <Text
                    style={{
                      fontFamily: "SF-Pro-Text-regular",
                      color: "black",
                    }}
                  >
                    Heat
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: Platform.OS === "ios" ? 10 : 0,
                  }}
                >
                  <Checkbox
                    tintColors={{ true: "#C19F1E", false: "#C19F1E" }}
                    disabled={false}
                    value={Medication}
                    onValueChange={(newValue) => SetMedication(newValue)}
                  />
                  <Text
                    style={{
                      fontFamily: "SF-Pro-Text-regular",
                      color: "black",
                    }}
                  >
                    Medication
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: Platform.OS === "ios" ? 10 : 0,
                  }}
                >
                  <Checkbox
                    tintColors={{ true: "#C19F1E", false: "#C19F1E" }}
                    disabled={false}
                    value={Taping}
                    onValueChange={(newValue) => SetTaping(newValue)}
                  />
                  <Text
                    style={{
                      fontFamily: "SF-Pro-Text-regular",
                      color: "black",
                    }}
                  >
                    Taping
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: Platform.OS === "ios" ? 10 : 0,
                  }}
                >
                  <Checkbox
                    tintColors={{ true: "#C19F1E", false: "#C19F1E" }}
                    disabled={false}
                    value={Foam}
                    onValueChange={(newValue) => SetFoam(newValue)}
                  />
                  <Text
                    style={{
                      fontFamily: "SF-Pro-Text-regular",
                      color: "black",
                    }}
                  >
                    Foam Rolling
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: Platform.OS === "ios" ? 10 : 0,
                  }}
                >
                  <Checkbox
                    tintColors={{ true: "#C19F1E", false: "#C19F1E" }}
                    disabled={false}
                    value={Strech}
                    onValueChange={(newValue) => SetStrech(newValue)}
                  />
                  <Text
                    style={{
                      fontFamily: "SF-Pro-Text-regular",
                      color: "black",
                    }}
                  >
                    Stretching
                  </Text>
                </View>
              </View>
            </View>
            <Text
              style={{
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
                marginTop: 10,
              }}
            >
              POSTURAL ASSESSMENT
            </Text>
            <View>
              <Text
                style={{
                  fontFamily: "SF-Pro-Text-regular",
                  fontWeight: "bold",
                  color: "black",
                  marginLeft: 10,
                  marginTop: 10,
                }}
              >
                Head:
              </Text>
              <View
                style={{
                  marginTop: 10,
                  marginLeft: 10,
                }}
              >
                {/* <View
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <RadioButton
                    value="Neutral"
                    status={Head === "Neutral" ? "checked" : "unchecked"}
                    onPress={() => SetHead("Neutral")}
                  />
                  <Text
                    style={{
                      fontFamily: "SF-Pro-Text-regular",
                      color: "black",
                    }}
                  >
                    Neutral
                  </Text>
                </View> */}

                {/* <View
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    alignItems: "center",
                    marginLeft: 10,
                  }}
                >
                  <RadioButton
                    value="Forward"
                    status={Head === "Forward" ? "checked" : "unchecked"}
                    onPress={() => SetHead("Forward")}
                  />
                  <Text
                    style={{
                      fontFamily: "SF-Pro-Text-regular",
                      color: "black",
                    }}
                  >
                    Forward
                  </Text>
                </View> */}
                <RadioButtonRN
                  activeColor={"#C19F1E"}
                  deactiveColor={"grey"}
                  data={data7}
                  box={false}
                  selectedBtn={(e) => SetHead(e.label)}
                />
              </View>
              <Text
                style={{
                  fontFamily: "SF-Pro-Text-regular",
                  fontWeight: "bold",
                  color: "black",
                  marginLeft: 10,
                  marginTop: 10,
                }}
              >
                Left Shoulder:
              </Text>
              <View
                style={{
                  marginTop: 10,
                  marginLeft: 10,
                }}
              >
                {/* <View
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <RadioButton
                    value="Neutral"
                    status={LShoulder === "Neutral" ? "checked" : "unchecked"}
                    onPress={() => SetLShoulder("Neutral")}
                  />
                  <Text
                    style={{
                      fontFamily: "SF-Pro-Text-regular",
                      color: "black",
                    }}
                  >
                    Neutral
                  </Text>
                </View> */}

                {/* <View
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <RadioButton
                    value="Elevated"
                    status={LShoulder === "Elevated" ? "checked" : "unchecked"}
                    onPress={() => SetLShoulder("Elevated")}
                  />
                  <Text
                    style={{
                      fontFamily: "SF-Pro-Text-regular",
                      color: "black",
                    }}
                  >
                    Elevated
                  </Text>
                </View> */}
                {/* <View
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <RadioButton
                    value="Depressed Neutral"
                    status={
                      LShoulder === "Depressed Neutral"
                        ? "checked"
                        : "unchecked"
                    }
                    onPress={() => SetLShoulder("Depressed Neutral")}
                  />
                  <Text
                    style={{
                      fontFamily: "SF-Pro-Text-regular",
                      color: "black",
                    }}
                  >
                    Depressed Neutral
                  </Text>
                </View> */}
                {/* <View
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <RadioButton
                    value="Rounded"
                    status={LShoulder === "Rounded" ? "checked" : "unchecked"}
                    onPress={() => SetLShoulder("Rounded")}
                  />
                  <Text
                    style={{
                      fontFamily: "SF-Pro-Text-regular",
                      color: "black",
                    }}
                  >
                    Rounded
                  </Text>
                </View> */}
                <RadioButtonRN
                  activeColor={"#C19F1E"}
                  deactiveColor={"grey"}
                  data={data8}
                  box={false}
                  selectedBtn={(e) => SetLShoulder(e.label)}
                />
              </View>
              <Text
                style={{
                  fontFamily: "SF-Pro-Text-regular",
                  fontWeight: "bold",
                  color: "black",
                  marginLeft: 10,
                  marginTop: 10,
                }}
              >
                Right Shoulder:
              </Text>
              <View
                style={{
                  marginTop: 10,
                  marginLeft: 10,
                }}
              >
                {/* <View
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <RadioButton
                    value="Neutral"
                    status={RShoulder === "Neutral" ? "checked" : "unchecked"}
                    onPress={() => SetRShoulder("Neutral")}
                  />
                  <Text
                    style={{
                      fontFamily: "SF-Pro-Text-regular",
                      color: "black",
                    }}
                  >
                    Neutral
                  </Text>
                </View> */}

                {/* <View
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <RadioButton
                    value="Elevated"
                    status={RShoulder === "Elevated" ? "checked" : "unchecked"}
                    onPress={() => SetRShoulder("Elevated")}
                  />
                  <Text
                    style={{
                      fontFamily: "SF-Pro-Text-regular",
                      color: "black",
                    }}
                  >
                    Elevated
                  </Text>
                </View> */}
                {/* <View
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <RadioButton
                    value="Depressed Neutral"
                    status={
                      RShoulder === "Depressed Neutral"
                        ? "checked"
                        : "unchecked"
                    }
                    onPress={() => SetRShoulder("Depressed Neutral")}
                  />
                  <Text
                    style={{
                      fontFamily: "SF-Pro-Text-regular",
                      color: "black",
                    }}
                  >
                    Depressed Neutral
                  </Text>
                </View> */}
                {/* <View
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <RadioButton
                    value="Rounded"
                    status={RShoulder === "Rounded" ? "checked" : "unchecked"}
                    onPress={() => SetRShoulder("Rounded")}
                  />
                  <Text
                    style={{
                      fontFamily: "SF-Pro-Text-regular",
                      color: "black",
                    }}
                  >
                    Rounded
                  </Text>
                </View> */}
                <RadioButtonRN
                  activeColor={"#C19F1E"}
                  deactiveColor={"grey"}
                  data={data9}
                  box={false}
                  selectedBtn={(e) => SetRShoulder(e.label)}
                />
              </View>
              <Text
                style={{
                  fontFamily: "SF-Pro-Text-regular",
                  fontWeight: "bold",
                  color: "black",
                  marginLeft: 10,
                  marginTop: 10,
                }}
              >
                Thoracic Spine:
              </Text>
              <View
                style={{
                  marginTop: 10,
                  marginLeft: 10,
                }}
              >
                {/* <View
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <RadioButton
                    value="Neutral"
                    status={Thoracic === "Neutral" ? "checked" : "unchecked"}
                    onPress={() => SetThoracic("Neutral")}
                  />
                  <Text
                    style={{
                      fontFamily: "SF-Pro-Text-regular",
                      color: "black",
                    }}
                  >
                    Neutral
                  </Text>
                </View> */}

                {/* <View
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <RadioButton
                    value="Flattened"
                    status={Thoracic === "Flattened" ? "checked" : "unchecked"}
                    onPress={() => SetThoracic("Flattened")}
                  />
                  <Text
                    style={{
                      fontFamily: "SF-Pro-Text-regular",
                      color: "black",
                    }}
                  >
                    Flattened
                  </Text>
                </View> */}
                {/* <View
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <RadioButton
                    value="Kyphosis Scoliosis"
                    status={
                      Thoracic === "Kyphosis Scoliosis"
                        ? "checked"
                        : "unchecked"
                    }
                    onPress={() => SetThoracic("Kyphosis Scoliosis")}
                  />
                  <Text
                    style={{
                      fontFamily: "SF-Pro-Text-regular",
                      color: "black",
                    }}
                  >
                    Kyphosis Scoliosis
                  </Text>
                </View> */}
                <RadioButtonRN
                  activeColor={"#C19F1E"}
                  deactiveColor={"grey"}
                  data={data10}
                  box={false}
                  selectedBtn={(e) => SetThoracic(e.label)}
                />
              </View>
              <Text
                style={{
                  fontFamily: "SF-Pro-Text-regular",
                  fontWeight: "bold",
                  color: "black",
                  marginLeft: 10,
                  marginTop: 10,
                }}
              >
                Lumbar Spine
              </Text>
              <View
                style={{
                  marginTop: 10,
                  marginLeft: 10,
                }}
              >
                {/* <View
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <RadioButton
                    value="Neutral"
                    status={Lumbar === "Neutral" ? "checked" : "unchecked"}
                    onPress={() => SetLumbar("Neutral")}
                  />
                  <Text
                    style={{
                      fontFamily: "SF-Pro-Text-regular",
                      color: "black",
                    }}
                  >
                    Neutral
                  </Text>
                </View> */}

                {/* <View
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <RadioButton
                    value="Increased"
                    status={Lumbar === "Increased" ? "checked" : "unchecked"}
                    onPress={() => SetLumbar("Increased")}
                  />
                  <Text
                    style={{
                      fontFamily: "SF-Pro-Text-regular",
                      color: "black",
                    }}
                  >
                    Increased
                  </Text>
                </View> */}
                {/* <View
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <RadioButton
                    value="Decreased Lordosis"
                    status={
                      Lumbar === "Decreased Lordosis" ? "checked" : "unchecked"
                    }
                    onPress={() => SetLumbar("Decreased Lordosis")}
                  />
                  <Text
                    style={{
                      fontFamily: "SF-Pro-Text-regular",
                      color: "black",
                    }}
                  >
                    Decreased Lordosis
                  </Text>
                </View> */}
                <RadioButtonRN
                  activeColor={"#C19F1E"}
                  deactiveColor={"grey"}
                  data={data11}
                  box={false}
                  selectedBtn={(e) => SetLumbar(e.label)}
                />
              </View>
            </View>
            <Text
              style={{
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
                marginTop: 10,
              }}
            >
              Left Knee
            </Text>
            <View
              style={{
                marginTop: 10,
                marginLeft: 10,
              }}
            >
              {/* <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="Neutral"
                  status={Knee === "Neutral" ? "checked" : "unchecked"}
                  onPress={() => SetKnee("Neutral")}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Neutral
                </Text>
              </View> */}

              {/* <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="Varus"
                  status={Knee === "Varus" ? "checked" : "unchecked"}
                  onPress={() => SetKnee("Varus")}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Varus
                </Text>
              </View> */}
              {/* <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="Valgus"
                  status={Knee === "Valgus" ? "checked" : "unchecked"}
                  onPress={() => SetKnee("Valgus")}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Valgus
                </Text>
              </View> */}
              <RadioButtonRN
                activeColor={"#C19F1E"}
                deactiveColor={"grey"}
                data={data12}
                box={false}
                selectedBtn={(e) => SetKnee(e.label)}
              />
            </View>
            <Text
              style={{
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
                marginTop: 10,
              }}
            >
              Right Knee
            </Text>
            <View
              style={{
                marginTop: 10,
                marginLeft: 10,
              }}
            >
              {/* <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="Neutral"
                  status={Rknee === "Neutral" ? "checked" : "unchecked"}
                  onPress={() => SetRknee("Neutral")}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Neutral
                </Text>
              </View> */}

              {/* <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="Varus"
                  status={Rknee === "Varus" ? "checked" : "unchecked"}
                  onPress={() => SetRknee("Varus")}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Varus
                </Text>
              </View> */}
              {/* <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="Valgus"
                  status={Rknee === "Valgus" ? "checked" : "unchecked"}
                  onPress={() => SetRknee("Valgus")}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Valgus
                </Text>
              </View> */}
              <RadioButtonRN
                activeColor={"#C19F1E"}
                deactiveColor={"grey"}
                data={data13}
                box={false}
                selectedBtn={(e) => SetRknee(e.label)}
              />
            </View>
            <Text
              style={{
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
                marginTop: 10,
              }}
            >
              Left Foot
            </Text>
            <View
              style={{
                marginTop: 10,
                marginLeft: 10,
              }}
            >
              {/* <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="Flat"
                  status={Lfoot === "Flat" ? "checked" : "unchecked"}
                  onPress={() => SetLfoot("Flat")}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Flat
                </Text>
              </View> */}

              {/* <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="Medial Arch"
                  status={Lfoot === "Medial Arch" ? "checked" : "unchecked"}
                  onPress={() => SetLfoot("Medial Arch")}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Medial Arch
                </Text>
              </View> */}
              {/* <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="Pronated"
                  status={Lfoot === "Pronated" ? "checked" : "unchecked"}
                  onPress={() => SetLfoot("Pronated")}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Pronated
                </Text>
              </View> */}
              <RadioButtonRN
                activeColor={"#C19F1E"}
                deactiveColor={"grey"}
                data={data14}
                box={false}
                selectedBtn={(e) => SetLfoot(e.label)}
              />
            </View>
            <Text
              style={{
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
                marginTop: 10,
              }}
            >
              Right Foot
            </Text>
            <View
              style={{
                marginTop: 10,
                marginLeft: 10,
              }}
            >
              {/* <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="Flat"
                  status={Rfoot === "Flat" ? "checked" : "unchecked"}
                  onPress={() => SetRfoot("Flat")}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Flat
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="Medial Arch"
                  status={Rfoot === "Medial Arch" ? "checked" : "unchecked"}
                  onPress={() => SetRfoot("Medial Arch")}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Medial Arch
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="Pronated"
                  status={Rfoot === "Pronated" ? "checked" : "unchecked"}
                  onPress={() => SetRfoot("Pronated")}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Pronated
                </Text>
              </View> */}
              <RadioButtonRN
                activeColor={"#C19F1E"}
                deactiveColor={"grey"}
                data={data15}
                box={false}
                selectedBtn={(e) => SetLfoot(e.label)}
              />
            </View>
            <Text
              style={{
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
                marginTop: 10,
              }}
            >
              Foot Posture Index:
            </Text>
            <TextInput
              style={{
                height: 40,
                margin: 12,
                borderWidth: 1,
                padding: 10,
              }}
              placeholder="Foot Posture Index: Eg. 5"
              value={FootIndex}
              onChangeText={SetFootIndex}
            />
            <Image
              style={{
                width: 310,
                height: 200,
                alignSelf: "center",
              }}
              source={require("./post.png")}
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
              Posterior
            </Text>
            <View
              style={{
                marginLeft: 10,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <Checkbox
                  tintColors={{ true: "#C19F1E", false: "#C19F1E" }}
                  disabled={false}
                  value={Posterior}
                  onValueChange={(newValue) => SetPosterior(newValue)}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Posterior
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: Platform.OS === "ios" ? 10 : 0,
                }}
              >
                <Checkbox
                  tintColors={{ true: "#C19F1E", false: "#C19F1E" }}
                  disabled={false}
                  value={Posteromedial}
                  onValueChange={(newValue) => SetPosteromedial(newValue)}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Posteromedial
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: Platform.OS === "ios" ? 10 : 0,
                }}
              >
                <Checkbox
                  tintColors={{ true: "#C19F1E", false: "#C19F1E" }}
                  disabled={false}
                  value={Medial}
                  onValueChange={(newValue) => SetMedial(newValue)}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Medial
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: Platform.OS === "ios" ? 10 : 0,
                }}
              >
                <Checkbox
                  tintColors={{ true: "#C19F1E", false: "#C19F1E" }}
                  disabled={false}
                  value={Anteromedial}
                  onValueChange={(newValue) => SetAnteromedial(newValue)}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Anteromedial
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: Platform.OS === "ios" ? 10 : 0,
                }}
              >
                <Checkbox
                  tintColors={{ true: "#C19F1E", false: "#C19F1E" }}
                  disabled={false}
                  value={Anterior}
                  onValueChange={(newValue) => SetAnterior(newValue)}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Anterior
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: Platform.OS === "ios" ? 10 : 0,
                }}
              >
                <Checkbox
                  tintColors={{ true: "#C19F1E", false: "#C19F1E" }}
                  disabled={false}
                  value={Anterolateral}
                  onValueChange={(newValue) => SetAnterolateral(newValue)}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Anterolateral
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: Platform.OS === "ios" ? 10 : 0,
                }}
              >
                <Checkbox
                  tintColors={{ true: "#C19F1E", false: "#C19F1E" }}
                  disabled={false}
                  value={Posterolateral}
                  onValueChange={(newValue) => SetPosterolateral(newValue)}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Posterolateral
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: Platform.OS === "ios" ? 10 : 0,
                }}
              >
                <Checkbox
                  tintColors={{ true: "#C19F1E", false: "#C19F1E" }}
                  disabled={false}
                  value={Lateral}
                  onValueChange={(newValue) => SetLateral(newValue)}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Lateral
                </Text>
              </View>
            </View>
            <Text
              style={{
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
                marginTop: 10,
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
              placeholder="Enter Value"
              value={Abduction}
              onChangeText={SetAbdcution}
            />
            <Text
              style={{
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
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
              placeholder="Enter Value"
              value={Exrotation}
              onChangeText={SetExrotation}
            />
            <Text
              style={{
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
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
              placeholder="Enter Value"
              value={Glenohumeral}
              onChangeText={SetGlenohumeral}
            />
            <Text
              style={{
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
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
              placeholder="Enter Value"
              value={Rotationgain}
              onChangeText={SetRotationgain}
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
            <View
              style={{
                marginTop: 10,
                marginLeft: 10,
              }}
            >
              {/* <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="Positive"
                  status={Impingement === "Positive" ? "checked" : "unchecked"}
                  onPress={() => SetImpingement("Positive")}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Positive
                </Text>
              </View> */}

              {/* <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="Negative"
                  status={Impingement === "Negative" ? "checked" : "unchecked"}
                  onPress={() => SetImpingement("Negative")}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Negative
                </Text>
              </View> */}
              <RadioButtonRN
                activeColor={"#C19F1E"}
                deactiveColor={"grey"}
                data={data16}
                box={false}
                selectedBtn={(e) => SetImpingement(e.label)}
              />
            </View>
            <View>
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
                placeholder="Enter value"
                value={Fullcan}
                onChangeText={SetFullcan}
              />
              <Text
                style={{
                  fontFamily: "SF-Pro-Text-regular",
                  fontWeight: "bold",
                  color: "black",
                  marginLeft: 10,
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
                placeholder="Enter value"
                value={Infraspinatus}
                onChangeText={SetInfraspinatus}
              />
              <Text
                style={{
                  fontFamily: "SF-Pro-Text-regular",
                  fontWeight: "bold",
                  color: "black",
                  marginLeft: 10,
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
                placeholder="Enter value"
                value={Kibler}
                onChangeText={SetKibler}
              />
              <Text
                style={{
                  fontFamily: "SF-Pro-Text-regular",
                  fontWeight: "bold",
                  color: "black",
                  marginLeft: 10,
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
                placeholder="Enter value"
                value={Positionone}
                onChangeText={SetPositionone}
              />
              <Text
                style={{
                  fontFamily: "SF-Pro-Text-regular",
                  fontWeight: "bold",
                  color: "black",
                  marginLeft: 10,
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
                placeholder="Enter value"
                value={Positiontwo}
                onChangeText={SetPositiontwo}
              />
              <Text
                style={{
                  fontFamily: "SF-Pro-Text-regular",
                  fontWeight: "bold",
                  color: "black",
                  marginLeft: 10,
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
                placeholder="Enter value"
                value={Positionthree}
                onChangeText={SetPositionthree}
              />
              <Text
                style={{
                  fontFamily: "SF-Pro-Text-regular",
                  fontWeight: "bold",
                  color: "black",
                  marginLeft: 10,
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
                placeholder="Enter value"
                value={Scapular}
                onChangeText={SetScapular}
              />
              <Text
                style={{
                  fontFamily: "SF-Pro-Text-regular",
                  fontWeight: "bold",
                  color: "black",
                  marginLeft: 10,
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
                placeholder="Enter value"
                value={Adduction}
                onChangeText={SetAdduction}
              />
              <Text
                style={{
                  fontFamily: "SF-Pro-Text-regular",
                  fontWeight: "bold",
                  color: "black",
                  marginLeft: 10,
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
                placeholder="Enter value"
                value={Kims}
                onChangeText={SetKims}
              />
              <Text
                style={{
                  fontFamily: "SF-Pro-Text-regular",
                  fontWeight: "bold",
                  color: "black",
                  marginLeft: 10,
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
                placeholder="Enter value"
                value={Biceps}
                onChangeText={SetBiceps}
              />
              <Text
                style={{
                  fontFamily: "SF-Pro-Text-regular",
                  fontWeight: "bold",
                  color: "black",
                  marginLeft: 10,
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
                placeholder="Enter value"
                value={Brien}
                onChangeText={SetBrien}
              />
              <Text
                style={{
                  fontFamily: "SF-Pro-Text-regular",
                  fontWeight: "bold",
                  color: "black",
                  marginLeft: 10,
                }}
              >
                CKUEST
              </Text>
              <TextInput
                style={{
                  height: 40,
                  margin: 12,
                  borderWidth: 1,
                  padding: 10,
                }}
                placeholder="Enter value"
                value={Ckuest}
                onChangeText={SetCkuest}
              />
              <Text
                style={{
                  fontFamily: "SF-Pro-Text-regular",
                  fontWeight: "bold",
                  color: "black",
                  marginLeft: 10,
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
                placeholder="Enter value"
                value={Balance}
                onChangeText={SetBalance}
              />
            </View>
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
            <View
              style={{
                marginTop: 10,
                marginLeft: 10,
              }}
            >
              {/* <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="Positive"
                  status={Quadranttest === "Positive" ? "checked" : "unchecked"}
                  onPress={() => SetQuadranttest("Positive")}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Positive
                </Text>
              </View> */}

              {/* <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="Negative"
                  status={Quadranttest === "Negative" ? "checked" : "unchecked"}
                  onPress={() => SetQuadranttest("Negative")}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Negative
                </Text>
              </View> */}
              <RadioButtonRN
                activeColor={"#C19F1E"}
                deactiveColor={"grey"}
                data={data17}
                box={false}
                selectedBtn={(e) => SetQuadranttest(e.label)}
              />
            </View>
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
            <View
              style={{
                marginTop: 10,
                marginLeft: 10,
              }}
            >
              {/* <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="+≤ 3.0cms"
                  status={Trunk === "+≤ 3.0cms" ? "checked" : "unchecked"}
                  onPress={() => SetTrunk("+≤ 3.0cms")}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  +≤ 3.0cms
                </Text>
              </View> */}

              {/* <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="-≤ 3.0cms"
                  status={Trunk === "-≤ 3.0cms" ? "checked" : "unchecked"}
                  onPress={() => SetTrunk("-≤ 3.0cms")}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  -≤ 3.0cms
                </Text>
              </View> */}
              <RadioButtonRN
                activeColor={"#C19F1E"}
                deactiveColor={"grey"}
                data={data18}
                box={false}
                selectedBtn={(e) => SetTrunk(e.label)}
              />
            </View>
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
            <View
              style={{
                marginTop: 10,
                marginLeft: 10,
              }}
            >
              {/* <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="> +5.0cms"
                  status={Lumbarspine === "> +5.0cms" ? "checked" : "unchecked"}
                  onPress={() => SetLumbarspine("> +5.0cms")}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  {">"} +5.0cms
                </Text>
              </View> */}

              {/* <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value=" -2.0cms"
                  status={Lumbarspine === "-2.0cms" ? "checked" : "unchecked"}
                  onPress={() => SetLumbarspine("-2.0cms")}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  -2.0cms
                </Text>
              </View> */}
              <RadioButtonRN
                activeColor={"#C19F1E"}
                deactiveColor={"grey"}
                data={data19}
                box={false}
                selectedBtn={(e) => SetLumbarspine(e.label)}
              />
            </View>
            <Text
              style={{
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
                marginTop: 10,
              }}
            >
              NOTES :
            </Text>
            <TextInput
              style={{
                height: 40,
                margin: 12,
                borderWidth: 1,
                padding: 10,
              }}
              placeholder="Enter Value"
              value={Notes}
              onChangeText={SetNotes}
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
              placeholder="Enter Value"
              value={Hamstring}
              onChangeText={SetHamstring}
            />
            <Text
              style={{
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
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
              placeholder="Enter Value"
              value={Iliopsoas}
              onChangeText={SetIliopsoas}
            />
            <Text
              style={{
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
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
              placeholder="Enter Value"
              value={Femoris}
              onChangeText={SetFemoris}
            />
            <Text
              style={{
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
              }}
            >
              Hip Internal Rotation – Prone (≥ 30) :
            </Text>
            <TextInput
              style={{
                height: 40,
                margin: 12,
                borderWidth: 1,
                padding: 10,
              }}
              placeholder="Enter Value"
              value={Internalhip}
              onChangeText={SetInternalhip}
            />
            <Text
              style={{
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
              }}
            >
              Hip External Rotation – Prone (≥ 45):
            </Text>
            <TextInput
              style={{
                height: 40,
                margin: 12,
                borderWidth: 1,
                padding: 10,
              }}
              placeholder="Enter Value"
              value={Externalhip}
              onChangeText={SetExternalhip}
            />
            <Text
              style={{
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
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
              placeholder="Enter Value"
              value={Quadranthip}
              onChangeText={SetQuadranthip}
            />
            <Text
              style={{
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
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
              placeholder="Enter Value"
              value={Piriformis}
              onChangeText={SetPiriformis}
            />
            <Text
              style={{
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
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
              placeholder="Enter Value"
              value={Lunge}
              onChangeText={SetLunge}
            />
            <Text
              style={{
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
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
              placeholder="Enter Value"
              value={Impingementp}
              onChangeText={SetImpingementp}
            />
            <Text
              style={{
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
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
              placeholder="Enter Value"
              value={Singleleg}
              onChangeText={SetSingleleg}
            />
            <Text
              style={{
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
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
              placeholder="Enter Value"
              value={Squat}
              onChangeText={SetSquat}
            />
            <Text
              style={{
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
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
              placeholder="Enter Value"
              value={Singlelegsquat}
              onChangeText={SetSinglelegsquat}
            />
            <Text
              style={{
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
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
              placeholder="Enter Value"
              value={Stability}
              onChangeText={SetStability}
            />
            <Text
              style={{
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
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
              placeholder="Enter Value"
              value={Ottawa}
              onChangeText={SetOttawa}
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
              SLUMP :
            </Text>
            <View
              style={{
                marginTop: 10,
                marginLeft: 10,
              }}
            >
              {/* <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="Positive"
                  status={SLUMP === "Positive" ? "checked" : "unchecked"}
                  onPress={() => SetSLUMP("Positive")}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Positive
                </Text>
              </View> */}

              {/* <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="Negative"
                  status={SLUMP === "Negative" ? "checked" : "unchecked"}
                  onPress={() => SetSLUMP("Negative")}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Negative
                </Text>
              </View> */}
              <RadioButtonRN
                activeColor={"#C19F1E"}
                deactiveColor={"grey"}
                data={data20}
                box={false}
                selectedBtn={(e) => SetSLUMP(e.label)}
              />
            </View>
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
              placeholder="Enter Value"
              value={SLR}
              onChangeText={SetSLR}
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
            <View
              style={{
                marginTop: 10,
                marginLeft: 10,
              }}
            >
              {/* <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="Positive"
                  status={ULTTs === "Positive" ? "checked" : "unchecked"}
                  onPress={() => SetULTTs("Positive")}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Positive
                </Text>
              </View> */}

              {/* <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="Negative"
                  status={ULTTs === "Negative" ? "checked" : "unchecked"}
                  onPress={() => SetULTTs("Negative")}
                />
                <Text
                  style={{
                    fontFamily: "SF-Pro-Text-regular",
                    color: "black",
                  }}
                >
                  Negative
                </Text>
              </View> */}
              <RadioButtonRN
                activeColor={"#C19F1E"}
                deactiveColor={"grey"}
                data={data21}
                box={false}
                selectedBtn={(e) => SetULTTs(e.label)}
              />
            </View>
          </View>
          <View
            style={{
              marginTop: 10,
              marginLeft: 20,
              width: 100,
            }}
          >
            <Text
              style={{ color: "black", fontWeight: "bold", marginLeft: -10 }}
            >
              Upload Video
            </Text>
            <TouchableOpacity
              onPress={videoHandler}
              style={{
                flexDirection: "row",
                alignItems: "center",
                margin: RFValue(20, 816),
                width: 200,
              }}
            >
              <View
                style={{
                  padding: RFValue(10, 816),
                  backgroundColor: "white",
                  borderRadius: 10,
                }}
              >
                <Icon
                  name="video"
                  type="font-awesome-5"
                  color="black"
                  size={30}
                />
              </View>

              <Text style={{ marginLeft: RFValue(30, 816) }}>
                Select Video from Gallery
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              alignItems: "center",
              marginTop: 30,
            }}
          >
            <View
              style={{
                width: 100,
              }}
            >
              <Button onPress={onSave} title="Save" color="#ee664f" />
            </View>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default AddNewPhysioAss;
