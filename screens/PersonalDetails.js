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
} from "react-native";
let ScreenWidth = Dimensions.get("window").width;
let ScreenHeight = Dimensions.get("window").height;
import { Icon } from "react-native-elements";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
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
import Textarea from "react-native-textarea";
import Notification from "./components/Notification";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: RFValue(20, 816),
    marginBottom: 0,
    paddingTop: RFValue(20, 816),
    minHeight: ScreenHeight,
  },
});

function PersonalDetails({ route, navigation }) {
  const user = useSelector(selectUser);
  const userType = useSelector(selectUserType);
  const temperoryId = useSelector(selectTemperoryId);
  const [userData, setUserData] = useState(null);
  const [editable, setEditable] = useState(false);
  const [dob, setdob] = useState(userData?.data?.dob);
  const [gender, setGender] = useState(userData?.data?.gender);
  const [address, setAddress] = useState("");
  const dispatch = useDispatch();

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
          setdob(snap.data().dob);
          setGender(snap.data().gender);
          setAddress(snap.data().address);
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
          console.log("23");
          querySnapshot.forEach(function (doc) {
            setUserData({
              id: doc.id,
              data: doc.data(),
            });
            setdob(doc.data().dob);
            setGender(doc.data().gender);
            setAddress(doc.data().address);
          });
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    }
  }, [user]);

  const saveDetails = () => {
    db.collection("athletes")
      .doc(userData?.id)
      .update({
        dob,
        gender,
        address,
      })
      .then((res) => {})
      .catch((e) => console.log(e));
    setEditable(false);
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
                marginRight: RFValue(20, 816),
              }}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Icon name="chevron-left" type="font-awesome-5" />
            </TouchableOpacity>
            <View>
              <Text
                style={{
                  fontSize: RFValue(30, 816),
                  fontFamily: "SF-Pro-Text-regular",
                  fontWeight: "bold",
                  color: "black",
                  marginLeft: RFValue(20, 816),
                }}
              >
                Personal Details
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
          <Notification navigation={navigation} />
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
              Gender
            </Text>
            <TextInput
              style={
                editable
                  ? {
                      width: ScreenWidth - RFValue(60, 816),
                      borderRadius: RFValue(5, 816),
                      paddingVertical:
                        Platform.OS === "ios" ? 15 : RFValue(5, 816),
                      paddingHorizontal: RFValue(10, 816),
                      backgroundColor: "white",
                      borderWidth: 0.5,
                    }
                  : {
                      borderWidth: 0.5,
                      width: ScreenWidth - RFValue(60, 816),
                      borderRadius: RFValue(5, 816),
                      paddingVertical:
                        Platform.OS === "ios" ? 15 : RFValue(5, 816),
                      paddingHorizontal: RFValue(10, 816),
                      backgroundColor: "white",
                    }
              }
              editable={editable}
              placeholder="Enter Gender"
              defaultValue={userData?.data?.gender}
              value={gender}
              onChangeText={setGender}
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
              Date of birth
            </Text>
            <TextInput
              style={
                editable
                  ? {
                      width: ScreenWidth - RFValue(60, 816),
                      borderRadius: RFValue(5, 816),
                      paddingVertical:
                        Platform.OS === "ios" ? 15 : RFValue(5, 816),
                      paddingHorizontal: RFValue(10, 816),
                      backgroundColor: "white",
                      borderWidth: 0.5,
                    }
                  : {
                      borderWidth: 0.5,
                      width: ScreenWidth - RFValue(60, 816),
                      borderRadius: RFValue(5, 816),
                      paddingVertical: RFValue(5, 816),
                      paddingHorizontal: RFValue(10, 816),
                      backgroundColor: "white",
                    }
              }
              editable={editable}
              placeholder="Enter Date of birth"
              defaultValue={userData?.data?.dob}
              value={dob}
              onChangeText={setdob}
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
              Billing Address
            </Text>
            <Textarea
              onChangeText={(text) => setAddress(text)}
              defaultValue={address}
              maxLength={120}
              placeholder={"Enter Address"}
              editable={editable}
              containerStyle={
                editable
                  ? {
                      width: ScreenWidth - RFValue(60, 816),
                      borderRadius: RFValue(5, 816),
                      paddingVertical: RFValue(5, 816),
                      paddingHorizontal: RFValue(10, 816),
                      backgroundColor: "white",
                      borderWidth: 0.5,
                    }
                  : {
                      borderWidth: 0.5,
                      width: ScreenWidth - RFValue(60, 816),
                      borderRadius: RFValue(5, 816),
                      paddingVertical: RFValue(5, 816),
                      paddingHorizontal: RFValue(10, 816),
                      backgroundColor: "white",
                    }
              }
            />
          </View>

          {editable && (
            <View>
              <TouchableOpacity
                style={{
                  height: RFValue(52, 816),
                  width: ScreenWidth - RFValue(100, 816),
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
            </View>
          )}
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

export default PersonalDetails;
