import * as React from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import { selectUserData } from "../features/userSlice";
import { db } from "../firebase";
import { Icon } from "react-native-elements";
import { useIsFocused } from "@react-navigation/native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 0,
    minHeight: "100%",
    paddingTop: RFValue(20, 816),
  },
});

const NotificationsScreen = ({ route, navigation }) => {
  const userData = useSelector(selectUserData);
  const [readMessages, setReadMessages] = React.useState([]);
  const [unreadMessages, setUnreadMessages] = React.useState([]);
  const [switchScreen, setSwitchScreen] = React.useState(false);
  const isFocused = useIsFocused();

  React.useEffect(() => {
    let temp1 = [];
    let temp2 = [];
    var unsub1 = db
      .collection("AthleteNotifications")
      .doc(userData?.id)
      .collection("notifications")
      .where("seen", "==", false)
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          let currentID = doc.id;
          let appObj = { ...doc.data(), ["id"]: currentID };
          temp1.push(appObj);
        });
        setUnreadMessages(temp1);
      });
    var unsub2 = db
      .collection("AthleteNotifications")
      .doc(userData?.id)
      .collection("notifications")
      .where("seen", "==", true)
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          let currentID = doc.id;
          let appObj = { ...doc.data(), ["id"]: currentID };
          temp2.push(appObj);
        });
        setReadMessages(temp2);
      });

    return () => {
      unsub1();
      unsub2();
    };
  }, [userData?.id, isFocused]);

  const getData = () => {
    let temp1 = [];
    let temp2 = [];
    var unsub3 = db
      .collection("AthleteNotifications")
      .doc(userData?.id)
      .collection("notifications")
      .where("seen", "==", false)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          let currentID = doc.id;
          let appObj = { ...doc.data(), ["id"]: currentID };
          temp1.push(appObj);
        });
        setUnreadMessages(temp1);
      });
    var unsub4 = db
      .collection("AthleteNotifications")
      .doc(userData?.id)
      .collection("notifications")
      .where("seen", "==", true)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          let currentID = doc.id;
          let appObj = { ...doc.data(), ["id"]: currentID };
          temp2.push(appObj);
        });
        setReadMessages(temp2);
      });
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          margin: RFValue(20, 816),
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          style={{
            marginHorizontal: RFValue(20, 816),
          }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Icon name="chevron-left" type="font-awesome-5" />
        </TouchableOpacity>
        {switchScreen === false && (
          <TouchableOpacity
            style={{ borderColor: "#d3d3d3", borderwidth: 1, borderRadius: 8 }}
            onPress={() => {
              db.collection("AthleteNotifications")
                .doc(userData?.id)
                .collection("notifications")
                .get()
                .then(function (querySnapshot) {
                  // Once we get the results, begin a batch
                  var batch = db.batch();

                  querySnapshot.forEach(function (doc) {
                    // For each doc, add a delete operation to the batch
                    batch.update(doc.ref, "seen", true);
                    // batch.update(doc.ref);
                  });

                  // Commit the batch
                  return batch.commit();
                })
                .then(function () {
                  // Delete completed!
                  // ...
                  getData();
                });

              // const batch = db.batch()

              // .onSnapshot(function(querySnapshot) {
              //     querySnapshot.forEach(function(doc) {
              //         doc.ref.update({
              //             seen: true
              //         });
              //     });
              // });
            }}
          >
            <Text style={{ textAlign: "center" }}>Mark All as Read</Text>
          </TouchableOpacity>
        )}
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          justifyContent: "center",
          marginTop: 15,
        }}
      >
        <TouchableOpacity
          style={{
            marginRight: RFValue(10, 816),
            backgroundColor: switchScreen === false ? "#C19F1E" : "#fff",
            borderRadius: RFValue(8, 816),
            paddingHorizontal: RFValue(8, 816),
            paddingVertical: 4,
          }}
          onPress={() => setSwitchScreen(false)}
        >
          <Text style={{ fontWeight: "700" }}>Unread Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            marginRight: RFValue(10, 816),
            backgroundColor: switchScreen === true ? "#C19F1E" : "#fff",
            borderRadius: RFValue(8, 816),
            paddingHorizontal: RFValue(8, 816),
            paddingVertical: 4,
          }}
          onPress={() => setSwitchScreen(true)}
        >
          <Text style={{ fontWeight: "700" }}>Read Notifications</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          margin: RFValue(20, 816),
          flex: 1,
          alignItems: "center",
          justifyContent: "space-between",
          height: "80%",
        }}
      >
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          style={{ width: "100%", height: "70%" }}
        >
          {switchScreen === false
            ? unreadMessages.map((msg, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={{
                    backgroundColor: "white",
                    padding: RFValue(10, 816),
                    width: "100%",
                    height: RFValue(80, 816),
                    borderBottomWidth: idx < unreadMessages.length ? 1 : 0,
                    borderBottomColor: "#d3d3d3",
                  }}
                >
                  <Text>{msg.message}</Text>
                  <Text style={{ textAlign: "right" }}>
                    {msg.timestamp.toDate().toDateString() +
                      " at " +
                      msg.timestamp.toDate().toLocaleTimeString()}
                  </Text>
                </TouchableOpacity>
              ))
            : readMessages.map((msg, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={{
                    backgroundColor: "white",
                    padding: RFValue(10, 816),
                    width: "100%",
                    height: 80,
                    borderBottomWidth: idx < unreadMessages.length ? 1 : 0,
                    borderBottomColor: "#d3d3d3",
                  }}
                >
                  <Text>{msg.message}</Text>
                  <Text style={{ textAlign: "right" }}>
                    {msg.timestamp.toDate().toDateString() +
                      " at " +
                      msg.timestamp.toDate().toLocaleTimeString()}
                  </Text>
                </TouchableOpacity>
              ))}
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

export default NotificationsScreen;
