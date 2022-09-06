import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  Dimensions,
  Image,
  TextInput,
  Modal,
  PermissionsAndroid,
} from "react-native";
let ScreenWidth = Dimensions.get("window").width;
let ScreenHeight = Dimensions.get("window").height;
import { useIsFocused } from "@react-navigation/native";
import ImagePicker from "react-native-image-crop-picker";
import { useDispatch, useSelector } from "react-redux";
import { selectUserData } from "../../features/userSlice";
import { db } from "../../firebase";
import { Icon } from "react-native-elements";
import WorkoutCard from "../components/WorkoutCard";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Notification from "../components/Notification";
import * as firebase from "firebase";
import WebView from "react-native-webview";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CheckBox from "@react-native-community/checkbox";
import DocumentPicker from "react-native-document-picker";

import { launchCamera, launchImageLibrary } from "react-native-image-picker";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3",
    marginBottom: 0,
    paddingTop: RFValue(20, 816),
    height: ScreenHeight,
    padding: RFValue(10, 816),
  },
  modalView1: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: ScreenWidth,
    minHeight: ScreenHeight / 1.8,
    paddingBottom: ScreenHeight * 0.05,
    paddingTop: RFValue(50, 816),
  },
  modalView: {
    backgroundColor: "#fff",
    borderRadius: RFValue(20, 816),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#333",
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 3.84,
    elevation: 9,
    width: "100%",
    height: ScreenHeight / 3.2,
    paddingBottom: ScreenHeight * 0.05,
  },
});

const EditOwnWorkout = ({ route, navigation }) => {
  const userData = useSelector(selectUserData);
  const [imageUrl, setImageUrl] = useState(null);

  const { workout, workoutId } = route.params;
  const [name, setName] = useState(workout.name);
  const [VideoURL, SetVideoURL] = useState(workout.videoUrl);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [videoData, setVideoData] = useState([
    {
      title: "",
      description: "",
    },
  ]);
  const [VideoSelected, SetVideoSelected] = useState(false);

  const imagePicker = (type) => {
    let temp = [...videoData];
    if (type == "gallery") {
      ImagePicker.clean().catch((e) => {
        console.log(e);
      });
      ImagePicker.openPicker({
        width: 900,
        height: 1200,
        cropping: true,
      }).then((image) => {
        temp[0]["thumbnail"] = image;

        setVideoData(temp);
        setThumbnail(image);

        setImageUrl(image.path);
      });
    } else {
      ImagePicker.clean().catch((e) => {
        console.log(e);
      });
      ImagePicker.openCamera({
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

  const pickDocument = async (type) => {
    try {
      // const res = await DocumentPicker.pick({
      //   type: [DocumentPicker.types[type]],
      // });

      const option = { mediaType: "video" };

      const res = await launchImageLibrary(option);
      var newData = res.assets[0];
      var filename = newData.uri.substring(newData.uri.lastIndexOf("/") + 1);
      newData.name = filename;

      console.log("Hello", res);
      if (type == "video") {
        let temp = [...videoData];
        if (!temp[0]) {
          temp[0] = {};
        }

        temp[0]["video"] = newData;

        setVideoData(temp);

        let formData1 = {
          title: "name",
          video: {
            uri: res.uri,
            type: res.type,
            size: res.size,
          },
        };
      }
      if (type == "images") {
        let temp = [...videoData];
        if (temp[0]) {
          temp[0]["thumbnail"] = res;
          console.log("HI", temp[0]["thumbnail"]);
          setVideoData(temp);
          setThumbnail(res);
        } else {
          alert("select a video first");
        }
      }

      setImageUrl(res.uri);

      // var formData = new FormData();
      // formData.append("title", "title");
      // formData.append("description", "description");
      // formData.append("video", {
      //   uri: res.uri,
      //   type: res.type,

      //   name: res.name,
      // });

      // let headers = {
      //   "Content-Type": "multipart/form-data", // this is a imp line
      //   Accept: "application/json",
      // };
      // let obj = {
      //   method: "POST",
      //   headers: headers,
      //   body: formData,
      // };
      // console.log("err");
      // let url1 = "http://192.168.55.101:3000/api/upload/video";

      // setTimeout(() => {
      //   fetch(url1, obj) // put your API URL here
      //     .then((resp) => {
      //       console.log(resp);
      //       let json = null;
      //       json = resp.json();
      //       console.log(" Response", json);
      //       if (resp.ok) {
      //         return json;
      //       }
      //       return json.then((err) => {
      //         console.log("error :", err);
      //         throw err;
      //       });
      //     })
      //     .then((json) => json)
      //     .catch((err) => {
      //       console.log("c", err);
      //     });
      // }, 3000);

      // console.log(res.uri, res.type, res.name, res.size);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

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
  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
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
                paddingHorizontal: RFValue(20, 816),
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
                fontSize: RFValue(24, 816),
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                marginLeft: 20,
              }}
            >
              Edit Workout
            </Text>
          </View>

          <Notification navigation={navigation} />
        </View>
        <View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <Image
              source={{
                uri: workout.thumbnail_url,
              }}
              style={{
                width: RFValue(100, 816),
                height: RFValue(100, 816),
                marginLeft: 20,
              }}
            />
            <TouchableOpacity>
              <Text
                style={{
                  marginLeft: 30,
                  fontWeight: "bold",
                  width: RFValue(180, 816),
                  fontSize: 20,
                }}
              >
                {workout.videoUrl}
              </Text>
            </TouchableOpacity>
          </View>

          <Text
            style={{
              fontSize: RFValue(18, 816),
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
              color: "black",
              marginLeft: 10,
              marginTop: 20,
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
              borderRadius: 4,
            }}
            value={name}
            onChangeText={(text) => {
              setName(text);
            }}
          />
          <Text
            style={{
              marginTop: RFValue(20, 816),
              marginLeft: 10,
              color: "black",
              fontWeight: "bold",
            }}
          >
            Upload Video Thumbnail
          </Text>
          <TouchableOpacity
            onPress={() => requestCameraPermission("gallery")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              margin: RFValue(30, 816),
            }}
          >
            <View
              style={{
                padding: RFValue(10, 816),
                backgroundColor: "white",
                borderRadius: 10,
              }}
            >
              {console.log("smj", videoData[0]?.thumbnail?.path)}
              {videoData[0]?.thumbnail ? (
                <Image
                  style={{ width: 100, height: 70 }}
                  source={{ uri: videoData[0].thumbnail.path }}
                />
              ) : (
                <Icon
                  name="video"
                  type="font-awesome-5"
                  color="black"
                  size={30}
                />
              )}
            </View>
            <Text style={{ marginLeft: RFValue(30, 816) }}>
              Select Image from Gallery
            </Text>
          </TouchableOpacity>
          <View
            style={{
              marginLeft: 10,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <CheckBox
              value={VideoSelected}
              tintColors={{
                true: "#C19F1E",
                false: "#C19F1E",
              }}
              onValueChange={(newValue) => {
                SetVideoSelected(!VideoSelected);
              }}
            />
            <Text style={{ color: "black" }}>Add Video</Text>
          </View>

          {!VideoSelected ? (
            <View>
              <Text
                style={{
                  fontSize: RFValue(18, 816),
                  fontFamily: "SF-Pro-Text-regular",
                  fontWeight: "bold",
                  color: "black",
                  marginLeft: 10,
                  marginTop: 20,
                }}
              >
                Video URL
              </Text>
              <TextInput
                style={{
                  height: 40,
                  margin: 12,
                  borderWidth: 1,
                  padding: 10,
                  borderRadius: 4,
                }}
                value={VideoURL}
                onChangeText={(text) => {
                  SetVideoURL(text);
                }}
              />
            </View>
          ) : (
            <View
              style={{
                marginLeft: 10,
              }}
            >
              <Text style={{ color: "black", marginTop: 20 }}>
                Upload Video
              </Text>
              <TouchableOpacity
                onPress={() => pickDocument("video")}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  margin: RFValue(20, 816),
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
                {videoData[0]?.video?.name ? (
                  <Text style={{ marginLeft: RFValue(30, 816) }}>
                    {videoData[0]?.video?.name}
                  </Text>
                ) : (
                  <Text style={{ marginLeft: RFValue(30, 816) }}>
                    Select Video from Gallery
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity
            style={{
              width: RFValue(100, 816),
              height: RFValue(35, 816),
              backgroundColor: "#C19F1E",
              textAlign: "center",
              marginLeft: 100,
              borderRadius: 5,
              marginTop: 20,
            }}
            onPress={async () => {
              if (thumbnail == null || videoData.length == 0) {
                db.collection("coaches")
                  .doc(userData?.id)
                  .collection("ownWorkout")
                  .doc(workoutId)
                  .update({
                    name: name,
                    workoutName: name,
                    videoUrl: VideoURL,
                  })
                  .then(() => {
                    alert("Edited Successfully");
                  });
              } else {
                if (!VideoSelected) {
                  const response = await fetch(thumbnail.path);
                  const blob = await response.blob();
                  firebase
                    .storage()
                    .ref(
                      `/coachWorkoutThumbnails/${userData.data.email}/${thumbnail.name}`
                    )
                    .put(blob);

                  let url;
                  const storageRef = firebase.storage().ref();
                  const fileRef = storageRef.child(
                    `/coachWorkoutThumbnails/${userData.data.email}/${thumbnail.name}`
                  );
                  await fileRef.getDownloadURL().then((url) => {
                    db.collection("coaches")
                      .doc(userData?.id)
                      .collection("ownWorkout")
                      .doc(workoutId)
                      .update({
                        name: name,
                        workoutName: name,
                        videoUrl: VideoURL,
                        thumbnail_url: url,
                      })
                      .then(() => {
                        alert("Edited Successfully");
                      });
                  });
                } else {
                  const response = await fetch(thumbnail.path);
                  const blob = await response.blob();
                  firebase
                    .storage()
                    .ref(
                      `/coachWorkoutThumbnails/${userData.data.email}/${thumbnail.name}`
                    )
                    .put(blob);

                  let url;
                  const storageRef = firebase.storage().ref();
                  const fileRef = storageRef.child(
                    `/coachWorkoutThumbnails/${userData.data.email}/${thumbnail.name}`
                  );
                  await fileRef.getDownloadURL().then((url2) => {
                    console.log(url2);
                    let data = [...videoData];

                    data.forEach((vid) => {
                      var formData = new FormData();

                      formData.append("title", vid.title);
                      formData.append("description", vid.description);
                      formData.append("video", {
                        uri: vid.video.uri,
                        type: vid.video.type,

                        name: vid.video.name,
                      });
                      // formData.append("video", {
                      //   uri: vid?.thumbnail?.uri ? vid?.thumbnail?.uri : null,
                      //   type: vid?.thumbnail?.type ? vid?.thumbnail?.type : null,
                      //   name: vid?.thumbnail?.name ? vid?.thumbnail?.name : null,
                      // });
                      let headers = {
                        "Content-Type": "multipart/form-data", // this is a imp line
                      };
                      let obj = {
                        method: "POST",
                        headers: headers,
                        body: formData,
                      };

                      let url1 =
                        "https://ritikp-server.herokuapp.com/api/upload/video";
                      console.log(formData);
                      setTimeout(() => {
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
                                firebase.firestore.FieldValue.serverTimestamp(),
                                vid.title,
                                vid.description,
                                userData?.id
                              );

                              db.collection("coaches")
                                .doc(userData?.id)
                                .collection("ownWorkout")
                                .add({
                                  name: name,
                                  // videoId: json.uri,
                                  videoUrl: "https://vimeo.com/" + json.uri,
                                  workoutName: name,
                                  timestamp:
                                    firebase.firestore.FieldValue.serverTimestamp(),
                                  thumbnail_url: url2,
                                })
                                .then(() => {
                                  alert("Edited Successfully");
                                });
                              console.log("wt", json);
                            } else {
                            }
                          })
                          .catch((err) => {
                            console.log("c", err);
                          });
                      }, 2000);
                    });
                  });
                }
              }
            }}
          >
            <Text
              style={{
                textAlign: "center",
                marginTop: 4,
                color: "white",
              }}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default EditOwnWorkout;
