import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
  SafeAreaView,
  TextInput,
  Switch,
  Platform,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { db } from "../firebase";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
import { useDispatch, useSelector } from "react-redux";
import { selectUserData, selectUserType } from "../features/userSlice";
import { setFoodList, getFoodList } from "../features/foodSlice";

import { Icon } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";
import RNPickerSelect from "react-native-picker-select";
import AddFoodCard from "./components/AddFoodCard";
import DatePicker from "react-native-datepicker";
import moment from "moment";
import triggerNotification from "../utils/sendPushNotification";
import { saveNotification } from "../utils/SaveNotificationMessage";

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
        width: "100%",
        paddingVertical:
          Platform.OS === "ios" ? RFValue(15, 816) : RFValue(10, 816),
      }}
      {...props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
      editable={props.editable}
      maxLength={500}
      multiline={true}
    />
  );
};

const AddMeal = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  // const serverData = useSelector(getFoodList);

  const [serverData, setServerData] = useState([]);
  const [athleteView, setAthleteView] = useState(true);
  const [foodName, setFoodName] = useState("");
  const [selectedDate, setSelectedDate] = useState(formatDate());
  const [data1, setdata1] = useState();
  const [data2, setdata2] = useState();
  const [coachEntireFood, setCoachEntireFood] = useState([
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
    },
  ]);

  useEffect(() => {
    if (route.params?.nutrition) {
      console.log(route.params?.nutrition.data.nutrition.plan);
      setCoachEntireFood(route.params?.nutrition.data.nutrition.plan);
      setFoodName(route.params?.nutrition.data.nutrition.nutritionName);
    }
  }, [route.params?.nutrition]);

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
    },
  ]);
  const [foodId, setFoodId] = useState(null);
  const [type, setType] = useState("");

  useEffect(() => {
    if (route.params?.type) {
      setType(route.params?.type);
    }
  }, [route.params?.type]);

  useEffect(() => {
    if (route.params?.entireFood && route.params.entireFood.length > 0) {
      setEntireFood(route.params.entireFood);
    }
  }, [route.params?.entireFood]);

  useEffect(() => {
    if (route.params?.todaysFoodId) {
      setFoodId(route.params.todaysFoodId);
      setSelectedDate(route.params.todaysFoodId);
      console.log("Food id is", route.params?.todaysFoodId);
    }
  }, [route.params?.todaysFoodId]);

  useEffect(async () => {
    if (userData) {
      await db
        .collection("AthleteNutrition")
        .doc(userType === "athlete" ? userData?.id : route.params.athlete.id)
        .collection("nutrition")
        .doc(selectedDate)
        .get()
        .then((doc) => {
          console.log(9, selectedDate);
          if (doc.data()?.entireFood) {
            setEntireFood(doc.data()?.entireFood);

            console.log(doc.data()?.entireFood);
            a;
          } else {
            console.log("niData");
            setEntireFood([
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
              },
            ]);
          }
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }
  }, [selectedDate]);

  useEffect(async () => {
    await db
      .collection("coaches")
      .doc(
        userType === "athlete"
          ? route.params?.nutrition?.data?.from_id
          : userData?.id
      )
      .collection("ownFood")
      .get()
      .then((querySnapshot) => {
        let tmpList1 = [];
        querySnapshot.forEach((documentSnapshot) => {
          tmpList1.push({
            __v: 0,
            _id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });
        setdata1(tmpList1);
        console.log(tmpList1);
        dispatch(setFoodList(tmpList1));

      // fetch("https://rongoeirnet.herokuapp.com/getFood")
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

      //       setdata2(tmpList);
      //       dispatch(setFoodList(tmpList));
      //     })
      //     .catch((error) => {
      //       console.error(error);
      //     });
      });

    // dispatch(setFoodList(data1.concat(data2)));
  }, []);

  function formatDate() {
    var d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
  function formatDate1(d) {
    var d = new Date(d);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        enableResetScrollToCoords={false}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: RFValue(20, 816),
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={{
                paddingRight: RFValue(20, 816),
                marginLeft: 20,
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
                textAlign: "center",
                fontWeight: "bold",
                color: "black",
                marginLeft: 20,
              }}
            >
              Add Meal
            </Text>
          </View>

          <TouchableOpacity
            style={{ marginRight: 20 }}
            onPress={() => {
              navigation.navigate("MealHistory", { type: type });
            }}
          >
            <Icon name="history" type="font-awesome-5" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: RFValue(20, 816),
            alignSelf: "flex-end",
            marginRight: 10,
          }}
        >
          {/* {userType === "coach" && (
            <View
              style={{
                alignItems: "center",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Text style={{ marginRight: 10 }}>Coach Assigned meal</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={athleteView ? "#05B8DB" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => setAthleteView(!athleteView)}
                value={athleteView}
                style={{ marginRight: 10 }}
              />
            </View>
          )} */}

          {/* <Text>Your meals</Text> */}
        </View>

        <Image
          style={{
            width: "100%",
            height: RFValue(180, 816),
            marginBottom: RFValue(10, 816),
            marginTop: RFValue(10, 816),
          }}
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/triden-workout-app.appspot.com/o/app_images%2Fnutrition.jpeg?alt=media&token=57c137c0-3f00-4f5d-bd18-daf8f2a919c8",
          }}
        />

        <View
          style={{
            fontSize: RFValue(18, 816),

            backgroundColor: "white",
            padding: RFValue(10, 816),
            borderRadius: RFValue(8, 816),
            margin: 10,
          }}
        >
          <View style={{ alignItems: "center", marginHorizontal: 10 }}>
            <Text
              style={{
                color: "black",
                textAlign: "left",
              }}
            >
              {" "}
              Date
            </Text>
            {/*Platform.OS === 'ios'?
               <DatePickerIOS

               date={new Date(moment(startDate,"DD-MM-YYYY"))}
               //style={{marginTop:-RFValue(80,816),marginBottom:-RFValue(80,816)}}
               onDateChange={(date) => {setStartDate(moment(date).format("DD-MM-YYYY"));}}
               timeZoneOffsetInMinutes={5*60 + 30}
             />
            : */}
            {console.log(17, route?.params.todaysFoodId)}
            <DatePicker
              style={{
                width: "100%",

                alignSelf: "flex-start",
                backgroundColor: "white",
                borderWidth: 0.5,
                bordercolor: "white",
                borderRadius: RFValue(5, 816),
              }}
              // disabled={foodId === null ? false : true}
              date={selectedDate}
              mode="date"
              placeholder="select date"
              format="YYYY-MM-DD"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              // minDate={moment(new Date()).utc().format("DD-MM-YYYY")}
              customStyles={{
                dateIcon: {
                  position: "absolute",
                  height: 0,
                  width: 0,
                },
                dateInput: {
                  borderWidth: 0,
                  borderRadius: RFValue(5, 816),
                },
                dateText: {
                  alignSelf: "center",
                  marginLeft: RFValue(10, 816),
                },
              }}
              onDateChange={(date) => {
                setSelectedDate(date);
              }}
            />
          </View>
          {athleteView ? (
            entireFood.map((ent, index) => (
              <View
                style={{
                  width: "100%",
                  backgroundColor: "white",
                  padding: RFValue(10, 816),
                  borderRadius: RFValue(8, 816),
                  marginTop: 20,
                }}
                key={index}
              >
                <View style={{ width: "100%" }}>
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          width: "70%",
                        }}
                      >
                        <Text style={{ color: "black" }}>Meal: </Text>
                        {Platform.OS === "ios" ? (
                          <RNPickerSelect
                            value={ent.meal}
                            style={{ paddingVertical: 5 }}
                            onValueChange={(itemValue) => {
                              let temp = [...entireFood];
                              temp[index].meal = itemValue;
                              setEntireFood(temp);
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
                            disabled={type === "non-editable" ? true : false}
                          />
                        ) : (
                          <Picker
                            selectedValue={ent.meal}
                            style={{
                              width: "100%",
                              padding: RFValue(15, 816),
                              borderWidth: 1,
                              borderColor: "grey",
                              borderRadius: RFValue(5, 816),
                            }}
                            onValueChange={(itemValue) => {
                              let temp = [...entireFood];
                              temp[index].meal = itemValue;
                              setEntireFood(temp);
                            }}
                            enabled={type === "non-editable" ? false : true}
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
                      {type !== "non-editable" && (
                        <TouchableOpacity
                          style={{
                            marginRight: 20,
                          }}
                          onPress={() => {
                            let temp = [...entireFood];
                            temp.splice(index, 1);
                            setEntireFood(temp);
                          }}
                        >
                          <Icon name="times" type="font-awesome-5" size={15} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                  <View
                    style={{ marginBottom: RFValue(20, 816), width: "100%" }}
                  >
                    <Text style={{ color: "black" }}>Description</Text>
                    <View
                      style={{
                        borderColor: "#999",
                        borderWidth: 0.8,
                        marginVertical: RFValue(10, 816),
                        borderRadius: 5,
                        width: "100%",
                      }}
                    >
                      <UselessTextInput
                        multiline
                        numberOfLines={4}
                        placeholder="Enter Meal Description"
                        onChangeText={(newValue) => {
                          let temp = [...entireFood];
                          temp[index].description = newValue;
                          setEntireFood(temp);
                        }}
                        value={ent.description}
                        editable={type === "non-editable" ? false : true}
                      />
                    </View>
                  </View>
                  {serverData?.length == 0 ? (
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ActivityIndicator size="large" color="#05B8DB" />
                    </View>
                  ) : (
                    ent.food?.map((item, idx) => {
                      return (
                        <AddFoodCard
                          type={type}
                          item={item}
                          idx={idx}
                          key={idx}
                          ent={ent}
                          entireFood={entireFood}
                          index={index}
                          serverData={serverData}
                          setEntireFood={setEntireFood}
                        />
                      );
                    })
                  )}
                </View>

                <View>
                  {type !== "non-editable" && (
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
                        let temp = [...ent.food];
                        temp.push({
                          foodName: "",
                          proteins: 0,
                          carbs: 0,
                          fat: 0,
                          calories: 0,
                          quantity: 1,
                        });
                        foodData[index].food = temp;
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
                  )}
                </View>
              </View>
            ))
          ) : (
            <View
              style={{
                padding: RFValue(10, 816),
                backgroundColor: "white",
                borderRadius: 5,
              }}
            >
              <View
                style={{
                  alignItems: "flex-start",
                }}
              >
                <Text style={{ margin: RFValue(10, 816) }}>
                  Nutrition Plan Name
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    width: ScreenWidth - RFValue(50, 816),
                    borderColor: "#999",
                    borderRadius: RFValue(5, 816),
                    paddingVertical:
                      Platform.OS === "ios" ? RFValue(15, 816) : 5,
                    paddingHorizontal: RFValue(10, 816),
                  }}
                  placeholder="Enter Nutrition Plan Name"
                  ////placeholdertextColor="black"
                  placeholderOpacity="1"
                  value={foodName}
                  onChangeText={setFoodName}
                  editable={userType === "coach" ? false : true}
                />
              </View>

              {coachEntireFood?.map((item, idx) => {
                return (
                  <View key={idx}>
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            margin: RFValue(10, 816),
                            marginTop: RFValue(25, 816),
                          }}
                        >
                          Select Meal
                        </Text>
                        {/*
                    <TouchableOpacity onPress={()=>{
                      var temp = [...plan];
                      temp.splice(idx,1)
                      console.log(temp)
                      setPlan(temp)
                    }} style={{marginRight:20}}>
                      <Icon name="times" type="font-awesome-5" />
                  </TouchableOpacity>*/}
                      </View>
                      <View
                        style={{
                          alignItems: "center",
                          backgroundColor: "#fff",
                          borderWidth: 0.5,
                          borderRadius: RFValue(5, 816),
                          padding: Platform.OS === "ios" ? RFValue(10, 816) : 0,
                          paddingBottom:
                            Platform.OS === "ios"
                              ? RFValue(10, 816)
                              : RFValue(20, 816),
                        }}
                      >
                        {Platform.OS === "ios" ? (
                          <RNPickerSelect
                            value={item.meal}
                            onValueChange={(itemValue) => {
                              let tempMeal = [...coachEntireFood];
                              tempMeal[idx].meal = itemValue;
                              setCoachEntireFood(tempMeal);
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
                            disabled={userType === "coach" ? true : false}
                          />
                        ) : (
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
                              let tempMeal = [...coachEntireFood];
                              tempMeal[idx].meal = itemValue;
                              setCoachEntireFood(tempMeal);
                            }}
                            enabled={userType === "coach" ? false : true}
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
                            let tempMeal = [...coachEntireFood];
                            tempMeal[idx].description = text;
                            setCoachEntireFood(tempMeal);
                          }}
                          value={item.description}
                          editable={userType === "coach" ? false : true}
                        />
                      </View>
                    </View>

                    {item.food?.map((itm, idx2) => {
                      return (
                        <AddFoodCard
                          type={"non-editable"}
                          item={itm}
                          idx={idx2}
                          key={idx2}
                          ent={item}
                          entireFood={coachEntireFood}
                          index={idx}
                          serverData={serverData}
                          setEntireFood={setCoachEntireFood}
                        />
                      );
                    })}

                    {coachEntireFood.length > 1 &&
                      coachEntireFood.length - 1 !== idx && (
                        <View
                          style={{
                            width: ScreenWidth - RFValue(60, 816),
                            borderTopWidth: 0.8,
                            marginVertical: RFValue(15, 816),
                          }}
                        ></View>
                      )}
                  </View>
                );
              })}
            </View>
          )}

          {athleteView
            ? type !== "non-editable" && (
                <TouchableOpacity
                  style={{
                    height: RFValue(52, 816),
                    width: ScreenWidth - 40,
                    borderRadius: RFValue(10, 816),
                    marginTop: RFValue(45, 816),
                    marginBottom: RFValue(15, 816),
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#C19F1E",
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
                      },
                    ]);
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
                    Add Meal
                  </Text>
                </TouchableOpacity>
              )
            : null}
          {athleteView ? (
            <TouchableOpacity
              style={{
                height: RFValue(52, 816),
                width: "100%",
                marginTop: RFValue(15, 816),
                marginBottom: RFValue(25, 816),
                justifyContent: "center",
                alignItems: "center",
                borderRadius: RFValue(10, 816),
                backgroundColor: "#C19F1E",
              }}
              onPress={() => {
                if (type === "non-editable") {
                  navigation.goBack();
                } else {
                  var save = true;
                  entireFood.forEach((id) => {
                    if (id.meal == "Select the type of meal" || id.meal == "") {
                      save = false;
                    }
                  });
                  if (!save) {
                    alert("Please select a meal");
                  } else {
                    db.collection("AthleteNutrition")
                      .doc(userData?.id)
                      .collection("nutrition")
                      .doc(formatDate1(selectedDate))
                      .set(
                        {
                          entireFood,
                        },
                        { merge: true }
                      )
                      .then(() => {
                        saveNotification(
                          userData.id,
                          `${userData?.data?.name} has logged meal on ${moment(
                            selectedDate,
                            "YYYY-MM-DD"
                          ).format("DD-MM-YYYY")}`
                        );
                        // triggerNotification(userData.data.listOfCoaches, {
                        //   title: "Nutrition completed",
                        //   body: `${userData?.data?.name} has completed Nutrition ${entireFood[0].meal}`,
                        // });
                        // navigation.navigate("Nutrition");
                        navigation.navigate("PostAddScreen", {
                          screen: "nutrition",
                        });
                      })
                      .catch((error) => {
                        console.error("Error updating document: ", error);
                      });
                  }
                }
              }}
            >
              <View>
                <Text
                  style={{
                    color: "white",
                    fontFamily: "SF-Pro-Display-regular",
                    fontSize: RFValue(16, 816),
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {type === "non-editable" ? "Return" : "Complete Nutrition"}
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default AddMeal;
