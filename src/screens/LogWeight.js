import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
  TextInput,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { db } from "../utils/firebase";
import firebase from "firebase";
import ImagePicker from "react-native-image-crop-picker";
import DatePicker from "react-native-datepicker";
import moment from "moment";
import "moment/locale/en-in";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";
import { selectUserData, setUserData } from "../features/userSlice";
import { Icon } from "react-native-elements";
import Notification from "./components/Notification";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import triggerNotification from "../utils/sendPushNotification";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 0,
    padding: RFValue(20, 816),
    minHeight: ScreenHeight,
  },
  progressBar: {
    height: RFValue(20, 816),
    width: "100%",
    backgroundColor: "white",
    borderColor: "#000",
    borderWidth: 2,
    borderRadius: RFValue(5, 816),
  },
});

const AddMetrics = ({ route, navigation }) => {
  moment.locale("en-in");
  const userData = useSelector(selectUserData);
  const dispatch = useDispatch();
  const [weight, setWeight] = useState(null);
  const [height, setHeight] = useState(null);
  const [fat, setFat] = useState(null);
  const [muscle, setMuscle] = useState(null);
  const [date, setDate] = useState(formatDate());
  const [logged, setLogged] = useState(false);
  const [backImageUrl, setBackImageUrl] = useState(null);
  const [frontImageUrl, setFrontImageUrl] = useState(null);
  const [sideImageUrl, setSideImageUrl] = useState(null);

  // const [backUrl, setBackUrl] = useState(null);
  // const [frontUrl, setFrontUrl] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [neck, setNeck] = useState("");
  const [chest, setChest] = useState("");
  const [waist, setWaist] = useState("");
  const [glutes, setGlutes] = useState("");
  const [quads, setQuads] = useState("");
  const [arms, setArms] = useState("");

  function formatDate() {
    var d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  useEffect(() => {
    if (date && userData?.id && userData?.id.metrics) {
      if (userData?.data?.metrics[date] !== undefined) {
        if (userData?.data.metrics[date].weight !== undefined) {
          setWeight(userData?.data.metrics[date].weight);
        }
        if (userData?.data.metrics[date].height !== undefined) {
          setHeight(userData?.data.metrics[date].height);
        }
        if (userData?.data.metrics[date].fat !== undefined) {
          setFat(userData?.data.metrics[date].fat);
        }
        if (userData?.data.metrics[date].muscle !== undefined) {
          setMuscle(userData?.data.metrics[date].muscle);
        }
        if (userData?.data.metrics[date].neck !== undefined) {
          setNeck(userData?.data.metrics[date].neck);
        }
        if (userData?.data.metrics[date].chest !== undefined) {
          setChest(userData?.data.metrics[date].chest);
        }
        if (userData?.data.metrics[date].waist !== undefined) {
          setWaist(userData?.data.metrics[date].waist);
        }
        if (userData?.data.metrics[date].glutes !== undefined) {
          setGlutes(userData?.data.metrics[date].glutes);
        }
        if (userData?.data.metrics[date].quads !== undefined) {
          setQuads(userData?.data.metrics[date].quads);
        }
        if (userData?.data.metrics[date].arms !== undefined) {
          setArms(userData?.data.metrics[date].arms);
        }
      }
    }
  }, [date]);

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

  function formatDate() {
    var d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  const AddDetails = async () => {
    if (weight == undefined || weight === "") {
      alert("Please enter the weight.");
      return;
    }
    setLoading(true);
    var frontUrl = "";
    if (frontImageUrl) {
      frontUrl = await uploadImage(frontImageUrl, "frontImage");
    }

    var sideUrl = "";
    if (sideImageUrl) {
      sideUrl = await uploadImage(sideImageUrl, "sideImage");
    }


    var backUrl = "";
    if (backImageUrl) {
      backUrl = await uploadImage(backImageUrl, "backImage");
    }

    setLoading(false);
    db.collection("athletes")
      .doc(userData?.id)
      .get()
      .then(function (snap) {
        let temp = snap.data().metrics;
        if (temp[date]) {
          let t = { ...temp[date] };
          t.weight = parseFloat(weight);
          t.height = parseFloat(height);
          t.fat = parseFloat(fat);
          t.muscle = parseFloat(muscle);
          t.neck = parseFloat(neck);
          t.chest = parseFloat(chest);
          t.waist = parseFloat(waist);
          t.glutes = parseFloat(glutes);
          t.quads = parseFloat(quads);
          t.arms = parseFloat(arms);
          t.frontImageUrl = frontUrl ? frontUrl : "";
          t.backImageUrl = backUrl ? backUrl : "";
          t.sideImageUrl = sideUrl ? sideUrl : "";

          temp[date] = t;
        } else {
          temp[date] = {
            weight: parseFloat(weight),
            height: parseFloat(height),
            fat: parseFloat(fat),
            muscle: parseFloat(muscle),
            neck: parseFloat(neck),
            chest: parseFloat(chest),
            waist: parseFloat(waist),
            glutes: parseFloat(glutes),
            quads: parseFloat(quads),
            arms: parseFloat(arms),
            frontImageUrl: frontUrl,
            backImageUrl: backUrl,
            sideImageUrl: sideUrl,
          };
        }
        console.log("temp------>", temp);
        db.collection("athletes").doc(userData?.id).update({
          metrics: temp,
        });

        db.collection("athletes")
          .doc(userData?.id)
          .collection("metrics")
          .doc(date)
          .set({
            weight: parseFloat(weight),
            height: parseFloat(height),
            fat: parseFloat(fat),
            muscle: parseFloat(muscle),
            neck: parseFloat(neck),
            chest: parseFloat(chest),
            waist: parseFloat(waist),
            glutes: parseFloat(glutes),
            quads: parseFloat(quads),
            arms: parseFloat(arms),
            frontImageUrl: frontUrl,
            backImageUrl: backUrl,
            sideImageUrl: sideUrl,

          });
        const ids = [userData.data.listOfCoaches[0]];
        triggerNotification(ids, {
          title: "Logged Metrics",
          body: `${userData?.data?.name} has logged metrics on ${date} `,
        });
        if (fat || muscle || height || weight) {
          db.collection("athletes")
            .doc(userData?.id)
            .collection("Anthropometric")
            .get()
            .then((snap) => {
              if (!snap.empty) {
                db.collection("athletes")
                  .doc(userData?.id)
                  .collection("Anthropometric")
                  .doc("anthropometric")
                  .update({
                    height: parseFloat(height),
                    weight: parseFloat(weight),
                    fat: parseFloat(fat),
                    muscle: parseFloat(muscle),
                    neck: parseFloat(neck),
                    chest: parseFloat(chest),
                    waist: parseFloat(waist),
                    glutes: parseFloat(glutes),
                    quads: parseFloat(quads),
                    arms: parseFloat(arms),
                    backImageUrl: backUrl,
                    frontImageUrl: frontUrl,
                    sideImageUrl: sideUrl,

                  })
                  .then((res) => {
                    alert("Logged Metrics Successfully!");

                    db.collection("CoachNotifications")
                      .doc(userData.data.listOfCoaches[0])
                      .collection("notifications")
                      .add(
                        {
                          message: `${userData?.data?.name} has logged metrics on ${date} `,
                          seen: false,
                          timestamp:
                            firebase.firestore.FieldValue.serverTimestamp(),
                          athlete_id: userData?.id,
                        },
                        { merge: true }
                      )
                      .then(() => { });
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              } else {
                db.collection("athletes")
                  .doc(userData?.id)
                  .collection("Anthropometric")
                  .doc("anthropometric")
                  .set({
                    height: parseFloat(height),
                    weight: parseFloat(weight),
                    fat: parseFloat(fat),
                    muscle: parseFloat(muscle),
                    neck: parseFloat(neck),
                    chest: parseFloat(chest),
                    waist: parseFloat(waist),
                    glutes: parseFloat(glutes),
                    quads: parseFloat(quads),
                    arms: parseFloat(arms),
                    backImageUrl: backUrl,
                    frontImageUrl: frontUrl,
                    sideImageUrl: sideUrl,

                  })
                  .then((res) => {
                    alert("Logged Metrics Successfully!");
                  })
                  .catch((e) => console.log(e));
              }
            });
        }
      });
  };

  return (
    <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
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

            <Text
              style={{
                fontSize: RFValue(30, 816),
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                color: "black",
                marginLeft: RFValue(20, 816),
              }}
            >
              Add Metrics
            </Text>
          </View>
          <Notification navigation={navigation} />
        </View>

        <View style={{ marginTop: 0 }}>
          {logged ? (
            <View
              style={{
                padding: RFValue(15, 816),
                backgroundColor: "white",
                borderRadius: 30,
                marginTop: RFValue(15, 816),
              }}
            >
              <Text>Logged Metrics on {date}</Text>
            </View>
          ) : null}
          {/* Platform.OS === 'ios'?
               <DatePickerIOS
               date={new Date(date)}               
               //style={{marginTop:-RFValue(80,816),marginBottom:-RFValue(80,816)}}
               onDateChange={(date) => {setDate(moment(date).format("YYYY-MM-DD"));}}
               timeZoneOffsetInMinutes={5*60 + 30}
             />
            :  */}
          <DatePicker
            style={{
              width: "100%",
              marginTop: RFValue(20, 816),
              alignSelf: "flex-start",
              backgroundColor: "white",
              borderWidth: 2,
              borderColor: "#DBE2EA",
              borderRadius: RFValue(10, 816),
            }}
            date={date}
            mode="date"
            placeholder="select date"
            format="YYYY-MM-DD"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: "absolute",
                height: 0,
                width: 0,
              },
              dateInput: {
                borderWidth: 0,
              },
              dateText: {
                alignSelf: "flex-start",
                marginLeft: RFValue(10, 816),
              },
            }}
            onDateChange={(date) => {
              setDate(date);
            }}
            maxDate={new Date()}
          />

          <Text
            style={{
              marginBottom: RFValue(10, 816),
              color: "black",
              marginTop: RFValue(10, 816),
            }}
          >
            Weight*
          </Text>
          <TextInput
            style={{
              borderWidth: 2,
              width: "100%",
              borderColor: "#DBE2EA",
              borderRadius: RFValue(10, 816),
              paddingVertical: Platform.OS === "ios" ? 15 : RFValue(5, 816),
              paddingHorizontal: RFValue(10, 816),
              backgroundColor: "white",
            }}
            placeholder="Enter Weight"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />
          <View
            style={{
              borderBottomWidth: 0.7,
              bordercolor: "white",
              marginTop: RFValue(20, 816),
            }}
          ></View>

          <Text
            style={{
              marginBottom: RFValue(10, 816),
              color: "black",
              marginTop: RFValue(10, 816),
            }}
          >
            Anthromorphic Measuremants
          </Text>

          <Text
            style={{
              marginBottom: RFValue(10, 816),
              color: "black",
              marginTop: RFValue(10, 816),
            }}
          >
            Fat Percentage
          </Text>
          <TextInput
            style={{
              borderWidth: 2,
              width: "100%",
              borderColor: "#DBE2EA",
              borderRadius: RFValue(10, 816),
              paddingVertical: Platform.OS === "ios" ? 15 : RFValue(5, 816),
              paddingHorizontal: RFValue(10, 816),
              backgroundColor: "white",
            }}
            placeholder={"Enter Fat Percentage"}
            value={fat}
            onChangeText={setFat}
            keyboardType="numeric"
          />

          <Text
            style={{
              marginBottom: RFValue(10, 816),
              color: "black",
              marginTop: RFValue(10, 816),
            }}
          >
            Height
          </Text>
          <TextInput
            style={{
              borderWidth: 2,
              width: "100%",
              borderColor: "#DBE2EA",
              borderRadius: RFValue(10, 816),
              paddingVertical: Platform.OS === "ios" ? 15 : RFValue(5, 816),
              paddingHorizontal: RFValue(10, 816),
              backgroundColor: "white",
            }}
            placeholder="Enter Height"
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
          />
          <Text
            style={{
              marginBottom: RFValue(10, 816),
              color: "black",
              marginTop: RFValue(10, 816),
            }}
          >
            Muscle Percentage
          </Text>
          <TextInput
            style={{
              borderWidth: 2,
              width: "100%",
              borderColor: "#DBE2EA",
              borderRadius: RFValue(10, 816),
              paddingVertical: Platform.OS === "ios" ? RFValue(15, 816) : 5,
              paddingHorizontal: RFValue(10, 816),
              backgroundColor: "white",
            }}
            placeholder="Enter Muscle Percentage"
            value={muscle}
            onChangeText={setMuscle}
            keyboardType="numeric"
          />

          <Text
            style={{
              marginBottom: RFValue(10, 816),
              color: "black",
              marginTop: RFValue(10, 816),
            }}
          >
            Neck (Inch)
          </Text>
          <TextInput
            style={{
              borderWidth: 2,
              width: "100%",
              borderColor: "#DBE2EA",
              borderRadius: RFValue(10, 816),
              paddingVertical: Platform.OS === "ios" ? RFValue(15, 816) : 5,
              paddingHorizontal: RFValue(10, 816),
              backgroundColor: "white",
            }}
            placeholder="Enter Neck size"
            value={neck}
            onChangeText={setNeck}
            keyboardType="numeric"
          />

          <Text
            style={{
              marginBottom: RFValue(10, 816),
              color: "black",
              marginTop: RFValue(10, 816),
            }}
          >
            Chest (Inch)
          </Text>
          <TextInput
            style={{
              borderWidth: 2,
              width: "100%",
              borderColor: "#DBE2EA",
              borderRadius: RFValue(10, 816),
              paddingVertical: Platform.OS === "ios" ? RFValue(15, 816) : 5,
              paddingHorizontal: RFValue(10, 816),
              backgroundColor: "white",
            }}
            placeholder="Enter Chest size "
            value={chest}
            onChangeText={setChest}
            keyboardType="numeric"
          />

          <Text
            style={{
              marginBottom: RFValue(10, 816),
              color: "black",
              marginTop: RFValue(10, 816),
            }}
          >
            Waist (Inch)
          </Text>
          <TextInput
            style={{
              borderWidth: 2,
              width: "100%",
              borderColor: "#DBE2EA",
              borderRadius: RFValue(10, 816),
              paddingVertical: Platform.OS === "ios" ? RFValue(15, 816) : 5,
              paddingHorizontal: RFValue(10, 816),
              backgroundColor: "white",
            }}
            placeholder="Enter Waist Size"
            value={waist}
            onChangeText={setWaist}
            keyboardType="numeric"
          />

          <Text
            style={{
              marginBottom: RFValue(10, 816),
              color: "black",
              marginTop: RFValue(10, 816),
            }}
          >
            Glutes (Inch)
          </Text>
          <TextInput
            style={{
              borderWidth: 2,
              width: "100%",
              borderColor: "#DBE2EA",
              borderRadius: RFValue(10, 816),
              paddingVertical: Platform.OS === "ios" ? RFValue(15, 816) : 5,
              paddingHorizontal: RFValue(10, 816),
              backgroundColor: "white",
            }}
            placeholder="Enter Gluts Size"
            value={glutes}
            onChangeText={setGlutes}
            keyboardType="numeric"
          />

          <Text
            style={{
              marginBottom: RFValue(10, 816),
              color: "black",
              marginTop: RFValue(10, 816),
            }}
          >
            Quads (Inch)
          </Text>
          <TextInput
            style={{
              borderWidth: 2,
              width: "100%",
              borderColor: "#DBE2EA",
              borderRadius: RFValue(10, 816),
              paddingVertical: Platform.OS === "ios" ? RFValue(15, 816) : 5,
              paddingHorizontal: RFValue(10, 816),
              backgroundColor: "white",
            }}
            placeholder="Enter Quads Size"
            value={quads}
            onChangeText={setQuads}
            keyboardType="numeric"
          />

          <Text
            style={{
              marginBottom: RFValue(10, 816),
              color: "black",
              marginTop: RFValue(10, 816),
            }}
          >
            Arms (Inch)
          </Text>
          <TextInput
            style={{
              borderWidth: 2,
              width: "100%",
              borderColor: "#DBE2EA",
              borderRadius: RFValue(10, 816),
              paddingVertical: Platform.OS === "ios" ? RFValue(15, 816) : 5,
              paddingHorizontal: RFValue(10, 816),
              backgroundColor: "white",
            }}
            placeholder="Enter Arms Size"
            value={arms}
            onChangeText={setArms}
            keyboardType="numeric"
          />

          <Text
            style={{
              marginBottom: RFValue(10, 816),
              color: "black",
              marginTop: RFValue(10, 816),
            }}
          >
            *compulsory fields
          </Text>

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
          {isLoading && (
            <View style={{ marginTop: 10 }}>
              <ActivityIndicator size="large" color="#C19F1E" />
            </View>
          )}
          <TouchableOpacity
            onPress={() => AddDetails()}
            style={{
              padding: RFValue(15, 816),
              backgroundColor: "#C19F1E",
              borderRadius: 25,
              marginTop: RFValue(20, 816),
            }}
          >
            <Text
              style={{
                fontSize: RFValue(16, 816),
                color: "black",
                alignSelf: "center",
              }}
            >
              Log Metrics
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default AddMetrics;
