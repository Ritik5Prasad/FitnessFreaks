import * as React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { selectUserType } from "../features/userSlice";
import { Icon } from "react-native-elements";
let ScreenWidth = Dimensions.get("window").width;
let ScreenHeight = Dimensions.get("window").height;
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const PostAddScreen = ({ route, navigation }) => {
  const userType = useSelector(selectUserType);
  const [screen, setScreen] = React.useState("");

  React.useEffect(() => {
    if (route.params?.screen) {
      setScreen(route.params.screen);
    }
  }, [route.params?.screen]);

  //console.log(navigation.state.routes.length)

  //console.log({screen})
  return (
    <View
      style={{
        backgroundColor: "#f3f3f3",
      }}
    >
      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: ScreenHeight / 1.5,
        }}
      >
        <View
          elevation={10}
          style={{
            width: ScreenWidth / 1.8,
            height: ScreenWidth / 1.8,
            backgroundColor: "#f3f3f3",
            borderWidth: 1,
            borderColor: "#333",
            borderRadius: ScreenWidth / 1.8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000000",
            shadowOpacity: 0.5,
            shadowRadius: 1,
            shadowOffset: {
              height: 1,
              width: 1,
            },
          }}
        >
          <Icon
            name="check"
            color="#35d445"
            size={ScreenWidth / 4}
            style="solid"
            type="font-awesome-5"
          />
        </View>
        <Text
          style={{ marginTop: RFValue(25, 816), fontSize: RFValue(18, 816) }}
        >
          {userType === "athlete" && screen === "workout"
            ? "Completed workout successfully!"
            : userType === "athlete" && screen === "nutrition"
            ? "Completed meal successfully!"
            : screen === "workout"
            ? "Assiged your workout successfully!"
            : "Assiged your meal successfully!"}
        </Text>

        <TouchableOpacity
          style={{
            width: RFValue(150, 816),
            height: RFValue(40, 816),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderRadius: 25,
            borderColor: "#777",
            backgroundColor: "#f3f3f3",
            marginTop: 30,
          }}
          onPress={() =>
            userType === "athlete" && screen === "workout"
              ? navigation.navigate("Home")
              : userType === "athlete" && screen === "nutrition"
              ? navigation.navigate("Home")
              : screen === "workout"
              ? navigation.reset({
                  index: 0,
                  routes: [{ name: "WorkoutList" }],
                })
              : navigation.reset({
                  index: 0,
                  routes: [{ name: "CoachNutrition" }],
                })
          }
        >
          <Text>Return Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostAddScreen;
