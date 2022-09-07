import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  FlatList,
  Alert,
} from "react-native";
import { db } from "../../utils/firebase";
import { RFValue } from "react-native-responsive-fontsize";
import { useSelector } from "react-redux";
import { selectUserData } from "../../features/userSlice";
import { Icon } from "react-native-elements";
import Notification from "../components/Notification";
import { useIsFocused } from "@react-navigation/native";

const OwnFoodList = ({ navigation, route }) => {
  const userData = useSelector(selectUserData);

  const isFocused = useIsFocused();

  const [foodList, setFoodList] = useState([]);

  useEffect(() => {
    getOwnFoodList();
  }, [isFocused]);

  const getOwnFoodList = () => {
    db.collection("coaches")
      .doc(userData?.id)
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

        setFoodList(tmpList);
      });
  };

  const onEditPress = (item) => {
    navigation.navigate("AddOwnFood", { isEdit: true, foodItem: item });
  };

  const onDeletePress = (item, index) => {
    Alert.alert(
      "Delete",
      "Are you sure want to delete food item",
      [
        { text: "Cancel", onPress: () => console.log("Cancel Pressed!") },
        {
          text: "Delete",
          onPress: () => {
            db.collection("coaches")
              .doc(userData?.id)
              .collection("ownFood")
              .doc(item?.id)
              .delete()
              .then(() => {
                var tmpList = foodList.filter((i) => i.id !== item.id);
                setFoodList(tmpList);
              })
              .catch((e) => alert("Error while deleting food item"));
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderFoodItem = ({ item, index }) => {
    return (
      <View style={styles.itemContainer}>
        <Text
          style={styles.foodName}
        >{`${item.name}(${item.servings} ${item.units})`}</Text>
        <View style={styles.proteinContainer}>
          <Text style={styles.proteinText}>{`Protein : ${item.protein}`}</Text>
          <Text style={styles.proteinText}>{`Carbs : ${item.carbs}`}</Text>
        </View>
        <View style={styles.proteinContainer}>
          <Text style={styles.proteinText}>{`Fat : ${item.fat}`}</Text>
          <Text
            style={styles.proteinText}
          >{`Calories : ${item.calories}`}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.editButtonContainer}
            onPress={() => onEditPress(item)}
          >
            <Text>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editButtonContainer}
            onPress={() => onDeletePress(item, index)}
          >
            <Text>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
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
            Own Food
          </Text>
        </View>
        <Notification navigation={navigation} />
      </View>

      <FlatList
        data={foodList}
        renderItem={renderFoodItem}
        ItemSeparatorComponent={() => <View style={styles.listDivider} />}
        style={styles.marginTop20}
      />

      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => navigation.navigate("AddOwnFood", { isEdit: false })}
      >
        <Icon name="plus" type="font-awesome-5" color="white" size={20} />
      </TouchableOpacity>
    </View>
  );
};

export default OwnFoodList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    padding: RFValue(10, 816),
  },
  listDivider: {
    height: 1,
    backgroundColor: "grey",
  },
  marginTop20: {
    marginTop: 20,
    padding: RFValue(10, 816),
  },
  itemContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
  },
  foodName: {
    color: "black",
    fontSize: 18,
  },
  proteinContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  proteinText: {
    flex: 1,
  },
  fabButton: {
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
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 10,
  },
  editButtonContainer: {
    padding: 10,
    backgroundColor: "#C19F1E",
    borderRadius: 6,
    marginBottom: RFValue(10, 816),
    color: "white",
  },
});
