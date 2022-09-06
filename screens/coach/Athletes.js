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
  SafeAreaView,
  Platform,
} from "react-native";
import { auth, db } from "../../firebase";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";
import {
  setDbID,
  selectDbId,
  selectUser,
  setUserDetails,
  selectShowData,
  logout,
  setUserData,
  selectUserData,
  setTemperoryID,
} from "../../features/userSlice";
import { useIsFocused } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import Notification from "../components/Notification";
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
import SearchableDropdown from "react-native-searchable-dropdown";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 0,
    padding: RFValue(20, 816),
    minHeight: ScreenHeight,
  },
  athlete_card: {
    width: ScreenWidth / 1.05,
    height: RFValue(180, 816),
    backgroundColor: "#2E2E2E",
    // borderWidth: 1,
    // borderColor: "white",
    borderRadius: RFValue(12, 816),
    marginVertical: RFValue(15, 816),
    padding: RFValue(15, 816),
  },
  athlete_cardHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: RFValue(10, 816),
    marginVertical: RFValue(10, 816),
  },
  athlete_image: {
    marginHorizontal: RFValue(10, 816),
    width: ScreenWidth * 0.35,
    height: ScreenWidth * 0.35,
    borderRadius: 100,
    backgroundColor: "white",
    marginRight: RFValue(20, 816),
    marginTop: 0,
  },
  athlete_name: {
    fontSize: RFValue(18, 816),
    color: "black",
    margin: RFValue(15, 816),
    marginBottom: RFValue(5, 816),
  },
  athlete__cardBody: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: RFValue(20, 816),
  },
  share: {
    position: "absolute",
    top: RFValue(20, 816),
    right: RFValue(70, 816),
  },
});

function Athletes({ navigation }) {
  const [userDetails, setUserDetails] = useState(null);
  const [athleteDetails, setAthleteDetails] = useState([]);
  const user = useSelector(selectUser);
  const userData = useSelector(selectUserData);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [athletes, setAthletes] = useState([]);
  const isFocused = useIsFocused();
  const [athleteSearch, setAthleteSearch] = React.useState("");
  const [searchedAthletes, setSearchedAthletes] = React.useState([]);
  const [athleteRes, setAtheleteRes] = React.useState([]);

  useFocusEffect(
    React.useCallback(() => {
      var temp = [];
      const data = [];
      if (userData?.id) {
        let coachIds = [userData.id];
        const subcoachIds = userData.data?.listOfCoaches || [];
        coachIds = coachIds.concat(subcoachIds);
        db.collection("athletes")
          .orderBy("name", "asc")
          .get()
          .then((snapshot) => {
            snapshot.docs.forEach((item) => {
              const coachId = item.data().listOfCoaches?.length
                ? item.data().listOfCoaches[0]
                : "";
              if (coachIds.includes(coachId)) {
                let currentID = item.id;
                let appObj = { ...item.data(), ["id"]: currentID };
                data.push(appObj);
                temp.push(
                  <View
                    key={appObj.name}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: RFValue(15, 816),
                      padding: RFValue(10, 816),
                      borderRadius: RFValue(20, 816),
                      justifyContent: "space-between",
                      backgroundColor: "white",
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          dispatch(setTemperoryID(appObj.id));
                          navigation.navigate("Profile");
                        }}
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Image
                          source={{
                            uri:
                              appObj?.imageUrl ||
                              "https://firebasestorage.googleapis.com/v0/b/jumpstartwithsudee-80502.appspot.com/o/userImage.jpeg?alt=media&token=a6756f49-9e4d-4cc8-89ea-0a97de7ad376",
                          }}
                          style={{
                            width: RFValue(50, 816),
                            height: RFValue(50, 816),
                            borderRadius: 100,
                            alignSelf: "center",
                          }}
                        />
                        <View style={{ marginLeft: RFValue(20, 816) }}>
                          <Text
                            style={{
                              fontSize: RFValue(20, 816),
                              color: "black",
                              fontWeight: "bold",
                            }}
                          >
                            {appObj?.name}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <TouchableOpacity
                        style={{
                          marginRight: RFValue(20, 816),
                          width: 35,
                          height: 35,
                          borderRadius: 35,
                          backgroundColor: "#C19F1E",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onPress={() =>
                          navigation.navigate("Chat", {
                            from_id: userData?.id,
                            to_id: item.id,
                            from_name: userData.data.name,
                            to_name: item.data().name,
                            type: "coach",
                          })
                        }
                      >
                        <Icon
                          name="message"
                          type="material"
                          size={24}
                          color="white"
                          style={{ width: RFValue(40, 816) }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }
            });
            setAthleteDetails(data);
            setAthletes(temp);
          });
      }
    }, [user, userData?.id, isFocused])
  );

  React.useEffect(() => {
    if (athleteSearch == null || athleteSearch == "") {
      setSearchedAthletes(athleteDetails);
    } else {
      setSearchedAthletes(
        athleteDetails.filter((id) => {
          return id?.name.toLowerCase().includes(athleteSearch.toLowerCase());
        })
      );
      var temp = athleteDetails.filter((id) => {
        return id?.name.toLowerCase().includes(athleteSearch.toLowerCase());
      });
      var temp2 = [];
      temp.forEach((item) => {
        temp2.push(
          <View
            key={item.name}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: RFValue(15, 816),
              padding: RFValue(10, 816),
              borderRadius: RFValue(20, 816),
              justifyContent: "space-between",
              backgroundColor: "white",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => {
                  dispatch(setTemperoryID(item.id));
                  navigation.navigate("Profile");
                }}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <Image
                  source={{
                    uri:
                      item?.imageUrl ||
                      "https://firebasestorage.googleapis.com/v0/b/jumpstartwithsudee-80502.appspot.com/o/userImage.jpeg?alt=media&token=a6756f49-9e4d-4cc8-89ea-0a97de7ad376",
                  }}
                  style={{
                    width: RFValue(50, 816),
                    height: RFValue(50, 816),
                    borderRadius: 100,
                    alignSelf: "center",
                  }}
                />
                <View style={{ marginLeft: RFValue(20, 816) }}>
                  <Text
                    style={{
                      fontSize: RFValue(20, 816),
                      color: "black",
                      fontWeight: "bold",
                    }}
                  >
                    {item?.name}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                style={{
                  marginRight: RFValue(20, 816),
                  width: 35,
                  height: 35,
                  borderRadius: 35,
                  backgroundColor: "#C19F1E",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() =>
                  navigation.navigate("Chat", {
                    from_id: userData?.id,
                    to_id: item.id,
                    from_name: userData.data.name,
                    to_name: item.data().name,
                    type: "coach",
                  })
                }
              >
                <Icon
                  name="message"
                  type="material"
                  size={24}
                  color="white"
                  style={{ width: RFValue(40, 816) }}
                />
              </TouchableOpacity>
            </View>
          </View>
        );
      });
      setAtheleteRes(temp2);
    }
  }, [athleteSearch]);

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <View style={styles.container}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                style={{
                  paddingRight: RFValue(20, 816),
                }}
                onPress={() => {
                  navigation.navigate("CoachHomeScreen");
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
                All Athletes
              </Text>
            </View>

            <Notification navigation={navigation} />
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("InvitesList")}
            style={{
              alignSelf: "flex-end",
              marginVertical: RFValue(10, 816),
              backgroundColor: "#C19F1E",
              padding: RFValue(10, 816),
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "white" }}>Pending Invites</Text>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              backgroundColor: "white",
              borderRadius: 6,
              borderColor: "rgba(0,0,0,9)",
              alignItems: "center",
              marginVertical: 10,
            }}
          >
            {/*
                  <SafeAreaView style={{ flex: 1 }}>
                    <SearchableDropdown
                      onItemSelect={(item) => {
                        setSelectedAthlete(item);
                      }}
                               placeholderTextColor={"black"}
                      containerStyle={{ padding: 5 }}
                      textInputStyle={{
                        backgroundColor: "#fff",
                        marginLeft: 0,
                      }}
                      textInputProps={{
                        underlineColorAndroid: "transparent",
                        style: {
                          borderRadius:RFValue(5, 816),
                          backgroundColor: "#fff",
                          color: "black",
                          bordercolor:"white",
                          paddingHorizontal:10
                        },
                      }}
                      itemStyle={{
                        padding:RFValue(10, 816),
                        marginTop: 2,
                        backgroundColor: "#C19F1E",
                        borderColor: "#fff",
                        borderWidth: 1,
                        borderRadius:10
                      }}
                      itemTextStyle={{
                        color: "#222",
                      }}
                      itemsContainerStyle={{
                        maxHeight: RFValue(120, 816),
                        margin: 0,
                        padding: 0,
                      }}
                      items={athleteDetails}
                      listProps={{
                        nestedScrollEnabled: true,
                      }}
                      defaultIndex={2}
                      placeholder={
                        selectedAthlete
                          ? selectedAthlete.name
                          : "Enter Athlete Name"
                      }
                      resetValue={false}
                      underlineColorAndroid="transparent"
                    />
                    </SafeAreaView>*/}

            <TextInput
              value={athleteSearch}
              onChangeText={(text) => setAthleteSearch(text)}
              style={{
                width: "100%",
                paddingLeft: RFValue(10, 816),
                paddingVertical: Platform.OS === "ios" ? 15 : 0,
              }}
              placeholder={"Search Athlete"}
            />
          </View>
          {!athleteSearch ? (
            athletes
          ) : athleteSearch && searchedAthletes.length > 0 ? (
            athleteRes
          ) : (
            <View style={{ alignItems: "center" }}>
              <Text>No Athletes found</Text>
            </View>
          )}
          {/*athleteSearch && searchedAthletes.length > 0 ? athleteRes : athletes*/}
        </View>
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
        onPress={() => navigation.navigate("InviteAthlete")}
      >
        <Icon name="plus" type="font-awesome-5" color="white" size={20} />
      </TouchableOpacity>
    </View>
  );
}

export default Athletes;
