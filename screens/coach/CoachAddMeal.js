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
  TextInput,
  Modal,
  TouchableHighlight,
  Platform,
  Switch,
} from "react-native";
import { db } from "../../firebase";
import firebase from "firebase";
import { ActivityIndicator } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import moment from "moment";
import triggerNotification from "../../utils/sendPushNotification";
import { saveNotification } from "../../utils/SaveNotificationMessage";


let ScreenHeight = Dimensions.get("window").height;

let ScreenWidth = Dimensions.get("window").width;
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";
import AddFoodCard from "../components/AddFoodCard";
import DatePicker from "react-native-datepicker";
import dayjs from "dayjs";

import {
  selectUser,
  selectUserData,
  selectUserType,
} from "../../features/userSlice";

import { setFoodList, getFoodList } from "../../features/foodSlice";
import { Icon } from "react-native-elements";
import RNPickerSelect from "react-native-picker-select";
import Notification from "../components/Notification";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Nutrition from "../Nutrition";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginBottom: 0,
    paddingTop: RFValue(20, 816),
    height: ScreenHeight,
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
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
    width: ScreenWidth,
    height: ScreenHeight / 3.2,
    paddingBottom: ScreenHeight * 0.05,
  },
});
function formatDate() {
  var d = new Date(),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

const UselessTextInput = (props) => {
  return (
    <TextInput
      textAlignVertical="top"
      style={{
        padding: RFValue(10, 816),
        width: ScreenWidth / 1.2,
        borderRadius: 3,
        paddingVertical: Platform.OS === "ios" ? 15 : 10,
      }}
      {...props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
      editable={props.editable}
      maxLength={500}
      multiline={true}
    />
  );
};

const CoachAddMeal = ({ route, navigation }) => {
  const user = useSelector(selectUser);
  const userType = useSelector(selectUserType);
  const userData = useSelector(selectUserData);
  const serverData = useSelector(getFoodList);

  // const [serverData, setServerData] = useState([]);
  const [foodName, setFoodName] = useState("");
  const [addFood, setAddFood] = useState(false);
  const [collapse, setCollapse] = useState(false);

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

  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState();

  useEffect(() => {
    if (route.params?.nutrition) {
      setFoodName(route.params.nutrition.data?.nutrition?.nutritionName);
      const selectedDays = route.params.nutrition.data?.selectedDays || [];
      setSelectedDays(selectedDays);
      if (selectedDays.length > 0) {
        setSelectedDay(selectedDays[0]);
      }
      if (route.params?.nutrition?.data?.nutrition?.entireFood) {
        setEntireFood(route.params?.nutrition?.data?.nutrition?.entireFood);
        setAddFood(
          route.params?.nutrition?.data?.nutrition?.entireFood[0]?.addFood
        );
      }
    }
  }, [route.params?.nutrition]);

  useEffect(() => {
    db.collection("coaches")
      .doc(
        userType === "athlete"
          ? route.params?.nutrition?.data?.from_id
          : userData?.id
      )
      .collection("ownFood")
      .get()
      .then((querySnapshot) => {
        let tmpList = [];
        querySnapshot.forEach((documentSnapshot) => {
          tmpList.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });

        dispatch(setFoodList(tmpList));
      });
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
    if (addFood && selectedDay) {
      db.collection("AthleteNutrition")
        .doc(userData?.id)
        .collection("nutrition")
        .doc(selectedDay)
        .get()
        .then((snapshot) => {
          if (!snapshot.exists) return;
          const athleteFood = snapshot.data().entireFood;
          const newEntireFood = entireFood.slice();
          athleteFood.forEach((meal) => {
            if (meal.addedByAthlete) {
              newEntireFood.push(meal);
            } else {
              meal.food.forEach((foodItem) => {
                const index = newEntireFood.findIndex(
                  (m) => m.meal === meal.meal && !m.addedByAthlete
                );
                if (index !== -1) {
                  const newFood = newEntireFood[index].food.slice();
                  if (foodItem.addedByAthlete) {
                    newFood.push(foodItem);
                  } else {
                    const foodIndex = newFood.findIndex(
                      (f) => f.foodName === foodItem.foodName
                    );
                    if (foodIndex !== -1) {
                      newFood[foodIndex] = {
                        ...newFood[foodIndex],
                        logged: true,
                      };
                    }
                  }
                  newEntireFood[index] = {
                    ...newEntireFood[index],
                    food: newFood,
                  };
                }
              });
            }
          });
          setEntireFood(newEntireFood);
        });
    }
  }, [userData?.id, selectedDay, addFood]);

  function handleLogPress() {
    const meals = [];
    entireFood.forEach((meal) => {
      const mealClone = { ...meal };
      mealClone.food = mealClone.food.filter((foodItem) => foodItem.logged);
      if (mealClone.food.length > 0) {
        meals.push(mealClone);
      }
    });
    db.collection("AthleteNutrition")
      .doc(userData.id)
      .collection("nutrition")
      .doc(selectedDay)
      .set({
        date: firebase.firestore.FieldValue.serverTimestamp(),
        entireFood: meals,
      })
      .then(() => {
        saveNotification(
          userData.id,
          `${userData?.data?.name} has logged nutrition for ${moment(
            selectedDay,
            "YYYY-MM-DD"
          ).format("DD-MM-YYYY")} meal plan`
        );
        navigation.goBack();
      });
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        enableResetScrollToCoords={false}
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
                if (userType === "athlete") {
                  navigation.goBack();
                } else {
                  navigation.replace("CoachNutrition");
                }
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
                fontSize: RFValue(28, 816),
                fontFamily: "SF-Pro-Text-regular",
                fontWeight: "bold",
                marginLeft: RFValue(20, 816),
              }}
            >
              {userType === "athlete" ? "View Meal" : "Add Meal"}
            </Text>
          </View>
          <Notification navigation={navigation} />
        </View>

        {/* <TouchableOpacity
          style={{
            position: "absolute",
            right: 30,
            top:RFValue(10, 816),
          }}
          onPress={() => {
            navigation.navigate("MealHistory");
          }}
        >
          <Icon name="history" type="font-awesome-5" />
        </TouchableOpacity> */}

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
          <View style={{ flex: 1 }}>
            <View
              style={{
                margin: RFValue(10, 816),
                backgroundColor: "white",
                borderRadius: RFValue(8, 816),
                paddingBottom: 10,
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
                {userType == "coach" ? (
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
                ) : null}
              </View>
              <TextInput
                style={{
                  borderWidth: 1,
                  width: ScreenWidth - RFValue(50, 816),
                  borderColor: "#999",
                  borderRadius: RFValue(5, 816),
                  paddingVertical: RFValue(10, 816),
                  paddingHorizontal: RFValue(10, 816),
                  marginLeft: 10,
                }}
                placeholder="Enter Nutrition Plan Name"
                //placeholdertextColor="black"
                placeholderOpacity="1"
                value={foodName}
                onChangeText={setFoodName}
                editable={userType === "athlete" ? false : true}
              />
            </View>
            {/* {addFood && (
              <View
                style={{
                  alignItems: "center",
                  marginHorizontal: 10,
                  backgroundColor: "white",

                  borderRadius: RFValue(5, 816),
                  paddingVertical: RFValue(10, 816),
                  paddingHorizontal: RFValue(10, 816),
                }}
              >
                <Text
                  style={{
                    color: "black",
                    textAlign: "left",
                    width: "100%",
                    backgroundColor: "white",
                  }}
                >
                  {" "}
                  Date
                </Text>
                Platform.OS === 'ios'?
               <DatePickerIOS

               date={new Date(moment(startDate,"DD-MM-YYYY"))}
               //style={{marginTop:-RFValue(80,816),marginBottom:-RFValue(80,816)}}
               onDateChange={(date) => {setStartDate(moment(date).format("DD-MM-YYYY"));}}
               timeZoneOffsetInMinutes={5*60 + 30}
             />
            : 

                <DatePicker
                  style={{
                    width: "100%",
                    marginVertical: RFValue(10, 816),

                    alignSelf: "flex-start",
                    backgroundColor: "white",
                    borderWidth: 0.5,
                    bordercolor:"white",
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
            )}
             */}
            {userType === "athlete" && (
              <Picker
                selectedValue={selectedDay}
                onValueChange={(value) => setSelectedDay(value)}
              >
                {selectedDays.map((day) => (
                  <Picker.Item label={day} value={day} key={day} />
                ))}
              </Picker>
            )}
            {entireFood?.map((item, idx) => {
              return (
                <View
                  key={idx}
                  style={{
                    backgroundColor: "white",
                    marginLeft: RFValue(10, 816),
                    padding: RFValue(10, 816),
                    borderRadius: 8,
                  }}
                >
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
                          //margin: RFValue(10, 816),
                          //marginTop: RFValue(10, 816),
                          color: "black",
                          fontSize: RFValue(20, 816),
                          marginBottom: RFValue(5, 816),
                        }}
                      >
                        Select Meal
                      </Text>
                      {userType == "coach" || item.addedByAthlete ? (
                        <TouchableOpacity
                          onPress={() => {
                            var temp = [...entireFood];
                            temp.splice(idx, 1);
                            setEntireFood(temp);
                          }}
                          style={{ marginRight: 20 }}
                        >
                          <Icon name="times" type="font-awesome-5" />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                    <View
                      style={{
                        backgroundColor: "#fff",
                        borderWidth: 0.5,
                        borderRadius: RFValue(5, 816),
                        marginBottom: 20,
                        flexDirection: "row",
                        alignItems: "center",
                        width: "70%",
                        paddingVertical: 10,
                      }}
                    >
                      {Platform.OS === "ios" ? (
                        <RNPickerSelect
                          value={item.meal}
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
                          disabled={
                            userType === "athlete" && !item.addedByAthlete
                          }
                        />
                      ) : (
                        <Picker
                          selectedValue={item.meal}
                          style={{
                            width: ScreenWidth - RFValue(60, 816),
                            borderWidth: 1,
                            bordercolor: "white",
                          }}
                          onValueChange={(itemValue) => {
                            let tempMeal = [...entireFood];
                            tempMeal[idx].meal = itemValue;
                            setEntireFood(tempMeal);
                          }}
                          enabled={
                            userType !== "athlete" || item.addedByAthlete
                          }
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
                    <View style={{ marginTop: RFValue(15, 816) }}>
                      <Text
                        style={{ fontSize: RFValue(20, 816), color: "black" }}
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
                          value={item.description}
                          editable={userType === "athlete" ? false : true}
                        />
                      </View>
                    </View>
                  )}
                  {entireFood.length > 1 && entireFood.length - 1 !== idx && (
                    <View
                      style={{
                        width: ScreenWidth - RFValue(60, 816),
                        borderTopWidth: 0.8,
                        marginVertical: RFValue(15, 816),
                      }}
                    ></View>
                  )}
                  {serverData?.length == 0 ? (
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ActivityIndicator size="large" color="#C19F1E" />
                    </View>
                  ) : (
                    addFood &&
                    item.food?.map((ent, idx2) => {
                      return (
                        <View key={idx2} style={{ width: ScreenWidth - 40 }}>
                          <AddFoodCard
                            type={
                              userType === "athlete" && !ent.addedByAthlete
                                ? "non-editable"
                                : "Editable"
                            }
                            collapse={collapse}
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
                    })
                  )}

                  {addFood ? (
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
                          let temp = [...item.food];
                          temp.push({
                            foodName: "",
                            proteins: 0,
                            carbs: 0,
                            fat: 0,
                            calories: 0,
                            quantity: 1,
                            logged: userType === "athlete" ? true : false,
                            addedByAthlete:
                              userType === "athlete" ? true : false,
                          });
                          foodData[idx].food = temp;
                          setCollapse(true);
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

          <TouchableOpacity
            style={{
              height: RFValue(52, 816),
              width: "80%",
              marginTop: RFValue(45, 816),
              marginBottom: RFValue(15, 816),
              justifyContent: "center",
              alignItems: "center",
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
                  addedByAthlete: userType === "athlete" ? true : false,
                  food: [
                    {
                      foodName: "",
                      proteins: 0,
                      carbs: 0,
                      fat: 0,
                      calories: 0,
                      quantity: 1,
                      addedByAthlete: userType === "athlete" ? true : false,
                      logged: userType === "athlete" ? true : false,
                    },
                  ],
                  addFood,
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

          {/* <View
            style={{
              width: ScreenWidth - 30,
              borderTopWidth: 0.8,
            }}
          ></View> */}
          {userType !== "athlete" && (
            <TouchableOpacity
              style={{
                height: RFValue(52, 816),
                width: ScreenWidth - RFValue(40, 816),
                marginTop: RFValue(15, 816),
                marginBottom: RFValue(25, 816),
                justifyContent: "center",
                alignItems: "center",
                borderRadius: RFValue(10, 816),
                backgroundColor: "#C19F1E",
                alignSelf: "center",
              }}
              onPress={() => {
                console.log("Clicked");
                if (foodName == "") {
                  alert("Please enter plan name");
                } else {
                  setModal(true);
                }
              }}
            >
              <View>
                <Text
                  style={{
                    color: "white",
                    fontFamily: "SF-Pro-Display-regular",
                    fontSize: RFValue(18, 816),
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  Add Plan
                </Text>
              </View>
            </TouchableOpacity>
          )}
          {userType === "athlete" && addFood && (
            <TouchableOpacity
              style={{
                height: RFValue(52, 816),
                width: ScreenWidth - RFValue(40, 816),
                marginTop: RFValue(15, 816),
                marginBottom: RFValue(25, 816),
                justifyContent: "center",
                alignItems: "center",
                borderRadius: RFValue(10, 816),
                backgroundColor: "#C19F1E",
                alignSelf: "center",
              }}
              onPress={handleLogPress}
            >
              <View>
                <Text
                  style={{
                    color: "white",
                    fontFamily: "SF-Pro-Display-regular",
                    fontSize: RFValue(18, 816),
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  Log Nutrition
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        <Modal animationType="slide" transparent={true} visible={modal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.body}>
                <Text
                  style={{
                    fontSize: RFValue(15, 816),
                    fontWeight: "700",
                    color: "#003049",
                    marginTop: -10,
                  }}
                >
                  Do you want to save the meal?
                </Text>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: RFValue(15, 816),
                }}
              >
                <TouchableOpacity
                  style={{
                    height: RFValue(40, 816),
                    width: ScreenWidth / 2.5,
                    marginBottom: RFValue(8, 816),
                    borderRadius: RFValue(8, 816),
                    shadowColor: "rgba(0,0,0, .4)", // IOS
                    shadowOffset: { height: 1, width: 1 }, // IOS
                    shadowOpacity: 1, // IOS
                    shadowRadius: 1, //IOS
                    backgroundColor: "#808080",
                    elevation: 2, // Android
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    marginRight: RFValue(15, 816),
                  }}
                  onPress={() => {
                    // navigation.navigate("AssignNutrition", {
                    //   nutrition: {
                    //     nutritionName: foodName,
                    //     plan,
                    //   },
                    // });
                    setModal(false);
                    setModal1(true);
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      fontSize: RFValue(14, 816),
                      textAlign: "center",
                    }}
                  >
                    DON'T SAVE
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    height: RFValue(40, 816),
                    width: ScreenWidth / 4,
                    marginBottom: RFValue(8, 816),
                    borderRadius: RFValue(8, 816),
                    shadowColor: "rgba(0,0,0, .4)", // IOS
                    shadowOffset: { height: 1, width: 1 }, // IOS
                    shadowOpacity: 1, // IOS
                    shadowRadius: 1, //IOS
                    backgroundColor: "#C19F1E",
                    elevation: 2, // Android
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    marginLeft: RFValue(15, 816),
                  }}
                  onPress={() => {
                    db.collection("CoachFood")
                      .add({
                        from_id: userData?.id,
                        assignedTo_id: "",
                        nutrition: {
                          nutritionName: foodName,
                          entireFood,
                        },
                        saved: true,
                        timestamp:
                          firebase.firestore.FieldValue.serverTimestamp(),
                      })
                      .then(() => {
                        // navigation.navigate("AssignNutrition", {
                        //   nutrition: {
                        //     nutritionName: foodName,
                        //     plan,
                        //   },
                        // });
                        setModal(false);
                        setModal1(true);
                      });
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: RFValue(14, 816),
                      textAlign: "center",
                    }}
                  >
                    SAVE
                  </Text>
                </TouchableOpacity>
              </View>

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
                  backgroundColor: "white",
                  elevation: 2, // Android
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
                onPress={() => {
                  db.collection("Food")
                    .add({
                      from_id: userData?.id,
                      assignedTo_id: "",
                      nutrition: {
                        nutritionName: foodName,
                        entireFood,
                      },
                      timestamp:
                        firebase.firestore.FieldValue.serverTimestamp(),
                    })
                    .then(() => {
                      // navigation.navigate("AssignNutrition", {
                      //   nutrition: {
                      //     nutritionName: foodName,
                      //     plan,
                      //   },
                      // });
                      setModal(false);
                    });
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: RFValue(14, 816),
                    textAlign: "center",
                  }}
                >
                  RETURN HOME
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal animationType="slide" transparent={true} visible={modal1}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.body}>
                <Text
                  style={{
                    fontSize: RFValue(14, 816),
                    fontWeight: "700",
                    color: "black",
                    marginTop: -10,
                    textAlign: "center",
                  }}
                >
                  Would you like to assign this meal to your athletes?
                </Text>
                <Text
                  style={{
                    fontSize: RFValue(12, 816),
                    fontWeight: "700",
                    color: "white",
                    marginTop: RFValue(10, 816),
                    textAlign: "center",
                  }}
                >
                  You can complete this step later from the meal screen
                </Text>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: RFValue(15, 816),
                }}
              >
                <TouchableOpacity
                  style={{
                    height: RFValue(40, 816),
                    width: ScreenWidth / 4,
                    marginBottom: RFValue(8, 816),
                    borderRadius: RFValue(8, 816),
                    shadowColor: "rgba(0,0,0, .4)", // IOS
                    shadowOffset: { height: 1, width: 1 }, // IOS
                    shadowOpacity: 1, // IOS
                    shadowRadius: 1, //IOS
                    backgroundColor: "#808080",
                    elevation: 2, // Android
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    marginRight: RFValue(15, 816),
                  }}
                  onPress={() => setModal1(false)}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: RFValue(14, 816),
                      textAlign: "center",
                    }}
                  >
                    NO
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    height: RFValue(40, 816),
                    width: ScreenWidth / 4,
                    marginBottom: RFValue(8, 816),
                    borderRadius: RFValue(8, 816),
                    shadowColor: "rgba(0,0,0, .4)", // IOS
                    shadowOffset: { height: 1, width: 1 }, // IOS
                    shadowOpacity: 1, // IOS
                    shadowRadius: 1, //IOS
                    backgroundColor: "#C19F1E",
                    elevation: 2, // Android
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    marginLeft: RFValue(15, 816),
                  }}
                  onPress={() => {
                    navigation.navigate("AssignNutrition", {
                      nutrition: {
                        nutritionName: foodName,
                        entireFood,
                      },
                      type: "add",
                    });

                    setModal1(false);
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: RFValue(14, 816),
                      textAlign: "center",
                    }}
                  >
                    YES
                  </Text>
                </TouchableOpacity>
              </View>

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
                  backgroundColor: "white",
                  elevation: 2, // Android
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
                onPress={() => {
                  setModal1(false);
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: RFValue(14, 816),
                    textAlign: "center",
                  }}
                >
                  SAVE AND RETURN HOME
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default CoachAddMeal;
