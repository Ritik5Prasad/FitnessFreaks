import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableHighlight,
  Platform,
  Switch,
} from "react-native";
import { db } from "../../utils/firebase";
import firebase from "firebase";
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
import { useDispatch, useSelector } from "react-redux";
import { selectUserData } from "../../features/userSlice";
import { setFoodList, getFoodList } from "../../features/foodSlice";
import { Icon } from "react-native-elements";
import SearchableDropdown from "react-native-searchable-dropdown";
import { Picker } from "@react-native-picker/picker";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import RNPickerSelect from "react-native-picker-select";
import Notification from "../components/Notification";
import AddFoodCard from "../components/AddFoodCard";
import moment from "moment";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import sendPushNotification from "../../utils/sendPushNotification";
import Nutrition from "../Nutrition";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 0,
    paddingTop: RFValue(20, 816),
    height: ScreenHeight,
  },
});

const UselessTextInput = (props) => {
  return (
    <TextInput
      style={{
        textAlignVertical: "top",
        padding: RFValue(10, 816),
        width: ScreenWidth / 1.2,
        borderRadius: RFValue(5, 816),
        paddingVertical: Platform.OS === "ios" ? 15 : 10,
      }}
      {...props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
      editable={props.editable}
      maxLength={500}
      multiline={true}
    />
  );
};

const AssignNutrition = ({ route, navigation }) => {
  const userData = useSelector(selectUserData);
  const serverData = useSelector(getFoodList);
  const dispatch = useDispatch();

  const [nutrition, setNutrition] = useState(null);
  const [nutritionId, setNutritionId] = useState("");
  const [athletes, setAthletes] = useState([]);
  const [selectedAthletes, setSelectedAthletes] = useState([]);
  const [currentStartWeek, setCurrentStartWeek] = useState(null);
  const [currentEndWeek, setCurrentEndWeek] = useState(null);

  const [addFood, setAddFood] = useState(false);
  const [daysList, setDaysList] = useState([
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ]);
  const [specificDates, setSpecificDates] = useState([]);
  const [type, setType] = useState("");
  const [entireFood, setEntireFood] = useState([
    {
      meal: "",
      description: "",
      food: [
        {
          foodName: "",
          proteins: 0,
          carbs: 0,
          fat: 0,
          calories: 0,
          quantity: 1,
        },
      ],
      addFood: false,
    },
  ]);

  useEffect(() => {
    if (route.params?.nutrition) {
      if (route.params?.type === "update") {
        setType(route.params?.type);
        setNutrition(route.params?.nutrition.data.nutrition);
        setNutritionId(route.params.nutrition.id);
        if (route.params?.nutrition?.data?.nutrition?.entireFood) {
          setEntireFood(route.params?.nutrition.data.nutrition?.entireFood);
          setAddFood(
            route.params?.nutrition.data.nutrition?.entireFood[0]?.addFood
          );
        }
        setSelectedAthletes(route.params?.nutrition.data.selectedAthletes);
      } else if (route.params?.type === "create") {
        setType(route.params?.type);
        setNutrition(route.params?.nutrition.data.nutrition);
        setNutritionId(route.params.nutrition.id);
        if (route.params?.nutrition?.data?.nutrition?.entireFood) {
          setEntireFood(route.params?.nutrition.data.nutrition?.entireFood);
          setAddFood(
            route.params?.nutrition.data.nutrition?.entireFood[0]?.addFood
          );
        }
      } else if (route.params?.type === "view") {
        setType(route.params?.type);
        setNutrition(route.params?.nutrition.data.nutrition);
        setNutritionId(route.params.nutrition.id);
        if (route.params?.nutrition?.data?.nutrition?.entireFood) {
          setEntireFood(route.params?.nutrition.data.nutrition?.entireFood);
          setAddFood(
            route.params?.nutrition.data.nutrition?.entireFood[0]?.addFood
          );
        }
        setSelectedAthletes(route.params?.nutrition.data.selectedAthletes);
      } else {
        setNutrition(route.params?.nutrition);
        if (route.params?.nutrition?.entireFood) {
          setEntireFood(route.params?.nutrition?.entireFood);
          setAddFood(route.params?.nutrition?.entireFood[0]?.addFood);
        }
      }
    }
  }, [route.params?.nutrition]);

  useEffect(() => {
    console.log(entireFood);
  }, [entireFood]);
  useEffect(() => {
    if (type === "non-editable") {
      var curr = new Date(); // get current date
      var first = curr.getDate() - curr.getDay(); // First day is the  day of the month - the day of the week \

      var firstday = new Date(curr.setDate(first)).toUTCString();
      var lastday = new Date(curr.setDate(curr.getDate() + 6)).toUTCString();

      setCurrentStartWeek(formatSpecificDate(firstday));
      setCurrentEndWeek(formatSpecificDate(lastday));
    } else {
      var curr = new Date(); // get current date
      var first = curr.getDate() - curr.getDay(); // First day is the  day of the month - the day of the week \

      var firstday = new Date(curr.setDate(first)).toUTCString();
      var lastday = new Date(curr.setDate(curr.getDate() + 6)).toUTCString();

      setCurrentStartWeek(formatSpecificDate(firstday));
      setCurrentEndWeek(formatSpecificDate(lastday));
    }
  }, []);

  // useEffect(() => {
  //   fetch("https://rongoeirnet.herokuapp.com/getFood")
  //     .then((response) => response.json())
  //     .then((responseJson) => {
  //       //Successful response from the API Call
  //       // setServerData(responseJson.data);
  //       const tmpList = responseJson.data.map((item) => {
  //         return {
  //           calories: item.calories,
  //           carbs: item.carbs,
  //           fats: item.fats,
  //           name: item.name,
  //           protein: item.protein,
  //           servings: item.servings,
  //           servings2: item.servings2,
  //           units: item.units,
  //           units2: item.units2,
  //           __v: item.__v,
  //           _id: item._id,
  //         };
  //       });

  //       dispatch(setFoodList(tmpList));
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }, []);

  useEffect(() => {
    console.log(selectedAthletes);
  }, [selectedAthletes]);

  function incr_date(date_str) {
    var parts = date_str.split("-");
    var dt = new Date(
      parseInt(parts[0], 10), // year
      parseInt(parts[1], 10) - 1, // month (starts with 0)
      parseInt(parts[2], 10) // date
    );
    dt.setDate(dt.getDate() + 1);
    parts[0] = "" + dt.getFullYear();
    parts[1] = "" + (dt.getMonth() + 1);
    if (parts[1].length < 2) {
      parts[1] = "0" + parts[1];
    }
    parts[2] = "" + dt.getDate();
    if (parts[2].length < 2) {
      parts[2] = "0" + parts[2];
    }
    return parts.join("-");
  }

  useEffect(() => {
    if (currentStartWeek) {
      let temp = currentStartWeek;
      let datesCollection = [];

      for (var i = 0; i < 7; i++) {
        datesCollection.push(temp);
        temp = incr_date(temp);
      }

      setSpecificDates(datesCollection);
    }
  }, [currentStartWeek]);

  console.log({ type });

  function formatSpecificDate(d) {
    var d = new Date(d),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  function formatSpecificDate1(d) {
    var d = new Date(d),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month].join("/");
  }

  function formatSpecificDay(d) {
    var d = new Date(d),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return day;
  }

  useState(() => {
    if (userData?.id) {
      const data = [];
      db.collection("athletes")
        .orderBy("name", "asc")
        .get()
        .then((snapshot) => {
          snapshot.docs.forEach((athlete) => {
            if (userData?.data.listOfAthletes.includes(athlete.id)) {
              let currentID = athlete.id;
              let appObj = { ...athlete.data(), ["id"]: currentID };
              data.push(appObj);
            }
          });
          setAthletes(data);
        });
    }
  }, [userData?.id]);

  function formatDate() {
    var d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: RFValue(20, 816),
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

            <Text
              style={{
                fontSize: RFValue(30, 816),
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                marginLeft: RFValue(20, 816),
              }}
            >
              {type == "view" ? "View Nutrition" : "Create Nutrition"}
            </Text>
          </View>
          <Notification navigation={navigation} />
        </View>

        <View
          style={{
            marginVertical: RFValue(10, 816),
            marginTop: ScreenHeight * 0.1,
          }}
        >
          <Image
            style={{
              width: ScreenWidth,
              height: RFValue(180, 816),
              marginBottom: RFValue(20, 816),
            }}
            source={{
              uri: "https://firebasestorage.googleapis.com/v0/b/triden-workout-app.appspot.com/o/app_images%2Fnutrition.jpeg?alt=media&token=57c137c0-3f00-4f5d-bd18-daf8f2a919c8",
            }}
          />

          <View>
            <View
              style={{
                marginBottom: RFValue(15, 816),
                padding: RFValue(10, 816),
                paddingBottom: RFValue(20, 816),
                margin: RFValue(10, 816),
                borderRadius: RFValue(8, 816),
                backgroundColor: "white",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ margin: RFValue(10, 816), color: "black" }}>
                  Nutrition Plan Name
                </Text>
                {type == "view" ? null : (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginVertical: 10,
                    }}
                  >
                    <Text>Add Food</Text>
                    <Switch
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      thumbColor={addFood ? "#C19F1E" : "#f4f3f4"}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={() => {
                        let tempMeal = [...entireFood];
                        tempMeal[0].addFood = !addFood;
                        setEntireFood(tempMeal);
                        setAddFood(!addFood);
                      }}
                      value={addFood}
                      style={{ marginLeft: 10 }}
                    />
                  </View>
                )}
              </View>
              <TextInput
                style={{
                  borderWidth: 1,
                  width: ScreenWidth - RFValue(60, 816),
                  borderColor: "grey",
                  borderRadius: RFValue(5, 816),
                  paddingVertical: Platform.OS === "ios" ? 15 : 5,
                  paddingHorizontal: RFValue(10, 816),
                }}
                defaultValue={nutrition?.nutritionName}
                editable={false}
              />
            </View>

            {type !== "update" && type !== "view" && (
              <View
                style={{
                  alignSelf: "center",
                  padding: RFValue(10, 816),
                  backgroundColor: "white",
                  borderRadius: RFValue(8, 816),
                  margin: RFValue(10, 816),
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: RFValue(12, 816),
                    fontWeight: "700",
                    marginBottom: 6,
                    color: "black",
                  }}
                >
                  Search for Athletes
                </Text>

                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    backgroundColor: "#fff",
                    width: "100%",
                    paddingRight: RFValue(10, 816),
                    borderRadius: 6,
                    position: "relative",
                    borderColor: "#bbb",
                    borderWidth: 1,
                  }}
                >
                  <SafeAreaView style={{ flex: 1 }}>
                    <SearchableDropdown
                      multi={true}
                      placeholderTextColor={"black"}
                      selectedItems={selectedAthletes}
                      onItemSelect={(item) => {
                        const items = [...selectedAthletes];
                        item.selectedDays = [];
                        items.push(item);
                        setSelectedAthletes(items);
                      }}
                      onRemoveItem={(item, index) => {
                        const items = selectedAthletes.filter(
                          (sitem) => sitem.id !== item.id
                        );
                        setSelectedAthletes(items);
                      }}
                      // setSort={(item, searchedText) =>
                      //   item.name
                      //     .toLowerCase()
                      //     .startsWith(searchedText.toLowerCase())
                      // }
                      containerStyle={{ padding: 5 }}
                      textInputStyle={{
                        flex: 1,
                        paddingHorizontal: RFValue(20, 816),
                        paddingVertical: Platform.OS === "ios" ? 10 : 5,
                      }}
                      itemStyle={{
                        padding: RFValue(10, 816),
                        marginTop: 2,
                        backgroundColor: "#FAF9F8",
                        paddingVertical: Platform.OS === "ios" ? 15 : 10,
                      }}
                      itemTextStyle={{
                        color: "black",
                      }}
                      itemsContainerStyle={{
                        maxHeight: RFValue(120, 816),
                        margin: 0,
                        padding: 0,
                      }}
                      items={athletes}
                      textInputProps={{
                        underlineColorAndroid: "transparent",
                        style: {
                          padding: RFValue(12, 816),
                          borderRadius: RFValue(5, 816),
                          backgroundColor: "#fff",
                          height: RFValue(45, 816),
                        },
                      }}
                      listProps={{
                        nestedScrollEnabled: true,
                      }}
                      defaultIndex={2}
                      resetValue={false}
                      underlineColorAndroid="transparent"
                    />
                  </SafeAreaView>

                  <Icon
                    name="search"
                    type="font-awesome-5"
                    color="black"
                    size={15}
                    style={{ marginTop: RFValue(15, 816) }}
                  />
                </View>
              </View>
            )}
            {type !== "update" &&
              selectedAthletes.map((athlete, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      padding: RFValue(10, 816),
                      justifyContent: "center",
                      backgroundColor: "#d3d3d3",
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#C19F1E",
                        alignSelf: "center",
                        borderRadius: 100,
                        height: RFValue(45, 816),
                        width: ScreenWidth - RFValue(60, 816),
                      }}
                    >
                      <Image
                        style={{
                          width: RFValue(35, 816),
                          height: RFValue(35, 816),
                          borderRadius: 100,
                          marginHorizontal: RFValue(20, 816),
                        }}
                        source={
                          athlete.imageUrl
                            ? { uri: athlete.imageUrl }
                            : "https://firebasestorage.googleapis.com/v0/b/jumpstartwithsudee-80502.appspot.com/o/userImage.jpeg?alt=media&token=a6756f49-9e4d-4cc8-89ea-0a97de7ad376"
                        }
                      />
                      <Text
                        style={{
                          fontSize: RFValue(12, 816),
                          fontWeight: "700",
                          color: "black",
                        }}
                      >
                        {athlete.name}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: RFValue(12, 816),
                        fontWeight: "700",
                        marginTop: RFValue(15, 816),
                        marginLeft: 20,
                      }}
                    >
                      Select days
                    </Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        alignSelf: "center",
                        width: "100%",
                      }}
                    >
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: RFValue(20, 816),
                          width: "100%",
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            paddingRight: RFValue(10, 816),
                            paddingVertical: 15,
                          }}
                          onPress={() => {
                            var curr = new Date(currentStartWeek); // get current date
                            var first = curr.getDate() - curr.getDay() - 7; // First day is the  day of the month - the day of the week \

                            var firstday = new Date(
                              curr.setDate(first)
                            ).toUTCString();
                            var lastday = new Date(
                              curr.setDate(curr.getDate() + 6)
                            ).toUTCString();
                            if (new Date(currentStartWeek) > new Date()) {
                              setCurrentStartWeek(formatSpecificDate(firstday));
                              setCurrentEndWeek(formatSpecificDate(lastday));
                            }
                          }}
                        >
                          <Icon
                            name="chevron-left"
                            size={15}
                            type="font-awesome-5"
                          />
                        </TouchableOpacity>
                        {specificDates.map((day, idx) => (
                          <TouchableOpacity
                            key={idx}
                            onPress={() => {
                              if (type !== "view") {
                                if (
                                  athlete?.selectedDays?.includes(
                                    specificDates[idx]
                                  )
                                ) {
                                  let selected =
                                    selectedAthletes[index].selectedDays;
                                  var index1 = selected.indexOf(
                                    specificDates[idx]
                                  );
                                  if (index1 !== -1) {
                                    selected.splice(index1, 1);
                                    selectedAthletes[index] = {
                                      ...selectedAthletes[index],
                                      selected,
                                    };
                                    setSelectedAthletes([...selectedAthletes]);
                                  }
                                } else {
                                  if (
                                    new Date(specificDates[idx]) > new Date() ||
                                    specificDates[idx] === formatDate()
                                  ) {
                                    let selectedDays =
                                      selectedAthletes[index].selectedDays;
                                    selectedAthletes[index] = {
                                      ...selectedAthletes[index],
                                      selectedDays: [
                                        ...selectedDays,
                                        specificDates[idx],
                                      ],
                                    };
                                    setSelectedAthletes([...selectedAthletes]);
                                  }
                                }
                              }
                            }}
                            style={
                              athlete?.selectedDays?.includes(
                                specificDates[idx]
                              )
                                ? {
                                    backgroundColor: "#C19F1E",
                                    color: "#fff",
                                    width: RFValue(45, 816),
                                    height: RFValue(50, 816),
                                    justifyContent: "center",
                                    alignItems: "center",
                                    position: "relative",
                                    borderRadius: RFValue(10, 816),
                                    marginRight: 6,
                                    marginBottom: RFValue(5, 816),
                                  }
                                : {
                                    backgroundColor:
                                      new Date(specificDates[idx]) >
                                        new Date() ||
                                      specificDates[idx] === formatDate()
                                        ? "#fff"
                                        : "grey",
                                    width: RFValue(45, 816),
                                    height: RFValue(50, 816),
                                    justifyContent: "center",
                                    alignItems: "center",
                                    position: "relative",
                                    borderRadius: RFValue(10, 816),
                                    marginRight: 6,
                                    marginBottom: RFValue(5, 816),
                                  }
                            }
                          >
                            <View
                              style={{
                                alignItems: "center",
                                justifyContent: "center",
                                flex: 1,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: RFValue(13, 816),
                                  fontFamily: "SF-Pro-Display-regular",
                                  width: "80%",
                                  textAlign: "center",
                                  flex: 1,
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: athlete?.selectedDays?.includes(
                                    specificDates[idx]
                                  )
                                    ? "black"
                                    : "black",
                                }}
                              >
                                {moment(day).format("dddd").slice(0, 3)}
                              </Text>
                              <Text
                                style={{
                                  fontSize: RFValue(13, 816),
                                  fontFamily: "SF-Pro-Display-regular",
                                  width: "80%",
                                  textAlign: "center",
                                  flex: 1,
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: athlete?.selectedDays?.includes(
                                    specificDates[idx]
                                  )
                                    ? "black"
                                    : "black",
                                }}
                              >
                                {formatSpecificDate1(day)}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}

                        <TouchableOpacity
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            paddingLeft: RFValue(10, 816),
                            paddingVertical: 15,
                          }}
                          onPress={() => {
                            var curr = new Date(currentStartWeek); // get current date
                            var first = curr.getDate() - curr.getDay() + 7; // First day is the  day of the month - the day of the week \

                            var firstday = new Date(
                              curr.setDate(first)
                            ).toUTCString();
                            var lastday = new Date(
                              curr.setDate(curr.getDate() + 6)
                            ).toUTCString();

                            setCurrentStartWeek(formatSpecificDate(firstday));
                            setCurrentEndWeek(formatSpecificDate(lastday));
                          }}
                        >
                          <Icon
                            name="chevron-right"
                            size={15}
                            type="font-awesome-5"
                          />
                        </TouchableOpacity>
                      </View>

                      {/*
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      {specificDates?.map((tempDate, idx) => (
                        <View
                          style={{
                            width: RFValue(53,816),
                            height: RFValue(30,816),
                          }}
                          key={idx}
                        >
                          <Text
                            style={{
                              fontSize: RFValue(12,816),
                              fontFamily: "SF-Pro-Display-regular",
                              width: "80%",
                              textAlign: "center",
                            }}
                          >
                            {formatSpecificDate1(tempDate)}
                          </Text>
                        </View>
                      ))}
                          </View>*/}
                    </View>
                  </View>
                );
              })}
          </View>

          {type !== "update" ||
            ("view" && (
              <View
                style={{
                  width: "100%",
                  borderBottomWidth: 0.8,
                  bordercolor: "white",
                  marginVertical: RFValue(30, 816),
                }}
              ></View>
            ))}

          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "white",
              margin: RFValue(10, 816),
              borderRadius: RFValue(8, 816),
              marginTop: RFValue(20, 816),
            }}
          >
            <View>
              {entireFood?.map((item, idx) => {
                return (
                  <View key={idx}>
                    <View style={{ marginBottom: 20 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginTop: 10,
                        }}
                      >
                        <Text
                          style={{ margin: RFValue(10, 816), color: "black" }}
                        >
                          Select Meal
                        </Text>
                        {type == "view" ? null : (
                          <TouchableOpacity
                            onPress={() => {
                              var temp = [...entireFood];
                              temp.splice(idx, 1);
                              console.log(temp);
                              setEntireFood(temp);
                            }}
                            style={{ marginRight: 10 }}
                          >
                            <Icon name="times" type="font-awesome-5" />
                          </TouchableOpacity>
                        )}
                      </View>
                      <View
                        style={{
                          alignItems: "center",
                          backgroundColor: "#fff",
                          borderWidth: 0.5,
                          borderRadius: RFValue(5, 816),
                          padding: Platform.OS === "ios" ? RFValue(20, 816) : 0,
                          paddingBottom: RFValue(20, 816),
                        }}
                      >
                        {Platform.OS === "ios" ? (
                          <RNPickerSelect
                            value={item?.meal}
                            style={{ paddingVertical: 5 }}
                            onValueChange={(itemValue) => {
                              let tempMeal = [...entireFood];
                              tempMeal[idx].meal = itemValue;
                              setEntireFood(tempMeal);
                            }}
                            items={[
                              { label: "Select the type of meal", value: "" },
                              { label: "Breakfast", value: "Breakfast" },
                              { label: "Lunch", value: "Lunch" },
                              { label: "Snack", value: "Snack" },
                              { label: "Pre Workout", value: "Pre Workout" },
                              { label: "Post Workout", value: "Post Workout" },
                              { label: "Dinner", value: "Dinner" },
                            ]}
                            disabled={type === "view"}
                          />
                        ) : (
                          <Picker
                            selectedValue={item?.meal}
                            style={{
                              height: RFValue(15, 816),
                              width: ScreenWidth - RFValue(60, 816),
                              padding: RFValue(15, 816),
                              borderWidth: 1,
                              bordercolor: "white",
                            }}
                            onValueChange={(itemValue) => {
                              let tempMeal = [...entireFood];
                              tempMeal[idx].meal = itemValue;
                              setEntireFood(tempMeal);
                            }}
                            enabled={type !== "view"}
                          >
                            <Picker.Item
                              label={"Select the type of meal"}
                              value={""}
                            />
                            <Picker.Item
                              label={"Breakfast"}
                              value={"Breakfast"}
                            />
                            <Picker.Item label={"Lunch"} value={"Lunch"} />
                            <Picker.Item label={"Snack"} value={"Snack"} />
                            <Picker.Item
                              label={"Pre Workout"}
                              value={"Pre Workout"}
                            />
                            <Picker.Item
                              label={"Post Workout"}
                              value={"Post Workout"}
                            />
                            <Picker.Item label={"Dinner"} value={"Dinner"} />
                          </Picker>
                        )}
                      </View>
                    </View>
                    {addFood ? null : (
                      <View style={{ marginTop: RFValue(20, 816) }}>
                        <Text
                          style={{
                            marginLeft: RFValue(10, 816),
                            color: "black",
                          }}
                        >
                          Description
                        </Text>
                        <View
                          style={{
                            borderColor: "#999",
                            borderWidth: 0.8,
                            marginVertical: RFValue(10, 816),
                            borderRadius: RFValue(7, 816),
                          }}
                        >
                          <UselessTextInput
                            key={idx}
                            multiline
                            numberOfLines={4}
                            placeholder="Enter Meal Description"
                            onChangeText={(text) => {
                              let tempMeal = [...entireFood];
                              tempMeal[idx].description = text;
                              setEntireFood(tempMeal);
                            }}
                            value={item?.description}
                            editable={type !== "view"}
                          />
                        </View>
                      </View>
                    )}

                    {entireFood?.length > 1 && entireFood?.length - 1 !== idx && (
                      <View
                        style={{
                          width: ScreenWidth - RFValue(60, 816),
                          borderTopWidth: 0.8,
                          marginVertical: RFValue(15, 816),
                          marginBottom: 5,
                        }}
                      ></View>
                    )}

                    {addFood &&
                      item?.food?.map((ent, idx2) => {
                        return (
                          <View style={{ width: ScreenWidth - 40 }}>
                            <AddFoodCard
                              type={
                                type == "view" ? "non-editable" : "Editable"
                              }
                              item={ent}
                              idx={idx2}
                              key={idx2}
                              ent={item}
                              entireFood={entireFood}
                              index={idx}
                              serverData={serverData}
                              setEntireFood={setEntireFood}
                            />
                          </View>
                        );
                      })}

                    {addFood && type != "view" ? (
                      <View>
                        <TouchableOpacity
                          style={{
                            height: RFValue(52, 816),
                            width: "100%",
                            marginTop: RFValue(45, 816),
                            marginBottom: RFValue(15, 816),
                            justifyContent: "center",
                            alignItems: "center",
                            display: "flex",
                            backgroundColor: "#C19F1E",
                            borderRadius: RFValue(8, 816),
                          }}
                          onPress={() => {
                            let foodData = [...entireFood];
                            let temp = [...item?.food];
                            temp.push({
                              foodName: "",
                              proteins: 0,
                              carbs: 0,
                              fat: 0,
                              calories: 0,
                              quantity: 1,
                            });
                            foodData[idx].food = temp;
                            setEntireFood(foodData);
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
                            Add Food
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </View>
          </View>

          {(type === "update" || type === "create") && (
            <TouchableOpacity
              style={{
                height: RFValue(52, 816),
                width: ScreenWidth - RFValue(40, 816),
                marginTop: RFValue(45, 816),
                marginBottom: RFValue(15, 816),
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                backgroundColor: "#C19F1E",
                borderRadius: RFValue(10, 816),
                alignSelf: "center",
              }}
              onPress={() => {
                setEntireFood([
                  ...entireFood,
                  {
                    meal: "",
                    description: "",
                    food: [
                      {
                        foodName: "",
                        proteins: 0,
                        carbs: 0,
                        fat: 0,
                        calories: 0,
                        quantity: 1,
                      },
                    ],
                    addFood: false,
                  },
                ]);
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: "SF-Pro-Display-regular",
                  fontSize: RFValue(16, 816),
                  textAlign: "center",
                }}
              >
                Add Meal
              </Text>
            </TouchableOpacity>
          )}

          {route.params.coach && (
            <Text
              style={{
                fontSize: RFValue(14, 816),
                color: "black",
                paddingHorizontal: RFValue(10, 816),
              }}
            >
              Assigned By {route.params.coach.name}
            </Text>
          )}

          <TouchableOpacity
            style={{
              height: RFValue(52, 816),
              width: ScreenWidth - RFValue(25, 816),
              marginTop: RFValue(15, 816),
              marginBottom: RFValue(25, 816),
              justifyContent: "center",
              alignItems: "center",
              borderRadius: RFValue(15, 816),
              backgroundColor: "#C19F1E",
              alignSelf: "center",
            }}
            onPress={() => {
              if (type === "view") {
                navigation.goBack();
              } else {
                if (type === "update") {
                  db.collection("Food")
                    .doc(nutritionId)
                    .update({
                      nutrition: {
                        nutritionName: nutrition.nutritionName,
                        entireFood,
                      },
                      timestamp:
                        firebase.firestore.FieldValue.serverTimestamp(),
                      saved: false,
                    });
                  if (type === "update") {
                    navigation.goBack();
                  } else {
                    navigation.navigate("PostAddScreen");
                  }
                } else {
                  let tempDate1 = [];
                  selectedAthletes.map((athlete) => {
                    athlete.selectedDays.map((d) => {
                      tempDate1.push(d);
                    });
                  });

                  if (selectedAthletes && tempDate1.length > 0) {
                    selectedAthletes.map((athlete, idx) => {
                      db.collection("CoachFood")
                        .add({
                          from_id: userData?.id,
                          assignedTo_id: athlete.id,
                          selectedDays: athlete.selectedDays,
                          nutrition: {
                            nutritionName: nutrition.nutritionName,
                            entireFood,
                          },
                          saved: false,
                          selectedAthletes,

                          timestamp:
                            firebase.firestore.FieldValue.serverTimestamp(),
                          date: firebase.firestore.FieldValue.serverTimestamp(),
                        })
                        .then((docRef) => {
                          db.collection("Food").add({
                            from_id: userData?.id,
                            assignedTo_id: athlete.id,
                            selectedDays: athlete.selectedDays,
                            nutrition: {
                              nutritionName: nutrition.nutritionName,
                              entireFood,
                            },
                            saved: false,
                            selectedAthletes,
                            timestamp:
                              firebase.firestore.FieldValue.serverTimestamp(),
                            date: firebase.firestore.FieldValue.serverTimestamp(),
                            coachFoodId: docRef.id,
                          });
                        });
                    });

                    selectedAthletes.forEach((id) => {
                      db.collection("AthleteNotifications")
                        .doc(id.id)
                        .collection("notifications")
                        .add({
                          message: "New Nutrition plan assigned",
                          seen: false,
                          timestamp:
                            firebase.firestore.FieldValue.serverTimestamp(),
                          coach_id: userData?.id,
                        });
                    });

                    sendPushNotification(
                      selectedAthletes.map((sa) => sa.id),
                      {
                        title: "new Nutrition Plan assigned",
                      }
                    );
                    // const ids = [selectedAthletes.map((athlete) => athlete.id)];
                    // const notification = "Nutrition has been added";
                    // const data1 = Nutrition;
                    // triggerNotification(ids, notification, data1);

                    navigation.navigate("PostAddScreen", {
                      screen: "nutrition",
                    });
                  } else {
                    alert("Please select an athlete and assign a date");
                  }
                }
              }
            }}
          >
            <View>
              <Text
                style={{
                  color: "white",
                  fontFamily: "SF-Pro-Display-regular",
                  fontSize: RFValue(15, 816),
                  textAlign: "center",
                }}
              >
                {type === "view"
                  ? "Return"
                  : type === "update"
                  ? "Update Plan"
                  : "Add Plan"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default AssignNutrition;
