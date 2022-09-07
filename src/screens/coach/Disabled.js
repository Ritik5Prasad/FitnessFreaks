import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  TextInput,
  BackHandler,
  Button,
  Share,
  Dimensions,
  SafeAreaView,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { auth, db } from "../../utils/firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUser,
  setUserData,
  selectUserData,
  selectUserType,
  setTemperoryID,
  logout,
} from "../../features/userSlice";
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
import { useIsFocused } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import { Text as SvgText } from "react-native-svg";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { ActivityIndicator } from "react-native-paper";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 0,
    padding: RFValue(20, 816),
    minHeight: ScreenHeight,
  },

  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    justifyContent: "center",
    alignItems: "center",
    width: ScreenWidth,
    height: ScreenHeight / 2.5,
    paddingBottom: ScreenHeight * 0.05,
  },
  body: {
    position: "absolute",
    right: RFValue(30, 816),
    bottom: ScreenHeight * 0.15,
  },
});

function Disabled(props) {
  const user = useSelector(selectUser);
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const [athleteDetails, setAthleteDetails] = useState([]);
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [events, setEvents] = useState([]);
  const [requestDate, setRequestDate] = useState(formatDate());
  const [workouts, setWorkouts] = useState([]);
  const [nutrition, setNutrition] = useState([]);
  const [complianceCount, setComplianceCount] = useState(0);
  const [ncomplianceCount, setNComplianceCount] = useState(0);
  const [pcomplianceCount, setPComplianceCount] = useState(0);
  const [fcomplianceCount, setFComplianceCount] = useState(0);
  const [onboardModal, setOnboardModal] = useState(false);
  const [athleteSearch, setAthleteSearch] = useState("");
  const [searchedAthletes, setSearchedAthletes] = useState([]);
  const [active, setActive] = useState(false);
  const [reload, setReload] = useState(false);
  const [isLoading, setisLoading] = useState(true);

  React.useEffect(() => {
    if (userType === "coach") {
      db.collection("coaches")
        .doc(userData?.id)
        .get()
        .then((snap) => {
          setActive(
            snap.data().active !== undefined
              ? snap.data().active === true
                ? true
                : false
              : true
          );
          setisLoading(false);
        });
    }
  }, [userData, reload]);
  console.log(props);
  React.useEffect(() => {
    console.log(active);
    active && props.navigation.navigate("Home");
  }, [active]);

  function formatDate() {
    var d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  const data1 = [
    {
      key: 1,
      amount: 54,
      svg: { fill: "#ffe66d" },
    },
    {
      key: 2,
      amount: 30,
      svg: { fill: "#00b4c4" },
    },
    {
      key: 3,
      amount: 26,
      svg: { fill: "#ff6b6b" },
    },
  ];

  const Labels = ({ slices, height, width }) => {
    return slices.map((slice, index) => {
      const { labelCentroid, pieCentroid, data } = slice;
      return (
        <SvgText
          key={index}
          x={pieCentroid[0]}
          y={pieCentroid[1]}
          fill={"black"}
          textAnchor={"middle"}
          alignmentBaseline={"middle"}
          fontSize={17}
          stroke={"black"}
          strokeWidth={0.1}
          style={{ padding: RFValue(15, 816), backgroundColor: "white" }}
        >
          {data.amount}
        </SvgText>
      );
    });
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     const onBackPress = () => {
  //       return true;
  //     };

  //     BackHandler.addEventListener("hardwareBackPress", onBackPress);

  //     return () =>
  //       BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  //   }, [])
  // );

  useEffect(() => {
    console.log("1");
    db.collection("coaches")
      .where("email", "==", user)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          dispatch(
            setUserData({
              id: doc.id,
              data: doc.data(),
            })
          );
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });

    if (userData) {
      const data = [];
      db.collection("athletes")
        .orderBy("name", "asc")
        .get()
        .then((snapshot) => {
          snapshot.docs.forEach((athlete) => {
            if (userData?.data?.listOfAthletes?.includes(athlete.id)) {
              let currentID = athlete.id;
              let appObj = { ...athlete.data(), ["id"]: currentID };
              data.push(appObj);
            }
          });
          setAthleteDetails(data);
        });
    }
  }, [user, userData?.id, isFocused]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#C19F1E" />
      </View>
    );
  } else
    return (
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View>
            <View
              style={{
                fontSize: RFValue(30, 816),
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                color: "black",
                alignSelf: "center",
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                }}
              >
                {" "}
                Please pay all your dues to continue
              </Text>
            </View>

            <TouchableOpacity
              style={{
                alignItems: "center",
                marginTop: 60,
                backgroundColor: "#C19F1E",
                padding: RFValue(20, 816),
                borderRadius: 25,
              }}
              onPress={() => {}}
            >
              <Text style={{ fontSize: RFValue(18, 816) }}>PayNow</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                console.log(2);
                setReload(!reload);
              }}
              style={{ alignItems: "center", marginTop: RFValue(60, 816) }}
            >
              <Icon
                name="sync-alt"
                type="font-awesome-5"
                size={30}
                color="black"
              />
              <Text
                onPress={() => {
                  setReload(!reload);
                }}
                style={{ fontSize: RFValue(18, 816) }}
              >
                refresh
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                console.log(9);
                auth.signOut();
                dispatch(logout());

                props.navigation.navigate("LoginScreen");
                props.navigation.closeDrawer();
              }}
              style={{
                alignItems: "center",
                marginTop: 60,
                backgroundColor: "#C19F1E",
                padding: RFValue(20, 816),
                borderRadius: 25,
              }}
            >
              <Text style={{ fontSize: RFValue(18, 816), color: "white" }}>
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
}

export default Disabled;
