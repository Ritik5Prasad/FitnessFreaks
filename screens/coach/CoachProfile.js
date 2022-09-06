import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Linking,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  PermissionsAndroid,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUserData,
  selectTemperoryId,
  selectUserType,
  setUserData,
} from "../../features/userSlice";
import ImagePicker1 from "react-native-image-crop-picker";
import { db } from "../../firebase";
import Textarea from "react-native-textarea";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Notification from "../components/Notification";
import { Icon } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import Marker from "react-native-image-marker";
import Share from "react-native-share";
import DocumentPicker from "react-native-document-picker";
import * as firebase from "firebase";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

export default function CoachProfile({ props, navigation }) {
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const dispatch = useDispatch();
  const temperoryId = useSelector(selectTemperoryId);
  const [description, setDescription] = useState("");
  const [editable, seteditable] = useState(false);
  const [temperoryDetails, setTemperoryDetails] = useState(null);
  const [awards, setAwards] = useState("");
  const [certificates, setCertificates] = useState("");

  const [imageUrl, setImageUrl] = useState(null);
  const [reload, setreload] = useState(true);
  const [isLoading, setisLoading] = useState(false);
  useEffect(() => {
    setDescription(
      userData?.data?.description ? userData.data.description : ""
    );
    setAwards(userData?.data?.awards ? userData.data.awards : "");
    setCertificates(
      userData?.data?.certificates ? userData.data.certificates : ""
    );
  }, [userData?.id]);

  useEffect(() => {
    if (temperoryId) {
      db.collection("coaches")
        .doc(temperoryId)
        .get()
        .then(function (doc) {
          if (doc.exists) {
            setTemperoryDetails({ id: doc.id, data: doc.data() });
          } else {
            console.log("No such document!");
          }
        })
        .catch(function (error) {
          console.log("Error getting document:", error);
        });
    }
  }, [temperoryId, reload]);

  const saveprofile = () => {
    db.collection("coaches")
      .doc(userData?.id)
      .update({
        description,
        awards,
        certificates,
      })
      .then((res) => {
        seteditable(false);
        dispatch(
          setUserData({
            id: userData?.id,
            data: {
              ...userData.data,
              awards: awards,
              certificates: certificates,
              description: description,
            },
          })
        );
      })
      .catch((e) => console.log(e));
  };

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

  const GenerateMarkedImage = (uri) => {
    Marker.markImage({
      src: "file://" + uri,
      markerSrc:
        "https://firebasestorage.googleapis.com/v0/b/fitnessapp0.appspot.com/o/TMC-Nutritinist-Certification.jpeg?alt=media&token=437e6b28-29a2-4f75-8ffc-de83af50b5e3",
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

  const share = async () => {
    await Share.open({ url: path });
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
              db.collection("coaches")
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
    if (userType === "coach") {
      db.collection("coaches")
        .doc(userData?.id)
        .get()
        .then(function (snap) {
          dispatch(
            setUserData({
              id: userData?.id,
              data: snap.data(),
            })
          );
        });
    }
  }, [reload, userData]);

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: "#F6F6F6" }}
      contentContainerStyle={{ padding: 0, backgroundColor: "#F6F6F6" }}
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
            style={{ marginRight: 20 }}
            onPress={() => navigation.goBack()}
          >
            <Image source={require("../../assets/left_arrow.png")} />
          </TouchableOpacity>
          <Icon
            name="bars"
            type="font-awesome-5"
            size={24}
            onPress={() => navigation.toggleDrawer()}
          />
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
            source={
              userData?.data?.imageUrl || temperoryDetails?.data?.imageUrl
                ? {
                    uri:
                      userType !== "athlete"
                        ? userData?.data.imageUrl
                        : temperoryDetails?.data?.imageUrl,
                  }
                : require("../../assets/userImage.jpeg")
            }
            style={{
              width: RFValue(150, 816),
              height: RFValue(150, 816),
              borderRadius: 100,
              alignSelf: "center",
            }}
          />
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
        <Text
          style={{
            fontSize: RFValue(25, 816),
            fontWeight: "bold",
            color: "black",
            marginTop: RFValue(10, 816),
          }}
        >
          {userType === "coach"
            ? userData?.data.name
            : temperoryDetails?.data?.name}
        </Text>
        <Text
          style={{
            fontSize: RFValue(15, 816),
            fontWeight: "700",
            color: "black",
            marginTop: RFValue(5, 816),
          }}
        >
          {userType === "coach" && userData?.data.CoachType} Coach
        </Text>

        {userType !== "athlete" && (
          <View>
            {!editable ? (
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
            )}
          </View>
        )}
      </View>

      <View
        style={{ padding: RFValue(20, 816), paddingBottom: 0, paddingTop: 0 }}
      >
        <View style={{ marginTop: RFValue(10, 816), paddingBottom: 20 }}>
          <Text style={{ color: "black", fontSize: 16 }}>Description</Text>
          {!editable ? (
            <Text
              style={{
                color: "black",
                marginTop: RFValue(5, 816),
                fontSize: 16,
              }}
            >
              {userData.data.description}
            </Text>
          ) : (
            <Textarea
              containerStyle={{
                height: RFValue(180, 816),
                padding: RFValue(5, 816),
                backgroundColor: "#F5FCFF",
              }}
              style={{
                textAlignVertical: "top", // hack android
                height: RFValue(180, 816),
                fontSize: 14,
                color: "black",
              }}
              onChangeText={(text) => {
                setDescription(text);
              }}
              value={
                userType === "coach"
                  ? description
                  : temperoryDetails?.data?.description
              }
              defaultValue={
                userType === "coach"
                  ? description
                  : temperoryDetails?.data?.description
              }
              maxLength={120}
              placeholder={"Describe here ..."}
              underlineColorAndroid={"transparent"}
              editable={editable}
            />
          )}

          <View style={{ marginTop: RFValue(20, 816) }}>
            <Text style={{ color: "black", fontSize: 16 }}>Accolades</Text>
            {!editable ? (
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: RFValue(20, 816),
                  padding: RFValue(10, 816),
                  marginTop: RFValue(10, 816),
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "black",
                    fontSize: RFValue(18, 816),
                    alignSelf: "center",
                  }}
                >
                  Certifications
                </Text>
                <Text
                  style={{
                    color: "black",
                    alignSelf: "center",
                    textAlign: "center",
                    marginTop: RFValue(5, 816),
                  }}
                >
                  {userData?.data?.certificates}
                </Text>
                <Text
                  style={{
                    color: "blue",
                    fontSize: RFValue(18, 816),
                    marginTop: 10,
                    alignSelf: "center",
                  }}
                  onPress={() =>
                    Linking.openURL(
                      "https://www.myfoodprogram.com/wp-content/uploads/2020/02/CACFP-Week_Certificate-of-Good-Nutrition_v1_Youth-2048x1583.jpg"
                    )
                  }
                >
                  Nutritionist Certificates
                </Text>
              </View>
            ) : (
              <View>
                <Text
                  style={{
                    color: "black",
                    fontSize: RFValue(18, 816),
                    marginTop: 10,
                  }}
                >
                  Certificates
                </Text>
                <Textarea
                  containerStyle={{
                    backgroundColor: "white",
                    padding: RFValue(10, 816),
                    marginTop: 10,
                  }}
                  onChangeText={(text) => setCertificates(text)}
                  defaultValue={certificates}
                  maxLength={120}
                  placeholder={"Enter Awards earned"}
                />
              </View>
            )}
            {!editable ? (
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: RFValue(20, 816),
                  padding: RFValue(10, 816),
                  marginTop: RFValue(15, 816),
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "black",
                    fontSize: RFValue(18, 816),
                    alignSelf: "center",
                  }}
                >
                  Awards
                </Text>
                <Text
                  style={{
                    color: "black",
                    alignSelf: "center",
                    textAlign: "center",
                    marginTop: RFValue(5, 816),
                  }}
                >
                  {userData?.data?.awards}
                </Text>
              </View>
            ) : (
              <View>
                <Text
                  style={{
                    color: "black",
                    fontSize: RFValue(18, 816),
                    marginTop: 10,
                  }}
                >
                  Awards
                </Text>
                <Textarea
                  containerStyle={{
                    backgroundColor: "white",
                    padding: RFValue(10, 816),
                    marginTop: 10,
                  }}
                  onChangeText={(text) => setAwards(text)}
                  defaultValue={awards}
                  maxLength={120}
                  placeholder={"Enter Awards earned"}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
