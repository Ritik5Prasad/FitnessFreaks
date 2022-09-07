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
  Modal,
} from "react-native";
let ScreenWidth = Dimensions.get("window").width;
let ScreenHeight = Dimensions.get("window").height;
import { useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { selectUserData } from "../../features/userSlice";
import { db } from "../../utils/firebase";
import { Icon } from "react-native-elements";
import WorkoutCard from "../components/WorkoutCard";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Notification from "../components/Notification";
import WebView from "react-native-webview";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

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
const OwnWorkouts = ({ route, navigation }) => {
  const userData = useSelector(selectUserData);
  const [workouts, setWorkouts] = useState([]);
  const [name, setName] = React.useState("");
  const [Id, setId] = useState("");
  const [modal, setModal] = useState(false);
  useEffect(() => {
    db.collection("coaches")
      .doc(userData?.id)
      .collection("ownWorkout")
      .onSnapshot((snapshot) =>
        setWorkouts(
          snapshot.docs.map((doc) => ({ id: doc.id, workout: doc.data() }))
        )
      );
  }, []);
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
              Own Workouts
            </Text>
          </View>

          <Notification navigation={navigation} />
        </View>
        <View
          style={{
            margin: 20,
          }}
        >
          {workouts.map(({ id, workout }) => (
            <View
              style={{
                width: 300,
                height: 100,
                borderRadius: 10,
                borderWidth: 0.5,
                borderColor: "black",
                marginBottom: 20,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setId(workout.videoUrl);
                  setModal(true);
                }}
              >
                <Image
                  source={{
                    uri: workout.thumbnail_url,
                  }}
                  style={{
                    width: RFValue(60, 816),
                    height: RFValue(60, 816),
                    marginLeft: 20,
                  }}
                />
              </TouchableOpacity>

              <View
                style={{
                  display: "flex",
                }}
              >
                <Text
                  style={{
                    marginLeft: 30,
                    fontWeight: "bold",
                    width: RFValue(80, 816),
                  }}
                >
                  {workout.name}
                </Text>
                <TouchableOpacity>
                  <Text
                    style={{
                      marginLeft: 30,
                      fontWeight: "bold",
                      width: RFValue(80, 816),
                      fontSize: 10,
                    }}
                  >
                    {workout.videoUrl}
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  marginLeft: 40,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("EditOwnWorkout", {
                      workout: workout,
                      workoutId: id,
                    });
                  }}
                  style={{
                    width: RFValue(80, 816),
                    height: RFValue(30, 816),
                    backgroundColor: "#C19F1E",
                    textAlign: "center",
                    color: "white",
                    borderRadius: 5,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      marginTop: 4,
                    }}
                  >
                    Edit
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: RFValue(80, 816),
                    height: RFValue(30, 816),
                    backgroundColor: "red",
                    textAlign: "center",

                    borderRadius: 5,
                    marginTop: 20,
                  }}
                  onPress={() => {
                    db.collection("coaches")
                      .doc(userData?.id)
                      .collection("ownWorkout")
                      .doc(id)
                      .delete()
                      .then(() => {
                        alert("Deleted Successfully");
                      });
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      marginTop: 4,
                      color: "white",
                    }}
                  >
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
        <Modal animationType="slide" transparent={true} visible={modal}>
          <View style={styles.centeredView1}>
            <View style={styles.modalView1}>
              <WebView
                style={{ height: 700, width: ScreenWidth }}
                source={
                  Id
                    ? {
                        uri:
                          "https://player.vimeo.com/video/" +
                          Id.substring(Id.lastIndexOf("/") + 1),
                      }
                    : null
                }
              />

              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: RFValue(150, 816),
                }}
              >
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
                    backgroundColor: "#fff",
                    elevation: 2, // Android
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                  onPress={() => setModal(false)}
                >
                  <Text
                    style={{
                      color: "#006D77",
                      fontSize: RFValue(14, 816),
                      textAlign: "center",
                    }}
                  >
                    RETURN
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAwareScrollView>
      <TouchableOpacity
        style={{
          position: "absolute",
          right: RFValue(30, 816),
          bottom: RFValue(30, 816),
          zIndex: 1,
          backgroundColor: "#C19F1E",
          borderRadius: 100,
          padding: RFValue(10, 816),
          width: RFValue(60, 816),
          height: RFValue(60, 816),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => navigation.navigate("CreateOwnWorkout")}
      >
        <Icon name="plus" type="font-awesome-5" color="white" size={20} />
      </TouchableOpacity>
    </View>
  );
};

export default OwnWorkouts;
