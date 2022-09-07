import React from "react";
import { View, Text, TouchableOpacity, Dimensions, Image } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
let ScreenWidth = Dimensions.get("window").width;
let ScreenHeight = Dimensions.get("window").height;
import { Icon } from "react-native-elements";

const WorkoutCard2 = ({ navigation, data, item }) => {
  return (
    <TouchableOpacity
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: RFValue(15, 816),
        width: ScreenWidth - RFValue(30, 816),
        borderRadius: RFValue(8, 816),
        marginVertical: RFValue(5, 816),
      }}
      onPress={() => {
        navigation.navigate("WorkoutDetails", {
          // workout: data,
          // workoutName: data?.preWorkout?.workoutName,
          // assignType: "non-editable",
          data: data,
          item: item,
        });
      }}
    >
      <Image
        style={{
          width: RFValue(80, 816),
          height: RFValue(80, 816),
          backgroundColor: "grey",
          borderRadius: RFValue(12, 816),
          marginRight: RFValue(20, 816),
        }}
        source={require("../../../assets/illustration.jpeg")}
      />
      <View
        style={{
          width: "60%",
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text
            style={{
              fontSize: RFValue(15, 816),
              fontWeight: "700",
              marginBottom: RFValue(10, 816),
            }}
          >
            {/* {item?.data?.preWorkout?.workoutName} {showDate && `   ${date}`} */}
            {data?.isLongTerm
              ? data?.workoutName
              : data?.preWorkout?.workoutName}{" "}
            {/* {showDate && `   ${date}`} */}
          </Text>
          {/* {console.log(coach)} */}
          {/* {coach?.length > 0 && (
              <Text
                style={{
                  fontSize: RFValue(15, 816),
                  fontWeight: "700",
                  marginBottom: RFValue(10, 816),
                }}
              >
                by {coach[0]?.name}
              </Text>
            )} */}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: RFValue(12, 816), width: RFValue(60, 816) }}
            >
              Calories
            </Text>
            <Text style={{ fontSize: RFValue(12, 816) }}>
              {data?.preWorkout?.caloriesBurnEstimate}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: RFValue(12, 816), width: RFValue(60, 816) }}
            >
              Difficulty
            </Text>
            <Text style={{ fontSize: RFValue(12, 816) }}>
              {data?.preWorkout?.workoutDifficulty}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: RFValue(12, 816), width: RFValue(60, 816) }}
            >
              Duration
            </Text>
            <Text style={{ fontSize: RFValue(12, 816) }}>
              {data?.preWorkout?.workoutDuration}
            </Text>
          </View>
        </View>
        <View
          style={{
            marginLeft: 140,
            position: "absolute",
          }}
        >
          {/* <Text>{selecteddate && selecteddate}</Text> */}
        </View>
      </View>

      <Icon
        name="chevron-right"
        type="font-awesome-5"
        color="black"
        size={RFValue(20, 816)}
      />
    </TouchableOpacity>
  );
};

export default WorkoutCard2;
