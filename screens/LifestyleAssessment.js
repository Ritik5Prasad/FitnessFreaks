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
  KeyboardAvoidingView,
} from "react-native";
import { setSaved } from "../features/onboardingSlice";
let ScreenWidth = Dimensions.get("window").width;
let ScreenHeight = Dimensions.get("window").height;
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Icon } from "react-native-elements";
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
import { Picker } from "@react-native-picker/picker";
import RNPickerSelect from "react-native-picker-select";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const styles = StyleSheet.create({
  container: {
    padding: RFValue(20, 816),
    marginBottom: 0,
    paddingTop: RFValue(20, 816),
    paddingBottom: 200,
  },
});

const UselessTextInput = (props) => {
  return (
    <TextInput
      style={{
        textAlignVertical: "top",
        padding: RFValue(10, 816),
        paddingVertical: Platform.OS === "ios" ? 15 : 10,
      }}
      {...props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
      editable={props.isEnabled}
      maxLength={500}
      multiline={true}
    />
  );
};

function TrainingAssessment({ route, navigation }) {
  const user = useSelector(selectUser);
  const userType = useSelector(selectUserType);
  const temperoryId = useSelector(selectTemperoryId);
  const [userData, setUserData] = useState(null);
  const [editable, setEditable] = useState(false);
  const [doSmoke, setDoSmoke] = useState(false);
  const [consumeAlcohol, setConsumeAlcohol] = useState(false);
  const [haveAllergies, setHaveAllergies] = useState(false);
  const [fast, setFast] = useState(false);
  const [avoidNonVeg, setAvoidNonVeg] = useState(false);
  const [specifyAllergies, setSpecifyAllergies] = useState("");
  const [fastFood, setFastFood] = useState("");

  const [dishesDisliked, setDishesDisliked] = useState("");
  const [favDish, setFavDish] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [meal, setMeal] = useState("");

  const [diet, setDiet] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [snacks, setSnacks] = useState("");
  const [breakfast, setBreakfast] = useState("");
  const [lunch, setLunch] = useState("");
  const [dinner, setDinner] = useState("");
  const [smokeData, setSmokeData] = useState("");
  const [alcoholData, setAlcoholData] = useState("");
 
  const [smokeFrequency, setSmokeFrequency] = useState("");
  const [smokePer, setSmokePer] = useState("");
  const [alcoholFrequency, setAlcoholFrequency] = useState("");
  const [alcoholPer, setAlcoholPer] = useState("");
  const [outsideFoodFrequency, setOutsideFoodFrequency] = useState("");
  const [outsideFoodPer, setOutsideFoodPer] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [daysList, setDaysList] = useState([
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ]);


  const selectData = [
    { id: 2, name: "Sedentary (mostly sitting throughout the day)" },
    { id: 3, name: "Semi Sedentary(some movement due to chores)" },
    { id: 4, name: "Moderately Active(2-3 days of exercise)" },
    { id: 5, name: "Active(4-5 days of regular exercise)" },
    { id: 6, name: "Very Active(6 days of rigorous exercise)" }
  ]

  const [selectedAvoidNonvegDays, setSelectedAvoidNonvegDays] = useState([]);
  const [selectedFastDays, setSelectedFastDays] = useState([]);
  const [color, changeColor] = useState([]);
  const [color1, changeColor1] = useState([]);
  const dispatch = useDispatch();
  const [type, setType] = useState(null);
  const [athlete_id, setAtheteId] = useState(null);

  useEffect(() => {
    if (route.params?.type) {
      setType(route.params?.type);
    }
  }, [route.params?.type]);

  useEffect(() => {
    if (route.params?.athlete_id) {
      setAtheteId(route.params?.athlete_id);
    }
  }, [route.params?.athlete_id]);

  useEffect(() => {
    if (userType == "coach") {
      db.collection("athletes")
        .doc(temperoryId)
        .get()
        .then(function (snap) {
          setUserData({
            id: temperoryId,
            data: snap.data(),
          });
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    } else {
      setEditable(true);
      db.collection("athletes")
        .where("email", "==", user)
        .get()
        .then(function (snap) {
          snap.docs.forEach((item) => {
            setUserData({
              id: item.id,
              data: item.data(),
            });
          });
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    }
  }, [user, temperoryId]);

  useEffect(() => {
    if (userData) {
      let temp1 = [];
      let temp2 = [];
      db.collection("athletes")
        .doc(userData?.id)
        .collection("Lifestyle")
        .doc("lifestyle")
        .get()
        .then(function (doc) {
          if (doc.exists) {
            console.log("Document data:", doc.data());
            setDoSmoke(doc.data().doSmoke);
            setConsumeAlcohol(doc.data().consumeAlcohol);
            setHaveAllergies(doc.data().haveAllergies);
            setFast(doc.data().fast);
            setAvoidNonVeg(doc.data().avoidNonVeg);
            setSpecifyAllergies(doc.data().specifyAllergies);
            setFastFood(doc.data().fastFood);

            setDishesDisliked(doc.data().dishesDisliked);
            setFavDish(doc.data().favDish);
            setCuisine(doc.data().cuisine);
            setMeal(doc.data().meal);

            setLunch(doc.data().lunch);
            setBreakfast(doc.data().breakfast);
            setDinner(doc.data().dinner);
            setSnacks(doc.data().snacks);
            setSmokeData(doc.data().smokeData);
            setAlcoholData(doc.data().alcoholData);

            setDiet(doc.data().diet);
            setActivityLevel(doc.data().activityLevel);

            setSmokeFrequency(doc.data().smokeFrequency);
            setSmokePer(doc.data()?.smokePer ? doc.data().smokePer : "");
            setAlcoholFrequency(doc.data().alcoholFrequency);
            setAlcoholPer(doc.data().alcoholPer ? doc.data().alcoholPer : "");
            setOutsideFoodFrequency(doc.data().outsideFoodFrequency);
            setOutsideFoodPer(
              doc.data().outsideFoodPer ? doc.data().outsideFoodPer : ""
            );
            setAdditionalDetails(doc.data().additionalDetails);
            setSelectedAvoidNonvegDays(doc.data().selectedAvoidNonvegDays);
            daysList.map((item, idx) => {
              if (doc.data().selectedAvoidNonvegDays.includes(item)) {
                temp1.push(idx);
              }
            });
            setSelectedFastDays(doc.data().selectedFastDays);
            daysList.map((item, idx) => {
              if (doc.data().selectedFastDays.includes(item)) {
                console.log("selected item is ", item);

                temp2.push(idx);
              }
            });
            changeColor(temp1);
            changeColor1(temp2);
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch((e) => console.log(e));
    }
  }, [userData?.id]);

  useEffect(() => {
    daysList.map((item, idx) => {
      if (!selectedAvoidNonvegDays.includes(item)) {
        if (color.includes(idx)) {
          setSelectedAvoidNonvegDays([...selectedAvoidNonvegDays, item]);
        }
      }
    });
  }, [color]);

  useEffect(() => {
    daysList.map((item, idx) => {
      if (!selectedFastDays.includes(item)) {
        if (color1.includes(idx)) {
          setSelectedFastDays([...selectedFastDays, item]);
        }
      }
    });
  }, [color1]);

  const saveDetails = () => {
    dispatch(setSaved(true));
    db.collection("athletes")
      .doc(userData?.id)
      .collection("Lifestyle")
      .get()
      .then((snap) => {
        if (!snap.empty) {
          db.collection("athletes")
            .doc(userData?.id)
            .collection("Lifestyle")
            .doc("lifestyle")
            .update({
              doSmoke,
              smokeFrequency,
              smokePer,
              consumeAlcohol,
              haveAllergies,
              fast,
              avoidNonVeg,
              specifyAllergies,
              fastFood,
              dishesDisliked,
              favDish,
              cuisine,
              lunch,
              meal,
              dinner,
              alcoholData,
              smokeData,
              breakfast,
              snacks,
              diet,
              activityLevel,
              alcoholFrequency,
              alcoholPer,
              outsideFoodFrequency,
              outsideFoodPer,
              additionalDetails,
              selectedFastDays,
              selectedAvoidNonvegDays,
            })
            .then((res) => { })
            .catch((e) => console.log(e));
        } else {
          db.collection("athletes")
            .doc(userData?.id)
            .collection("Lifestyle")
            .doc("lifestyle")
            .set({
              doSmoke,
              smokeFrequency,
              smokePer,
              consumeAlcohol,
              haveAllergies,
              fast,
              avoidNonVeg,
              specifyAllergies,
              fastFood,
              dishesDisliked,
              favDish,
              cuisine,
              diet,
              meal,
              lunch,
              dinner,
              alcoholData,
              smokeData,
              breakfast,
              snacks,
              activityLevel,
              alcoholFrequency,
              alcoholPer,
              outsideFoodFrequency,
              outsideFoodPer,
              additionalDetails,
              selectedFastDays,
              selectedAvoidNonvegDays,
            })
            .then((res) => { })
            .catch((e) => console.log(e));
        }
      });

    setEditable(false);
  };

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid
    >
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: RFValue(10, 816),
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
            <View style={{ marginLeft: 15 }}>
              <Text
                style={{
                  fontSize: RFValue(22, 816),
                  fontFamily: "SF-Pro-Text-regular",
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                Food and Lifestyle
              </Text>
              <Text
                style={{
                  fontSize: RFValue(22, 816),
                  fontFamily: "SF-Pro-Text-regular",
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                Assessment
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
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "column",
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
              marginTop: 20,
            }}
          >
            <Text
              style={{
                fontSize: RFValue(17, 816),
                color: "black",
                marginVertical: RFValue(10, 816),
              }}
            >
              What does your diet look like, add breakfast, lunch, snacks, dinner.
            </Text>
            <Text style={{  marginTop:10,marginHorizontal:1}}>Breakfast</Text>
            <TextInput
              style={{
                width: "100%",
                borderRadius: RFValue(5, 816),
                paddingVertical: Platform.OS === "ios" ? 15 : RFValue(5, 816),
                paddingHorizontal: RFValue(10, 816),
                backgroundColor: "white",
                borderWidth: 0.5,
                marginTop: 10
              }}
              editable={editable}
              placeholder="Type your diet"
              defaultValue={userData?.data?.breakfast}
              value={breakfast}
              onChangeText={setBreakfast}
            />

            <Text style={{   marginTop:10,marginHorizontal:1}}>Lunch</Text>
            <TextInput
              style={{
                width: "100%",
                borderRadius: RFValue(5, 816),
                paddingVertical: Platform.OS === "ios" ? 15 : RFValue(5, 816),
                paddingHorizontal: RFValue(10, 816),
                backgroundColor: "white",
                borderWidth: 0.5,
                marginTop: 10
              }}
              editable={editable}
              placeholder="Type your diet"
              defaultValue={userData?.data?.lunch}
              value={lunch}
              onChangeText={setLunch}
            />

            <Text style={{  marginTop:10,marginHorizontal:1}}>Snacks</Text>
            <TextInput
              style={{
                width: "100%",
                borderRadius: RFValue(5, 816),
                paddingVertical: Platform.OS === "ios" ? 15 : RFValue(5, 816),
                paddingHorizontal: RFValue(10, 816),
                backgroundColor: "white",
                borderWidth: 0.5,
                marginTop: 10,
              
              }}
              editable={editable}
              placeholder="Type your diet"
              defaultValue={userData?.data?.snacks}
              value={snacks}
              onChangeText={setSnacks}
            />

            <Text style={{ marginTop:10,marginHorizontal:1 }}>Dinner</Text>
            <TextInput
              style={{
                width: "100%",
                borderRadius: RFValue(5, 816),
                paddingVertical: Platform.OS === "ios" ? 15 : RFValue(5, 816),
                paddingHorizontal: RFValue(10, 816),
                backgroundColor: "white",
                borderWidth: 0.5,
                marginTop: 10
              }}
              editable={editable}
              placeholder="Type your diet"
              defaultValue={userData?.data?.dinner}
              value={dinner}
              onChangeText={setDinner}
            />
          </View>

          <View
            style={{
              backgroundColor: "white",
              padding: RFValue(10, 816),
              borderRadius: 10,
              marginTop:20
            }}
          >
            <Text style={{ color: "black", marginBottom: 5 }}>
              What type of diet do you follow (vegan, vegetarian, non veg, eggetarian) ?
            </Text>
            {Platform.OS === "ios" ? (
              <RNPickerSelect
                value={diet}
                onValueChange={(value) => setDiet(value)}
                style={{ paddingVertical: 5 }}
                items={[
                  { label: "Vegetarian", value: "Vegetarian" },
                  { label: "Non-Vegetarian", value: "Non-Vegetarian" },
                  { label: "Eggetarian", value: "Eggetarian" },
                  {
                    label: "Pescetarian (Fish)",
                    value: "Pescetarian (Fish)",
                  },
                  { label: "Jain Food", value: "Jain Food" },
                  { label: "Vegan", value: "Vegan" }
                ]}
                disabled={!editable}
              />
            ) : (
              <Picker
                selectedValue={diet}
                style={{
                  marginBottom: RFValue(0, 816),
                }}
                onValueChange={(itemValue, itemIndex) => {
                  setDiet(itemValue);
                }}
                enabled={editable}
              >
                <Picker.Item label="Select Diet" value="" />
                <Picker.Item label="Vegetarian" value="Veg" />
                <Picker.Item label="Non-Vegetarian" value="Non-Veg" />
                <Picker.Item label="Eggetarian" value="Eggetarian" />
                <Picker.Item label="Vegan" value="Vegan" />
              </Picker>
            )}
          </View>


          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              marginVertical: RFValue(10, 816),
              marginTop: RFValue(20, 816),
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: RFValue(10, 816),
                borderRadius: 10,
              }}
            >
              <Text style={{ color: "black", marginBottom: 5 }}>
                Choose your Daily Activity Level
              </Text>

              {Platform.OS === "ios" ? (
                <RNPickerSelect
                  value={activityLevel}
                  onValueChange={(value) => setActivityLevel(value)}
                  style={{ paddingVertical: 50, }}
                  items={[
                    { label: "Sedentary (mostly sitting throughout the day)", value: "Sedentary (mostly sitting throughout the day)" },
                    {
                      label: "Semi Sedentary(some movement due to chores)",
                      value: "Semi Sedentary(some movement due to chores)"
                    },

                    { label: "Moderately Active(2-3 days of exercise)", value: "Moderately Active(2-3 days of exercise)" },
                    {
                      label: "Active(4-5 days of regular exercise)",
                      value: "Active(4-5 days of regular exercise)",
                    },
                    { label: "Very Active(6 days of rigorous exercise)", value: "Very Active(6 days of rigorous exercise)" },

                  ]}
                  disabled={!editable}
                />
              ) : (

                <Picker
                  selectedValue={activityLevel}


                  style={{
                    marginBottom: RFValue(0, 816),

                  }}
                  onValueChange={(itemValue, itemIndex) => {
                    setActivityLevel(itemValue);
                  }}
                  enabled={editable}
                >
                  <Picker.Item label="Select Activity Level" value="" />
                  <Picker.Item label="Sedentary (mostly sitting during day)" value="Sedentary (mostly sitting during day)" />
                  <Picker.Item label="Semi Sedentary(slight movement at home)" value="Semi Sedentary(slight movement at home)" />
                  <Picker.Item label="Moderately Active(2-3 days of exercise)" value="Moderately Active(2-3 days of exercise)" />
                  <Picker.Item label="Active(4-5 days of regular exercise)" value="Active(4-5 days of regular exercise)" />
                  <Picker.Item label="Very Active(6 days of rigorous exercise)" value="Very Active(6 days of rigorous exercise)" />

                </Picker>

              )}
            </View>
          </View>



          <View
            style={{
              backgroundColor: "white",
              padding: RFValue(10, 816),
              borderRadius: RFValue(10, 816),
              marginTop: 20,
            }}
          >
            <View>
              <Text style={{ color: "black" }}>Do you smoke?</Text>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 0,
                }}
              >
                {editable === true ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-evenly",
                      marginVertical: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        width: "50%",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => setDoSmoke("yes")}
                        style={{
                          padding: 5,
                          borderRadius: 100,
                          borderWidth: 1,
                          marginRight: 10,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor:
                              doSmoke == "yes" ? "black" : "white",
                            width: RFValue(10, 816),
                            height: RFValue(10, 816),
                            borderRadius: 100,
                          }}
                        ></View>
                      </TouchableOpacity>
                      <Text style={{ color: "black" }}>Yes</Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <TouchableOpacity
                        onPress={() => setDoSmoke("no")}
                        style={{
                          padding: 5,
                          borderRadius: 100,
                          borderWidth: 1,
                          marginRight: 10,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor:
                              doSmoke == "no" ? "black" : "white",
                            width: RFValue(10, 816),
                            height: RFValue(10, 816),
                            borderRadius: 100,
                          }}
                        ></View>
                      </TouchableOpacity>
                      <Text style={{ color: "black" }}>No</Text>
                    </View>
                  </View>
                ) : (
                  <Text
                    style={{
                      marginTop: RFValue(15, 816),
                      marginBottom: RFValue(15, 816),
                      fontSize: RFValue(15, 816),
                      textTransform: "capitalize",
                      color: "black",
                    }}
                  >
                    {doSmoke}
                  </Text>
                )}
              </View>
            </View>
            {doSmoke == "yes" ? 
              <TextInput
              style={{
                width: "100%",
                borderRadius: RFValue(5, 816),
                paddingVertical: Platform.OS === "ios" ? 15 : RFValue(5, 816),
                paddingHorizontal: RFValue(10, 816),
                backgroundColor: "white",
                borderWidth: 0.5,
              }}
              editable={editable}
              placeholder="Eg. Twice a day"
              defaultValue={userData?.data?.smokeData}
              value={smokeData}
              onChangeText={setSmokeData}
            />
            : null}
             
          </View>

          <View
            style={{
              backgroundColor: "white",
              padding: RFValue(10, 816),
              borderRadius: RFValue(10, 816),
              marginTop: 20,
            }}
          >
            <View>
              <Text style={{ color: "black" }}>Do you consume alcohol?</Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 0,
                }}
              >
                {editable === true ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-evenly",
                      marginVertical: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        width: "50%",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => setConsumeAlcohol("yes")}
                        style={{
                          padding: 5,
                          borderRadius: 100,
                          borderWidth: 1,
                          marginRight: 10,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor:
                              consumeAlcohol == "yes" ? "black" : "white",
                            width: RFValue(10, 816),
                            height: RFValue(10, 816),
                            borderRadius: 100,
                          }}
                        ></View>
                      </TouchableOpacity>
                      <Text style={{ color: "black" }}>Yes</Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <TouchableOpacity
                        onPress={() => setConsumeAlcohol("no")}
                        style={{
                          padding: 5,
                          borderRadius: 100,
                          borderWidth: 1,
                          marginRight: 10,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor:
                              consumeAlcohol == "no" ? "black" : "white",
                            width: RFValue(10, 816),
                            height: RFValue(10, 816),
                            borderRadius: 100,
                          }}
                        ></View>
                      </TouchableOpacity>
                      <Text style={{ color: "black" }}>No</Text>
                    </View>
                  </View>
                ) : (
                  <Text
                    style={{
                      marginTop: RFValue(15, 816),
                      marginBottom: RFValue(15, 816),
                      fontSize: RFValue(15, 816),
                      textTransform: "capitalize",
                      color: "black",
                    }}
                  >
                    {consumeAlcohol}
                  </Text>
                )}
              </View>
            </View>
            {consumeAlcohol == "yes" ? 
              <TextInput
              style={{
                width: "100%",
                borderRadius: RFValue(5, 816),
                paddingVertical: Platform.OS === "ios" ? 15 : RFValue(5, 816),
                paddingHorizontal: RFValue(10, 816),
                backgroundColor: "white",
                borderWidth: 0.5,
              }}
              editable={editable}
              placeholder="Eg. Twice a day"
              defaultValue={userData?.data?.alcoholData}
              value={alcoholData}
              onChangeText={setAlcoholData}
            />
            : null}
          </View>

          <View
            style={{
              backgroundColor: "white",
              padding: RFValue(10, 816),
              borderRadius: RFValue(10, 816),
              marginTop: 20,
            }}
          >
            <View>
              <Text style={{ color: "black", marginBottom: 5 }}>
              How many meals do you eat outside?
              </Text>
              <TextInput
              style={{
                width: "100%",
                borderRadius: RFValue(5, 816),
                paddingVertical: Platform.OS === "ios" ? 15 : RFValue(5, 816),
                paddingHorizontal: RFValue(10, 816),
                backgroundColor: "white",
                borderWidth: 0.5,
              }}
              editable={editable}
              placeholder="Type your meal"
              defaultValue={userData?.data?.meal}
              value={meal}
              onChangeText={setMeal}
            />
            </View>
          </View>

          

          <View
            style={{
              backgroundColor: "white",
              padding: RFValue(10, 816),
              borderRadius: RFValue(10, 816),
              marginTop: 20,
            }}
          >
            <Text
              style={{
                fontSize: RFValue(17, 816),
                color: "black",
                marginVertical: RFValue(10, 816),
              }}
            >
              What is your preferred cuisine?
            </Text>
            <TextInput
              style={{
                width: "100%",
                borderRadius: RFValue(5, 816),
                paddingVertical: Platform.OS === "ios" ? 15 : RFValue(5, 816),
                paddingHorizontal: RFValue(10, 816),
                backgroundColor: "white",
                borderWidth: 0.5,
              }}
              editable={editable}
              placeholder="Type your preferred cuisine"
              defaultValue={userData?.data?.cuisine}
              value={cuisine}
              onChangeText={setCuisine}
            />
          </View>

          <View
            style={{
              backgroundColor: "white",
              padding: RFValue(10, 816),
              borderRadius: RFValue(10, 816),
              marginTop: 20,
            }}
          >
            <Text
              style={{
                fontSize: RFValue(17, 816),
                marginVertical: RFValue(10, 816),
                color: "black",
              }}
            >
              What is your favourite dish?
            </Text>
            <TextInput
              style={{
                width: "100%",
                borderRadius: RFValue(5, 816),
                paddingVertical: Platform.OS === "ios" ? RFValue(15, 816) : 5,
                paddingHorizontal: RFValue(10, 816),
                backgroundColor: "white",
                borderWidth: 0.5,
              }}
              editable={editable}
              placeholder="Please specify"
              defaultValue={userData?.data?.favDish}
              value={favDish}
              onChangeText={setFavDish}
            />
          </View>

          <View
            style={{
              backgroundColor: "white",
              padding: RFValue(10, 816),
              borderRadius: RFValue(10, 816),
              marginTop: 20,
            }}
          >
            <Text
              style={{
                fontSize: RFValue(17, 816),
                marginVertical: RFValue(10, 816),
                color: "black",
              }}
            >
              Do you have any dishes you dislike?
            </Text>
            <TextInput
              style={{
                backgroundColor: "white",
                width: "100%",
                borderRadius: RFValue(5, 816),
                paddingVertical: Platform.OS === "ios" ? RFValue(15, 816) : 5,
                paddingHorizontal: RFValue(10, 816),
                borderWidth: 0.5,
              }}
              editable={editable}
              placeholder="Please specify"
              defaultValue={userData?.data?.dishesDisliked}
              value={dishesDisliked}
              onChangeText={setDishesDisliked}
            />
          </View>
          <View
            style={{
              backgroundColor: "white",
              padding: RFValue(10, 816),
              borderRadius: RFValue(10, 816),
              marginTop: 20,
            }}
          >
            <View>
              <Text style={{ color: "black" }}>Do you have allergies?</Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 0,
                }}
              >
                {editable === true ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-evenly",
                      marginVertical: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        width: "50%",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => setHaveAllergies("yes")}
                        style={{
                          padding: 5,
                          borderRadius: 100,
                          borderWidth: 1,
                          marginRight: 10,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor:
                              haveAllergies == "yes" ? "black" : "white",
                            width: RFValue(10, 816),
                            height: RFValue(10, 816),
                            borderRadius: 100,
                          }}
                        ></View>
                      </TouchableOpacity>
                      <Text style={{ color: "black" }}>Yes</Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <TouchableOpacity
                        onPress={() => setHaveAllergies("no")}
                        style={{
                          padding: 5,
                          borderRadius: 100,
                          borderWidth: 1,
                          marginRight: 10,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor:
                              haveAllergies == "no" ? "black" : "white",
                            width: RFValue(10, 816),
                            height: RFValue(10, 816),
                            borderRadius: 100,
                          }}
                        ></View>
                      </TouchableOpacity>
                      <Text style={{ color: "black" }}>No</Text>
                    </View>
                  </View>
                ) : (
                  <Text
                    style={{
                      marginTop: RFValue(15, 816),
                      marginBottom: RFValue(15, 816),
                      fontSize: RFValue(15, 816),
                      textTransform: "capitalize",
                      color: "black",
                    }}
                  >
                    {haveAllergies}
                  </Text>
                )}
              </View>
            </View>
            {haveAllergies == "yes" ? (
              <View>
                <Text
                  style={{
                    fontSize: RFValue(17, 816),
                    marginVertical: RFValue(10, 816),
                    color: "black",
                  }}
                >
                  Please specify
                </Text>
                <TextInput
                  style={{
                    width: "100%",
                    borderRadius: RFValue(5, 816),
                    paddingVertical:
                      Platform.OS === "ios"
                        ? RFValue(15, 816)
                        : RFValue(5, 816),
                    paddingHorizontal: RFValue(10, 816),
                    backgroundColor: "white",
                    borderWidth: 0.5,
                  }}
                  editable={editable}
                  placeholder="Type your allergies"
                  defaultValue={userData?.data?.specifyAllergies}
                  value={specifyAllergies}
                  onChangeText={setSpecifyAllergies}
                />
              </View>
            ) : null}
          </View>

          <View
            style={{
              backgroundColor: "white",
              padding: RFValue(10, 816),
              borderRadius: RFValue(10, 816),
              marginTop: 20,
            }}
          >
            <View>
              <Text style={{ color: "black" }}>Do you fast?</Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 0,
                }}
              >
                {editable === true ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-evenly",
                      marginVertical: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        width: "50%",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => setFast("yes")}
                        style={{
                          padding: 5,
                          borderRadius: 100,
                          borderWidth: 1,
                          marginRight: 10,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: fast == "yes" ? "black" : "white",
                            width: RFValue(10, 816),
                            height: RFValue(10, 816),
                            borderRadius: 100,
                          }}
                        ></View>
                      </TouchableOpacity>
                      <Text style={{ color: "black" }}>Yes</Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <TouchableOpacity
                        onPress={() => setFast("no")}
                        style={{
                          padding: 5,
                          borderRadius: 100,
                          borderWidth: 1,
                          marginRight: 10,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: fast == "no" ? "black" : "white",
                            width: RFValue(10, 816),
                            height: RFValue(10, 816),
                            borderRadius: 100,
                          }}
                        ></View>
                      </TouchableOpacity>
                      <Text style={{ color: "black" }}>No</Text>
                    </View>
                  </View>
                ) : (
                  <Text
                    style={{
                      marginTop: RFValue(15, 816),
                      marginBottom: RFValue(15, 816),
                      fontSize: RFValue(15, 816),
                      textTransform: "capitalize",
                      color: "black",
                    }}
                  >
                    {fast}
                  </Text>
                )}
              </View>
            </View>

            {fast == "yes" ? (
              <View>
                <Text
                  style={{
                    fontSize: RFValue(15, 816),
                    marginTop: RFValue(15, 816),
                    color: "black",
                  }}
                >
                  Select days you fast on
                </Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "wrap",
                    marginVertical: RFValue(10, 816),
                    width: ScreenWidth - RFValue(20, 816),
                  }}
                >
                  {daysList.map((day, idx) => (
                    <TouchableOpacity
                      key={idx}
                      disabled={!editable}
                      onPress={() => {
                        if (color1.includes(idx)) {
                          var array = [...color1];
                          var index = array.indexOf(idx);
                          if (index !== -1) {
                            array.splice(index, 1);
                            changeColor1(array);
                          }
                          var list = selectedFastDays.filter(
                            (t) => t !== daysList[idx]
                          );
                          setSelectedFastDays(list);
                        } else {
                          changeColor1([...color1, idx]);
                        }
                      }}
                      style={
                        color1.includes(idx)
                          ? {
                            backgroundColor: "#C19F1E",
                            width: RFValue(45, 816),
                            height: RFValue(25, 816),
                            justifyContent: "center",
                            alignItems: "center",
                            position: "relative",
                            borderRadius: RFValue(10, 816),
                            marginRight: RFValue(8, 816),
                            marginBottom: RFValue(5, 816),
                          }
                          : {
                            backgroundColor: "#fff",
                            width: RFValue(45, 816),
                            height: RFValue(25, 816),
                            justifyContent: "center",
                            alignItems: "center",
                            position: "relative",
                            borderRadius: RFValue(10, 816),
                            marginRight: RFValue(8, 816),
                            marginBottom: RFValue(5, 816),
                          }
                      }
                    >
                      <View>
                        <Text
                          style={
                            color1.includes(idx)
                              ? {
                                fontSize: RFValue(13, 816),
                                fontFamily: "SF-Pro-Display-regular",
                                width: "80%",
                                textAlign: "center",
                                color: "black",
                                fontWeight: "bold",
                              }
                              : {
                                fontSize: RFValue(13, 816),
                                fontFamily: "SF-Pro-Display-regular",
                                width: "80%",
                                textAlign: "center",
                                color: "black",
                              }
                          }
                        >
                          {day}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: RFValue(17, 816),
                      marginVertical: RFValue(10, 816),
                      color: "black",
                    }}
                  >
                    What are you allowed to eat on the days you fast?
                  </Text>
                  <TextInput
                    style={{
                      width: "100%",
                      borderRadius: RFValue(5, 816),
                      paddingVertical:
                        Platform.OS === "ios"
                          ? RFValue(15, 816)
                          : RFValue(5, 816),
                      paddingHorizontal: RFValue(10, 816),
                      backgroundColor: "white",
                      borderWidth: 0.5,
                    }}
                    editable={editable}
                    placeholder="Describe your food"
                    defaultValue={userData?.data?.fastFood}
                    value={fastFood}
                    onChangeText={setFastFood}
                  />
                </View>
              </View>
            ) : null}
          </View>

          <View
            style={{
              backgroundColor: "white",
              padding: RFValue(10, 816),
              borderRadius: RFValue(10, 816),
              marginTop: 20,
            }}
          >
            <View>
              <Text style={{ color: "black" }}>
                If non vegetarian, do you avoid non veg on specific days?
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 0,
                }}
              >
                {editable === true ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-evenly",
                      marginVertical: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        width: "50%",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => setAvoidNonVeg("yes")}
                        style={{
                          padding: 5,
                          borderRadius: 100,
                          borderWidth: 1,
                          marginRight: 10,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor:
                              avoidNonVeg == "yes" ? "black" : "white",
                            width: RFValue(10, 816),
                            height: RFValue(10, 816),
                            borderRadius: 100,
                          }}
                        ></View>
                      </TouchableOpacity>
                      <Text style={{ color: "black" }}>Yes</Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <TouchableOpacity
                        onPress={() => setAvoidNonVeg("no")}
                        style={{
                          padding: 5,
                          borderRadius: 100,
                          borderWidth: 1,
                          marginRight: 10,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor:
                              avoidNonVeg == "no" ? "black" : "white",
                            width: RFValue(10, 816),
                            height: RFValue(10, 816),
                            borderRadius: 100,
                          }}
                        ></View>
                      </TouchableOpacity>
                      <Text style={{ color: "black" }}>No</Text>
                    </View>
                  </View>
                ) : (
                  <Text
                    style={{
                      marginTop: RFValue(15, 816),
                      fontSize: RFValue(15, 816),
                      textTransform: "capitalize",
                      color: "black",
                    }}
                  >
                    {avoidNonVeg}
                  </Text>
                )}
              </View>
            </View>

            {avoidNonVeg == "yes" ? (
              <View>
                <Text
                  style={{
                    fontSize: RFValue(15, 816),
                    marginTop: RFValue(15, 816),
                    color: "black",
                  }}
                >
                  Select days
                </Text>

                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "wrap",
                    marginVertical: RFValue(10, 816),
                    width: ScreenWidth - RFValue(20, 816),
                  }}
                >
                  {daysList.map((day, idx) => (
                    <TouchableOpacity
                      key={idx}
                      disabled={!editable}
                      onPress={() => {
                        if (color.includes(idx)) {
                          var array = [...color];
                          var index = array.indexOf(idx);
                          if (index !== -1) {
                            array.splice(index, 1);
                            changeColor(array);
                          }
                          var list = selectedAvoidNonvegDays.filter(
                            (t) => t !== daysList[idx]
                          );
                          setSelectedAvoidNonvegDays(list);
                        } else {
                          changeColor([...color, idx]);
                        }
                      }}
                      style={
                        color.includes(idx)
                          ? {
                            backgroundColor: "#C19F1E",
                            width: RFValue(45, 816),
                            height: RFValue(25, 816),
                            justifyContent: "center",
                            alignItems: "center",
                            position: "relative",
                            borderRadius: RFValue(10, 816),
                            marginRight: RFValue(8, 816),
                            marginBottom: RFValue(5, 816),
                          }
                          : {
                            backgroundColor: "#fff",
                            width: RFValue(45, 816),
                            height: RFValue(25, 816),
                            justifyContent: "center",
                            alignItems: "center",
                            position: "relative",
                            borderRadius: RFValue(10, 816),
                            marginRight: RFValue(8, 816),
                            marginBottom: RFValue(5, 816),
                          }
                      }
                    >
                      <View>
                        <Text
                          style={
                            color.includes(idx)
                              ? {
                                fontSize: RFValue(13, 816),
                                fontFamily: "SF-Pro-Display-regular",
                                width: "80%",
                                textAlign: "center",
                                color: "black",
                                fontWeight: "bold",
                              }
                              : {
                                fontSize: RFValue(13, 816),
                                fontFamily: "SF-Pro-Display-regular",
                                width: "80%",
                                textAlign: "center",
                                color: "black",
                              }
                          }
                        >
                          {day}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : null}
          </View>

          <View
            style={{
              backgroundColor: "white",
              padding: RFValue(10, 816),
              borderRadius: RFValue(10, 816),
              marginTop: 20,
            }}
          >
            <Text style={{ color: "black" }}>Additional Details</Text>
            <View
              style={{
                marginVertical: RFValue(10, 816),
                backgroundColor: "white",
                borderRadius: 5,
                borderWidth: 0.5,
              }}
            >
              <UselessTextInput
                multiline
                numberOfLines={4}
                placeholder="Please provide additional details if any"
                onChangeText={(text) => setAdditionalDetails(text)}
                value={additionalDetails}
                isEnabled={editable ? true : false}
              />
            </View>
          </View>

          {editable && (
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                style={{
                  height: 52,
                  width: ScreenWidth - RFValue(100, 816),
                  marginTop: RFValue(15, 816),
                  marginBottom: 25,
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
                      color: "white",
                      fontFamily: "SF-Pro-Display-regular",
                      fontSize: RFValue(18, 816),
                      textAlign: "center",
                    }}
                  >
                    Complete Form
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

export default TrainingAssessment;
