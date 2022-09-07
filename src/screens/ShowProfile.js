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
  DatePickerIOS,
} from "react-native";
let ScreenWidth = Dimensions.get("window").width;
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Icon } from "react-native-elements";
import * as Permissions from "expo-permissions";

import * as ImagePicker from "expo-image-picker";
import * as firebase from "firebase";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";
import {
  selectShowData,
  selectUser,
  selectUserDetails,
  setDbID,
  setUserDetails,
} from "../features/userSlice";
import { db } from "../utils/firebase";
import DatePicker from "react-native-datepicker";
import moment from "moment";
import DocumentPicker from "react-native-document-picker";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: RFValue(20, 816),
    marginBottom: 0,
    paddingTop: RFValue(20, 816),
  },
  profileLabels: {
    color: "black",
    marginVertical: RFValue(20, 816),
    fontSize: RFValue(20, 816),
    width: RFValue(200, 816),
    fontWeight: "bold",
  },
  profileData: {
    color: "black",
    margin: RFValue(20, 816),
    fontSize: RFValue(20, 816),
  },

  imageContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});

function ShowProfile({ route, navigation }) {
  const user = useSelector(selectUser);
  const [userData, setUserData] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [editable, setEditable] = useState(false);
  const [name, setName] = useState(userData?.data?.name);
  const [gender, setGender] = useState(userData?.data?.gender);
  const [dob, setDob] = useState(userData?.data?.dob);
  const [email, setEmail] = useState(userData?.data?.email);
  const [address, setAddress] = useState(userData?.data?.address);
  const [phone, setPhone] = useState(userData?.data?.phone);
  const dispatch = useDispatch();

  const [type, setType] = useState(null);
  const [athlete_id, setAtheteId] = useState(null);

  useEffect(() => {
    if (route.params?.type) {
      setType(route.params?.type);
    }
  }, [route.params?.type]);

  useEffect(() => {
    if (route.params?.athlete_id) {
      setAtheteId(route.params?.athlete_id);
    }
  }, [route.params?.athlete_id]);

  useEffect(() => {
    db.collection("athletes")
      .where("email", "==", user)
      .get()
      .then(function (querySnapshot) {
        console.log("23");
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

    if (athlete_id) {
      db.collection("athletes")
        .doc(athlete_id)
        .get()
        .then(function (doc) {
          console.log("24");
          if (doc.exists) {
            console.log("Document data:", doc.data());
            setUserData({ id: doc.id, data: doc.data() });
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch(function (error) {
          console.log("Error getting document:", error);
        });
    }
  }, [user, athlete_id]);

  const getImageFromCamera = async () => {
    console.log("Image from camera");
    const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
    // // const cameraRollPermission = await Permissions.askAsync(
    // //   Permissions.CAMERA
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

  const uploadImage = async (uri, imageName) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const childPath = `images/${email}`;

    const task = firebase.storage().ref().child(childPath).put(blob);

    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        console.log(snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };

  useEffect(() => {
    if (name === undefined) {
      setName(userData?.data?.name);
    }
    if (gender === undefined) {
      setGender(userData?.data?.gender);
    }
    if (dob === undefined) {
      setDob(userData?.data?.dob);
    }
    if (email === undefined) {
      setEmail(userData?.data?.email);
    }
    if (address === undefined) {
      setAddress(userData?.data?.address);
    }
    if (phone === undefined) {
      setPhone(userData?.data?.phone);
    }
  }, [editable]);

  const saveDetails = () => {
    if (name === undefined) {
      setName(userData?.data?.name);
    }
    if (gender === undefined) {
      setGender(userData?.data?.gender);
    }
    if (dob === undefined) {
      setDob(userData?.data?.dob);
    }
    if (email === undefined) {
      setEmail(userData?.data?.email);
    }
    if (address === undefined) {
      setAddress(userData?.data?.address);
    }
    if (phone === undefined) {
      setPhone(userData?.data?.phone);
    }

    console.log("Updated details:");
    console.log(name, gender, dob, email, address, phone);
    console.log("==============================");

    db.collection("athletes")
      .doc(userData?.id)
      .update({
        name,
        email,
        gender,
        address,
        dob,
        phone,
        imageUrl,
      })
      .then((res) => console.log(res))
      .catch((e) => console.log(e));
    setEditable(false);
  };

  return (
    <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Settings")}
          style={{
            position: "absolute",
            left: RFValue(25, 816),
            top: RFValue(30, 816),
            backgroundColor: "white",
          }}
        >
          <Icon name="chevron-left" type="font-awesome-5" color="white" />
        </TouchableOpacity>

        <View
          style={{
            width: RFValue(80, 816),
            position: "absolute",
            top: RFValue(27, 816),
            right: 0,
          }}
        >
          {type !== "coach" && (
            <TouchableOpacity onPress={() => setEditable(true)}>
              <Icon name="edit" type="font-awesome-5" color="#eee" />
            </TouchableOpacity>
          )}
        </View>

        <View>
          <View>
            <View style={styles.imageContainer}>
              <Image
                style={
                  editable
                    ? {
                        margin: RFValue(10, 816),
                        marginLeft: RFValue(50, 816),
                        width: RFValue(120, 816),
                        height: RFValue(120, 816),
                        borderRadius: 100,
                        backgroundColor: "white",
                        alignSelf: "center",
                        marginTop: RFValue(50, 816),
                      }
                    : {
                        margin: RFValue(10, 816),
                        width: RFValue(120, 816),
                        height: RFValue(120, 816),
                        borderRadius: 100,
                        backgroundColor: "white",
                        alignSelf: "center",
                        marginTop: RFValue(50, 816),
                      }
                }
                source={
                  imageUrl
                    ? { uri: imageUrl }
                    : { uri: userData?.data?.imageUrl }
                }
              />
              {editable && (
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
                    <AntDesign
                      name="camera"
                      size={RFValue(24, 816)}
                      color="white"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={getImageFromGallery}>
                    <FontAwesome
                      name="photo"
                      size={RFValue(24, 816)}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={{ display: "flex", alignItems: "center" }}>
              <TextInput
                style={
                  editable
                    ? {
                        borderWidth: 1,
                        width: RFValue(200, 816),
                        borderColor: "white",
                        color: "black",
                        borderRadius: RFValue(5, 816),
                        display: "flex",
                        alignSelf: "center",
                        fontSize: RFValue(20, 816),
                        textAlign: "center",
                        width: ScreenWidth,
                        paddingVertical: Platform.OS === "ios" ? 15 : 10,
                      }
                    : {
                        borderWidth: 0,
                        width: RFValue(200, 816),
                        borderColor: "white",
                        color: "black",
                        borderRadius: RFValue(5, 816),
                        display: "flex",
                        alignSelf: "center",
                        fontSize: RFValue(20, 816),
                        textAlign: "center",
                        paddingVertical:
                          Platform.OS === "ios"
                            ? RFValue(15, 816)
                            : RFValue(10, 816),
                        width: ScreenWidth,
                      }
                }
                ////placeholdertextColor="white"
                defaultValue={userData?.data?.name}
                editable={editable}
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          <View style={{ marginLeft: -RFValue(50, 816) }}>
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <Text style={styles.profileLabels}>Gender : </Text>

              {editable ? (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 0,
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
                        onPress={() => setGender("female")}
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
                              gender == "female" ? "black" : "white",
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
                        onPress={() => setGender("male")}
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
                              gender == "male" ? "black" : "white",
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
              ) : (
                <TextInput
                  style={{
                    borderWidth: 0,
                    width: RFValue(200, 816),
                    borderColor: "white",
                    color: "black",
                    borderRadius: RFValue(5, 816),
                    paddingVertical:
                      Platform.OS === "ios" ? 15 : RFValue(5, 816),
                    paddingHorizontal: RFValue(10, 816),
                  }}
                  //placeholdertextColor="white"
                  editable={editable}
                  defaultValue={userData?.data?.gender}
                  value={gender}
                  onChangeText={setGender}
                />
              )}
            </View>

            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <Text style={styles.profileLabels}>Date of Birth : </Text>
              {editable ? (
                /*Platform.OS === 'ios'?
               <DatePickerIOS
               date={new Date(moment(dob,"DD-MM-YYYY"))}
               onDateChange={(date) => setDob(moment(date).format("DD-MM-YYYY"))}
               timeZoneOffsetInMinutes={5*60 + 30}
             />
                : */
                <DatePicker
                  style={{
                    width: ScreenWidth - RFValue(150, 816),
                    marginVertical: RFValue(10, 816),
                  }}
                  date={dob}
                  mode="date"
                  placeholder="Select Date of Birth"
                  format="DD-MM-YYYY"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
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
                      backgroundColor: "#000000",
                      color: "black",
                    },
                    // ... You can check the source to find the other keys.
                  }}
                  onDateChange={(date) => {
                    setDob(date);
                  }}
                />
              ) : (
                <TextInput
                  style={{
                    borderWidth: 0,
                    width: RFValue(200, 816),
                    borderColor: "white",
                    color: "black",
                    borderRadius: RFValue(5, 816),
                    paddingVertical:
                      Platform.OS === "ios" ? 15 : RFValue(5, 816),
                    paddingHorizontal: RFValue(10, 816),
                  }}
                  //placeholdertextColor="white"
                  editable={editable}
                  defaultValue={userData?.data?.dob}
                  value={dob}
                  onChangeText={setDob}
                />
              )}
            </View>

            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <Text style={styles.profileLabels}>Email : </Text>

              <TextInput
                style={
                  editable
                    ? {
                        borderWidth: 1,
                        width: RFValue(200, 816),
                        borderColor: "white",
                        color: "black",
                        borderRadius: RFValue(5, 816),
                        paddingVertical:
                          Platform.OS === "ios" ? 15 : RFValue(5, 816),
                        paddingHorizontal: RFValue(10, 816),
                      }
                    : {
                        borderWidth: 0,
                        width: RFValue(200, 816),
                        borderColor: "white",
                        color: "black",
                        borderRadius: RFValue(5, 816),
                        paddingVertical: RFValue(5, 816),
                        paddingHorizontal: RFValue(10, 816),
                      }
                }
                //placeholdertextColor="white"
                editable={editable}
                defaultValue={userData?.data?.email}
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <View style={{ display: "flex", alignItems: "center" }}>
              <Text style={styles.profileLabels}>Address :</Text>

              <TextInput
                style={
                  editable
                    ? {
                        borderWidth: 1,
                        width: RFValue(020, 816),
                        borderColor: "white",
                        color: "black",
                        borderRadius: RFValue(5, 816),
                        paddingVertical:
                          Platform.OS === "ios" ? 15 : RFValue(5, 816),
                        paddingHorizontal: RFValue(10, 816),
                      }
                    : {
                        borderWidth: 0,
                        width: RFValue(200, 816),
                        borderColor: "white",
                        color: "black",
                        borderRadius: RFValue(5, 816),
                        paddingVertical: RFValue(5, 816),
                        paddingHorizontal: RFValue(10, 816),
                      }
                }
                //placeholdertextColor="white"
                editable={editable}
                defaultValue={userData?.data?.address}
                value={address}
                onChangeText={setAddress}
              />
            </View>
            <View style={{ display: "flex", alignItems: "center" }}>
              <Text style={styles.profileLabels}>Phone :</Text>

              <TextInput
                style={
                  editable
                    ? {
                        borderWidth: 1,
                        width: RFValue(200, 816),
                        borderColor: "white",
                        color: "black",
                        borderRadius: RFValue(5, 816),
                        paddingVertical:
                          Platform.OS === "ios" ? 15 : RFValue(5, 816),
                        paddingHorizontal: RFValue(10, 816),
                      }
                    : {
                        borderWidth: 0,
                        width: RFValue(200, 816),
                        borderColor: "white",
                        color: "black",
                        borderRadius: RFValue(5, 816),
                        paddingVertical: RFValue(5, 816),
                        paddingHorizontal: RFValue(10, 816),
                      }
                }
                //placeholdertextColor="white"
                defaultValue={userData?.data?.phone}
                editable={editable}
                keyboardType={"numeric"}
                value={phone}
                onChangeText={setPhone}
              />
            </View>
          </View>
        </View>
        {editable && (
          <TouchableOpacity
            activeOpacity={0.6}
            backgroundColor="steelblue"
            style={{
              width: "90%",
              backgroundColor: "steelblue",
              height: RFValue(55, 816),
              marginBottom: RFValue(20, 816),
              justifyContent: "center",
              alignItems: "center",
              borderRadius: RFValue(8, 816),
              shadowColor: "#3895CE",
              marginHorizontal: RFValue(20, 816),
              marginTop: RFValue(50, 816),
            }}
            onPress={saveDetails}
          >
            <LinearGradient
              colors={["#3895CE", "#004872"]}
              start={[0, 0]}
              end={[1, 0]}
              style={{
                width: "100%",
                height: "100%",
                paddingTop: RFValue(10, 816),
                borderRadius: RFValue(8, 816),
              }}
              onPress={saveDetails}
            >
              <View>
                <Text
                  style={{
                    color: "#E2E2E2",
                    fontSize: RFValue(20, 816),
                    fontFamily: "SF-Pro-Display-regular",
                    textAlign: "center",
                  }}
                >
                  Save Changes
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAwareScrollView>
  );
}

export default ShowProfile;
