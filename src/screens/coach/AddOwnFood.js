import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
} from "react-native";
import { db } from "../../utils/firebase";
import * as firebase from "firebase";
import { RFValue } from "react-native-responsive-fontsize";
import { useSelector } from "react-redux";
import { selectUserData } from "../../features/userSlice";
import { Icon } from "react-native-elements";
import Notification from "../components/Notification";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const AddOwnFood = ({ navigation, route }) => {
  const isEdit = route.params.isEdit;
  const userData = useSelector(selectUserData);

  const [name, setName] = useState();
  const [servings, setservings] = useState();
  const [units, setunits] = useState();
  const [protein, setProtein] = useState();
  const [carbs, setCarbs] = useState();
  const [fat, setFat] = useState();
  const [calories, setCalories] = useState();

  useEffect(() => {
    if (isEdit) {
      const foodItem = route.params.foodItem;

      setName(foodItem.name);
      setservings(foodItem.servings);
      setunits(foodItem.units);
      setProtein(foodItem.protein);
      setCarbs(foodItem.carbs);
      setFat(foodItem.fat);
      setCalories(foodItem.calories);
    }
  }, []);

  const addFood = () => {
    if (name === undefined || name === "") {
      alert("Please enter food name");
      return;
    }
    if (servings === undefined || servings === "") {
      alert("Please enter servings");
      return;
    }
    if (units === undefined || units == "") {
      alert("Please enter serving type");
      return;
    }
    if (protein === undefined || protein === "") {
      alert("Please enter protein");
      return;
    }
    if (carbs === undefined || carbs === "") {
      alert("Please enter carbs");
      return;
    }
    if (fat === undefined || fat === "") {
      alert("Please enter fat");
      return;
    }
    if (calories === undefined || calories === "") {
      alert("Please enter calories");
      return;
    }

   


    if (isEdit) {
      const foodItem = route.params.foodItem;
      db.collection("coaches")
        .doc(userData?.id)
        .collection("ownFood")
        .doc(foodItem?.id)
        .update({
          name,
          servings,
          units,
          protein:parseFloat(protein),
          carbs:parseFloat(carbs),
          fat:parseFloat(fat),
          calories:parseFloat(calories),
          units2:"",
          servings2:"",
        
        })
        .then(() => {
          alert("Update Successfully");
          navigation.goBack();
        });
    } else {
      db.collection("coaches")
        .doc(userData?.id)
        .collection("ownFood")
        .add({
          name,
          servings,
          units,
          protein:parseFloat(protein),
          carbs:parseFloat(carbs),
          fat:parseFloat(fat),
          calories:parseFloat(calories),
          units2:"",
          servings2:"",
         
        })
        .then(() => {
          alert("Added Successfully");
          navigation.goBack();
        });
    }
  };

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          padding: RFValue(20, 816),
          paddingBottom: 0,
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            style={{ paddingRight: RFValue(20, 816) }}
            onPress={() => navigation.goBack()}
          >
            <Icon
              name="chevron-left"
              type="font-awesome-5"
              color="black"
              size={RFValue(30, 816)}
            />
          </TouchableOpacity>
          <Icon
            name="bars"
            type="font-awesome-5"
            size={24}
            onPress={() => navigation.toggleDrawer()}
          />
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 28,
              marginLeft: RFValue(20, 816),
              color: "black",
            }}
          >
            {isEdit ? "Edit Food" : " Add Own Food"}
          </Text>
        </View>
        <Notification navigation={navigation} />
      </View>

      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.subContainer}>
          <Text style={styles.foodName}>Food Name</Text>
          <TextInput
            placeholder="Food Name"
            value={name}
            onChangeText={setName}
            style={styles.foodNameInput}
          />
          <Text style={styles.foodName}>Quantity</Text>
          <TextInput
            placeholder="servings"
            value={servings}
            onChangeText={setservings}
            style={styles.foodNameInput}
            keyboardType="number-pad"
            returnKeyType="done"
          />

          <Text style={styles.foodName}>Serving</Text>
          <TextInput
            placeholder="Serving"
            value={units}
            onChangeText={setunits}
            style={styles.foodNameInput}
            returnKeyType="done"
          />

          <View style={styles.proteinMainContainer}>
            <View style={styles.proteinSubContainer}>
              <Text style={styles.foodName}>Protein</Text>
              <TextInput
                placeholder="Protein"
                value={protein}
                onChangeText={setProtein}
                style={styles.foodNameInput}
                keyboardType="number-pad"
                returnKeyType="done"
              />
            </View>
            <View style={styles.proteinDivider} />
            <View style={styles.proteinSubContainer}>
              <Text style={styles.foodName}>Carbs</Text>
              <TextInput
                placeholder="Carbs"
                value={carbs}
                onChangeText={setCarbs}
                style={styles.foodNameInput}
                keyboardType="number-pad"
                returnKeyType="done"
              />
            </View>
          </View>

          <View style={styles.proteinMainContainer}>
            <View style={styles.proteinSubContainer}>
              <Text style={styles.foodName}>Fat</Text>
              <TextInput
                placeholder="Fat"
                value={fat}
                onChangeText={setFat}
                style={styles.foodNameInput}
                keyboardType="number-pad"
                returnKeyType="done"
              />
            </View>
            <View style={styles.proteinDivider} />
            <View style={styles.proteinSubContainer}>
              <Text style={styles.foodName}>Calories</Text>
              <TextInput
                placeholder="Calories"
                value={calories}
                onChangeText={setCalories}
                style={styles.foodNameInput}
                keyboardType="number-pad"
                returnKeyType="done"
              />
            </View>
          </View>

          <TouchableOpacity onPress={addFood} style={styles.submitButton}>
            <Text style={styles.addFoodText}>
              {isEdit ? "Update Food" : "Add Food"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default AddOwnFood;

const styles = StyleSheet.create({
  subContainer: {
    padding: RFValue(10, 816),
  },
  foodName: {
    color: "black",
    fontSize: 14,
    marginTop: 20,
  },
  foodNameInput: {
    borderWidth: 0.5,
    marginTop: 10,
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === "ios" ? 15 : 10,
  },
  submitButton: {
    marginTop: 30,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(15, 816),
    backgroundColor: "#C19F1E",
  },
  addFoodText: {
    color: "black",
    fontFamily: "SF-Pro-Display-regular",
    fontSize: RFValue(15, 816),
  },
  proteinMainContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  proteinSubContainer: {
    flex: 1,
  },
  proteinDivider: {
    width: 20,
  },
});
