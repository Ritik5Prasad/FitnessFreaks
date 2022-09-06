import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Keyboard,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  KeyboardAvoidingView,
  Dimensions,
  Modal,
} from "react-native";

import { Icon } from "react-native-elements";

import moment from "moment";

import * as firebase from "firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUser,
  selectUserDetails,
  setDbID,
  setUserDetails,
  selectUserType,
  selectUserData,
} from "../features/userSlice";
import { db } from "../firebase";
import { useFocusEffect } from "@react-navigation/native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import EmojiSelector from "react-native-emoji-selector";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import Notification from "./components/Notification";
import DocumentPicker from "react-native-document-picker";
import { ActivityIndicator } from "react-native-paper";

import { TouchableWithoutFeedback } from "react-native";
import ImagePicker1 from "react-native-image-crop-picker";
import sendPushNotification from "../utils/sendPushNotification";

let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FB",
    justifyContent: "flex-end",
    paddingTop: RFValue(20, 816),
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    display: "flex",
    justifyContent: "center",
    // alignItems: "center",
    width: ScreenWidth,
    minHeight: ScreenHeight / 1.8,
  },
});

function Chat({ route, navigation }) {
  const userType = useSelector(selectUserType);
  const userData = useSelector(selectUserData);
  const [inputMessage, setInputMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [from_id, setfrom_id] = useState(route.params?.from_id);
  const [from_name, setfrom_name] = useState(route.params?.from_name);
  const [to_id, setto_id] = useState(route.params?.to_id);
  const [to_name, setto_name] = useState(route.params?.to_name);
  const [type, settype] = useState(route.params?.type);
  const [coachDetails, setCoachDetails] = useState({});
  const [imageUrl, setImageUrl] = useState(null);
  const [full, setFull] = useState(false);
  const [doc_id, setDoc_id] = useState(null);
  const [modal, setModal] = useState(false);
  const scrollViewRef = useRef(null);
  const [athleteData, setAthleteData] = useState({});
  const [listOfCoaches, setListOfCoaches] = useState([]);
  const [warningMessage, setWarningMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  // const ScreenHeight = Dimensions.get("window").height;
  const [image, setImage] = useState("");

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        scrollViewRef.current.scrollToEnd({
          animated: true,
        });
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    if (route.params?.registerFlow) {
      setRegisterFlow(route.params?.registerFlow);
    }
  }, [route.params?.registerFlow]);

  useEffect(() => {
    if (route.params?.chatType) {
      setChatType(route.params?.chatType);
    }
  }, [route.params?.chatType]);

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
        width: 700,
        height: 1000,
        cropping: true,
        compressImageQuality: 0.5,
      }).then((image) => {
        setImageUrl(image.path);
      });
    } else {
      ImagePicker1.clean().catch((e) => {
        console.log(e);
      });
      ImagePicker1.openCamera({
        width: 700,
        height: 1000,
        cropping: true,
        compressImageQuality: 0.5,
      }).then((image) => {
        // setModalVisible(false);
        setImageUrl(image.path);
        // profPicUpload(image.path).then(async () => {
        //   await firestore()
        //     .collection("Users")
        //     .doc(docId)
        //     .update({
        //       profImgExtension: profileImage
        //         ? profileImage.uri.substr(image.path.lastIndexOf(".") + 1)
        //         : profImgExtension,
        //     })
        //     .then(() => {
        //       console.log("Photo updated!");
        //       setLoading(false);
        //     })
        //     .catch((error) => {
        //       setLoading(false);
        //       console.log(error);
        //     });
        // });
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
        aspect: [4, 3],
        quality: 0.5,
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

  // const cameraRollPermission = await Permissions.askAsync(
  //   Permissions.CAMERA_ROLL
  // );

  // if (cameraRollPermission.status === "granted") {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     allowsEditing: true,
  //     aspect: [3, 3],
  //     quality: 1,
  //   });

  //   if (!result.cancelled) {
  //     setImageUrl(result.uri);
  //   }
  // }

  // const Progress=({per})=>{
  //   return (
  //     <View
  //     style={{
  //       height:200,
  //       width:100
  //     }}
  //     >
  //       <Text>
  //         {per}
  //         </Text>
  //       </View>
  //   )
  // }

  useEffect(() => {
    const uploadImage = async () => {
      if (imageUrl) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        var milliseconds = new Date().getTime();

        const childPath = `images/${userData.data.email}/chat/${milliseconds}`;

        const task = firebase.storage().ref().child(childPath).put(blob);

        const taskProgress = (snapshot) => {
          // <Progress p={snapshot.bytesTransferred}/>
          console.log(`transferred: ${snapshot.bytesTransferred}`);
        };

        const taskCompleted = () => {
          task.snapshot.ref.getDownloadURL().then((snapshot) => {
            db.collection("chat")
              .where("from_id", "==", from_id)
              .where("to_id", "==", to_id)
              .get()
              .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                  setDoc_id(doc.id);

                  if (type === "coach") {
                    if (doc.id) {
                      db.collection("chat")
                        .doc(doc.id)
                        .collection("messages")
                        .add({
                          timestamp:
                            firebase.firestore.FieldValue.serverTimestamp(),
                          from_id: to_id,
                          from_name: to_name,
                          message: snapshot,

                          format: "image",
                        })
                        .catch((e) => {
                          console.log(e);
                        });
                    }
                    var userIdList = [];
                    userIdList.push(to_id);
                  } else if (type === "athlete") {
                    if (doc.id) {
                      db.collection("chat")
                        .doc(doc.id)
                        .collection("messages")
                        .add({
                          timestamp:
                            firebase.firestore.FieldValue.serverTimestamp(),
                          message: snapshot,
                          from_id: from_id,
                          from_name: from_name,
                          format: "image",
                        })
                        .catch((e) => {
                          console.log(e);
                        });
                    }
                    var userIdList = [];
                    userIdList.push(from_id);
                  }
                  sendPushNotification(userIdList, {
                    title: `New Message`,
                    body: `${from_name} : Photo`,
                  });
                });
                setImageUrl(null);
              })
              .catch(function (error) {
                console.log("Error getting documents: ", error);
              });

            setInputMessage("");
          });
        };

        const taskError = (snapshot) => {
          console.log(snapshot);
        };

        task.on("state_changed", taskProgress, taskError, taskCompleted);
      }
    };
    uploadImage();
  }, [imageUrl]);

  React.useEffect(() => {
    if (userType == "athlete") {
      setfrom_id(route.params?.to_id);
      setfrom_name(route.params?.from_name);
      setto_id(route.params?.from_id);
      settype("athlete");
      db.collection("coaches")
        .doc(route.params?.to_id)
        .get()
        .then((snap) => {
          setCoachDetails(snap.data());
          setto_name(snap.data().name);
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    }

    if (from_id && to_id) {
      console.log("2");
      db.collection("chat")
        .where("from_id", "==", from_id)
        .where("to_id", "==", to_id)
        .onSnapshot((snap) => {
          console.log("3");
          if (!snap.empty) {
            snap.forEach(function (doc) {
              setDoc_id(doc.id);
            });
          } else {
            console.log("4");
            db.collection("chat").add({
              from_id: from_id,
              to_id: to_id,
            });
            // const newRef = db.collection("chat").doc();
            // setDoc_id(newRef);
            // const res =  newRef.set({
            //   from_id: from_id,
            //   to_id: to_id,
            // });
            setAllMessages([]);
          }
        });

      // db.collection("athletes")
      //   .doc(from_id)
      //   .get()
      //   .then(function (doc) {
      //     if (doc.exists) {
      //       console.log("6");
      //       setListOfCoaches(doc.data().listOfCoaches);
      //     } else {
      //       console.log("No such document! gagan");
      //     }
      //   })
      //   .catch(function (error) {
      //     console.log("Error getting document:", error);
      //   });

      db.collection("athletes")
        .doc(to_id)
        .get()
        .then(function (doc) {
          if (doc.exists) {
            setAthleteData(doc.data());
          } else {
            console.log("No such document! gagan");
          }
        })
        .catch(function (error) {
          console.log("Error getting document:", error);
        });
    } else {
      setAllMessages([]);
    }
  }, [from_id, to_id]);

  useEffect(() => {
    if (doc_id) {
      setIsLoading(true);
      const unsubscribe = db
        .collection("chat")
        .doc(doc_id)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((querySnapshot) => {
          // Get all documents from collection - with IDs
          console.log("Loading the chat...");
          const data = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setIsLoading(false);

          setAllMessages(data);
        });

      return unsubscribe;
    } else {
      setAllMessages([]);
    }
  }, [db, doc_id]);

  const sendMessage = async () => {
    if (inputMessage !== "") {
      db.collection("chat")
        .where("from_id", "==", from_id)
        .where("to_id", "==", to_id)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            setDoc_id(doc.id);

            if (type === "coach") {
              if (doc.id) {
                db.collection("chat")
                  .doc(doc.id)
                  .collection("messages")
                  .add({
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    message: inputMessage,
                    from_id: to_id,
                    from_name: to_name,
                  })
                  .catch((e) => console.log(e));
              }
              var userIdList = [];
              userIdList.push(to_id);
            } else if (type === "athlete") {
              if (doc.id) {
                db.collection("chat")
                  .doc(doc.id)
                  .collection("messages")
                  .add({
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    message: inputMessage,
                    from_id: from_id,
                    from_name: from_name,
                  })
                  .catch((e) => console.log(e));
                var userIdList = [];
                userIdList.push(from_id);
              }
            }
            sendPushNotification(userIdList, {
              title: `New Message`,
              body: `${from_name} : ${inputMessage}`,
            });
          });
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });

      setInputMessage("");
    }
  };
  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#C19F1E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        showsVerticalScrollIndicator={false}
        keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 30}
      >
        <View
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottomWidth: 1,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: RFValue(5, 816),

                  borderColor: "#707070",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}
                  style={{ paddingHorizontal: RFValue(10, 816) }}
                >
                  <Icon name="chevron-left" type="font-awesome-5" />
                </TouchableOpacity>
                <Icon
                  name="bars"
                  type="font-awesome-5"
                  size={24}
                  onPress={() => navigation.toggleDrawer()}
                />
                <Image
                  source={{
                    uri:
                      type == "coach"
                        ? athleteData?.imageUrl != ""
                          ? athleteData.imageUrl
                          : null
                        : coachDetails?.imageUrl != ""
                        ? coachDetails.imageUrl
                        : null,
                  }}
                  style={{
                    width: RFValue(50, 816),
                    height: RFValue(50, 816),
                    borderRadius: 100,
                    margin: RFValue(10, 816),
                    marginLeft: RFValue(20, 816),
                  }}
                />
                <Text
                  style={{
                    color: "black",
                    fontSize: RFValue(20, 816),
                    fontWeight: "bold",
                  }}
                >
                  {to_name}
                </Text>
              </View>
              <Notification navigation={navigation} />
            </View>
            <View>
              <ScrollView
                ref={scrollViewRef}
                keyboardShouldPersistTaps="always"
                onContentSizeChange={(contentWidth, contentHeight) => {
                  var height = contentHeight;
                  console.log("h", contentHeight);
                  scrollViewRef.current.scrollToEnd({
                    animated: true,
                  });
                }}
                style={{
                  marginBottom: RFValue(140, 816),

                  paddingHorizontal: RFValue(2, 816),
                }}
                showsVerticalScrollIndicator={false}
              >
                <View style={{ flex: 1 }}>
                  {allMessages?.map((msg) => (
                    <View key={msg.id}>
                      {type === "coach" ? (
                        <View style={{ margin: RFValue(15, 816) }}>
                          {msg.format && msg.format == "image" ? (
                            <TouchableOpacity
                              onPress={() => {
                                setImage(msg.message);
                                setModal(true);
                              }}
                            >
                              <Image
                                source={{ uri: msg.message }}
                                style={
                                  msg.from_id === to_id
                                    ? {
                                        backgroundColor: "black",
                                        paddingHorizontal: RFValue(15, 816),
                                        paddingVertical: RFValue(10, 816),
                                        borderRadius: RFValue(15, 816),
                                        alignSelf: "flex-end",
                                        color: "white",
                                        borderBottomLeftRadius: 0,
                                        marginRight: RFValue(5, 816),
                                        height: 200,
                                        width: 200,
                                      }
                                    : {
                                        borderRadius: RFValue(15, 816),
                                        paddingHorizontal: RFValue(10, 816),
                                        paddingVertical: RFValue(5, 816),
                                        alignSelf: "flex-start",
                                        color: "#63697B",
                                        borderBottomRightRadius: 0,
                                        marginLeft: RFValue(5, 816),
                                        height: 200,
                                        width: 200,
                                      }
                                }
                              />
                            </TouchableOpacity>
                          ) : (
                            <Text
                              style={
                                msg.from_id === to_id
                                  ? {
                                      backgroundColor: "#C19F1E",

                                      paddingHorizontal: RFValue(15, 816),
                                      paddingVertical: RFValue(10, 816),
                                      borderRadius: RFValue(15, 816),
                                      alignSelf: "flex-end",
                                      color: "white",
                                      fontSize: RFValue(18, 816),
                                      borderBottomRightRadius: 0,
                                      marginRight: RFValue(5, 816),
                                    }
                                  : {
                                      backgroundColor: "#EAECF2",
                                      borderRadius: RFValue(15, 816),
                                      paddingHorizontal: RFValue(10, 816),
                                      paddingVertical: RFValue(5, 816),
                                      alignSelf: "flex-start",
                                      fontSize: RFValue(18, 816),
                                      color: "#63697B",
                                      borderBottomLeftRadius: 0,
                                      marginLeft: RFValue(5, 816),
                                    }
                              }
                            >
                              {msg.message}
                            </Text>
                          )}
                          {/* <Text
                      style={
                        msg.from_id === to_id
                          ? {
                              alignSelf: "flex-end",
                            }
                          : {
                              alignSelf: "flex-start",
                            }
                      }
                    >
                      {msg.timestamp}
                    </Text> */}
                        </View>
                      ) : (
                        <View style={{ margin: RFValue(15, 816) }}>
                          {msg.format && msg.format == "image" ? (
                            <TouchableOpacity
                              onPress={() => {
                                setImage(msg.message);
                                setModal(true);
                              }}
                            >
                              <Image
                                source={{ uri: msg.message }}
                                style={
                                  msg.from_id === to_id
                                    ? {
                                        backgroundColor: "black",

                                        paddingHorizontal: RFValue(15, 816),
                                        paddingVertical: RFValue(10, 816),
                                        borderRadius: RFValue(15, 816),
                                        alignSelf: "flex-start",
                                        color: "white",
                                        borderBottomLeftRadius: 0,
                                        marginRight: RFValue(5, 816),
                                        height: 200,
                                        width: 200,
                                      }
                                    : {
                                        borderRadius: RFValue(15, 816),
                                        paddingHorizontal: RFValue(10, 816),
                                        paddingVertical: RFValue(5, 816),
                                        alignSelf: "flex-end",
                                        color: "#63697B",
                                        borderBottomRightRadius: 0,
                                        marginLeft: RFValue(5, 816),
                                        height: 200,
                                        width: 200,
                                      }
                                }
                              />
                            </TouchableOpacity>
                          ) : (
                            <Text
                              style={
                                msg.from_id === from_id
                                  ? {
                                      backgroundColor: "#C19F1E",

                                      paddingHorizontal: RFValue(15, 816),
                                      paddingVertical: RFValue(10, 816),
                                      borderRadius: RFValue(15, 816),
                                      alignSelf: "flex-end",
                                      color: "white",
                                      fontSize: RFValue(18, 816),
                                      borderBottomRightRadius: 0,
                                      marginRight: RFValue(5, 816),
                                    }
                                  : {
                                      backgroundColor: "#EAECF2",
                                      borderRadius: RFValue(15, 816),
                                      paddingHorizontal: RFValue(10, 816),
                                      paddingVertical: RFValue(5, 816),
                                      alignSelf: "flex-start",
                                      fontSize: RFValue(18, 816),
                                      color: "#63697B",
                                      borderBottomLeftRadius: 0,
                                      marginLeft: RFValue(5, 816),
                                    }
                              }
                            >
                              {msg.message}
                            </Text>
                          )}
                          {/* <Text
                      style={
                        msg.from_id === from_id
                          ? {
                              alignSelf: "flex-end",
                            }
                          : {
                              alignSelf: "flex-start",
                            }
                      }
                    >
                      {msg.timestamp}
                    </Text> */}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                backgroundColor: "white",
                justifyContent: "space-between",
                paddingHorizontal: RFValue(10, 816),
                position: "absolute",
                bottom: 0,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "80%",
                }}
              >
                <TouchableOpacity
                  style={{
                    marginVertical: RFValue(15, 816),
                    marginRight: 10,
                  }}
                  // onPress={getImageFromCamera}
                  onPress={() => {
                    console.log("camera------->");
                    requestCameraPermission("camera");
                  }}
                >
                  <AntDesign name="camera" size={RFValue(28, 816)} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => requestCameraPermission("gallery")}
                >
                  <FontAwesome name="photo" size={RFValue(24, 816)} />
                </TouchableOpacity>

                <TextInput
                  style={{
                    color: "black",
                    width: "80%",
                    marginLeft: RFValue(10, 816),
                    paddingVertical: Platform.OS === "ios" ? 15 : 0,
                  }}
                  placeholder="Type something..."
                  ////placeholdertextColor="black"
                  value={inputMessage}
                  onChangeText={(val) => {
                    console.log(inputMessage);
                    console.log(32, val);
                    setInputMessage(val);
                  }}
                />
              </View>

              <TouchableWithoutFeedback
                onPress={(e) => {
                  sendMessage(e);
                }}
              >
                <Image
                  source={require("../assets/Send.png")}
                  style={{
                    width: RFValue(27, 816),
                    height: RFValue(25, 816),
                  }}
                />
              </TouchableWithoutFeedback>
            </View>
          </View>
          {warningMessage ? (
            <Text style={{ color: "yellow" }}>{warningMessage}</Text>
          ) : null}
          {/* <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            backgroundColor: "white",
            justifyContent: "space-between",
            paddingHorizontal: RFValue(10, 816),
          }}
        >
          <View
            style={{ flexDirection: "row", alignItems: "center", width: "80%" }}
          >
            <TouchableOpacity
              style={{ marginVertical: RFValue(15, 816), marginRight: 10 }}
              onPress={getImageFromCamera}
            >
              <AntDesign name="camera" size={RFValue(28, 816)} />
            </TouchableOpacity>

            <TouchableOpacity onPress={getImageFromGallery}>
              <FontAwesome name="photo" size={RFValue(24, 816)} />
            </TouchableOpacity>

            <TextInput
              style={{
                color: "black",
                width: "80%",
                marginLeft: RFValue(10, 816),
                paddingVertical: Platform.OS === "ios" ? 15 : 0,
              }}
              placeholder="Type something..."
              ////placeholdertextColor="black"
              value={inputMessage}
              onChangeText={setInputMessage}
            />
          </View>

          <TouchableWithoutFeedback
            onPress={(e) => {
              Keyboard.dismiss();
              sendMessage(e);
            }}
          >
            <Image
              source={require("../assets/Send.png")}
              style={{ width: RFValue(27, 816), height: RFValue(25, 816) }}
            />
          </TouchableWithoutFeedback>
        </View> */}
        </View>
        <Modal animationType="slide" transparent={true} visible={modal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Image
                style={{ height: ScreenHeight, width: ScreenWidth }}
                source={{ uri: image }}
              />
              <TouchableOpacity
                style={{
                  height: RFValue(40, 816),
                  width: ScreenWidth / 1.8,
                  marginBottom: RFValue(8, 816),
                  borderRadius: RFValue(8, 816),
                  position: "absolute",
                  bottom: RFValue(20, 816),
                  shadowColor: "rgba(0,0,0, .4)", // IOS
                  shadowOffset: { height: 1, width: 1 }, // IOS
                  shadowOpacity: 1, // IOS
                  shadowRadius: 1, //IOS
                  backgroundColor: "#C19F1E",
                  elevation: 2, // Android
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  marginLeft: ScreenWidth / 4.5,
                }}
                onPress={() => setModal(false)}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: RFValue(14, 816),
                    textAlign: "center",
                  }}
                >
                  Back
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </View>
  );
}

export default Chat;
