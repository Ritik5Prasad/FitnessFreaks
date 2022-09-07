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
  Platform,
  TouchableHighlight,
} from "react-native";
import { db } from "../../utils/firebase";
import firebase from "firebase";
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
import { useDispatch, useSelector } from "react-redux";
import { selectUserData } from "../../features/userSlice";
import { Icon } from "react-native-elements";
import sendPushNotification from "../components/SendNotification";
import SearchableDropdown from "react-native-searchable-dropdown";
import { Picker } from "@react-native-picker/picker";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
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

const CreateNutrition = ({ route, navigation }) => {
  const userData = useSelector(selectUserData);
  const dispatch = useDispatch();

  const [nutrition, setNutrition] = useState(null);
  const [nutritionId, setNutritionId] = useState("");
  const [plan, setPlan] = useState([]);

  console.log({ nutritionId });

  const [athletes, setAthletes] = useState([]);
  const [selectedAthletes, setSelectedAthletes] = useState([]);
  const [currentStartWeek, setCurrentStartWeek] = useState(null);
  const [currentEndWeek, setCurrentEndWeek] = useState(null);
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

  useEffect(() => {
    if (route.params?.nutrition) {
      if (route.params?.type === "update") {
        setType(route.params?.type);
        setNutrition(route.params?.nutrition.data.nutrition);
        setNutritionId(route.params.nutrition.id);
        setPlan(route.params?.nutrition.data.nutrition.plan);
        setSelectedAthletes(route.params?.nutrition.data.selectedAthletes);
      } else if (route.params?.type === "create") {
        setType(route.params?.type);
        setNutrition(route.params?.nutrition.data.nutrition);
        setNutritionId(route.params.nutrition.id);
        setPlan(route.params?.nutrition.data.nutrition.plan);
      } else if (route.params?.type === "view") {
        setType(route.params?.type);
        setNutrition(route.params?.nutrition.data.nutrition);
        setNutritionId(route.params.nutrition.id);
        setPlan(route.params?.nutrition.data.nutrition.plan);
        setSelectedAthletes(route.params?.nutrition.data.selectedAthletes);
      } else {
        setNutrition(route.params?.nutrition);
        setPlan(route.params?.nutrition.plan);
      }
    }
  }, [route.params?.nutrition]);

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
            marginLeft: 20,
          }}
        >
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

          <Text
            style={{
              fontSize: RFValue(30, 816),
              fontFamily: "SF-Pro-Text-regular",
              fontWeight: "bold",
            }}
          >
            Create Nutrition
          </Text>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
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
                alignItems: "flex-start",
                marginBottom: RFValue(15, 816),
              }}
            >
              <Text style={{ marginVertical: RFValue(10, 816) }}>
                Nutrition Plan Name
              </Text>
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
              <View>
                <Text
                  style={{
                    fontSize: RFValue(12, 816),
                    fontWeight: "700",
                    marginBottom: 6,
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
                    width: ScreenWidth - RFValue(60, 816),
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
                      marginTop: RFValue(25, 816),
                      display: "flex",
                      alignItems: "flex-start",
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#C19F1E",
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
                            : "https://firebasestorage.googleapis.com/v0/b/fitnessapp0.appspot.com/o/userImage.jpeg?alt=media&token=02e8cfe5-c866-4a4f-93ab-8c5930a5cd3c"
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
                        marginVertical: RFValue(10, 816),
                        width: ScreenWidth - RFValue(50, 816),
                      }}
                    >
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: RFValue(20, 816),
                          width: ScreenWidth - RFValue(50, 816),
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            marginRight: RFValue(20, 816),
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
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
                            style={{ marginRight: RFValue(10, 816) }}
                            type="font-awesome-5"
                          />
                        </TouchableOpacity>
                        {daysList.map((day, idx) => (
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
                                    width: RFValue(35, 816),
                                    height: RFValue(25, 816),
                                    justifyContent: "center",
                                    alignItems: "center",
                                    position: "relative",
                                    borderRadius: RFValue(10, 816),
                                    marginRight: 6,
                                    marginBottom: RFValue(5, 816),
                                  }
                                : {
                                    backgroundColor: "#fff",
                                    width: RFValue(35, 816),
                                    height: RFValue(25, 816),
                                    justifyContent: "center",
                                    alignItems: "center",
                                    position: "relative",
                                    borderRadius: RFValue(10, 816),
                                    marginRight: 6,
                                    marginBottom: RFValue(5, 816),
                                  }
                            }
                          >
                            <View>
                              <Text
                                style={{
                                  fontSize: RFValue(10, 816),
                                  fontFamily: "SF-Pro-Display-regular",
                                  width: "80%",
                                  textAlign: "center",
                                  color: athlete?.selectedDays?.includes(
                                    specificDates[idx]
                                  )
                                    ? "black"
                                    : "black",
                                }}
                              >
                                {day}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}

                        <TouchableOpacity
                          style={{
                            marginLeft: RFValue(20, 816),
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
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
                            style={{
                              marginRight: RFValue(10, 816),
                            }}
                            type="font-awesome-5"
                          />
                        </TouchableOpacity>
                      </View>

                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          width: ScreenWidth - RFValue(50, 816),
                        }}
                      >
                        {specificDates?.map((tempDate, idx) => (
                          <View
                            style={{
                              width: RFValue(40, 816),
                              height: RFValue(25, 816),
                            }}
                            key={idx}
                          >
                            <Text
                              style={{
                                fontSize: RFValue(10, 816),
                                fontFamily: "SF-Pro-Display-regular",
                                width: "80%",
                                textAlign: "center",
                              }}
                            >
                              {formatSpecificDate1(tempDate)}
                            </Text>
                          </View>
                        ))}
                      </View>
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
            }}
          >
            <View>
              {plan?.map((item, idx) => {
                return (
                  <View key={idx}>
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginTop: 10,
                        }}
                      >
                        <Text style={{ margin: RFValue(10, 816) }}>
                          Select Meal
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            var temp = [...plan];
                            temp.splice(idx, 1);
                            console.log(temp);
                            setPlan(temp);
                          }}
                          style={{ marginRight: 10 }}
                        >
                          <Icon name="times" type="font-awesome-5" />
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          alignItems: "center",
                          backgroundColor: "#fff",
                          borderWidth: 0.5,
                          borderRadius: RFValue(5, 816),
                          paddingBottom: RFValue(20, 816),
                        }}
                      >
                        <Picker
                          selectedValue={item.meal}
                          style={{
                            height: RFValue(15, 816),
                            width: ScreenWidth - RFValue(60, 816),
                            padding: RFValue(15, 816),
                            borderWidth: 1,
                            bordercolor: "white",
                          }}
                          onValueChange={(itemValue) => {
                            let tempMeal = [...plan];
                            tempMeal[idx].meal = itemValue;
                            setPlan(tempMeal);
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
                      </View>
                    </View>

                    <View style={{ marginTop: RFValue(20, 816) }}>
                      <Text style={{ marginLeft: RFValue(10, 816) }}>
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
                            let tempMeal = [...plan];
                            tempMeal[idx].description = text;
                            setPlan(tempMeal);
                          }}
                          value={item.description}
                          editable={type !== "view"}
                        />
                      </View>
                    </View>
                    {plan.length > 1 && plan.length - 1 !== idx && (
                      <View
                        style={{
                          width: ScreenWidth - RFValue(60, 816),
                          borderTopWidth: 0.8,
                          marginVertical: RFValue(15, 816),
                          marginBottom: 5,
                        }}
                      ></View>
                    )}
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
              }}
              onPress={() => {
                setPlan([
                  ...plan,
                  {
                    meal: "",
                    description: "",
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
                        plan,
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
                      sendPushNotification(
                        athlete.token,
                        "new Nutrition Plan assigned"
                      );
                      db.collection("Food").add({
                        from_id: userData?.id,
                        assignedTo_id: athlete.id,
                        selectedDays: athlete.selectedDays,
                        nutrition: {
                          nutritionName: nutrition.nutritionName,
                          plan,
                        },
                        saved: false,
                        selectedAthletes,

                        timestamp:
                          firebase.firestore.FieldValue.serverTimestamp(),
                      });
                    });

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
                  color: "black",
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

export default CreateNutrition;
