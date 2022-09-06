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
  Platform,
  PermissionsAndroid,
} from "react-native";
import { auth, db } from "../../firebase";
import ImagePicker from "react-native-image-crop-picker";
import * as firebase from "firebase";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox } from "react-native-paper";
import CheckBox from "@react-native-community/checkbox";
import {
  setDbID,
  selectDbId,
  selectUser,
  setUserDetails,
  selectShowData,
  logout,
  setUserData,
  selectUserData,
} from "../../features/userSlice";
import { useIsFocused } from "@react-navigation/native";
import { Icon } from "react-native-elements";
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
import Notification from "../components/Notification";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import VimeoPlayer from "../components/VimeoPlayer";
import { Formik } from "formik";
import DocumentPicker from "react-native-document-picker";
// import { Thumbnail } from "react-native-thumbnail-video";

import { launchCamera, launchImageLibrary } from "react-native-image-picker";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20,
    margin: RFValue(20, 816),

    // minHeight: ScreenHeight,
  },
});

function CreateOwnWorkout({ navigation, videoStatus, videoLink, screenName }) {
  const [userDetails, setUserDetails] = useState(null);
  const [athleteDetails, setAthleteDetails] = useState([]);
  const user = useSelector(selectUser);
  const userData = useSelector(selectUserData);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [athletes, setAthletes] = useState([]);
  const [listOfAthletes, setListOfAthletes] = useState(null);
  const [videoId, setVideoId] = useState(["576142998", "575857316"]);
  const [videoData, setVideoData] = useState([
    {
      title: "",
      description: "",
    },
  ]);
  const [modal, setModal] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [isUploading, setisUploading] = useState(false);
  const [isError, setiserror] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [VideoSelected, SetVideoSelected] = useState(false);
  const [Name, SetName] = useState("");

  useEffect(() => {
    var temp = [];
    const data = [];
    console.log(userData);
    if (userData?.id) {
    }
  }, [user, userData?.id]);

  const fetchUsers = (search) => {
    var temp = [];
    const data = [];
    console.log(userData);
    if (userData?.id) {
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
        console.log(newData, 'newwwww')
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

  // useEffect(() => {
  //   const uploadImage = async () => {
  //     if (imageUrl) {
  //       const response = await fetch(imageUrl);
  //       const blob = await response.blob();
  //       const childPath = `images/${userData.data.email}/chat`;

  //       const task = firebase.storage().ref().child(childPath).put(blob);

  //       const taskProgress = (snapshot) => {
  //         console.log(`transferred: ${snapshot.bytesTransferred}`);
  //       };

  //       const taskCompleted = () => {
  //         task.snapshot.ref.getDownloadURL().then((snapshot) => {
  //           db.collection("chat")
  //             .where("from_id", "==", from_id)
  //             .where("to_id", "==", to_id)
  //             .get()
  //             .then(function (querySnapshot) {
  //               querySnapshot.forEach(function (doc) {
  //                 setDoc_id(doc.id);

  //                 if (type === "coach") {
  //                   if (doc.id) {
  //                     db.collection("chat")
  //                       .doc(doc.id)
  //                       .collection("messages")
  //                       .add({
  //                         timestamp:
  //                           firebase.firestore.FieldValue.serverTimestamp(),
  //                         from_id: to_id,
  //                         from_name: to_name,
  //                         format: "image",
  //                       })
  //                       .catch((e) => console.log(e));
  //                   }
  //                 } else if (type === "athlete") {
  //                   if (doc.id) {
  //                     db.collection("chat")
  //                       .doc(doc.id)
  //                       .collection("messages")
  //                       .add({
  //                         timestamp:
  //                           firebase.firestore.FieldValue.serverTimestamp(),
  //                         message: snapshot,
  //                         from_id: from_id,
  //                         from_name: from_name,
  //                         format: "image",
  //                       })
  //                       .catch((e) => console.log(e));
  //                   }
  //                 }
  //               });
  //               setImageUrl(null);
  //             })
  //             .catch(function (error) {
  //               console.log("Error getting documents: ", error);
  //             });

  //           setInputMessage("");
  //         });
  //       };

  //       const taskError = (snapshot) => {
  //         console.log(snapshot);
  //       };

  //       task.on("state_changed", taskProgress, taskError, taskCompleted);
  //     }
  //   };
  //   uploadImage();
  // }, [imageUrl]);
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
          message: "Jump Start With Sudee needs access to your camera ",
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

  const addExercise = () => {
    if (Name == "") {
      alert("Please enter name");
    } else {
      db.collection("coaches")
        .doc(userData?.id)
        .collection("ownWorkout")
        .add({
          // videoId: json.uri,
          // thumbnail: "",
          // timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          // title: vid.title ? vid.title : "",
          // description: vid.description ? vid.description : "",
          // UploadedById: userData?.id,

          name: Name,
          videoUrl: null,
          workoutName: Name,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          thumbnail_url: null,
        })
        .then(() => {
          alert("Added Successfully");
          SetName("");
          videoData.title == "";
        });
      // setThumbnailDisable(true);
      // setDisable(true);
    }
  };

  const thumbnailUpload = async () => {

    if (thumbnail == null) {
      sendvideo("empty");
    } else {
      console.log(thumbnail, 'here12')
      const response = await fetch(thumbnail.path);
      const blob = await response.blob();
      // firebase
      //   .storage()
      //   .ref(`/coachWorkoutThumbnails/${userData.data.email}/${Name}`)
      //   .put(blob);

      let url;
      const storageRef = firebase.storage().ref();
      const fileRef = await storageRef.child(
        `/coachWorkoutThumbnails/${userData.data.email}/${Name}`
      );
      await fileRef.put(blob)

      url = await fileRef.getDownloadURL();
      console.log(url);
      setThumbnailUrl(url);
      sendvideo(url);
    }
  };

  const sendvideo = (thumbnailUrl) => {
    // if (thumbnailUrl != null) {
    if (!videoData || videoData?.length == 0) {
      alert("Please Add Video");
    } else {
      let data = [...videoData];

      data.forEach((vid) => {
        if (vid.video && vid.title) {
          setisUploading(true);
          setModal(true);
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


          let url1 = "https://ritikp-server.herokuapp.com/api/upload/video";
          console.log(formData, 'form111');
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
                  setisUploading(false);

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
                      name: vid.title ? vid.title : "",
                      // videoId: json.uri,
                      videoUrl: "https://vimeo.com/" + json.uri,
                      workoutName: vid.title ? vid.title : "",
                      timestamp:
                        firebase.firestore.FieldValue.serverTimestamp(),
                      thumbnail_url: thumbnailUrl,
                    });
                  console.log("wt", json);
                  setModal(true);
                  videoStatus && videoStatus(true);
                  videoLink && videoLink("https://vimeo.com/" + json.uri);
                } else {
                  setiserror(true);
                  setisUploading(false);
                }
              })
              .catch((err) => {
                setiserror(true);

                console.log("c", err);
              });
          }, 2000);
        } else {
          alert("Please fill the required fields");
        }
      });
    }

    // }
  };
  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: "#F6F6F6" }}
      contentContainerStyle={{ padding: 0, backgroundColor: "#F6F6F6" }}
    >
      {!videoStatus && (
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
              style={{ paddingRight: RFValue(20, 816) }}
              onPress={() => navigation.goBack()}
            >
              <Icon
                name="chevron-left"
                type="font-awesome-5"
                color="black"
                size={RFValue(30, 816)}
              />
            </TouchableOpacity>
            <Icon
              name="bars"
              type="font-awesome-5"
              size={24}
              onPress={() => navigation.toggleDrawer()}
            />
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 28,
                marginLeft: RFValue(20, 816),
                color: "black",
              }}
            >
              Workouts
            </Text>
          </View>
          <Notification navigation={navigation} />
        </View>
      )}

      <View
        style={{
          marginTop: RFValue(15, 816),
          padding: RFValue(10, 816),
        }}
      >
        <View>
          <Text style={{ color: "black" }}>Workout Name</Text>
          <TextInput
            placeholder="Enter Workout Name"
            onChangeText={(val) => {
              let temp = [...videoData];
              temp[0].title = val;
              setVideoData(temp);
              SetName(val);
            }}
            style={{
              borderWidth: 0.5,
              marginTop: RFValue(15, 816),
              backgroundColor: "white",
              width: "100%",
              padding: RFValue(10, 816),
              paddingVertical: Platform.OS === "ios" ? 15 : 10,
            }}
          />
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          {/* <Checkbox
            status={VideoSelected ? "checked" : "unchecked"}
            onPress={() => {
              SetVideoSelected(!VideoSelected);
            }}
            color={"#C19F1E"}
          /> */}
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

          <Text style={{ marginStart: 10 }}>Add Video</Text>
        </View>
        {!VideoSelected && (
          <TouchableOpacity
            onPress={() => {
              addExercise();
            }}
            style={{
              height: RFValue(52, 816),
              width: ScreenWidth - RFValue(20, 816),
              marginTop: RFValue(15, 816),
              marginBottom: RFValue(25, 816),
              justifyContent: "center",
              alignItems: "center",
              borderRadius: RFValue(15, 816),
              backgroundColor: "#C19F1E",
            }}
          >
            <Text
              style={{
                color: "black",
                fontFamily: "SF-Pro-Display-regular",
                fontSize: RFValue(15, 816),
                textAlign: "center",
              }}
            >
              Add Workout
            </Text>
          </TouchableOpacity>
        )}

        {VideoSelected && (
          <View>
            <Text style={{ color: "black", marginTop: 20 }}>Upload Video</Text>
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

            {/* {!videoStatus && (
            <View style={{ marginTop: RFValue(15, 816) }}>
              <Text style={{ color: "black" }}>Video Description</Text>
              <TextInput
                onChangeText={(val) => {
                  let temp = [...videoData];
                  temp[0].description = val;
                  setVideoData(temp);
                }}
                placeholder="Enter Video Description"
                style={{
                  borderWidth: 0.5,
                  marginTop: RFValue(15, 816),
                  backgroundColor: "white",
                  width: "100%",
                  padding: RFValue(10, 816),
                  paddingVertical: Platform.OS === "ios" ? 15 : 10,
                }}
              />
            </View>
          )} */}
            <Text
              style={{
                marginTop: RFValue(20, 816),

                color: "black",
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

            {console.log(videoData[0])}

            <TouchableOpacity
              onPress={() => {
                thumbnailUpload();
                // sendvideo();
              }}
              style={{
                height: RFValue(52, 816),
                width: ScreenWidth - RFValue(20, 816),
                marginTop: RFValue(15, 816),
                marginBottom: RFValue(25, 816),
                justifyContent: "center",
                alignItems: "center",
                borderRadius: RFValue(15, 816),
                backgroundColor: "#C19F1E",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: "SF-Pro-Display-regular",
                  fontSize: RFValue(15, 816),
                  textAlign: "center",
                }}
              >
                Add Workout
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 
        <Formik
          initialValues={{ title: "", description: "" }}
          onSubmit={(values) => {
            console.log(values);
            if (values.title && values.description) {
            } else {
            }
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <View>
              <TextInput
                name="title"
                onChangeText={handleChange("title")}
                onBlur={handleBlur("title")}
                value={values.title}
              />
              <TextInput
                name="description"
                onChangeText={handleChange("description")}
                onBlur={handleBlur("description")}
                value={values.description}
              />
              <Button
                title="Upload Video"
                onPress={() => pickDocument("video")}
              />
              <Button onPress={handleSubmit} title="Submit" />
            </View>
          )}
        </Formik> */}
      </View>
      <Modal animationType="slide" transparent={true} visible={modal}>
        <View
          style={{
            backgroundColor: "grey",
            minHeight: ScreenHeight,
            minWidth: ScreenWidth,
          }}
        >
          <View
            style={{
              justifyContent: "center",
              flex: 1,
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                width: "70%",
                height: "20%",
                borderRadius: 10,

                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setisUploading(false);
                  setModal(!modal);
                  if (!screenName) {
                    navigation.navigate("VODHome");
                  }
                }}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                }}
              >
                <Icon
                  name="times"
                  type="font-awesome-5"
                  color="black"
                  size={RFValue(30, 816)}
                />
              </TouchableOpacity>
              {isUploading && (
                <Text style={{ fontSize: RFValue(20, 816) }}>Uploading</Text>
              )}

              {isError && (
                <Text style={{ fontSize: RFValue(20, 816) }}>
                  Error uploading Video
                </Text>
              )}

              {!isError && !isUploading && (
                <Text style={{ fontSize: RFValue(20, 816) }}>
                  Video succesfully uploaded
                </Text>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAwareScrollView>
  );
}

export default CreateOwnWorkout;