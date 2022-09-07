import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Dimensions,
  Platform,
  DatePickerIOS,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import ImagePicker1 from "react-native-image-crop-picker";
import { TextInput } from "react-native-paper";
import { db, auth } from "../utils/firebase";
import {
  selectUser,
  login,
  setUserVerified,
  setUserType,
} from "../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import DatePicker from "react-native-datepicker";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as firebase from "firebase";
import { Formik } from "formik";
import { RegisterValidationSchema } from "../screens/validations/RegisterScreenValidations";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import DocumentPicker from "react-native-document-picker";

let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;

import { Icon } from "react-native-elements";
import sendPushNotification from "../utils/sendPushNotification";
import { saveTokenInFirestore } from "../utils/tokenUtils";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: RFValue(50, 816),
    backgroundColor: "white",
  },
  registerContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: RFValue(10, 816),
  },
  registerContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: RFValue(10, 816),
  },
  imageContainer: {
    flexDirection: "row",
    marginBottom: 0,
  },
  image: {
    margin: RFValue(10, 816),
    width: RFValue(100, 816),
    height: RFValue(100, 816),
    borderRadius: 100,
    backgroundColor: "grey",
  },
});

function RegisterScreen({ navigation }) {
  const [values, setValues] = useState(null);
  const [errMessage, setErrMessage] = useState("");
  const [imageUrl, setImageUrl] = useState(
    "https://firebasestorage.googleapis.com/v0/b/jumpstartwithsudee-80502.appspot.com/o/userImage.jpeg?alt=media&token=a6756f49-9e4d-4cc8-89ea-0a97de7ad376"
  );
  const [pin, setPin] = useState(null);
  const user = useSelector(selectUser);

  const dispatch = useDispatch();
  const [userType, setuserType] = useState("Athlete");
  const [userGender, setUserGender] = useState("");
  const [userTypeError, setUserTypeError] = useState(true);
  const [heightError, setHeightError] = useState(true);
  const [height, setHeight] = useState("");
  const [weightError, setWeightError] = useState(true);
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [coachIds, setCoachIds] = useState([]);

  useEffect(() => {
    db.collection("coaches").onSnapshot((snapshot) =>
      setCoachIds(snapshot.docs.map((doc) => doc.id))
    );
  }, []);

  useEffect(() => {
    height == "" ? setHeightError(true) : setHeightError(false);
    weight == "" ? setWeightError(true) : setWeightError(false);
    userType == "" ? setUserTypeError(true) : setUserTypeError(false);
  }, [userType, height, weight]);

  useEffect(() => {
    db.collection("counter")
      .doc("Ecea3D4sVoY1rb2BCP6S")
      .get()
      .then(function (doc) {
        if (doc.exists) {
          setPin(doc.data().count);
        } else {
          console.log("No such document!");
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
  }, [user]);

  const requestCameraPermission = async (type) => {
    if (Platform.OS === "ios") {
      // because ios not need permissions asking
      return imagePicker(type);
    }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Give permission to use Camera",
          message: "Fitness App needs access to your camera ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        imagePicker(type);
      } else {
        Alert.alert("Warning", "ritik needs access to your camera ", [
          {
            text: "Okay",
            onPress: () => null,
          },
        ]);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const imagePicker = (type) => {
    if (type == "gallery") {
      ImagePicker1.clean().catch((e) => {
        console.log(e);
      });
      ImagePicker1.openPicker({
        width: 900,
        height: 1200,
        cropping: true,
      }).then((image) => {
        setImageUrl(image.path);
      });
    } else {
      ImagePicker1.clean().catch((e) => {
        console.log(e);
      });
      ImagePicker1.openCamera({
        width: 900,
        height: 1200,
        cropping: true,
      }).then((image) => {
        setModalVisible(false);
        setImageUrl(image.path);
        profPicUpload(image.path).then(async () => {
          await firestore()
            .collection("Users")
            .doc(docId)
            .update({
              profImgExtension: profileImage
                ? profileImage.uri.substr(image.path.lastIndexOf(".") + 1)
                : profImgExtension,
            })
            .then(() => {
              console.log("Photo updated!");
              setLoading(false);
            })
            .catch((error) => {
              setLoading(false);
              console.log(error);
            });
        });
      });
    }
  };

  const getImageFromCamera = async () => {
    const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
    // const cameraRollPermission = await Permissions.askAsync(
    //   Permissions.CAMERA_ROLL
    // );

    if (
      cameraPermission.status === "granted"
      // &&
      // cameraRollPermission.status === "granted"
    ) {
      let capturedImage = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [3, 3],
      });
      if (!capturedImage.cancelled) {
        setImageUrl(capturedImage.uri);
      }
    }
  };

  const getImageFromGallery = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      if (result.uri) {
        console.log(result);
        setImageUrl(result.uri);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
      }
    }
  };

  const uploadImage = async (values) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const childPath = `images/${values.email}`;

    const task = firebase.storage().ref().child(childPath).put(blob);

    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        registerAthlete(snapshot, values);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };

  // const processImage = async (imageUri) => {
  //   let processedImage = await ImageManipulator.manipulate(
  //     imageUri,
  //     [{ resize: { width: 400 } }],
  //     { format: "png" }
  //   );
  //   console.log(processedImage);
  //   setImageUrl(processedImage.uri);
  // };

  const registerAthlete = async (snapshot, values) => {
    await auth
      .createUserWithEmailAndPassword(values.email, values.password)
      .then((auth) => {
        // navigation.navigate("AthleteFlow");
        dispatch(login(auth.user.email));
        dispatch(setUserType("athlete"));
        db.collection("athletes")
          .add({
            name: values.name,
            phone: values.phone,
            email: values.email,
            gender: userGender,
            dob: values.date,
            address: values.address,
            listOfCoaches: [],
            imageUrl: snapshot,
            metrics: data,
            verified: false,
            height: height,
            weight: weight,
            completedWorkouts: 0,
            averageWorkoutTime: 0,
            goalsMet: 0,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),

            diet: {
              name: "weight maintainance",
              carbs: 3.5 * weight,
              protein: 1.5 * weight,
              fat: 1 * weight,
              calories: 4 * 3.5 * weight + 4 * 1.5 * weight + 9 * 1 * weight,
            },
          })
          .then((doc) => {
            saveTokenInFirestore(values.email, "athlete");

            coachIds.map((c) => {
              db.collection("coaches")
                .doc(c)
                .update({
                  pendingInvites: firebase.firestore.FieldValue.increment(1),
                });

              var userIdList = [];
              userIdList.push(c);
              sendPushNotification(coachIds, {
                title: `Invite Request`,
                body: `${values.name} has sent a request to be your athlete!`,
              });

              db.collection("invites").add({
                coach: c,
                athlete: doc.id,
                name: values.name,
                imageUrl: imageUrl ? imageUrl : "",
                email: values.email,
                phone: values.phone,
              });

              db.collection("CoachNotifications")
                .doc(c)
                .collection("notifications")
                .add(
                  {
                    message: `${values.name} has sent a request to be your athlete! `,
                    seen: false,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    athlete_id: doc.id,
                  },
                  { merge: true }
                );
            });

            return doc.collection("metrics").doc(date).set({
              weight: weight,
              height: height,
            });
          });
      })
      .catch((e) => setErrMessage(e.message));
  };

  const registerCoach = async (snapshot, values) => {
    auth
      .createUserWithEmailAndPassword(values.email, values.password)
      .then((auth) => {
        db.collection("coaches").add({
          name: values.name,
          phone: values.phone,
          email: values.email,
          gender: userGender,
          dob: values.date,
          address: values.address,
          pin: pin,
          imageUrl: snapshot,
          sports: [],
          videolink: "https://meet.google.com/zkc-cqcj-gzb",
          listOfAthletes: [],
        });

        db.collection("counter")
          .doc("Ecea3D4sVoY1rb2BCP6S")
          .update({
            count: pin + 1,
          });
        navigation.navigate("CoachFlow");
        //navigation.navigate("CoachInfo");
        dispatch(login(auth.user.email));
        dispatch(setUserType("coach"));
        //dispatch(setUserDetails(auth.user));
      })
      .catch((e) => setErrMessage(e.message));
  };

  var key = date;
  console.log(date, "date is here");
  var val = {
    height: parseFloat(height),
    weight: parseFloat(weight),
  };

  const data = {};

  data[key] = val;

  const registerUser = async (values) => {
    if (
      moment(values.date, "DD-MM-YYYY").isAfter(
        moment(new Date(), "DD-MM-YYYY"),
        "day"
      )
    ) {
      alert("Date of birth invalid. Please select an appropriate date.");
    } else if (
      imageUrl !=
      "https://firebasestorage.googleapis.com/v0/b/jumpstartwithsudee-80502.appspot.com/o/userImage.jpeg?alt=media&token=a6756f49-9e4d-4cc8-89ea-0a97de7ad376"
    ) {
      uploadImage(values);
    } else {
      await auth
        .createUserWithEmailAndPassword(values.email, values.password)
        .then((auth) => {
          console.log("mail id created");
          navigation.navigate("AthleteFlow", {
            verified: false,
          });
          // navigation.navigate("OnboardingAthlete");
          dispatch(login(auth.user.email));
          dispatch(setUserVerified(false));
          dispatch(setUserType("athlete"));
          // navigation.navigate("VerifyAthlete");
          db.collection("athletes")
            .add({
              name: values.name,
              phone: values.phone,
              email: values.email,
              gender: userGender,
              dob: values.date,
              address: values.address,
              listOfCoaches: [],
              imageUrl: imageUrl,
              metrics: data,
              verified: false,
              height: height,
              weight: weight,
              completedWorkouts: 0,
              averageWorkoutTime: 0,
              goalsMet: 0,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              diet: {
                name: "weight maintainance",
                carbs: 3.5 * weight,
                protein: 1.5 * weight,
                fat: 1 * weight,
                calories: 4 * 3.5 * weight + 4 * 1.5 * weight + 9 * 1 * weight,
              },
            })
            .then((doc) => {
              saveTokenInFirestore(values.email, "athlete");
              coachIds.map((c) => {
                db.collection("coaches")
                  .doc(c)
                  .update({
                    pendingInvites: firebase.firestore.FieldValue.increment(1),
                  });

                var userIdList = [];
                userIdList.push(c);
                sendPushNotification(coachIds, {
                  title: `Invite Request`,
                  body: `${values.name} has sent a request to be your athlete!`,
                });

                db.collection("invites").add({
                  coach: c,
                  athlete: doc.id,
                  name: values.name,
                  imageUrl: imageUrl ? imageUrl : "",
                  email: values.email,
                  phone: values.phone,
                });

                db.collection("CoachNotifications")
                  .doc(c)
                  .collection("notifications")
                  .add(
                    {
                      message: `${values.name} has sent a request to be your athlete! `,
                      seen: false,
                      timestamp:
                        firebase.firestore.FieldValue.serverTimestamp(),
                      athlete_id: doc.id,
                    },
                    { merge: true }
                  );
              });

              return doc.collection("metrics").doc(date).set({
                weight: weight,
                height: height,
              });
            });
        })
        .catch((e) => setErrMessage(e.message));

      // } else if (userType === "Coach") {
      //   auth
      //     .createUserWithEmailAndPassword(values.email, values.password)
      //     .then((auth) => {
      //       db.collection("coaches").add({
      //         name: values.name,
      //         phone: values.phone,
      //         email: values.email,
      //         gender: userGender,
      //         dob: values.date,
      //         address: values.address,
      //         imageUrl: imageUrl,
      //         sports: [],
      //         listOfAthletes: [],
      //         pin,
      //         videolink: "https://meet.jit.si/ritik-" + pin,
      //         createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      //       });

      //       db.collection("counter")
      //         .doc("nPT9xINm51aJYqU3UOqI")
      //         .update({
      //           count: pin + 1,
      //         });
      //       navigation.navigate("CoachFlow");
      //       //navigation.navigate("CoachInfo");
      //       dispatch(login(auth.user.email));
      //       dispatch(setUserType("coach"));
      //       //dispatch(setUserDetails(auth.user));
      //     })
      //     .catch((e) => setErrMessage(e.message));
    }
  };

  return (
    <KeyboardAvoidingView
      // keyboardVerticalOffset={Header.HEIGHT + 20} // adjust the value here if you need more padding
      style={{ flex: 1 }}
      behavior="padding"
    >
      <ScrollView
      // showsVerticalScrollIndicator={false}
      // enableResetScrollToCoords={false}
      >
        <View style={styles.container}>
          <View
            style={{
              position: "absolute",
              left: 25,
              top: 50,
              zIndex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={{
                marginRight: RFValue(20, 816),
              }}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Icon name="chevron-left" type="font-awesome-5" />
            </TouchableOpacity>

            <Text
              style={{
                fontSize: RFValue(28, 816),
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
              }}
            >
              Account Creation
            </Text>
          </View>
          <View
            style={[styles.imageContainer, { marginTop: RFValue(40, 816) }]}
          >
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                marginLeft: RFValue(20, 816),
              }}
            >
              <TouchableOpacity
                style={{ marginVertical: RFValue(15, 816) }}
                onPress={getImageFromCamera}
              >
                <AntDesign name="camera" size={RFValue(24, 816)} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => requestCameraPermission("gallery")}
              >
                <FontAwesome name="photo" size={RFValue(24, 816)} />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={[
              styles.registerContainer,
              { width: "100%", padding: RFValue(20, 816) },
            ]}
          >
            <Formik
              validationSchema={RegisterValidationSchema}
              initialValues={{
                email: "",
                password: "",
                password2: "",
                name: "",
                phone: "",
                address: "",
                date: "",
              }}
              onSubmit={(values) => {
                values.email = values.email.toLowerCase();
                if (userType == "Athlete") {
                  if (height != "" && weight != "") {
                    setValues(values);
                    registerUser(values);
                  } else {
                    height == "" ? setHeightError(true) : null;
                    weight == "" ? setWeightError(true) : null;
                  }
                } else {
                  setValues(values);
                  registerUser(values);
                }
              }}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                isValid,
              }) => (
                <>
                  <View style={{ width: "100%" }}>
                    <TextInput
                      placeholder={"Name"}
                      error={errors.name}
                      theme={{
                        colors: {
                          primary: "rgba(0,0,0,0.7)",
                          underlineColor: "transparent",
                        },
                      }}
                      value={values.name}
                      label="Name"
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                      mode={"outlined"}
                      style={{
                        backgroundColor: "white",
                        width: "100%",
                        paddingVertical: Platform.OS === "ios" ? 15 : 0,
                      }}
                    />
                    {errors.name && (
                      <Text
                        style={{ fontSize: RFValue(10, 816), color: "red" }}
                      >
                        {errors.name}
                      </Text>
                    )}
                  </View>

                  {/* <View style={{ width: ScreenWidth - RFValue(40, 816) }}>
                  <Text
                    style={{
                      marginTop: RFValue(10, 816),
                      marginLeft: RFValue(5, 816),
                      marginBottom: -10,
                    }}
                  >
                    Are you an Athlete or a Coach?
                  </Text>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: RFValue(10, 816),
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-evenly",
                        marginVertical: 10,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          width: "50%",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => setuserType("Athlete")}
                          style={{
                            padding: 5,
                            borderRadius: 100,
                            borderWidth: 1,
                            marginRight: 10,
                          }}
                        >
                          <View
                            style={{
                              backgroundColor:
                                userType == "Athlete" ? "black" : "white",
                              width: RFValue(10, 816),
                              height: RFValue(10, 816),
                              borderRadius: 100,
                            }}
                          ></View>
                        </TouchableOpacity>
                        <Text style={{ color: "black" }}>Athlete</Text>
                      </View>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <TouchableOpacity
                          onPress={() => setuserType("Coach")}
                          style={{
                            padding: 5,
                            borderRadius: 100,
                            borderWidth: 1,
                            marginRight: 10,
                          }}
                        >
                          <View
                            style={{
                              backgroundColor:
                                userType == "Coach" ? "black" : "white",
                              width: RFValue(10, 816),
                              height: RFValue(10, 816),
                              borderRadius: 100,
                            }}
                          ></View>
                        </TouchableOpacity>
                        <Text style={{ color: "black" }}>Coach</Text>
                      </View>
                    </View>
                  </View>
                  {userTypeError && (
                    <Text
                      style={{
                        fontSize: RFValue(10, 816),
                        color: "red",
                        marginLeft: 5,
                      }}
                    >
                      Required
                    </Text>
                  )}
                </View> */}

                  <View style={{ width: ScreenWidth - RFValue(40, 816) }}>
                    <Text
                      style={{
                        marginTop: RFValue(10, 816),
                        marginLeft: RFValue(5, 816),
                        marginBottom: -10,
                      }}
                    >
                      Gender
                    </Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: RFValue(10, 816),
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-evenly",
                          marginVertical: 10,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            width: "50%",
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => setUserGender("female")}
                            style={{
                              padding: 5,
                              borderRadius: 100,
                              borderWidth: 1,
                              marginRight: 10,
                            }}
                          >
                            <View
                              style={{
                                backgroundColor:
                                  userGender == "female" ? "black" : "white",
                                width: RFValue(10, 816),
                                height: RFValue(10, 816),
                                borderRadius: 100,
                              }}
                            ></View>
                          </TouchableOpacity>
                          <Text style={{ color: "black" }}>Female</Text>
                        </View>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <TouchableOpacity
                            onPress={() => setUserGender("male")}
                            style={{
                              padding: 5,
                              borderRadius: 100,
                              borderWidth: 1,
                              marginRight: 10,
                            }}
                          >
                            <View
                              style={{
                                backgroundColor:
                                  userGender == "male" ? "black" : "white",
                                width: RFValue(10, 816),
                                height: RFValue(10, 816),
                                borderRadius: 100,
                              }}
                            ></View>
                          </TouchableOpacity>
                          <Text style={{ color: "black" }}>Male</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={{ width: "100%", marginTop: RFValue(10, 816) }}>
                    <TextInput
                      error={errors.phone}
                      placeholder={"Phone"}
                      theme={{
                        colors: {
                          primary: "rgba(0,0,0,0.7)",
                          underlineColor: "transparent",
                        },
                      }}
                      value={values.phone}
                      mode={"outlined"}
                      label="Phone"
                      onChangeText={handleChange("phone")}
                      onBlur={handleBlur("phone")}
                      style={{
                        backgroundColor: "white",
                        width: "100%",
                        paddingVertical: Platform.OS === "ios" ? 15 : 0,
                      }}
                    />
                    {errors.phone && (
                      <Text
                        style={{ fontSize: RFValue(10, 816), color: "red" }}
                      >
                        {errors.phone}
                      </Text>
                    )}
                  </View>

                  <View style={{ marginVertical: 5 }}>
                    {/*Platform.OS === 'ios'?
               <DatePickerIOS
               //style={{marginTop:-RFValue(80,816),marginBottom:-RFValue(80,816)}}
               date={new Date(moment(values.date,"DD-MM-YYYY"))}
               onDateChange={handleChange("date")}
               timeZoneOffsetInMinutes={5*60 + 30}
             />
                  : */}
                    <DatePicker
                      style={{
                        width: ScreenWidth - RFValue(40, 816),
                        marginVertical: RFValue(10, 816),
                        marginBottom: 0,
                        borderWidth: 0.5,
                        padding: RFValue(10, 816),
                        borderRadius: 5,
                      }}
                      date={values.date}
                      mode="date"
                      placeholder="Select Date of Birth*"
                      format="DD-MM-YYYY"
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      maxDate={Platform.OS === "ios" ? "" : new Date()}
                      customStyles={{
                        dateIcon: {
                          position: "absolute",
                          left: 0,
                          top: 4,
                          marginLeft: 0,
                        },
                        dateInput: {
                          marginLeft: RFValue(36, 816),
                          borderRadius: RFValue(5, 816),
                          borderColor: "#ddd",
                          borderWidth: 0,
                        },
                        // ... You can check the source to find the other keys.
                      }}
                      onDateChange={handleChange("date")}
                    />
                  </View>
                  {errors.date && (
                    <Text
                      style={{
                        fontSize: RFValue(10, 816),
                        color: "red",
                        textAlign: "left",
                        alignSelf: "flex-start",
                      }}
                    >
                      {errors.date}
                    </Text>
                  )}
                  <View style={{ width: "100%", marginTop: 10 }}>
                    <TextInput
                      placeholder={"Address"}
                      error={errors.address}
                      theme={{
                        colors: {
                          primary: "rgba(0,0,0,0.7)",
                          underlineColor: "transparent",
                        },
                      }}
                      label="Address"
                      mode={"outlined"}
                      value={values.address}
                      onChangeText={handleChange("address")}
                      onBlur={handleBlur("address")}
                      style={{
                        backgroundColor: "white",
                        width: "100%",
                        paddingVertical: Platform.OS === "ios" ? 15 : 0,
                      }}
                    />
                    {errors.address && (
                      <Text
                        style={{ fontSize: RFValue(10, 816), color: "red" }}
                      >
                        {errors.address}
                      </Text>
                    )}
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <View style={{ width: "40%" }}>
                      <TextInput
                        placeholder={"Height (cms)"}
                        error={heightError}
                        keyboardType="numeric"
                        theme={{
                          colors: {
                            primary: "rgba(0,0,0,0.7)",
                            underlineColor: "transparent",
                          },
                        }}
                        label="Height (cms)"
                        mode={"outlined"}
                        value={height}
                        onChangeText={(text) => setHeight(text)}
                        style={{
                          backgroundColor: "white",
                          width: "100%",
                          marginTop: RFValue(20, 816),
                          paddingVertical: Platform.OS === "ios" ? 15 : 0,
                        }}
                      />
                      {heightError && (
                        <Text
                          style={{ fontSize: RFValue(10, 816), color: "red" }}
                        >
                          Required
                        </Text>
                      )}
                    </View>
                    <View style={{ width: "40%" }}>
                      <TextInput
                        placeholder={"Weight"}
                        error={weightError}
                        keyboardType="numeric"
                        theme={{
                          colors: {
                            primary: "rgba(0,0,0,0.7)",
                            underlineColor: "transparent",
                          },
                        }}
                        label="Weight (kgs)"
                        mode={"outlined"}
                        value={weight}
                        onChangeText={setWeight}
                        style={{
                          backgroundColor: "white",
                          width: "100%",
                          marginTop: RFValue(20, 816),
                          paddingVertical: Platform.OS === "ios" ? 15 : 0,
                        }}
                      />
                      {weightError && (
                        <Text
                          style={{ fontSize: RFValue(10, 816), color: "red" }}
                        >
                          Required
                        </Text>
                      )}
                    </View>
                  </View>

                  <View style={{ width: "100%" }}>
                    <TextInput
                      placeholder={"Email"}
                      error={errors.email}
                      theme={{
                        colors: {
                          primary: "rgba(0,0,0,0.7)",
                          underlineColor: "transparent",
                        },
                      }}
                      label="Email"
                      mode={"outlined"}
                      value={values.email}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      style={{
                        backgroundColor: "white",
                        width: "100%",
                        marginTop: RFValue(20, 816),
                        paddingVertical: Platform.OS === "ios" ? 15 : 0,
                      }}
                    />
                    {errors.email && (
                      <Text
                        style={{ fontSize: RFValue(10, 816), color: "red" }}
                      >
                        {errors.email}
                      </Text>
                    )}
                  </View>
                  <View style={{ width: "100%" }}>
                    <TextInput
                      placeholder={"Password"}
                      secureTextEntry={true}
                      error={errors.password}
                      theme={{
                        colors: {
                          primary: "rgba(0,0,0,0.7)",
                          underlineColor: "transparent",
                        },
                      }}
                      label="Password"
                      mode={"outlined"}
                      value={values.password}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      style={{
                        backgroundColor: "white",
                        width: "100%",
                        marginTop: RFValue(20, 816),
                        paddingVertical: Platform.OS === "ios" ? 15 : 0,
                      }}
                    />
                    {errors.password && (
                      <Text
                        style={{ fontSize: RFValue(10, 816), color: "red" }}
                      >
                        {errors.password}
                      </Text>
                    )}
                  </View>
                  <View style={{ width: "100%" }}>
                    <TextInput
                      placeholder="Confirm Password"
                      error={errors.password2}
                      secureTextEntry={true}
                      theme={{
                        colors: {
                          primary: "rgba(0,0,0,0.7)",
                          underlineColor: "transparent",
                        },
                      }}
                      label="Confirm Password"
                      mode={"outlined"}
                      value={values.password2}
                      onChangeText={handleChange("password2")}
                      onBlur={handleBlur("password2")}
                      style={{
                        backgroundColor: "white",
                        width: "100%",
                        marginTop: RFValue(20, 816),
                        paddingVertical: Platform.OS === "ios" ? 15 : 0,
                      }}
                    />
                    {errors.password2 && (
                      <Text
                        style={{ fontSize: RFValue(10, 816), color: "red" }}
                      >
                        {errors.password2}
                      </Text>
                    )}
                  </View>

                  <View>
                    <Text
                      style={{ color: "black", fontSize: RFValue(18, 816) }}
                    >
                      {errMessage ? errMessage : null}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={{
                      height: RFValue(52, 816),
                      width: ScreenWidth - RFValue(100, 816),
                      marginTop: RFValue(15, 816),
                      marginBottom: RFValue(45, 816),
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 50,
                      backgroundColor: "#C19F1E",
                      borderWidth: 1,
                      borderColor: "white",
                    }}
                    onPress={handleSubmit}
                    disabled={!isValid}
                  >
                    <View>
                      <Text
                        style={{
                          color: "white",
                          fontFamily: "SF-Pro-Display-regular",
                          fontSize: RFValue(20, 816),
                        }}
                      >
                        Register
                      </Text>
                    </View>
                  </TouchableOpacity>
                </>
              )}
            </Formik>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default RegisterScreen;
