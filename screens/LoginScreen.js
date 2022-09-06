import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  TouchableHighlight,
  BackHandler,
  Platform,
} from "react-native";
import firebase from "firebase";
import { CommonActions } from "@react-navigation/routers";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
let ScreenWidth = Dimensions.get("window").width;
let ScreenHeight = Dimensions.get("window").height;
import { Icon } from "react-native-elements";
import { auth, db, firestore } from "../firebase";
import {
  selectUser,
  login,
  selectUserType,
  setUserType,
  selectUserVerified,
  setUserVerified,
  setLoading,
  selectLoading,
} from "../features/userSlice";
import {
  setFoodList,
  setExerciseList,
  setFirebaseExerciseList,
} from "../features/foodSlice";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
//import * as Notifications from 'expo-notifications';
import { ActivityIndicator } from "react-native-paper";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { saveTokenInFirestore } from "../utils/tokenUtils";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: RFValue(20, 816),
    minHeight: ScreenHeight,
  },
  loginContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  loginNavigationButtons: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  loginContent: {
    marginVertical: RFValue(10, 816),
  },
  loginContentTextInput: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: RFValue(5, 816),
    padding: RFValue(10, 816),
    backgroundColor: "white",
  },
  loginContentTextInputFocus: {
    borderColor: "lightblue",
    borderWidth: 1,
    borderRadius: RFValue(5, 816),
    padding: RFValue(10, 816),
    backgroundColor: "white",
  },
});

function LoginScreen({ navigation }) {
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectLoading);
  const userType = useSelector(selectUserType);
  const userVerified = useSelector(selectUserVerified);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [emailFocus, setEmailFocus] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});

  const isFocused = useIsFocused();

  useEffect(() => {
    setLoading(false);
  }, ["", isFocused]);

  // useEffect(() => {
  //   BackHandler.addEventListener("hardwareBackPress", () => true);
  //   return () =>
  //     BackHandler.removeEventListener("hardwareBackPress", () => true);
  // }, [isFocused]);

  useFocusEffect(
    useCallback(() => {
      console.log("loginscreen ");
      console.log(user + "  " + userType);
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
          if (userVerified) {
            navigation.navigate("AthleteFlow");
          } else {
            //navigation.navigate("OnboardingAthlete");
          }
          */
        }
      }
    }, [user, userType, userVerified])
  );

  const loginUser = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((auth) => {
        db.collection("coaches")
          .where("email", "==", email)
          .get()
          .then(async (snap) => {
            if (!snap.empty) {
              setLoading(true);

              snap.forEach(function (doc) {
                const data = {
                  id: doc.id,
                  data: doc.data(),
                };
                setUserData(data);
              });

              // await getFoodListAndStore();
              await getExerciseAndStore();

              saveTokenInFirestore(email, "coach");
              setTimeout(() => {
                // navigation.navigate("CoachFlow");
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: "CoachFlow" }],
                  })
                );
                dispatch(setUserType("coach"));
                dispatch(login(auth.user.email));
              }, 1000);
            } else {
              db.collection("athletes")
                .where("email", "==", email)
                .get()
                .then(async (snap) => {
                  if (!snap.empty) {
                    setLoading(true);

                    // await getFoodListAndStore();
                    saveTokenInFirestore(email, "athlete");
                    setTimeout(() => {
                      snap.forEach(function (doc) {
                        dispatch(setUserVerified(doc.data().verified));
                      });
                      // navigation.navigate("AthleteFlow");
                      navigation.dispatch(
                        CommonActions.reset({
                          index: 0,
                          routes: [{ name: "AthleteFlow" }],
                        })
                      );
                      dispatch(setUserType("athlete"));
                      dispatch(login(auth.user.email));
                    }, 1000);
                  } else {
                    Alert.alert(
                      "Incorrect Login",
                      "Check your email and password",
                      [
                        {
                          text: "Cancel",
                          onPress: () => console.log("Cancel Pressed"),
                          style: "cancel",
                        },
                        {
                          text: "OK",
                          onPress: () => console.log("OK Pressed"),
                        },
                      ],
                      { cancelable: false }
                    );
                  }
                });
            }
          });
      })
      .catch((e) => alert(e.message));
  };

  // const getFoodListAndStore = () => {
  //   return new Promise((resolve, reject) => {
  //     fetch("https://rongoeirnet.herokuapp.com/getFood")
  //       .then((response) => response.json())
  //       .then((responseJson) => {
  //         //Successful response from the API Call
  //         // setServerData(responseJson.data);

  //         //Successful response from the API Call
  //         const tmpList = responseJson.data.map((item) => {
  //           return {
  //             calories: item.calories,
  //             carbs: item.carbs,
  //             fats: item.fats,
  //             name: item.name,
  //             protein: item.protein,
  //             servings: item.servings,
  //             servings2: item.servings2,
  //             units: item.units,
  //             units2: item.units2,
  //             __v: item.__v,
  //             _id: item._id,
  //           };
  //         });

  //         dispatch(setFoodList(tmpList));
  //         resolve();
  //       })
  //       .catch((error) => {
  //         resolve();
  //       });
  //   });
  // };

  const getExerciseAndStore = () => {
    return new Promise((resolve, reject) => {
      fetch("https://rongoeirnet.herokuapp.com/getexercise")
        .then((response) => response.json())
        .then((responseJson) => {
          console.log("getExerciseAndStore", responseJson);

          dispatch(setExerciseList(responseJson.data));
          var firebaseList = [];
          db.collection("coaches")
            .doc(userData?.id)
            .collection("ownWorkout")
            .get()
            .then((doc) => {
              doc.forEach((w) => {
                let tmp = w.data();
                tmp["_id"] = w.id;
                firebaseList.push(tmp);
              });
              console.log("firebaseList", firebaseList);
              dispatch(setFirebaseExerciseList(firebaseList));
              resolve();
            })
            .catch((error) => {
              console.log("Firebase", error);
              resolve();
            });
        })
        .catch((error) => {
          console.log("API", error);
          resolve();
        });
    });
  };

  function forgotPass() {
    navigation.navigate("ForgotPassword");
  }

  if (loading === true) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#C19F1E" />
        <Text
          style={{
            fontFamily: "SF-Pro-Text-regular",
            textAlign: "center",
            fontWeight: "bold",
            color: "black",
            fontSize: RFValue(22, 816),
            marginTop: 20,
          }}
        >
          Please wait while the app loads
        </Text>
      </View>
    );
  } else {
    return (
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 30,
            }}
          >
            <TouchableOpacity
              style={{
                marginRight: RFValue(20, 816),
              }}
              onPress={() => {
                navigation.navigate("OnBoarding");
              }}
            >
              <Icon name="chevron-left" type="font-awesome-5" color="black" />
            </TouchableOpacity>

            <Text
              style={{
                fontFamily: "SF-Pro-Text-regular",
                textAlign: "center",
                fontWeight: "bold",
                color: "black",
                fontSize: RFValue(24, 816),
              }}
            >
              Login
            </Text>
          </View>

          <Text
            style={{
              fontSize: RFValue(26, 816),
              fontFamily: "SF-Pro-Display-thin",
              fontWeight: "bold",
              marginTop: RFValue(30, 816),
              color: "black",
            }}
          >
            Welcome Back!
          </Text>

          <View
            style={{
              marginVertical: RFValue(10, 816),
              marginTop: RFValue(40, 816),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
                marginTop: RFValue(15, 816),
                marginBottom: RFValue(20, 816),
              }}
            ></View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <View
                style={{
                  width: "30%",
                  borderTopWidth: 0.8,
                  borderColor: "#253274",
                }}
              ></View>
              <Text
                style={{
                  fontSize: RFValue(12, 816),
                  color: "#253274",
                }}
              >
                Log In Using Email
              </Text>
              <View
                style={{
                  width: "30%",
                  borderTopWidth: 0.8,
                  borderColor: "#253274",
                }}
              ></View>
            </View>

            <View style={{ width: "100%" }}>
              <View style={{ width: "100%" }}>
                <Text style={{ color: "#253274", marginVertical: 10 }}>
                  Email
                </Text>
                <TextInput
                  style={[
                    emailFocus
                      ? styles.loginContentTextInputFocus
                      : styles.loginContentTextInput,
                    { paddingVertical: Platform.OS === "ios" ? 15 : 10 },
                  ]}
                  placeholder={`${emailFocus ? "" : "Email"}`}
                  autoCapitalize="none"
                  onFocus={() => {
                    setEmailFocus(true);
                    setPasswordFocus(false);
                  }}
                  value={email}
                  onChangeText={(val) => setEmail(val.trim())}
                />
              </View>
              <View>
                <Text style={{ color: "#253274", marginVertical: 10 }}>
                  Password
                </Text>
                <TextInput
                  style={[
                    passwordFocus
                      ? styles.loginContentTextInputFocus
                      : styles.loginContentTextInput,
                    { paddingVertical: Platform.OS === "ios" ? 15 : 10 },
                  ]}
                  placeholder={`${passwordFocus ? "" : "Password"}`}
                  secureTextEntry
                  onFocus={() => {
                    setEmailFocus(false);
                    setPasswordFocus(true);
                  }}
                  autoCompleteType="off"
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </View>
            <TouchableHighlight
              style={{
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 50,
                padding: RFValue(5, 816),
                marginTop: 10,
              }}
              activeOpacity={0.6}
              underlayColor="#DDDDDD"
              onPress={forgotPass}
            >
              <Text
                style={{
                  fontSize: RFValue(18, 816),
                  textAlign: "center",
                  marginLeft: RFValue(15, 816),
                  color: "#253274",
                }}
              >
                Forgot Password?
              </Text>
            </TouchableHighlight>

            <TouchableOpacity
              style={{
                marginTop: RFValue(15, 816),
                marginBottom: RFValue(15, 816),
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 50,
                padding: RFValue(10, 816),
                backgroundColor: "#C19F1E",
              }}
              onPress={loginUser}
            >
              <View>
                <Text
                  style={{
                    color: "white",
                    fontFamily: "SF-Pro-Display-regular",
                    fontSize: RFValue(18, 816),
                    textAlign: "center",
                  }}
                >
                  Log In
                </Text>
              </View>
            </TouchableOpacity>

            <Text
              style={{
                margin: RFValue(10, 816),
                textAlign: "center",
                color: "black",
              }}
            >
              New to Fitness App?
            </Text>

            <TouchableHighlight
              style={{
                marginTop: RFValue(5, 816),
                marginBottom: RFValue(5, 816),
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 50,
                padding: RFValue(10, 816),
              }}
              onPress={() => navigation.navigate("RegisterScreen")}
              activeOpacity={0.6}
              underlayColor="#DDDDDD"
            >
              <Text
                style={{
                  fontSize: RFValue(20, 816),
                  textAlign: "center",
                  fontWeight: "700",
                  marginLeft: RFValue(15, 816),
                  marginRight: RFValue(10, 816),
                  color: "black",
                }}
              >
                Create Account
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

export default LoginScreen;
