import * as React from "react";
import { useIsFocused } from "@react-navigation/native";
import { View, TouchableOpacity, Image, Text } from "react-native";
import { useSelector } from "react-redux";
import { selectUserData, selectUserType } from "../../features/userSlice";
import { db } from "../../utils/firebase";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const Notification = ({ navigation }) => {
  const [count, setCount] = React.useState(0);
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const isFocused = useIsFocused();

  React.useEffect(() => {
    if (userData?.id) {
      if (userType == "coach") {
        db.collection("CoachNotifications")
          .doc(userData?.id)
          .collection("notifications")
          .where("seen", "==", false)
          .onSnapshot((snapshot) =>
            setCount(
              snapshot.docs.map((doc) => ({ id: doc.id, notify: doc.data() }))
            )
          );
      } else {
        db.collection("AthleteNotifications")
          .doc(userData?.id)
          .collection("notifications")
          .where("seen", "==", false)
          .onSnapshot((snapshot) =>
            setCount(
              snapshot.docs.map((doc) => ({ id: doc.id, notify: doc.data() }))
            )
          );
      }
    }
  }, [userData?.id, isFocused, userType]);

  return (
    <View style={{ marginRight: 25, marginBottom: 10 }}>
      <TouchableOpacity
        onPress={() => navigation.navigate("NotificationsScreen")}
      >
        <View
          style={{
            postion: "absolute",
            top: 12,
            left: "80%",
            backgroundColor: "red",
            width: RFValue(15, 816),
            height: RFValue(15, 816),
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ textAlign: "center", color: "white", fontSize: 10 }}>
            {count.length}
          </Text>
        </View>
        <Image
          style={{ width: 27, height: 27, resizeMode: "contain" }}
          source={require("../../../assets/bell.png")}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Notification;
