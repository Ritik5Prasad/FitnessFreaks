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
  PermissionsAndroid,
  Alert,
} from "react-native";
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
import { removeTokenFromFirestore } from "../utils/tokenUtils";
import { useDispatch, useSelector } from "react-redux";
import ImagePicker1 from "react-native-image-crop-picker";
import {
  selectUserData,
  selectUser,
  selectTemperoryId,
  selectUserType,
  setTemperoryData,
  logout
} from "../features/userSlice";
import { db,auth,firestore} from "../firebase";
import * as firebase from "firebase";
import { StackActions } from "@react-navigation/native";
import WorkoutCard from "./components/WorkoutCard";
import NutritionCard from "./components/NutritionCard";
import { Picker } from "@react-native-picker/picker";
import { TextInput as RNTextInput } from "react-native-paper";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
//import auth from '@react-native-firebase/auth';
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

import { ActivityIndicator } from "react-native-paper";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Profile({ props, navigation }) {
  const user = useSelector(selectUser);
  const userDataId = useSelector(selectUserData);
  const dispatch = useDispatch();
  const userType = useSelector(selectUserType);
  const temperoryId = useSelector(selectTemperoryId);
  const temperoryData = useSelector(setTemperoryData);
  const [phone, setphone] = useState("");
  const [email, setemail] = useState("");
  const [editable, seteditable] = useState(false);
  const [userData, setUserData] = useState(null);
  const userData1 = useSelector(selectUserData);
  const [requestDate, setRequestDate] = useState(formatDate());
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

  const [editCal, setEditCal] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [reload, setreload] = useState(true);
  const [isLoading, setisLoading] = useState(false);
  const [ownWorkouts, setOwnWorkouts] = useState([]);
  const [athleteUser, setAthleteUser] = useState({});

  useEffect(() => {
    setCalories(String(carbs * 4 + protein * 4 + fat * 9));
  }, [fat, protein, carbs]);

  useEffect(() => {
    if (userData1?.id) {
      db.collection("AthleteWorkouts")
        .doc(userData1?.id)
        .collection(formatSpecificDate(new Date()))
        .onSnapshot((snapshot) =>
          setOwnWorkouts(
            snapshot.docs.map((doc) => ({ id: doc.id, workouts: doc.data() }))
          )
        );
      console.log("hey", ownWorkouts);
    }
  }, [userData1?.id]);

  const ChangePlan = (calories) => {
    console.log(1, 2, calories);

    if (weight && weight != 0) {
      if (diet == "Weight Maintenance") {
        setCalories(
          String(4 * 1.5 * weight + 4 * 3.5 * weight + 9 * 1 * weight)
        );
        setCarbs(String(3.5 * weight));
        setFat(String(1 * weight));
        setProtein(String(1.5 * weight));
      } else if (diet == "High Performance") {
        setCalories(
          String(4 * 1.5 * weight + 4 * 6 * weight + 0.8 * 9 * weight)
        );
        setCarbs(String(6 * weight));
        setFat(String(0.8 * weight));
        setProtein(String(1.5 * weight));
      } else if (diet == "Fat Loss") {
        setCalories(String(4 * 2 * weight + 4 * 3 * weight + 1 * 9 * weight));
        setCarbs(String(2 * weight));
        setFat(String(1 * weight));
        setProtein(String(2 * weight));
      }
    }
  };

  const ChangeDiet = (diet) => {
    if (weight && weight != 0) {
      if (diet == "Weight Maintenance") {
        setCalories(
          String(4 * 1.5 * weight + 4 * 3.5 * weight + 9 * 1 * weight)
        );
        setCarbs(String(3.5 * weight)); // .5 abd 4
        setFat(String(1 * weight)); //.3 and 9
        setProtein(String(1.5 * weight)); // .2 and 4
      } else if (diet == "High Performance") {
        setCalories(
          String(4 * 1.5 * weight + 4 * 6 * weight + 0.8 * 9 * weight)
        );
        setCarbs(String(6 * weight)); // .6 and 4
        setFat(String(0.8 * weight)); // .1 and 9
        setProtein(String(1.5 * weight)); //.3 and 4
      } else if (diet == "Fat Loss") {
        setCalories(String(4 * 2 * weight + 4 * 3 * weight + 1 * 9 * weight));
        setCarbs(String(2 * weight)); // .3 and 4
        setFat(String(1 * weight)); //  .3 and 9
        setProtein(String(2 * weight)); //  .4 and 4
      }
    }
  };

  function formatDate() {
    var d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

   const deleteUserHandler = () => {
 
    Alert.alert('Are you sure you want to delete your account?','', [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress:async () => {
          await auth.currentUser.delete().then(
            await  db.collection("athletes")
            .doc(userDataId.id)
            .delete())
            .then(async function () {
            await removeTokenFromFirestore(userDataId.id);
            await dispatch(logout());
            navigation.dispatch(
              StackActions.replace("LoginScreen", { test: "Test Params" })
            );
            console.log('delete successful')
            
            
            navigation.navigate("LoginScreen");
            navigation.closeDrawer();
            alert("Account Deleted Successfully!")
          
            
              
          }).catch(function (error) {
            console.error({error})
          })
        }
      }
      
    ])
  };

 
  useEffect(() => {
    if (userType === "coach") {
      db.collection("athletes")
        .doc(temperoryId)
        .get()
        .then(function (snap) {
          setUserData({
            id: temperoryId,
            data: snap.data(),
          });

          setAthleteUser({
            id: temperoryId,
            data: snap.data(),
          });

          setphone(snap.data().phone);
          setemail(snap.data().email);
          setDiet(
            snap.data()?.diet ? snap.data().diet.name : "Weight Maintenance"
          );
          setCarbs(snap?.data()?.diet ? snap.data().diet.carbs : "300");
          setFat(snap.data()?.diet ? snap.data().diet.fat : "50");
          setProtein(snap.data()?.diet ? snap.data().diet.protein : "70");
          setCalories(snap?.data()?.diet ? snap.data().diet.calories : "1930");
          setWeight(snap?.data()?.weight ? snap.data().weight : "80");
          dispatch(
            setTemperoryData({
              id: temperoryId,
              data: snap.data(),
            })
          );
          ChangeDiet();
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    } else {
      db.collection("athletes")
        .where("email", "==", user)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            setUserData({
              id: doc.id,
              data: doc.data(),
            });
            setphone(doc.data().phone);
            setemail(doc.data().email);
            setDiet(
              doc.data()?.diet?.name
                ? doc.data().diet.name
                : "Weight Maintenance"
            );
            setCarbs(doc?.data()?.diet?.carbs ? doc.data().diet.carbs : "300");
            setFat(doc.data()?.diet?.fat ? doc.data().diet.fat : "60");
            setProtein(
              doc.data()?.diet?.protein ? doc.data().diet.protein : "100"
            );
            setCalories(
              doc?.data()?.diet?.calories ? doc.data().diet.calories : "2140"
            );
            setWeight(doc?.data()?.weight ? doc.data().weight : "80");
          });
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    }
  }, [user, temperoryId, reload]);

  function formatSpecificDate(d) {
    var d = new Date(d),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  useEffect(() => {
    if (userData) {
      var unsub1 = db
        .collection("workouts")
        .where("assignedToId", "==", userData?.id)
        //.where("date", "==", formatDate())
        .where("completed", "==", false)
        .limit(1)
        .onSnapshot((snapshot) => {
          setWorkouts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });

      var unsub2 = db
        .collection("workouts")
        .where("assignedToId", "==", userData?.id)
        .where("completed", "==", true)
        //.orderBy("date","desc")
        .limit(1)
        .onSnapshot((snapshot) => {
          setPastWorkouts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });

      db.collection("Food")
        .where("assignedTo_id", "==", userData?.id)
        .where("selectedDays", "array-contains", formatSpecificDate(new Date()))
        .get()
        .then((snapshot) => {
          setNutrition(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });

      return () => {
        unsub1();
        unsub2();
      };
    }
  }, [userData?.id, requestDate]);

  function TimeToMinutes(time) {
    var hms = time; // your input string
    var a = hms.split(":"); // split it at the colons

    // Hours are worth 60 minutes.
    var minutes = +a[0] * 60 + +a[1];

    return minutes;
  }

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
        Alert.alert(
          "Warning",
          "Fitness App needs access to your camera ",
          [
            {
              text: "Okay",
              onPress: () => null,
            },
          ]
        );
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

  const GenerateMarkedImage = (uri) => {
    Marker.markImage({
      src: "file://" + uri,
      markerSrc:
        "https://firebasestorage.googleapis.com/v0/b/triden-workout-app.appspot.com/o/website%2Fritik%20-%20BlackYellow-01%20(1).png?alt=media&token=91afea86-4baf-4df7-8c27-d949ed00f37f",
      position: "topRight",
      scale: 1,
      markerScale: 0.2,
      quality: 100,
      saveFormat: "png",
    }).then((local_path) => {
      var text = "";
      if (
        postWorkout.workoutDuration &&
        postWorkout.workoutDuration != undefined
      ) {
        text =
          route.params?.workoutName +
          " Duration: " +
          postWorkout?.workoutDuration;
      } else {
        text = route.params?.workoutName;
      }

      Marker.markText({
        src: "file://" + local_path,
        text: text,
        position: "bottomLeft",
        color: "black",
        fontName: "Helvetica",
        fontSize: RFValue(40, 816),
        scale: 1,
        quality: 100,
        saveFormat: "png",
      }).then((res) => {
        setPath("file://" + res);
        uploadImage("file://" + res);
      });
    });
  };

  const getImageFromCamera = async () => {
    const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
    // const cameraRollPermission = await Permissions.askAsync(
    //   Permissions.CAMERA
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
        GenerateMarkedImage(capturedImage.uri);
      }
    }
  };

 

  const uploadImage = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const childPath = `images/${userData.data.email}/workouts`;

    const task = firebase.storage().ref().child(childPath).put(blob);

    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        //setPath(snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log("upload " + snapshot);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
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

  useEffect(() => {
    const uploadImage = async () => {
      if (imageUrl) {
        setisLoading(true);
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const childPath = `images/${userData.data.email}/chat`;

        const task = firebase.storage().ref().child(childPath).put(blob);

        const taskProgress = (snapshot) => {
          console.log(`transferred: ${snapshot.bytesTransferred}`);
        };

        const taskCompleted = () => {
          task.snapshot.ref.getDownloadURL().then((snapshot) => {
            if (userType == "athlete") {
              db.collection("athletes")
                .doc(userData?.id)
                .update({
                  imageUrl: snapshot,
                })
                .then(() => {
                  setreload(!reload);
                })
                .catch(function (error) {
                  console.log("Error getting documents: ", error);
                  alert("failed, try again later");
                });
            }
            if (userType == "coach") {
              db.collection("coach")
                .doc(userData?.id)
                .update({
                  imageUrl: snapshot,
                })
                .then(() => {
                  setreload(!reload);
                })
                .catch(function (error) {
                  console.log("Error getting documents: ", error);
                  alert("failed, try again later");
                });
            }
            setisLoading(false);
          });
        };

        const taskError = (snapshot) => {
          console.log(snapshot);
          alert("failed, try again later");
          setisLoading(false);
        };

        task.on("state_changed", taskProgress, taskError, taskCompleted);
      }
    };
    uploadImage();
  }, [imageUrl]);

  useEffect(() => {
    let temp = [];
    if (userData?.id) {
      db.collection("AthleteNutrition")
        .doc(userType == "coach" ? temperoryId : userData?.id)
        .collection("nutrition")
        .doc(formatSpecificDate(new Date()))
        .get()
        .then((doc) => {
          if (doc.data()?.entireFood) {
            let tempCal = 0;
            let tempCarbs = 0;
            let tempFat = 0;
            let tempProtein = 0;
            //setEntireFood(doc.data()?.entireFood);
            doc.data()?.entireFood.map((foodContainer) => {
              foodContainer.food.map((f) => {
                tempCal = tempCal + f.calories;
                tempCarbs = tempCarbs + f.carbs;
                tempFat = tempFat + f.fat;
                tempProtein = tempProtein + f.proteins;
              });
            });
            let t = { ...doc.data() };
            t.calories = tempCal;
            t.carbs = tempCarbs;
            t.fat = tempFat;
            t.proteins = tempProtein;
            temp.push({ id: doc.id, data: t });
          }
          setMealHistory(temp);
        });
    }
  }, [temperoryId, userData?.id]);

  const saveprofile = () => {
    console.log(userData?.id);
    db.collection("athletes")
      .doc(userData?.id)
      .update({
        phone,
        diet: {
          name: diet,
          carbs,
          fat,
          calories,
          protein,
        },
      })
      .then((res) => seteditable(false))
      .catch((e) => console.log(e));
  };

  // if (isLoading) {
  //   return (
  //     <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
  //       <ActivityIndicator size="large" color="#C19F1E" />
  //     </View>
  //   );
  // }
  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: "#F6F6F6" }}
      contentContainerStyle={{ padding: 0, backgroundColor: "#F6F6F6" }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          flexDirection: "row",
          padding: RFValue(20, 816),
          paddingBottom: 0,
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            style={{ paddingRight: 20 }}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-left" type="font-awesome-5" />
          </TouchableOpacity>

          {/*
        <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                onPress={() => navigation.toggleDrawer()}
        />*/}
        </View>

        <Notification navigation={navigation} />
      </View>

      <View style={{ padding: RFValue(20, 816), alignItems: "center" }}>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Image
            source={{
              uri:
                userData?.data.imageUrl ||
                "https://firebasestorage.googleapis.com/v0/b/fitnessapp0.appspot.com/o/userImage.jpeg?alt=media&token=02e8cfe5-c866-4a4f-93ab-8c5930a5cd3c",
            }}
            style={{
              width: RFValue(150, 816),
              height: RFValue(150, 816),
              borderRadius: 100,
              alignSelf: "center",
            }}
          />
          {userType != "coach" && (
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
          )}
        </View>
        <Text
          style={{
            fontSize: RFValue(32, 816),
            fontWeight: "bold",
            color: "black",
            marginTop: RFValue(10, 816),
          }}
        >
          {userData?.data.name}
        </Text>
        <Text
          style={{
            fontSize: RFValue(18, 816),
            fontWeight: "bold",
            color: "black",
            marginTop: RFValue(5, 816),
          }}
        >
          Athlete
        </Text>
        {userType != "coach" ? (
          !editable ? (
            <TouchableOpacity
              onPress={() => seteditable(true)}
              style={{
                backgroundColor: "#C19F1E",
                borderRadius: RFValue(20, 816),
                marginTop: RFValue(10, 816),
                padding: RFValue(5, 816),
                paddingRight: RFValue(15, 816),
                paddingLeft: RFValue(15, 816),
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: RFValue(12, 816),
                  fontWeight: "bold",
                  color: "white",
                  alignSelf: "center",
                }}
              >
                EDIT PROFILE
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => saveprofile()}
              style={{
                backgroundColor: "#C19F1E",
                borderRadius: RFValue(20, 816),
                marginTop: RFValue(10, 816),
                padding: RFValue(5, 816),
                paddingRight: RFValue(15, 816),
                paddingLeft: RFValue(15, 816),
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: RFValue(12, 816),
                  fontWeight: "bold",
                  color: "white",
                  alignSelf: "center",
                }}
              >
                SAVE PROFILE
              </Text>
            </TouchableOpacity>
          )
        ) : null}
      </View>
     
      <View
        style={{
          backgroundColor: "white",
          padding: RFValue(10, 816),
          borderRadius: RFValue(10, 816),
          marginTop: RFValue(20, 816),
          paddingBottom: RFValue(15, 816),
          marginHorizontal: 20,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            marginBottom: RFValue(10, 816),
            color: "black",
          }}
        >
          Mobile Number
        </Text>
        <TextInput
          style={{
            backgroundColor: "white",
            borderRadius: RFValue(5, 816),
            paddingLeft: RFValue(20, 816),
            borderWidth: userType == "athlete" && editable ? 1 : 0,
            bordercolor: "white",
            padding: RFValue(10, 816),
            fontSize: RFValue(18, 816),
            color: "black",
            paddingVertical: Platform.OS === "ios" ? 15 : 10,
          }}
          onChangeText={(text) => {
            setphone(text);
          }}
          value={phone}
          placeholder="Phone Numer"
          editable={userType == "athlete" ? editable : false}
        />
      </View>

      <View
        style={{
          backgroundColor: "white",
          padding: RFValue(10, 816),
          borderRadius: RFValue(10, 816),
          marginTop: RFValue(20, 816),
          paddingBottom: RFValue(15, 816),
          marginHorizontal: 20,
        }}
      >
        <Text
          style={{
            fontSize: RFValue(18, 816),
            marginBottom: RFValue(10, 816),
            color: "black",
          }}
        >
          Email ID
        </Text>
        <TextInput
          style={{
            backgroundColor: "white",
            borderRadius: RFValue(5, 816),
            paddingLeft: RFValue(20, 816),
            bordercolor: "white",
            padding: RFValue(10, 816),
            fontSize: RFValue(18, 816),
            color: "black",
            paddingVertical: Platform.OS === "ios" ? 15 : 10,
          }}
          onChangeText={(text) => {
            setemail(text);
          }}
          value={email}
          placeholder="Email ID"
          editable={false}
        />
      </View>

      <View
        style={{
          backgroundColor: "white",
          padding: RFValue(10, 816),
          borderRadius: RFValue(10, 816),
          marginTop: RFValue(20, 816),
          paddingBottom: RFValue(15, 816),
          marginHorizontal: 20,
        }}
      >
        <Text style={{ color: "black" }}>Diet Options</Text>

        <View
          style={{
            alignItems: "center",
            backgroundColor: "#fff",
            borderWidth: 0.4,
            borderRadius: RFValue(5, 816),
            padding: Platform.OS === "ios" ? RFValue(20, 816) : 0,
            paddingBottom: RFValue(20, 816),
          }}
        >
          {Platform.OS === "ios" ? (
            <RNPickerSelect
              style={{ paddingVertical: 5 }}
              value={diet}
              onValueChange={(itemValue, itemIndex) => {
                setDiet(itemValue);
                ChangeDiet(itemValue);
              }}
              styles={{ marginTop: 20 }}
              items={[
                { label: "Weight Maintenance", value: "Weight Maintenance" },
                { label: "High Performance", value: "High Performance" },
                { label: "Fat Loss", value: "Fat Loss" },
              ]}
              disabled={!editable}
            />
          ) : (
            <Picker
              selectedValue={diet}
              style={{
                height: RFValue(15, 816),
                width: ScreenWidth - RFValue(80, 816),
                padding: RFValue(15, 816),
                borderWidth: 0.4,
                borderColor: "#777",
              }}
              onValueChange={(itemValue, itemIndex) => {
                setDiet(itemValue);
                ChangeDiet(itemValue);
              }}
              enabled={editable}
            >
              <Picker.Item
                label="Weight Maintenance"
                value="Weight Maintenance"
              />
              <Picker.Item label="High Performance" value="High Performance" />
              <Picker.Item label="Fat Loss" value="Fat Loss" />
            </Picker>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <RNTextInput
            keyboardType="numeric"
            style={{
              backgroundColor: "white",
              borderRadius: RFValue(8, 816),
              borderWidth: 0,
              fontSize: RFValue(18, 816),
              width: "45%",
            }}
            theme={{
              colors: {
                primary: "rgba(0,0,0,0.7)",
                underlineColor: "transparent",
              },
            }}
            label="Carbs"
            mode={"outlined"}
            value={String(carbs)}
            editable={editable}
            onChangeText={(text) => {
              setEditCal(false);

              setCarbs(text);
            }}
          />
          <RNTextInput
            keyboardType="numeric"
            style={{
              backgroundColor: "white",
              borderRadius: RFValue(8, 816),
              fontSize: RFValue(18, 816),
              width: "45%",
            }}
            theme={{
              colors: {
                primary: "rgba(0,0,0,0.7)",
                underlineColor: "transparent",
              },
            }}
            label="Protein"
            mode={"outlined"}
            value={String(protein)}
            editable={editable}
            onChangeText={(text) => {
              setEditCal(false);
              setProtein(text);
            }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
            marginTop: RFValue(10, 816),
            marginBottom: 15,
          }}
        >
          <RNTextInput
            keyboardType="numeric"
            style={{
              backgroundColor: "white",
              borderRadius: RFValue(8, 816),
              fontSize: RFValue(18, 816),
              width: "45%",
            }}
            theme={{
              colors: {
                primary: "rgba(0,0,0,0.7)",
                underlineColor: "transparent",
              },
            }}
            label="Fats"
            mode={"outlined"}
            value={String(fat)}
            editable={editable}
            onChangeText={(text) => {
              setEditCal(false);

              setFat(text);
            }}
          />
          <RNTextInput
            keyboardType="numeric"
            style={{
              backgroundColor: "white",
              borderRadius: RFValue(8, 816),
              fontSize: RFValue(18, 816),
              width: "45%",
            }}
            theme={{
              colors: {
                primary: "rgba(0,0,0,0.7)",
                underlineColor: "transparent",
              },
            }}
            label="Calories"
            mode={"outlined"}
            value={String(calories)}
            editable={false}
            // onChangeText={(text) => {
            //   setEditCal(true);

            //   setCalories(text);
            //   console.log(weight);
            //   ChangePlan(text);
            // }}
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            if (editable) {
              saveprofile();
            }
            seteditable(!editable);
          }}
          style={{
            backgroundColor: "#C19F1E",
            padding: RFValue(10, 816),
            width: "60%",
            borderRadius: 25,
            alignSelf: "center",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: "white",
              textAlign: "center",
            }}
          >
            {editable
              ? "Save Athlete Diet Options"
              : "Edit Athlete Diet Options"}
          </Text>
        </TouchableOpacity>

        {/* {userType == "coach" && !editable && (
          <TouchableOpacity
            onPress={() => navigation.navigate("EditPayments")}
            style={{
              backgroundColor: "#C19F1E",
              padding: RFValue(10, 816),
              width: "60%",
              borderRadius: 25,
              alignSelf: "center",
              marginTop: 20,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                color: "black",
                textAlign: "center",
              }}
            >
              Edit Payments
            </Text>
          </TouchableOpacity>
        )} */}
      </View>

      {/* {userType == "coach" ? null : (
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            marginTop: RFValue(20, 816),
            paddingHorizontal: RFValue(10, 816),
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginHorizontal: RFValue(15, 816),
              marginBottom: RFValue(10, 816),
            }}
          >
            <Text
              style={{
                fontSize: RFValue(12, 816),
                fontWeight: "700",
                position: "absolute",
                left: 0,
              }}
            >
              Workouts
            </Text>
            <TouchableHighlight
              style={{
                position: "absolute",
                left: ScreenWidth / 1.4,
                top: 0,
                paddingVertical: RFValue(5, 816),
                paddingHorizontal: RFValue(10, 816),
                borderRadius: RFValue(12, 816),
              }}
              onPress={() => {
                if (userType === "athlete") {
                  navigation.navigate("Workout", {
                    screen: "ViewAllWorkouts",
                    params: { type: "view" },
                  });
                } else {
                  navigation.navigate("Workout", {
                    screen: "ViewAllWorkouts",
                    params: {
                      type: "update",
                      assignedToId: temperoryId,
                    },
                  });
                }
              }}
              activeOpacity={0.6}
              underlayColor="#DDDDDD"
            >
              <Text style={{ fontSize: RFValue(10, 816) }}>View more</Text>
            </TouchableHighlight>
          </View>

          <View
            style={{
              marginVertical: RFValue(20, 816),
              alignItems: "center",
              width: "100%",
              paddingHorizontal: RFValue(10, 816),
            }}
          >
            {workouts.length > 0 ? (
              workouts?.map((workout, idx) => (
                <WorkoutCard
                  key={idx}
                  workouts={workouts}
                  item={workout}
                  idx={idx}
                  navigation={navigation}
                  athlete_id={temperoryId}
                />
              ))
            ) : (
              <Text
                style={{
                  fontSize: RFValue(12, 816),
                  backgroundColor: "#fff",
                  width: "100%",
                  paddingVertical: RFValue(10, 816),
                  textAlign: "center",

                  borderRadius: RFValue(8, 816),
                }}
              >
                There are no workouts for now
              </Text>
            )}
          </View>
          {userType === "coach" && (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                marginHorizontal: RFValue(15, 816),
                marginBottom: RFValue(10, 816),
              }}
            >
              <Text
                style={{
                  fontSize: RFValue(12, 816),
                  fontWeight: "700",
                  position: "absolute",
                  left: 0,
                }}
              >
                Completed Workouts
              </Text>
              <TouchableHighlight
                style={{
                  position: "absolute",
                  left: ScreenWidth / 1.4,
                  top: 0,
                  paddingVertical: RFValue(5, 816),
                  paddingHorizontal: RFValue(10, 816),
                  borderRadius: RFValue(12, 816),
                }}
                activeOpacity={0.6}
                underlayColor="#DDDDDD"
                onPress={() =>
                  navigation.navigate("ViewAllWorkouts", {
                    type: "view",
                    assignedToId: temperoryId,
                    completed: true,
                  })
                }
              >
                <Text style={{ fontSize: RFValue(10, 816) }}>View more</Text>
              </TouchableHighlight>
            </View>
          )}

          {userType === "coach" && (
            <View
              style={{
                width: "100%",
                marginHorizontal: 0,
                marginVertical: RFValue(20, 816),
              }}
            >
              {pastWorkouts.length > 0 ? (
                pastWorkouts?.map((item, idx) => (
                  <WorkoutCard
                    key={idx}
                    workouts={pastWorkouts}
                    item={item}
                    idx={idx}
                    navigation={navigation}
                    completed={true}
                  />
                ))
              ) : (
                <Text
                  style={{
                    fontSize: RFValue(12, 816),
                    backgroundColor: "#fff",
                    width: "100%",
                    paddingVertical: RFValue(10, 816),
                    textAlign: "center",
                    borderRadius: RFValue(8, 816),
                  }}
                >
                  There are no completed workouts for now
                </Text>
              )}
            </View>
          )}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginHorizontal: RFValue(15, 816),
            }}
          >
            <Text
              style={{
                fontSize: RFValue(12, 816),
                fontWeight: "700",
                position: "absolute",
                left: 0,
              }}
            >
              Nutrition
            </Text>
            <TouchableHighlight
              style={{
                position: "absolute",
                left: ScreenWidth / 1.4,
                top: 0,
                paddingVertical: RFValue(5, 816),
                paddingHorizontal: RFValue(10, 816),
                borderRadius: RFValue(12, 816),
              }}
              onPress={() => {
                if (userType === "athlete") {
                  navigation.navigate("Nutrition", {
                    screen: "ViewAllNutrition",
                  });
                } else {
                  navigation.navigate("Nutrition", {
                    screen: "ViewAllNutrition",
                    params: {
                      type: "update",
                      assignedToId: temperoryId,
                    },
                  });
                }
              }}
              activeOpacity={0.6}
              underlayColor="#DDDDDD"
            >
              <Text style={{ fontSize: RFValue(10, 816) }}>View more</Text>
            </TouchableHighlight>
          </View>

          <View
            style={{
              paddingHorizontal: RFValue(10, 816),
              marginVertical: RFValue(20, 816),
              alignItems: "center",
              width: "100%",
            }}
          >
            {nutrition.length > 0 ? (
              nutrition?.map((food, idx) => (
                <NutritionCard
                  key={idx}
                  nutrition={nutrition}
                  food={food}
                  idx={idx}
                  navigation={navigation}
                  type="update"
                />
              ))
            ) : (
              <Text
                style={{
                  fontSize: RFValue(12, 816),
                  backgroundColor: "#fff",
                  width: ScreenWidth - 60,
                  paddingVertical: RFValue(10, 816),
                  textAlign: "center",
                  borderRadius: RFValue(8, 816),
                  marginTop: RFValue(5, 816),

                  marginHorizontal: 15,
                }}
              >
                There are no nutrition for now
              </Text>
            )}
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginHorizontal: RFValue(15, 816),
            }}
          >
            <Text
              style={{
                fontSize: RFValue(12, 816),
                fontWeight: "700",
                position: "absolute",
                left: 0,
              }}
            >
              Meal History
            </Text>
            <TouchableHighlight
              style={{
                position: "absolute",
                left: ScreenWidth / 1.4,
                top: 0,
                paddingVertical: RFValue(5, 816),
                paddingHorizontal: RFValue(10, 816),
                borderRadius: RFValue(12, 816),
              }}
              onPress={() =>
                navigation.navigate("MealHistory", { type: "non-editable" })
              }
              activeOpacity={0.6}
              underlayColor="#DDDDDD"
            >
              <Text
                style={{
                  fontSize: RFValue(10, 816),
                }}
              >
                View more
              </Text>
            </TouchableHighlight>
          </View>

          {mealHistory.length > 0 ? (
            <View
              style={{
                marginVertical: RFValue(20, 816),
                width: "100%",
                paddingHorizontal: RFValue(10, 816),
              }}
            >
              {mealHistory?.map((food, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={{
                    width: "100%",
                    height: 120,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#fff",
                    marginVertical: RFValue(10, 816),
                    padding: RFValue(10, 816),
                    borderRadius: RFValue(8, 816),
                  }}
                  onPress={() => {
                    navigation.navigate("AddMeal", {
                      entireFood: food.data.entireFood,
                      type: "non-editable",
                    });
                  }}
                  onLongPress={() => {
                    if (userType === "athlete") {
                      Alert.alert(
                        "Delete this Meal plan",
                        "Are you sure you want to delete it?",
                        [
                          {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel",
                          },
                          {
                            text: "OK",
                            onPress: () => {
                              db.collection("AthleteNutrition")
                                .collection("nutrition")
                                .doc(formatSpecificDate(new Date()))
                                .delete()
                                .then(() => {
                                  console.log("Document successfully deleted!");
                                })
                                .catch((error) => {
                                  console.error(
                                    "Error removing document: ",
                                    error
                                  );
                                });
                            },
                          },
                        ],
                        { cancelable: false }
                      );
                    }
                  }}
                >
                  <Image
                    style={{
                      width: 80,
                      height: 80,
                      margin: RFValue(5, 816),
                      borderRadius: RFValue(8, 816),
                      backgroundColor: "#ddd",
                    }}
                    source={require("../assets/nutrition.jpeg")}
                  />
                  <View
                    style={{
                      flexDirection: "column",
                      marginHorizontal: RFValue(15, 816),
                    }}
                  >
                    <Text
                      style={{
                        fontSize: RFValue(15, 816),
                        fontWeight: "700",
                        marginBottom: RFValue(8, 816),
                      }}
                    >
                      {food.id}
                    </Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontSize: RFValue(12, 816), width: 60 }}>
                        Calories
                      </Text>
                      <Text style={{ fontSize: 12 }}>{food.data.calories}</Text>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontSize: RFValue(12, 816), width: 60 }}>
                        Carbs
                      </Text>
                      <Text style={{ fontSize: 12 }}>
                        {food.data.carbs.toFixed(2)}
                      </Text>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontSize: RFValue(12, 816), width: 60 }}>
                        Fat
                      </Text>
                      <Text style={{ fontSize: 12 }}>
                        {food.data.fat.toFixed(2)}
                      </Text>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontSize: RFValue(12, 816), width: 60 }}>
                        Proteins
                      </Text>
                      <Text style={{ fontSize: 12 }}>
                        {food.data.proteins.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      right: 25,
                    }}
                    // onPress={() => {
                    //   navigation.navigate("AddMeal");
                    // }}
                  >
                    <Icon
                      name="chevron-right"
                      color="black"
                      type="font-awesome-5"
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text
              style={{
                fontSize: RFValue(12, 816),
                backgroundColor: "#fff",
                width: ScreenWidth - 60,
                paddingVertical: RFValue(10, 816),
                textAlign: "center",
                borderRadius: RFValue(8, 816),
                marginTop: RFValue(25, 816),

                marginHorizontal: RFValue(20, 816),
              }}
            >
              There are no meals
            </Text>
          )}
        </View>
      )} */}

      <TouchableOpacity
        onPress={() =>
          navigation.navigate("AthleteHistory", { athlete: athleteUser })
        }
        style={{
          paddingLeft: RFValue(20, 816),
          padding: RFValue(15, 816),
          width: "90%",
          alignItems: "center",
          backgroundColor: "#C19F1E",
          alignSelf: "center",
          borderRadius: RFValue(20, 816),
          marginTop: RFValue(20, 816),
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: RFValue(20, 816),
            color: "white",
            alignSelf: "center",
          }}
        >
          View Athlete History
        </Text>
        <Icon
          name="chevron-right"
          type="font-awesome-5"
          style={{ marginRight: 20 }}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Reports")}
        style={{
          paddingLeft: RFValue(20, 816),
          padding: RFValue(15, 816),
          width: "90%",
          alignItems: "center",
          backgroundColor: "#C19F1E",
          alignSelf: "center",
          borderRadius: RFValue(20, 816),
          marginTop: RFValue(20, 816),
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: RFValue(20, 816),
            color: "white",
            alignSelf: "center",
          }}
        >
          View Reports
        </Text>
        <Icon
          name="chevron-right"
          type="font-awesome-5"
          style={{ marginRight: 20 }}
        />
      </TouchableOpacity>

      {/* <TouchableOpacity
        onPress={() => {
          // console.log("athleteUser->", athleteUser);
          navigation.navigate("AthletePayments", {
            athlete: athleteUser,
          });
        }}
        style={{
          paddingLeft: RFValue(20, 816),
          padding: RFValue(15, 816),
          width: "90%",
          alignItems: "center",
          backgroundColor: "#C19F1E",
          alignSelf: "center",
          borderRadius: RFValue(20, 816),
          marginTop: RFValue(20, 816),
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: RFValue(20, 816),
            color: "white",
            alignSelf: "center",
          }}
        >
          View Payment
        </Text>
        <Icon
          name="chevron-right"
          type="font-awesome-5"
          style={{ marginRight: 20 }}
        />
      </TouchableOpacity> */}

      {/* <TouchableOpacity
        onPress={() => {
          navigation.navigate("EditPaymentDetailsScreen", {
            athlete: athleteUser,
          });
        }}
        style={{
          paddingLeft: RFValue(20, 816),
          padding: RFValue(15, 816),
          width: "90%",
          alignItems: "center",
          backgroundColor: "#C19F1E",
          alignSelf: "center",
          borderRadius: RFValue(20, 816),
          marginTop: RFValue(20, 816),
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: RFValue(20, 816),
            color: "white",
            alignSelf: "center",
          }}
        >
          Edit Payment
        </Text>
        <Icon
          name="chevron-right"
          type="font-awesome-5"
          style={{ marginRight: 20 }}
        />
      </TouchableOpacity> */}
      {/* {userType == "coach" ? (
        <TouchableOpacity
          //  onPress={() => navigation.navigate("EditPayments")}
          style={{
            paddingLeft: RFValue(20, 816),
            padding: RFValue(15, 816),
            width: "90%",
            alignItems: "center",
            backgroundColor: "#C19F1E",
            alignSelf: "center",
            borderRadius: RFValue(20, 816),
            marginTop: RFValue(20, 816),
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: RFValue(20, 816),
              color: "white",
              alignSelf: "center",
            }}
          >
            View Payments
          </Text>
          <Icon
            name="chevron-right"
            type="font-awesome-5"
            style={{ marginRight: 20 }}
          />
        </TouchableOpacity>
      ) : null} */}

      <View style={{ padding: RFValue(20, 816) }}>
        <Text
          style={{
            fontSize: RFValue(22, 816),
            color: "black",
            fontWeight: "bold",
          }}
        >
          Assessments and Measurements
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("PersonalDetails")}
          style={{
            padding: RFValue(15, 816),
            paddingLeft: RFValue(20, 816),
            width: "100%",
            alignItems: "center",
            backgroundColor: "white",
            alignSelf: "center",
            borderRadius: RFValue(20, 816),
            marginTop: RFValue(15, 816),
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: RFValue(20, 816),
              color: "black",
              alignSelf: "center",
            }}
          >
            Personal Details
          </Text>
          <Icon
            name="chevron-right"
            type="font-awesome-5"
            style={{ marginRight: 20 }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Anthropometric")}
          style={{
            paddingLeft: RFValue(20, 816),
            padding: RFValue(15, 816),
            width: "100%",
            alignItems: "center",
            backgroundColor: "white",
            alignSelf: "center",
            borderRadius: RFValue(20, 816),
            marginTop: RFValue(15, 816),
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: RFValue(20, 816),
              color: "black",
              alignSelf: "center",
            }}
          >
            Anthropometric Measurements
          </Text>
          <Icon
            name="chevron-right"
            type="font-awesome-5"
            style={{ marginRight: 20 }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("MedicalAssessment")}
          style={{
            paddingLeft: RFValue(20, 816),
            padding: RFValue(15, 816),
            width: "100%",
            alignItems: "center",
            backgroundColor: "white",
            alignSelf: "center",
            borderRadius: RFValue(20, 816),
            marginTop: RFValue(15, 816),
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: RFValue(20, 816),
              color: "black",
              alignSelf: "center",
            }}
          >
            Medical Assessment
          </Text>
          <Icon
            name="chevron-right"
            type="font-awesome-5"
            style={{ marginRight: 20 }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("TrainingAssessment")}
          style={{
            paddingLeft: RFValue(20, 816),
            padding: RFValue(15, 816),
            width: "100%",
            alignItems: "center",
            backgroundColor: "white",
            alignSelf: "center",
            borderRadius: RFValue(20, 816),
            marginTop: RFValue(15, 816),
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: RFValue(20, 816),
              color: "black",
              alignSelf: "center",
            }}
          >
            Training Assessment
          </Text>
          <Icon
            name="chevron-right"
            type="font-awesome-5"
            style={{ marginRight: 20 }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("LifestyleAssessment")}
          style={{
            paddingLeft: RFValue(20, 816),
            padding: RFValue(15, 816),
            width: "100%",
            alignItems: "center",
            backgroundColor: "white",
            alignSelf: "center",
            borderRadius: RFValue(20, 816),
            marginTop: RFValue(15, 816),
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: RFValue(20, 816),
              color: "black",
              alignSelf: "center",
            }}
          >
            Food and Lifestyle Assessment
          </Text>
          <Icon
            name="chevron-right"
            type="font-awesome-5"
            style={{ marginRight: 20 }}
          />
        </TouchableOpacity>
             
       {userType!='coach'?  <TouchableOpacity
              onPress={deleteUserHandler}
              style={{
                paddingLeft: RFValue(20, 816),
                padding: RFValue(15, 816),
                width: "100%",
                justifyContent:'center',
                backgroundColor: "red",
                alignSelf: "center",
                borderRadius: RFValue(15, 816),
                marginTop: RFValue(15, 816),
                flexDirection: "row",
                
              }}
            >
               <Text
            style={{
              fontSize: RFValue(20, 816),
              color: "white",
              alignSelf: "center",
              textAlign:'center'
            }}
          >
                Delete Profile
              </Text>
            </TouchableOpacity>
            :
            null}
        
      </View>
    </KeyboardAwareScrollView>
  );
}
