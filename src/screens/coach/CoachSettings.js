import React from "react";
import { View, Button, StyleSheet, Dimensions } from "react-native";
let ScreenHeight = Dimensions.get("window").height;
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 0,
    paddingTop: RFValue(20, 816),
    height: ScreenHeight - RFValue(40, 816),
  },
});

const CoachSettings = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Button
        title="Your Profile"
        onPress={() => navigation.navigate("showProfile")}
      />
    </View>
  );
};

export default CoachSettings;
