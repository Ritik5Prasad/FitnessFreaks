import React from "react";
import {
  View,
  Button,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import { Icon } from "react-native-elements";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    marginBottom: 0,
    paddingTop: RFValue(20, 816),
    height: ScreenHeight - RFValue(40, 816),
  },
});

const Admin = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text
        style={{
          color: "black",
          textAlign: "center",
          fontSize: RFValue(22, 816),
          marginBottom: RFValue(50, 816),
        }}
      >
        Admin
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate("showProfile")}>
        <View
          style={{
            display: "flex",
            width: ScreenWidth - RFValue(80, 816),
            height: RFValue(50, 816),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: "white" }}>Your Profile</Text>
          <Icon name="chevron-right" type="font-awesome-5" color="white" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate("sportsSelection", { type: "Settings" })
        }
      >
        <View
          style={{
            display: "flex",
            width: ScreenWidth - RFValue(80, 816),
            height: RFValue(50, 816),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: "white" }}>Sports Selection</Text>
          <Icon name="chevron-right" type="font-awesome-5" color="white" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("AccountsHomeScreen")}
      >
        <View
          style={{
            display: "flex",
            width: ScreenWidth - RFValue(80, 816),
            height: RFValue(50, 816),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: "white" }}>Accounts</Text>
          <Icon name="chevron-right" type="font-awesome-5" color="white" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("BugReport", { userType: "coach" })}
      >
        <View
          style={{
            display: "flex",
            width: ScreenWidth - RFValue(80, 816),
            height: RFValue(50, 816),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: "white" }}>Bug Report</Text>
          <Icon name="chevron-right" type="font-awesome-5" color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Admin;
