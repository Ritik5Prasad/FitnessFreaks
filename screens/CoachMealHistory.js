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
  SafeAreaView,
  Modal,
  TextInput,
  Platform,
} from "react-native";
import { db } from "../firebase";
import { LinearGradient } from "expo-linear-gradient";
import firebase from "firebase";
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
import { Icon } from "react-native-elements";
import { useSelector } from "react-redux";
import { selectUserData } from "../features/userSlice";
import Notification from "./components/Notification";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3",
    paddingTop: RFValue(20, 816),
    height: ScreenHeight,
    padding: 10,
  },
});

const CoachMealHistory = ({ route, navigation }) => {
  const [data, setData] = useState(null);
  const userData = useSelector(selectUserData);
  const [modal, setModal] = React.useState(false);
  const [filterAsc, setFilterAsc] = React.useState(false);
  const [nutritionSearch, setNutritionSearch] = React.useState("");
  const [searchedNutritions, setSearchedNutritions] = React.useState([]);

  function formatDate1(day) {
    var d = new Date(day),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month].join("/");
  }

  useEffect(() => {
    let temp = [];
    db.collection("Food")
      .where("assignedTo_id", "==", userData?.id)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.data().nutrition) {
            temp.push({ id: doc.id, data: doc.data() });
          }
        });
        setData(temp);
      });
  }, []);

  React.useEffect(() => {
    if (data) {
      setData(data.reverse());
      console.log(filterAsc);
    }
  }, [filterAsc]);

  React.useEffect(() => {
    if (data) {
      if (nutritionSearch == null || nutritionSearch == "") {
        setSearchedNutritions(data);
      } else {
        setSearchedNutritions(
          data.filter((id) => {
            return id.data?.nutrition?.nutritionName
              .toLowerCase()
              .includes(nutritionSearch.toLowerCase());
          })
        );
      }
    } else {
      setSearchedNutritions([]);
    }
  }, [nutritionSearch]);

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
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
                fontSize: RFValue(20, 816),
                fontFamily: "SF-Pro-Text-regular",
                width: "50%",
                marginLeft: RFValue(20, 816),
              }}
            >
              Meal History
            </Text>
          </View>
          <Notification navigation={navigation} />
        </View>

        <View
          style={{
            flexDirection: "row",
            backgroundColor: "white",
            borderRadius: 6,
            borderColor: "rgba(0,0,0,9)",
            alignItems: "center",
            marginVertical: RFValue(10, 816),
            justifyContent: "space-between",
          }}
        >
          <TextInput
            value={nutritionSearch}
            onChangeText={(text) => setNutritionSearch(text)}
            style={{
              width: "80%",
              paddingLeft: RFValue(10, 816),
              paddingVertical: Platform.OS === "ios" ? 15 : 0,
            }}
            placeholder={"Search Nutrition"}
          />
          <TouchableOpacity
            onPress={() => setModal(true)}
            style={{ marginRight: 10 }}
          >
            <Image source={require("../assets/filter.png")} />
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginTop: RFValue(20, 816),
          }}
        >
          {nutritionSearch && searchedNutritions.length > 0
            ? searchedNutritions?.map((food, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={{
                    width: "100%",
                    height: 80,
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#fff",
                    marginVertical: RFValue(10, 816),
                    padding: RFValue(10, 816),
                    borderRadius: RFValue(8, 816),
                  }}
                  onPress={() =>
                    navigation.navigate("CoachAddMeal", {
                      nutrition: food,
                      type: "non-editable",
                    })
                  }
                >
                  <Image
                    style={{
                      width: 60,
                      height: 60,
                      margin: RFValue(5, 816),
                      borderRadius: RFValue(8, 816),
                      backgroundColor: "#ddd",
                    }}
                    source={require("../assets/nutrition.jpeg")}
                  />
                  <View
                    style={{
                      flexDirection: "column",
                      marginHorizontal: RFValue(15, 816),
                    }}
                  >
                    <Text
                      style={{
                        fontSize: RFValue(15, 816),
                        fontWeight: "700",
                        marginBottom: 8,
                      }}
                    >
                      {food.data.nutrition.nutritionName}
                    </Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      {food.data.selectedDays.map((day, i) => (
                        <Text key={i} style={{ fontSize: RFValue(10, 816) }}>
                          {formatDate1(day)}
                          {i < food.data.selectedDays.length - 1 ? "," : null}
                        </Text>
                      ))}
                    </View>
                  </View>
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      right: 25,
                    }}
                    // onPress={() => {
                    //   navigation.navigate("AddMeal");
                    // }}
                  >
                    <Icon
                      name="chevron-right"
                      color="#555"
                      type="font-awesome-5"
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            : data?.map((food, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={{
                    width: "100%",
                    height: 80,
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#fff",
                    marginVertical: RFValue(10, 816),
                    padding: RFValue(10, 816),
                    borderRadius: RFValue(8, 816),
                  }}
                  onPress={() =>
                    navigation.navigate("CoachAddMeal", {
                      nutrition: food,
                      type: "non-editable",
                    })
                  }
                >
                  <Image
                    style={{
                      width: 60,
                      height: 60,
                      margin: RFValue(5, 816),
                      borderRadius: RFValue(8, 816),
                      backgroundColor: "#ddd",
                    }}
                    source={require("../assets/nutrition.jpeg")}
                  />
                  <View
                    style={{
                      flexDirection: "column",
                      marginHorizontal: RFValue(15, 816),
                    }}
                  >
                    <Text
                      style={{
                        fontSize: RFValue(15, 816),
                        fontWeight: "700",
                        marginBottom: 8,
                      }}
                    >
                      {food.data.nutrition.nutritionName}
                    </Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      {food.data.selectedDays.map((day, i) => (
                        <Text key={i} style={{ fontSize: RFValue(10, 816) }}>
                          {formatDate1(day)}
                          {i < food.data.selectedDays.length - 1 ? "," : null}
                        </Text>
                      ))}
                    </View>
                  </View>
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      right: 25,
                    }}
                    // onPress={() => {
                    //   navigation.navigate("AddMeal");
                    // }}
                  >
                    <Icon
                      name="chevron-right"
                      color="#555"
                      type="font-awesome-5"
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
        </View>
      </KeyboardAwareScrollView>
      <Modal
        visible={modal}
        transparent={true}
        animationType="fade"
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "blue",
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              height: 170,
              width: 220,
              alignSelf: "center",
              borderRadius: 10,
            }}
          >
            <View
              style={{
                height: "33%",
                padding: RFValue(20, 816),
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  borderRadius: 100,
                  marginRight: RFValue(10, 816),
                  height: 23,
                  width: 23,
                  borderWidth: 1,
                  bordercolor: "white",
                  justifyContent: "center",
                }}
                onPress={() => setFilterAsc(true)}
              >
                <View
                  style={{
                    backgroundColor: filterAsc ? "#C19F1E" : "white",
                    height: 13,
                    width: 13,
                    borderRadius: 100,
                    alignSelf: "center",
                  }}
                ></View>
              </TouchableOpacity>
              <Text style={{ fontSize: RFValue(20, 816), textAlign: "center" }}>
                Oldest to latest
              </Text>
            </View>
            <View
              style={{
                height: "33%",
                padding: RFValue(20, 816),
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  borderRadius: 100,
                  marginRight: RFValue(10, 816),
                  height: 23,
                  width: 23,
                  borderWidth: 1,
                  bordercolor: "white",
                  justifyContent: "center",
                }}
                onPress={() => setFilterAsc(false)}
              >
                <View
                  style={{
                    backgroundColor: filterAsc ? "white" : "#C19F1E",
                    height: 13,
                    width: 13,
                    borderRadius: 100,
                    alignSelf: "center",
                  }}
                ></View>
              </TouchableOpacity>
              <Text style={{ fontSize: RFValue(20, 816), textAlign: "center" }}>
                latest to Oldest
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setModal(false)}
              style={{
                marginTop: RFValue(15, 816),
                width: "90%",
                borderRadius: RFValue(10, 816),
                padding: 5,
                backgroundColor: "#C19F1E",
                alignSelf: "center",
                justifyContent: "flex-end",
              }}
            >
              <Text
                style={{ fontSize: 16, color: "black", textAlign: "center" }}
              >
                Apply
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CoachMealHistory;
