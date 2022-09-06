import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
  ScrollView,
  ImageBackground,
  FlatList,
  Modal,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { db } from "../firebase";
import firebase from "firebase";
import { PieChart } from "react-native-svg-charts";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;

import { useDispatch, useSelector } from "react-redux";
import {
  selectTemperoryId,
  selectUserData,
  selectUserType,
} from "../features/userSlice";

import { Icon } from "react-native-elements";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import moment from "moment";
import "moment/locale/en-in";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 0,
    padding: RFValue(10, 816),
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

const Photos = ({ route, navigation }) => {
  const userType = useSelector(selectUserType);
  const userData = useSelector(selectUserData);
  const temperoryId = useSelector(selectTemperoryId);
  const [athleteDetails, setAthleteDetails] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [photoData, setPhotoData] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [modal, setModal] = useState(false);

  const isFocused = useIsFocused();
  moment.locale("en-in");

  useEffect(() => {
    if (userType === "coach") {
      db.collection("athletes")
        .doc(temperoryId)
        .get()
        .then(function (snap) {
          setAthleteDetails({
            id: temperoryId,
            data: snap.data(),
          });
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    } else {
      setAthleteDetails(userData);
    }
  }, [userData, temperoryId, isFocused]);

  useEffect(() => {
    if (athleteDetails) {
      console.log(athleteDetails.data.email, "email");
      if (athleteDetails.data.metrics) {
        var data = athleteDetails.data.metrics;
        var temp = [];
        var res = [];
        var keys = Object.keys(athleteDetails.data.metrics);
        keys.forEach((id) => {
          if (route.params.type == "front") {
            if (data[id].frontImageUrl && data[id].frontImageUrl != "") {
              temp.push({ url: data[id].frontImageUrl, id });
            }
          } else {
            console.log("hi", id);
            if (data[id].backImageUrl) {
              temp.push({ url: data[id].backImageUrl, id });
            }
          }
        });
        setPhotoData([...temp]);
        console.log("hye", temp);
      }
    }
  }, [athleteDetails, isFocused]);

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
            <View>
              <Text
                style={{
                  fontSize: 30,
                  fontFamily: "SF-Pro-Text-regular",
                  fontWeight: "bold",
                  color: "#003049",
                  marginLeft: RFValue(20, 816),
                }}
              >
                Athlete Photos
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            padding: RFValue(10, 816),
            borderRadius: RFValue(10, 816),
            backgroundColor: "white",
            marginTop: 10,
          }}
        >
          <FlatList
            extraData={photoData}
            data={photoData}
            renderItem={({ item, index }) => (
              <View style={{ flex: 1, flexDirection: "column", margin: 1 }}>
                <TouchableOpacity
                  key={item.id}
                  style={{ flex: 1 }}
                  onPress={() => {
                    var temp = [...selectedPhotos];
                    if (temp.includes(index)) {
                      temp.splice(selectedPhotos.indexOf(index), 1);
                    } else {
                      if (selectedPhotos.length < 2) {
                        temp.push(index);
                      }
                    }
                    setSelectedPhotos(temp);
                  }}
                >
                  <ImageBackground
                    style={
                      index == photoData.length - 1
                        ? {
                            height: 300,
                            width: "100%",
                            flex: 1,
                            alignItems: "flex-end",
                            justifyContent: "flex-end",
                          }
                        : {
                            height: 170,
                            width: "100%",
                            alignItems: "flex-end",
                            justifyContent: "flex-end",
                          }
                    }
                    source={{
                      uri: item.url,
                    }}
                  >
                    <LinearGradient
                      colors={["#00000050", "#00000080"]}
                      locations={[0, 1.0]}
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 5,
                      }}
                    >
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 20,
                            fontWeight: "600",
                          }}
                        >
                           {item.id.split('-').reverse().join('-')}
                        </Text>
                        {selectedPhotos.includes(index) ? (
                          <Icon
                            color="white"
                            name="check"
                            type="font-awesome-5"
                            style={{ marginLeft: 5 }}
                          />
                        ) : null}
                      </View>
                    </LinearGradient>
                  </ImageBackground>
                </TouchableOpacity>
              </View>
            )}
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>

        {selectedPhotos.length == 2 ? (
          <TouchableOpacity
            onPress={() => setModal(true)}
            style={{
              backgroundColor: "#C19F1E",
              padding: RFValue(10, 816),
              borderRadius: RFValue(20, 816),
              paddingHorizontal: RFValue(20, 816),
              alignSelf: "flex-end",
              position: "absolute",
              top: "80%",
              right: 20,
            }}
          >
            <Text style={{ fontWeight: "bold", color: "white" }}>Compare</Text>
          </TouchableOpacity>
        ) : null}

        {modal ? (
          <Modal
            transparent={true}
            animationType={"fade"}
            visible={modal}
            onRequestClose={() => {
              setModal(false);
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.8)",
                justifyContent: "center",
                alignItems: "center",
                // backgroundColor:'red'
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignSelf: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={{ uri: photoData[selectedPhotos[0]].url }}
                  style={{ width: "50%", height: 300 }}
                />
                <Image
                  source={{ uri: photoData[selectedPhotos[1]].url }}
                  style={{ width: "50%", height: 300 }}
                />
              </View>
              <TouchableOpacity
                onPress={() => setModal(false)}
                style={{
                  marginTop:10,
                  backgroundColor: "#C19F1E",
                  padding: RFValue(10, 816),
                  borderRadius: RFValue(20, 816),
                  paddingHorizontal: RFValue(20, 816),
                  // alignSelf: "flex-end",
                  // position: "absolute",
                  // top: "80%",

                }}
              >
                <Text style={{ fontWeight: "bold", color: "white",textAlign:'center' }}>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        ) : null}
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Photos;
