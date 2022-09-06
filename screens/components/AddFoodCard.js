import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  TextInput,
  Platform,
} from "react-native";
import { db } from "../../firebase";
import { useSelector } from "react-redux";
import { selectUserData, selectUserType } from "../../features/userSlice";
import { CheckBox, Icon } from "react-native-elements";
import SearchableDropdown from "react-native-searchable-dropdown";
let ScreenWidth = Dimensions.get("window").width;
import { Picker } from "@react-native-picker/picker";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import RNPickerSelect from "react-native-picker-select";
import { ActivityIndicator } from "react-native-paper";

function AddFoodCard(props) {
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const [open, setOpen] = useState(false);
  const [entireFood, setEntireFood] = useState(props.entireFood);
  const [index, setIndex] = useState(props.index);
  const [item, setItem] = useState(props.item);
  const [idx, setIdx] = useState(props.idx);

  useEffect(() => {
    setIndex(props.index);
    setIdx(props.idx);
    setItem(props.item);
    setOpen(props.item.foodName != "" && props.collapse ? false : true);
    setOpen(props.collapseOn == false ? false : true);
  }, [props.index, props.item, props.idx, props?.collapse]);

  // if (props.serverData?.length == 0) {
  //   return (
  //     <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
  //       <ActivityIndicator size="large" color="#05B8DB" />
  //     </View>
  //   );
  // }
  return (
    <View style={{ marginBottom: RFValue(15, 816), width: "100%" }}>
      {open ? (
        <View style={{ marginBottom: RFValue(20, 816) }}>
          <View
            style={{
              alignItems: "flex-start",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                justifyContent: "space-between",
                paddingRight: RFValue(20, 816),
              }}
            >
              <Text
                style={{ marginVertical: RFValue(10, 816), color: "black" }}
              >
                {props.type === "non-editable"
                  ? "Food Name"
                  : "Search Food Name"}
              </Text>
              {props.type !== "non-editable" && (
                <TouchableOpacity
                  onPress={() => {
                    let temp = [...props.entireFood[index].food];
                    let temp1 = [...props.entireFood];
                    temp.splice(idx, 1);
                    temp1[index].food = temp;
                    props.setEntireFood(temp1);
                  }}
                >
                  <Icon name="times" type="font-awesome-5" size={15} />
                </TouchableOpacity>
              )}
            </View>
            {props.type === "non-editable" ? (
              <Text style={{ color: "black" }}>{props.item.foodName}</Text>
            ) : (
              <SafeAreaView style={{ width: "100%" }}>
                {props?.serverData?.length > 0 && (
                  <SearchableDropdown
                    onTextChange={(text) => console.log(text)}
                    onItemSelect={(item) => {
                      let foodData = [...props.entireFood];
                      console.log(item);
                      let temp = [...props.ent.food];
                      temp[idx].foodName = item.name;
                      temp[idx].proteins =
                        item.protein * temp[idx].quantity || 0;
                      temp[idx].carbs = item.carbs * temp[idx].quantity || 0;
                      temp[idx].fat = item.fats * temp[idx].quantity || 0;
                      // temp[idx].fibre = item.fibres;
                      temp[idx].calories =
                        item.calories * temp[idx].quantity || 0;
                      temp[idx].foodDetails = item;
                      temp[idx].serving = "";
                      temp[idx].units = "";
                      temp[idx].quantity = 1;

                      foodData[index].food = temp;
                      props.setEntireFood(foodData);
                    }}
                    // setSort={(item, searchedText) =>
                    //   item.name
                    //     .toLowerCase()
                    //     .startsWith(searchedText.toLowerCase())
                    // }
                    containerStyle={{
                      padding: RFValue(5, 816),
                      paddingRight: 0,
                    }}
                    textInputStyle={{
                      padding: RFValue(12, 816),
                      borderWidth: 1,
                      borderColor: "grey",
                      borderRadius: RFValue(5, 816),
                      backgroundColor: "#fff",
                      width: "100%",
                      marginLeft: -5,
                      color: "black",
                      paddingVertical: Platform.OS === "ios" ? 15 : 12,
                      //placeholdertextColor:"black"
                    }}
                    placeholderTextColor={"black"}
                    itemStyle={{
                      padding: RFValue(10, 816),
                      marginTop: 2,
                      backgroundColor: "#FAF9F8",
                      borderColor: "#bbb",
                      borderWidth: 1,
                      color: "black",
                      //placeholdertextColor:"black",
                      width: "100%",
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
                    items={props.serverData}
                    listProps={{
                      nestedScrollEnabled: true,
                    }}
                    defaultIndex={0}
                    placeholder={
                      props.item.foodName
                        ? props.item.foodName
                        : "Enter Food Name"
                    }
                    placeholderTextColor={"black"}
                    resetValue={false}
                    underlineColorAndroid="transparent"
                  />
                )}
              </SafeAreaView>
            )}
          </View>

          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                alignItems: "flex-start",
              }}
            >
              <Text
                style={{ marginVertical: RFValue(10, 816), color: "black" }}
              >
                {props.type === "non-editable" ? "Quantity" : "Enter Quantity"}
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  width: ScreenWidth / 5,
                  borderColor: "grey",
                  borderRadius: RFValue(5, 816),
                  paddingVertical: Platform.OS === "ios" ? 15 : RFValue(5, 816),
                  paddingHorizontal: RFValue(10, 816),
                }}
                returnKeyType="done"
                keyboardType="numeric"
                value={String(props.item.quantity)}
                onChangeText={(newVal) => {
                  let foodData = [...props.entireFood];
                  let temp = [...props.ent.food];
                  if (newVal) {
                    temp[idx].quantity = newVal;
                  } else {
                    temp[idx].quantity = "";
                  }

                  if (temp[idx].units === props.item.foodDetails?.units) {
                    temp[idx].calories =
                      (temp[idx].quantity * temp[idx].foodDetails?.calories) /
                      temp[idx].foodDetails?.servings;
                    temp[idx].proteins =
                      (temp[idx].quantity * temp[idx].foodDetails?.protein) /
                      temp[idx].foodDetails?.servings;
                    temp[idx].carbs =
                      (temp[idx].quantity * temp[idx].foodDetails?.carbs) /
                      temp[idx].foodDetails?.servings;
                    temp[idx].fat =
                      (temp[idx].quantity * temp[idx].foodDetails?.fats) /
                      temp[idx].foodDetails?.servings;
                  } else if (
                    temp[idx].units === props.item.foodDetails?.units2
                  ) {
                    temp[idx].calories =
                      (temp[idx].quantity * temp[idx].foodDetails?.calories) /
                      temp[idx].foodDetails?.servings2;
                    temp[idx].proteins =
                      (temp[idx].quantity * temp[idx].foodDetails?.protein) /
                      temp[idx].foodDetails?.servings2;
                    temp[idx].carbs =
                      (temp[idx].quantity * temp[idx].foodDetails?.carbs) /
                      temp[idx].foodDetails?.servings2;
                    temp[idx].fat =
                      (temp[idx].quantity * temp[idx].foodDetails?.fats) /
                      temp[idx].foodDetails?.servings2;
                  } else {
                    temp[idx].proteins =
                      temp[idx].foodDetails?.protein *
                      (temp[idx].quantity || 0);
                    temp[idx].carbs =
                      temp[idx].foodDetails?.carbs * (temp[idx].quantity || 0);
                    temp[idx].fat =
                      temp[idx].foodDetails?.fats * (temp[idx].quantity || 0);
                    temp[idx].calories =
                      temp[idx].foodDetails?.calories *
                      (temp[idx].quantity || 0);
                  }
                  foodData[index].food = temp;
                  props.setEntireFood(foodData);
                }}
                placeholder={"Enter Quantity"}
                // editable={props.type === "non-editable" ? false : true}
              />
            </View>
            <View
              style={{
                alignItems: "flex-start",
                marginLeft: ScreenWidth * 0.1,
                marginTop: 15,
              }}
            >
              <Text
                style={{ marginVertical: 0, marginBottom: 5, color: "black" }}
              >
                {props.type === "non-editable" ? "Servings" : "Enter Servings"}
              </Text>
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {Platform.OS === "ios" ? (
                  <RNPickerSelect
                    style={{ paddingVertical: 5 }}
                    value={props.item?.foodDetails?.units}
                    onValueChange={(itemValue) => {
                      let foodData = [...props.entireFood];
                      let temp = [...props.ent.food];
                      temp[idx].units = itemValue;
                      if (temp[idx].units === props.item.foodDetails?.units) {
                        temp[idx].calories =
                          (temp[idx].quantity *
                            temp[idx].foodDetails?.calories) /
                          temp[idx].foodDetails?.servings;
                        temp[idx].proteins =
                          (temp[idx].quantity *
                            temp[idx].foodDetails?.protein) /
                          temp[idx].foodDetails?.servings;
                        temp[idx].carbs =
                          (temp[idx].quantity * temp[idx].foodDetails?.carbs) /
                          temp[idx].foodDetails?.servings;
                        temp[idx].fat =
                          (temp[idx].quantity * temp[idx].foodDetails?.fats) /
                          temp[idx].foodDetails?.servings;
                      } else if (
                        temp[idx].units === props.item.foodDetails?.units2
                      ) {
                        temp[idx].calories =
                          (temp[idx].quantity *
                            temp[idx].foodDetails?.calories) /
                          temp[idx].foodDetails?.servings2;
                        temp[idx].proteins =
                          (temp[idx].quantity *
                            temp[idx].foodDetails?.protein) /
                          temp[idx].foodDetails?.servings2;
                        temp[idx].carbs =
                          (temp[idx].quantity * temp[idx].foodDetails?.carbs) /
                          temp[idx].foodDetails?.servings2;
                        temp[idx].fat =
                          (temp[idx].quantity * temp[idx].foodDetails?.fats) /
                          temp[idx].foodDetails?.servings2;
                      } else {
                        console.log("Nothing is selected");
                      }
                      foodData[index].food = temp;
                      props.setEntireFood(foodData);
                    }}
                    items={[
                      {
                        label: props.item?.foodDetails?.units,
                        value: props.item?.foodDetails?.units,
                      },
                      {
                        label: props.item?.foodDetails?.units2,
                        value: props.item?.foodDetails?.units2,
                      },
                    ]}
                    enabled={props.type === "non-editable" ? true : false}
                  />
                ) : (
                  <Picker
                    selectedValue={String(props.item.units)}
                    style={{
                      height: RFValue(15, 816),
                      width: ScreenWidth / 2,
                      paddingHorizontal: RFValue(15, 816),
                      paddingVertical: RFValue(8, 816),
                      borderWidth: 1,
                      borderColor: "grey",
                      borderRadius: RFValue(5, 816),
                      marginLeft: -5,
                    }}
                    onValueChange={(itemValue) => {
                      let foodData = [...props.entireFood];
                      let temp = [...props.ent.food];
                      temp[idx].units = itemValue;
                      if (temp[idx].units === props.item.foodDetails?.units) {
                        temp[idx].quantity= temp[idx].foodDetails?.servings;

                        temp[idx].calories =
                          (temp[idx].quantity *
                            temp[idx].foodDetails?.calories) /
                          temp[idx].foodDetails?.servings;
                        temp[idx].proteins =
                          (temp[idx].quantity *
                            temp[idx].foodDetails?.protein) /
                          temp[idx].foodDetails?.servings;
                        temp[idx].carbs =
                          (temp[idx].quantity * temp[idx].foodDetails?.carbs) /
                          temp[idx].foodDetails?.servings;
                        temp[idx].fat =
                          (temp[idx].quantity * temp[idx].foodDetails?.fats) /
                          temp[idx].foodDetails?.servings;
                      } else if (
                        temp[idx].units === props.item.foodDetails?.units2
                      ) {
                        temp[idx].quantity= temp[idx].foodDetails?.servings2;
                       
                        temp[idx].calories =
                          (temp[idx].quantity *
                            temp[idx].foodDetails?.calories) /
                          temp[idx].foodDetails?.servings2;
                        temp[idx].proteins =
                          (temp[idx].quantity *
                            temp[idx].foodDetails?.protein) /
                          temp[idx].foodDetails?.servings2;
                        temp[idx].carbs =
                          (temp[idx].quantity * temp[idx].foodDetails?.carbs) /
                          temp[idx].foodDetails?.servings2;
                        temp[idx].fat =
                          (temp[idx].quantity * temp[idx].foodDetails?.fats) /
                          temp[idx].foodDetails?.servings2;
                      } else {
                        console.log("Nothing is selected");
                      }
                      foodData[index].food = temp;
                      props.setEntireFood(foodData);
                    }}
                    enabled={props.type === "non-editable" ? false : true}
                  >
                    {props.item?.foodDetails && (
                      <Picker.Item
                        label={props.item?.foodDetails?.units}
                        value={props.item?.foodDetails?.units}
                      />
                    )}
                    {props.item?.foodDetails && (
                      <Picker.Item
                        label={props.item?.foodDetails?.units2}
                        value={props.item?.foodDetails?.units2}
                      />
                    )}
                  </Picker>
                )}
                {Platform.OS === "ios" ? (
                  <Icon
                    name="caret-down"
                    type="font-awesome-5"
                    size={12}
                    style={{ paddingLeft: 5 }}
                    //onPress={() => navigation.toggleDrawer()}
                  />
                ) : null}
              </View>
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={{ color: "black" }}>Macro Nutrients</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "45%",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: "black", marginRight: 10 }}>Protein</Text>
                <Text style={{ color: "black", padding: 10 }}>
                  {item.proteins
                    ? String(Math.round(item.proteins * 10) / 10)
                    : String(0)}{" "}
                  g
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "45%",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: "black", marginRight: 10 }}>Carbs</Text>
                <Text style={{ color: "black", padding: 10 }}>
                  {item.carbs
                    ? String(Math.round(item.carbs * 10) / 10)
                    : String(0)}{" "}
                  g
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "45%",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: "black", marginRight: 10 }}>Fat</Text>
                <Text style={{ color: "black", padding: 10 }}>
                  {item.fat
                    ? String(Math.round(item.fat * 10) / 10)
                    : String(0)}{" "}
                  g
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "45%",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: "black", marginRight: 10 }}>
                  Calories
                </Text>
                <Text style={{ color: "black", padding: 10 }}>
                  {item.calories
                    ? String(Math.round(item.calories * 10) / 10)
                    : String(0)}{" "}
                  kcal
                </Text>
              </View>
            </View>

            {/* <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Text
        style={{ marginRight:RFValue(5, 816), width: ScreenWidth * 0.15 }}
      >
        Fibre
      </Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#777",
          width: ScreenWidth / 6,
          textAlign: "center",
          borderRadius: 4,
        }}
        value={item.fibre.toString()}
        editable={false}
      />
      <Text style={{ marginHorizontal: 5 }}>g</Text>
    </View> */}
          </View>
          <TouchableOpacity
            disabled={userType === "coach" ? true : false}
            style={{
              alignSelf: "flex-end",
              marginTop: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {(props.type === "non-editable" || item.addedByAthlete) &&
              userType != "coach" && (
                <CheckBox
                  checked={item.logged}
                  size={36}
                  uncheckedColor="#000"
                  onPress={() => {
                    props.setEntireFood((prevEntireFood) => {
                      const entireFood = prevEntireFood.slice();
                      const food = entireFood[index].food.slice();
                      food[idx] = {
                        ...food[idx],
                        logged: !food[idx].logged,
                      };
                      entireFood[index] = {
                        ...entireFood[index],
                        food,
                      };
                      return entireFood;
                    });
                  }}
                />
              )}
            <TouchableOpacity
              style={{
                padding: 5,
                paddingHorizontal: RFValue(8, 816),
                borderWidth: 1,
                borderRadius: 5,
              }}
              onPress={() => {
                if (item.foodName && item.foodName != "") {
                  setOpen(false);
                } else {
                  let temp = [...props.entireFood[index].food];
                  let temp1 = [...props.entireFood];
                  temp.splice(idx, 1);
                  temp1[index].food = temp;
                  props.setEntireFood(temp1);
                }
              }}
            >
              <Icon name="chevron-up" type="font-awesome-5" size={20} />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            padding: RFValue(10, 816),
            paddingLeft: RFValue(10, 816),
            borderWidth: 0.7,
            marginBottom: RFValue(10, 816),
            borderRadius: 5,
          }}
        >
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => setOpen(true)}
          >
            <Text style={{ width: "60%", color: "black" }}>
              {item.foodName}
            </Text>
            <Text style={{ color: "black", width: "40%" }}>
              {props.item.quantity} {props.item.units},{" "}
              {item.calories
                ? String(Math.round(item.calories * 10) / 10)
                : String(0)}{" "}
              kcal
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default AddFoodCard;