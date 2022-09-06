import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator
} from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
let ScreenWidth = Dimensions.get("window").width;
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
let ScreenHeight = Dimensions.get("window").height;
import moment from "moment";
import { Icon } from "react-native-elements";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import ImagePicker from "react-native-image-crop-picker";
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
import firebase from "firebase"
import { setSaved } from "../features/onboardingSlice";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: RFValue(20, 816),
    marginBottom: 0,
    paddingTop: RFValue(20, 816),
    minHeight: ScreenHeight,
  },
});

function Anthropometric({ route, navigation }) {
  const user = useSelector(selectUser);
  const [date, setDate] = useState(formatDate());
  const [userData, setUserData] = useState(null);
  const [editable, setEditable] = useState(false);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [fat, setFat] = useState("");
  const [muscle, setMuscle] = useState("");
  const [chest, setChest] = useState("");
  const [waist, setWaist] = useState("");
  const [glutes, setGlutes] = useState("");
  const [arms, setArms] = useState("");
  const [quads, setQuads] = useState("");
  const [neck, setNeck] = useState("");
  const [backImageUrl, setBackImageUrl] = useState(null);
  const [frontImageUrl, setFrontImageUrl] = useState(null);
  const [sideImageUrl, setSideImageUrl] = useState(null);

  const [loading, setLoading] = useState(false)
  const userType = useSelector(selectUserType);
  const temperoryId = useSelector(selectTemperoryId);

  const dispatch = useDispatch();
  
  function formatDate() {
    var d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  const selectImage = (pickerType, imageType) => {
    const option = { width: 900, height: 1200, cropping: true };

    if (pickerType === "Camera") {
      ImagePicker.openCamera(option)
        .then((image) => {
          console.log("ImagePicker->", image);
          if (imageType === "frontImage") {
            setFrontImageUrl(image.path);
          } else if (imageType === "backImage") {
            setBackImageUrl(image.path);
          }
          else {
            setSideImageUrl(image.path);
          }
        })
        .catch((error) => {
          console.log("error->", error);
        });
    } else {
      ImagePicker.openPicker(option)
        .then((image) => {
          console.log("ImagePicker->", image);
          if (imageType === "frontImage") {
            setFrontImageUrl(image.path);
          } else if (imageType === "backImage") {
            setBackImageUrl(image.path);
          }
          else {
            setSideImageUrl(image.path);
          }
        })
        .catch((error) => {
          console.log("error->", error);
        });
    }
  };

  const uploadImage = (image, type) => {
    return new Promise(async (resolve, reject) => {
      const response = await fetch(image);
      const blob = await response.blob();
      const childPath = `images/${userData.data.email}/${date}/${type}`;

      const task = firebase.storage().ref().child(childPath).put(blob);

      const taskProgress = (snapshot) => {
        console.log(`transferred: ${snapshot.bytesTransferred}`);
      };

      const taskCompleted = () => {
        task.snapshot.ref.getDownloadURL().then((snapshot) => {
          console.log("taskCompleted->", snapshot);
          resolve(snapshot);
        });
      };

      const taskError = (snapshot) => {
        console.log("taskError->", snapshot);
        reject(snapshot);
      };

      await task.on("state_changed", taskProgress, taskError, taskCompleted);
    });
  };

  useEffect( () => {
    if (userData) {
      setHeight(userData?.data?.height);
      setWeight(userData?.data?.weight);
    }
  }, [userData]);

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
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    } else {
      setEditable(true);
      db.collection("athletes")
        .where("email", "==", user)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            setUserData({
              id: doc.id,
              data: doc.data(),
            });
          });
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    }
  }, [user, temperoryId]);

  useEffect( async() => {
    if (userData) {
      db.collection("athletes")
        .doc(userData?.id)
        .collection("Anthropometric")
        .doc("anthropometric")
        .get()
        .then(function (doc) {
          if (doc.exists) {
            console.log("Document data:", doc.data());
            setHeight(doc.data().height ? String(doc.data().height) : "");
            setWeight(doc.data().weight ? String(doc.data().weight) : "");
            setFat(doc.data().fat ? String(doc.data().fat) : "");
            setMuscle(doc.data().muscle ? String(doc.data().muscle) : "");
            setArms(doc.data().arms ? String(doc.data().arms) : "");
            setWaist(doc.data().waist ? String(doc.data().waist) : "");
            setQuads(doc.data().quads ? String(doc.data().quads) : "");
            setChest(doc.data().chest ? String(doc.data().chest) : "");
            setGlutes(doc.data().glutes ? String(doc.data().glutes) : "");
            setNeck(doc.data().neck ? String(doc.data().neck) : "");
            setSideImageUrl(doc.data().sideImageUrl ? String(doc.data().sideImageUrl) : "");
            setFrontImageUrl(doc.data().frontImageUrl ? String(doc.data().frontImageUrl) : "");
            setBackImageUrl(doc.data().backImageUrl ? String(doc.data().backImageUrl) : "");
             
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch((e) => console.log(e));
    }
  }, [userData?.id]);

  const saveDetails = async() => {
    setLoading(true)
    const todayDate = moment().format("YYYY-MM-DD");

    dispatch(setSaved(true));

    var frontUrl = "";
    if (frontImageUrl) {
      frontUrl = await uploadImage(frontImageUrl, "frontImage");
      console.log(frontUrl)
    }

    var sideUrl = "";
    if (sideImageUrl) {
      sideUrl = await uploadImage(sideImageUrl, "sideImage");
      console.log(sideUrl)

    }


    var backUrl = "";
    if (backImageUrl) {
      backUrl = await uploadImage(backImageUrl, "backImage");
      console.log(backUrl)

    }

    db.collection("athletes")
      .doc(userData?.id)
      .get()
      .then(function (snap) {
        let temp = snap.data().metrics;
        temp[todayDate] = {
          height: parseFloat(height),
          weight: parseFloat(weight),
          fat: parseFloat(fat),
          muscle: parseFloat(muscle),
          waist: parseFloat(waist),
          arms: parseFloat(arms),
          glutes: parseFloat(glutes),
          quads: parseFloat(quads),
          chest: parseFloat(chest),
          neck: parseFloat(neck),
          frontImageUrl  :frontUrl ? frontUrl : "",
          backImageUrl : backUrl ? backUrl : "",
          sideImageUrl : sideUrl ? sideUrl : "",

        };

        db.collection("athletes").doc(userData?.id).update({
          metrics: temp,
        });
      });

    db.collection("athletes")
      .doc(userData?.id)
      .collection("Anthropometric")
      .get()
      .then((snap) => {
        if (!snap.empty) {
          console.log("1");
          db.collection("athletes")
            .doc(userData?.id)
            .collection("Anthropometric")
            .doc("anthropometric")
            .update({
              height: parseFloat(height),
              weight: parseFloat(weight),
              fat: parseFloat(fat),
              muscle: parseFloat(muscle),
              waist: parseFloat(waist),
              arms: parseFloat(arms),
              glutes: parseFloat(glutes),
              quads: parseFloat(quads),
              chest: parseFloat(chest),
              neck: parseFloat(neck),
              frontImageUrl: frontUrl,
            backImageUrl: backUrl,
            sideImageUrl: sideUrl,
            })
            .then((res) => { })
            .catch((e) => console.log(e));
        } else {
          console.log("2");
          console.log(height + " " + weight);
          db.collection("athletes")
            .doc(userData?.id)
            .collection("Anthropometric")
            .doc("anthropometric")
            .set({
              height: parseFloat(height),
              weight: parseFloat(weight),
              fat: parseFloat(fat),
              muscle: parseFloat(muscle),
              waist: parseFloat(waist),
              arms: parseFloat(arms),
              glutes: parseFloat(glutes),
              quads: parseFloat(quads),
              chest: parseFloat(chest),
              neck: parseFloat(neck),
              frontImageUrl: frontUrl,
              backImageUrl: backUrl,
              sideImageUrl: sideUrl,
            })
            .then((res) => { })
            .catch((e) => console.log(e));
        }
      });

    setEditable(false);
    setLoading(false)
  };
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView>
        <View style={styles.container}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
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
              <Icon
                name="bars"
                type="font-awesome-5"
                size={24}
                onPress={() => navigation.toggleDrawer()}
              />
              <View>
                <Text
                  style={{
                    fontSize: RFValue(24, 816),
                    fontFamily: "SF-Pro-Text-regular",
                    fontWeight: "bold",
                    color: "black",
                    marginLeft: RFValue(20, 816),
                  }}
                >
                  Anthropometric
                </Text>
                <Text
                  style={{
                    fontSize: RFValue(24, 816),
                    fontFamily: "SF-Pro-Text-regular",
                    fontWeight: "bold",
                    color: "black",
                    marginLeft: RFValue(20, 816),
                  }}
                >
                  Measurements
                </Text>
              </View>
            </View>
            {userType == "coach" ? null : (
              <TouchableOpacity
                style={{ marginRight: RFValue(20, 816) }}
                onPress={() => setEditable(true)}
              >
                <Image source={require("../assets/edit.png")} />
              </TouchableOpacity>
            )}
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginVertical: RFValue(10, 816),
              marginTop: RFValue(20, 816),
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: RFValue(10, 816),
                borderRadius: RFValue(10, 816),
                marginTop: RFValue(20, 816),
                paddingBottom: 15,
              }}
            >
              <Text style={{ marginBottom: RFValue(10, 816), color: "black" }}>
                Height* (cms)
              </Text>
              <TextInput
                style={
                  editable
                    ? {
                      width: ScreenWidth - 60,
                      borderRadius: RFValue(5, 816),
                      paddingVertical:
                        Platform.OS === "ios"
                          ? RFValue(15, 816)
                          : RFValue(5, 816),
                      paddingHorizontal: RFValue(10, 816),
                      backgroundColor: "white",
                      borderWidth: 0.5,
                    }
                    : {
                      borderWidth: 0.5,
                      width: ScreenWidth - 60,
                      borderRadius: RFValue(10, 816),
                      paddingVertical:
                        Platform.OS === "ios"
                          ? RFValue(15, 816)
                          : RFValue(5, 816),
                      paddingHorizontal: RFValue(10, 816),
                      backgroundColor: "white",
                    }
                }
                editable={editable}
                placeholder="Enter Height"
                defaultValue={userData?.data?.height}
                value={height}
                onChangeText={setHeight}
                keyboardType='decimal-pad'
              />
            </View>

            <View
              style={{
                backgroundColor: "white",
                padding: RFValue(10, 816),
                borderRadius: RFValue(10, 816),
                marginTop: RFValue(20, 816),
                paddingBottom: 15,
              }}
            >
              <Text style={{ marginBottom: RFValue(10, 816), color: "black" }}>
                Weight* (kgs)
              </Text>
              <TextInput
                style={
                  editable
                    ? {
                      width: ScreenWidth - 60,
                      borderRadius: RFValue(5, 816),
                      borderWidth: 0.5,
                      paddingVertical:
                        Platform.OS === "ios"
                          ? RFValue(15, 816)
                          : RFValue(5, 816),
                      paddingHorizontal: RFValue(10, 816),
                      backgroundColor: "white",
                    }
                    : {
                      borderWidth: 0.5,
                      width: ScreenWidth - 60,
                      borderRadius: RFValue(5, 816),
                      paddingVertical:
                        Platform.OS === "ios"
                          ? RFValue(15, 816)
                          : RFValue(5, 816),
                      paddingHorizontal: RFValue(10, 816),
                      backgroundColor: "white",

                    }
                }
                editable={editable}
                placeholder="Enter Weight"
                defaultValue={userData?.data?.weight}
                value={weight}
                onChangeText={setWeight}
                keyboardType='decimal-pad'
              />
            </View>

            <View
              style={{
                backgroundColor: "white",
                padding: RFValue(10, 816),
                borderRadius: RFValue(10, 816),
                marginTop: RFValue(20, 816),
                paddingBottom: 15,
              }}
            >
              <Text style={{ marginBottom: RFValue(10, 816), color: "black" }}>
                Fat Percentage
              </Text>
              <TextInput
                style={
                  editable
                    ? {
                      width: ScreenWidth - 60,
                      borderRadius: RFValue(5, 816),
                      paddingVertical:
                        Platform.OS === "ios"
                          ? RFValue(15, 816)
                          : RFValue(5, 816),
                      paddingHorizontal: RFValue(10, 816),
                      backgroundColor: "white",
                      borderWidth: 0.5,
                    }
                    : {
                      borderWidth: 0.5,
                      width: ScreenWidth - 60,
                      borderRadius: RFValue(5, 816),
                      paddingVertical:
                        Platform.OS === "ios"
                          ? RFValue(15, 816)
                          : RFValue(5, 816),
                      paddingHorizontal: RFValue(10, 816),
                      backgroundColor: "white",
                    }
                }
                editable={editable}
                placeholder="Enter Fat Percentage"
                defaultValue={userData?.data?.fat}
                value={fat}
                onChangeText={setFat}
                keyboardType='decimal-pad'
              />
            </View>

            <View
              style={{
                backgroundColor: "white",
                padding: RFValue(10, 816),
                borderRadius: RFValue(10, 816),
                marginTop: RFValue(20, 816),
                paddingBottom: 15,
              }}
            >
              <Text style={{ marginBottom: RFValue(10, 816), color: "black" }}>
                Muscle Percentage
              </Text>
              <TextInput
                style={
                  editable
                    ? {
                      width: ScreenWidth - 60,
                      borderRadius: RFValue(5, 816),
                      paddingVertical:
                        Platform.OS === "ios"
                          ? RFValue(15, 816)
                          : RFValue(5, 816),
                      paddingHorizontal: RFValue(10, 816),
                      backgroundColor: "white",
                      borderWidth: 0.5,
                    }
                    : {
                      borderWidth: 0.5,
                      width: ScreenWidth - 60,
                      borderRadius: RFValue(5, 816),
                      paddingVertical:
                        Platform.OS === "ios" ? 15 : RFValue(5, 816),
                      paddingHorizontal: RFValue(10, 816),
                      backgroundColor: "white",
                    }
                }
                editable={editable}
                placeholder="Enter Muscle Percentage"
                defaultValue={userData?.data?.muscle}
                value={muscle}
                onChangeText={setMuscle}
                keyboardType='decimal-pad'
              />
            </View>


            <View
              style={{
                backgroundColor: "white",
                padding: RFValue(10, 816),
                borderRadius: RFValue(10, 816),
                marginTop: RFValue(20, 816),
                paddingBottom: 15,
              }}
            >
              <Text style={{ marginBottom: RFValue(10, 816), color: "black" }}>
                Chest Measurement (inches)
              </Text>
              <TextInput
                style={
                  editable
                    ? {
                      width: ScreenWidth - 60,
                      borderRadius: RFValue(5, 816),
                      paddingVertical:
                        Platform.OS === "ios"
                          ? RFValue(15, 816)
                          : RFValue(5, 816),
                      paddingHorizontal: RFValue(10, 816),
                      backgroundColor: "white",
                      borderWidth: 0.5,
                    }
                    : {
                      borderWidth: 0.5,
                      width: ScreenWidth - 60,
                      borderRadius: RFValue(5, 816),
                      paddingVertical:
                        Platform.OS === "ios" ? 15 : RFValue(5, 816),
                      paddingHorizontal: RFValue(10, 816),
                      backgroundColor: "white",
                    }
                }
                editable={editable}
                placeholder="Enter Chest size"
                defaultValue={userData?.data?.chest}
                value={chest}
                onChangeText={setChest}
                keyboardType='decimal-pad'
              />
            </View>

            <View
              style={{
                backgroundColor: "white",
                padding: RFValue(10, 816),
                borderRadius: RFValue(10, 816),
                marginTop: RFValue(20, 816),
                paddingBottom: 15,
              }}
            >
              <Text style={{ marginBottom: RFValue(10, 816), color: "black" }}>
                Waist Measurement (inches)
              </Text>
              <TextInput
                style={
                  editable
                    ? {
                      width: ScreenWidth - 60,
                      borderRadius: RFValue(5, 816),
                      paddingVertical:
                        Platform.OS === "ios"
                          ? RFValue(15, 816)
                          : RFValue(5, 816),
                      paddingHorizontal: RFValue(10, 816),
                      backgroundColor: "white",
                      borderWidth: 0.5,
                    }
                    : {
                      borderWidth: 0.5,
                      width: ScreenWidth - 60,
                      borderRadius: RFValue(5, 816),
                      paddingVertical:
                        Platform.OS === "ios" ? 15 : RFValue(5, 816),
                      paddingHorizontal: RFValue(10, 816),
                      backgroundColor: "white",
                    }
                }
                editable={editable}
                placeholder="Enter Waist Size"
                defaultValue={userData?.data?.waist}
                value={waist}
                onChangeText={setWaist}
                keyboardType='decimal-pad'
              />
            </View>

            <View
              style={{
                backgroundColor: "white",
                padding: RFValue(10, 816),
                borderRadius: RFValue(10, 816),
                marginTop: RFValue(20, 816),
                paddingBottom: 15,
              }}
            >
              <Text style={{ marginBottom: RFValue(10, 816), color: "black" }}>
                Glutes Measurement (inches)
              </Text>
              <TextInput
                style={
                  editable
                    ? {
                      width: ScreenWidth - 60,
                      borderRadius: RFValue(5, 816),
                      paddingVertical:
                        Platform.OS === "ios"
                          ? RFValue(15, 816)
                          : RFValue(5, 816),
                      paddingHorizontal: RFValue(10, 816),
                      backgroundColor: "white",
                      borderWidth: 0.5,
                    }
                    : {
                      borderWidth: 0.5,
                      width: ScreenWidth - 60,
                      borderRadius: RFValue(5, 816),
                      paddingVertical:
                        Platform.OS === "ios" ? 15 : RFValue(5, 816),
                      paddingHorizontal: RFValue(10, 816),
                      backgroundColor: "white",
                    }
                }
                editable={editable}
                placeholder="Enter Glutes size"
                defaultValue={userData?.data?.glutes}
                value={glutes}
                onChangeText={setGlutes}
                keyboardType='decimal-pad'
              />
            </View>

            <View
              style={{
                backgroundColor: "white",
                padding: RFValue(10, 816),
                borderRadius: RFValue(10, 816),
                marginTop: RFValue(20, 816),
                paddingBottom: 15,
              }}
            >
              <Text style={{ marginBottom: RFValue(10, 816), color: "black" }}>
                Quads Measurement (inches)
              </Text>
              <TextInput
                style={
                  editable
                    ? {
                      width: ScreenWidth - 60,
                      borderRadius: RFValue(5, 816),
                      paddingVertical:
                        Platform.OS === "ios"
                          ? RFValue(15, 816)
                          : RFValue(5, 816),
                      paddingHorizontal: RFValue(10, 816),
                      backgroundColor: "white",
                      borderWidth: 0.5,
                    }
                    : {
                      borderWidth: 0.5,
                      width: ScreenWidth - 60,
                      borderRadius: RFValue(5, 816),
                      paddingVertical:
                        Platform.OS === "ios" ? 15 : RFValue(5, 816),
                      paddingHorizontal: RFValue(10, 816),
                      backgroundColor: "white",
                    }
                }
                editable={editable}
                placeholder="Enter Quads Measurement (inches)"
                defaultValue={userData?.data?.quads}
                value={quads}
                onChangeText={setQuads}
                keyboardType='decimal-pad'
              />
            </View>
              

            <View
              style={{
                backgroundColor: "white",
                padding: RFValue(10, 816),
                borderRadius: RFValue(10, 816),
                marginTop: RFValue(20, 816),
                paddingBottom: 15,
              }}
            >
              <Text style={{ marginBottom: RFValue(10, 816), color: "black" }}>
                Neck Measurement (inches)
              </Text>
              <TextInput
                style={
                  editable
                    ? {
                      width: ScreenWidth - 60,
                      borderRadius: RFValue(5, 816),
                      paddingVertical:
                        Platform.OS === "ios"
                          ? RFValue(15, 816)
                          : RFValue(5, 816),
                      paddingHorizontal: RFValue(10, 816),
                      backgroundColor: "white",
                      borderWidth: 0.5,
                    }
                    : {
                      borderWidth: 0.5,
                      width: ScreenWidth - 60,
                      borderRadius: RFValue(5, 816),
                      paddingVertical:
                        Platform.OS === "ios" ? 15 : RFValue(5, 816),
                      paddingHorizontal: RFValue(10, 816),
                      backgroundColor: "white",
                    }
                }
                editable={editable}
                placeholder="Enter Neck Measurement (inches)"
                defaultValue={userData?.data?.neck}
                value={neck}
                onChangeText={setNeck}
                keyboardType='decimal-pad'
              />
            </View>



            <View
              style={{
                backgroundColor: "white",
                padding: RFValue(10, 816),
                borderRadius: RFValue(10, 816),
                marginTop: RFValue(20, 816),
                paddingBottom: 15,
              }}
            >
              <Text style={{ marginBottom: RFValue(10, 816), color: "black" }}>
                Arms Measurement (inches)
              </Text>
              <TextInput
                style={
                  editable
                    ? {
                      width: ScreenWidth - 60,
                      borderRadius: RFValue(5, 816),
                      paddingVertical:
                        Platform.OS === "ios"
                          ? RFValue(15, 816)
                          : RFValue(5, 816),
                      paddingHorizontal: RFValue(10, 816),
                      backgroundColor: "white",
                      borderWidth: 0.5,
                    }
                    : {
                      borderWidth: 0.5,
                      width: ScreenWidth - 60,
                      borderRadius: RFValue(5, 816),
                      paddingVertical:
                        Platform.OS === "ios" ? 15 : RFValue(5, 816),
                      paddingHorizontal: RFValue(10, 816),
                      backgroundColor: "white",
                    }
                }
                editable={editable}
                placeholder="Enter Arms Measurement (inches)"
                defaultValue={userData?.data?.arms}
                value={arms}
                onChangeText={setArms}
                keyboardType='decimal-pad'
              />
            </View>
                

            <ScrollView horizontal={true} style={{ flexDirection: "row", marginTop: RFValue(20, 816) }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View>
                <Text style={{ textAlign: "center" }}>Front Image</Text>
                <Image
                  source={frontImageUrl ? { uri: frontImageUrl } : null}
                  style={{
                    margin: RFValue(10, 816),
                    width: RFValue(100, 816),
                    height: RFValue(100, 816),
                    borderRadius: RFValue(5, 816),
                    backgroundColor: "grey",
                  }}
                />
              </View>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "space-around",
                  marginLeft: RFValue(20, 816),
                }}
              >
                <TouchableOpacity
                  style={{ marginVertical: RFValue(15, 816) }}
                  onPress={() => selectImage("Camera", "frontImage")}
                >
                  <AntDesign name="camera" size={RFValue(24, 816)} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => selectImage("Gallery", "frontImage")}
                >
                  <FontAwesome name="photo" size={RFValue(24, 816)} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View>
                <Text style={{ textAlign: "center" }}>Back Image</Text>
                <Image
                  source={backImageUrl ? { uri: backImageUrl } : null}
                  style={{
                    margin: RFValue(10, 816),
                    width: RFValue(100, 816),
                    height: RFValue(100, 816),
                    borderRadius: RFValue(5, 816),
                    backgroundColor: "grey",
                  }}
                />
              </View>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "space-around",
                  marginLeft: RFValue(20, 816),
                }}
              >
                <TouchableOpacity
                  style={{ marginVertical: RFValue(15, 816) }}
                  onPress={() => selectImage("Camera", "backImage")}
                >
                  <AntDesign name="camera" size={RFValue(24, 816)} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => selectImage("Gallery", "backImage")}
                >
                  <FontAwesome name="photo" size={RFValue(24, 816)} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View>
                <Text style={{ textAlign: "center" }}>Side Image</Text>
                <Image
                  source={sideImageUrl ? { uri: sideImageUrl } : null}
                  style={{
                    margin: RFValue(10, 816),
                    width: RFValue(100, 816),
                    height: RFValue(100, 816),
                    borderRadius: RFValue(5, 816),
                    backgroundColor: "grey",
                  }}
                />
              </View>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "space-around",
                  marginLeft: RFValue(20, 816),
                }}
              >
                <TouchableOpacity
                  style={{ marginVertical: RFValue(15, 816) }}
                  onPress={() => selectImage("Camera", "sideImage")}
                >
                  <AntDesign name="camera" size={RFValue(24, 816)} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => selectImage("Gallery", "sideImage")}
                >
                  <FontAwesome name="photo" size={RFValue(24, 816)} />
                </TouchableOpacity>
              </View>
            </View>

          </ScrollView>



            <View
              style={{
                marginLeft: -ScreenWidth * 0.5,
                marginTop: RFValue(25, 816),
              }}
            >
              <Text style={{ color: "black" }}>*Compulsory Fields</Text>
            </View>
            {editable && (
              <View>
                {loading ? 
                <View  style={{
                  height: RFValue(52, 816),
                  width: ScreenWidth - 100,
                  marginTop: RFValue(15, 816),
                  marginBottom: RFValue(25, 816),
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 50,
                  backgroundColor: "#C19F1E",
                }}>
                  <ActivityIndicator size='small' color='white' />
                </View>
                :
                <TouchableOpacity
                  style={{
                    height: RFValue(52, 816),
                    width: ScreenWidth - 100,
                    marginTop: RFValue(15, 816),
                    marginBottom: RFValue(25, 816),
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 50,
                    backgroundColor: "#C19F1E",
                  }}
                  onPress={saveDetails}
                >
                  <View>
                    <Text
                      style={{
                        color: "black",
                        fontFamily: "SF-Pro-Display-regular",
                        fontSize: RFValue(18, 816),
                        textAlign: "center",
                      }}
                    >
                      Save Form
                    </Text>
                  </View>
                </TouchableOpacity>
}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default Anthropometric;
