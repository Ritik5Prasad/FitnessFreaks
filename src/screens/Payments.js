import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { PieChart } from "react-native-svg-charts";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Icon } from "react-native-elements";
import * as firebase from "firebase";
import moment from "moment";
import { db } from "../utils/firebase";
import { selectUserData, selectUserType } from "../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import darkColors from "react-native-elements/dist/config/colorsDark";
import Notification from "./components/Notification";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import triggerNotification from "../utils/sendPushNotification";

export default Payments = ({ route, navigation }) => {
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const [pending, setPending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [today, setToday] = useState([]);
  const [upcomingOpen, setUpcomingOpen] = useState(false);
  const [completedOpen, setCompletedOpen] = useState(false);
  const [pendingOpen, setPendingOpen] = useState(false);
  const [data, setData] = useState([
    {
      key: 1,
      amount: 54,
      svg: { fill: "#FFE66D" },
    },
    {
      key: 2,
      amount: 30,
      svg: { fill: "#00B1C0" },
    },
    {
      key: 3,
      amount: 26,
      svg: { fill: "#FF6B6B" },
    },
  ]);

  useEffect(() => {
    if (userData) {
      db.collection("payments")
        .where(
          "athlete",
          "==",
          route.params?.athlete ? route.params?.athlete?.id : userData?.id
        )
        .get()
        .then((snap) => {
          var payments_data = [];
          var completed = [];
          var upcoming = [];
          var pending = [];
          var today = [];
          snap.docs.forEach((doc) => {
            let appObj = { ...doc.data(), ["id"]: doc.id };
            payments_data.push(appObj);
            if (doc.data().status == "paid") {
              completed.push(
                <View
                  key={doc.id}
                  style={{
                    flexDirection: "row",
                    borderBottomWidth: 0.5,
                    bordercolor: "white",
                    paddingTop: 5,
                    paddingBottom: 5,
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View>
                    <Text
                      style={{ fontSize: RFValue(18, 816), color: "black" }}
                    >
                      {doc.data().athleteName}
                    </Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: RFValue(18, 816),
                          color: "black",
                        }}
                      >
                        Due on :{" "}
                      </Text>
                      <Text
                        style={{ fontSize: RFValue(18, 816), color: "black" }}
                      >
                        {moment(doc.data().date.seconds * 1000).format("ll")}
                      </Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: RFValue(18, 816),
                          color: "black",
                        }}
                      >
                        Paid on :{" "}
                      </Text>
                      <Text
                        style={{ fontSize: RFValue(18, 816), color: "black" }}
                      >
                        {moment(doc.data().paidDate.seconds * 1000).format(
                          "ll"
                        )}
                      </Text>
                    </View>
                  </View>
                  <Text style={{ fontSize: RFValue(18, 816), color: "black" }}>
                    {"\u20B9"} {doc.data().amt}
                  </Text>
                </View>
              );
            } else {
              if (
                moment(
                  moment(new Date()).format("DD-MM-YYYY"),
                  "DD-MM-YYYY"
                ).valueOf() <=
                  doc.data().date.seconds * 1000 &&
                moment(
                  moment(new Date()).add(1, "days").format("DD-MM-YYYY"),
                  "DD-MM-YYYY"
                ).valueOf() >=
                  doc.data().date.seconds * 1000
              ) {
                today.push(
                  <View
                    key={doc.id}
                    style={{
                      flexDirection: "row",
                      borderBottomWidth: 0.5,
                      bordercolor: "white",
                      paddingTop: 5,
                      paddingBottom: 5,
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View>
                      <Text
                        style={{ fontSize: RFValue(18, 816), color: "black" }}
                      >
                        {doc.data().athleteName}
                      </Text>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text
                          style={{
                            fontWeight: "bold",
                            fontSize: RFValue(18, 816),
                            color: "black",
                          }}
                        >
                          Due on :
                        </Text>
                        <Text
                          style={{ fontSize: RFValue(18, 816), color: "black" }}
                        >
                          {moment(doc.data().date.seconds * 1000).format("ll")}
                        </Text>
                      </View>
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: RFValue(18, 816),
                          color: "black",
                          textAlign: "center",
                        }}
                      >
                        {"\u20B9"} {doc.data().amt}
                      </Text>
                      {!route.params?.athlete && (
                        <TouchableOpacity
                          style={{
                            backgroundColor: "#C19F1E",
                            padding: 5,
                            borderRadius: 5,
                            paddingHorizontal: RFValue(10, 816),
                            marginTop: 5,
                          }}
                        >
                          <Text style={{ fontWeight: "bold", color: "black" }}>
                            Pay Now
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              } else if (
                doc.data().date.seconds * 1000 <
                moment(new Date()).valueOf()
              ) {
                pending.push(
                  <View
                    key={doc.id}
                    style={{
                      flexDirection: "row",
                      borderBottomWidth: 0.5,
                      bordercolor: "white",
                      paddingTop: 5,
                      paddingBottom: 5,
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View>
                      <Text
                        style={{ fontSize: RFValue(18, 816), color: "black" }}
                      >
                        {doc.data().athleteName}
                      </Text>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text
                          style={{
                            fontWeight: "bold",
                            fontSize: RFValue(18, 816),
                            color: "black",
                          }}
                        >
                          Due on :
                        </Text>
                        <Text
                          style={{ fontSize: RFValue(18, 816), color: "black" }}
                        >
                          {moment(doc.data().date.seconds * 1000).format("ll")}
                        </Text>
                      </View>
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: RFValue(18, 816),
                          color: "black",
                          textAlign: "center",
                        }}
                      >
                        {"\u20B9"} {doc.data().amt}
                      </Text>
                      {!route.params?.athlete && (
                        <TouchableOpacity
                          style={{
                            backgroundColor: "#C19F1E",
                            padding: 5,
                            borderRadius: 5,
                            paddingHorizontal: RFValue(10, 816),
                            marginTop: 5,
                          }}
                        >
                          <Text style={{ fontWeight: "bold", color: "black" }}>
                            Pay Now
                          </Text>
                        </TouchableOpacity>
                      )}
                      {route.params?.athlete && (
                        <Icon
                          name="bell"
                          type="font-awesome-5"
                          size={24}
                          onPress={() => {
                            const userIds = [];
                            userIds.push(route.params?.athlete.id);
                            triggerNotification(userIds, {
                              title: `Payment`,
                              body: `Please pay to coach ${doc.data().amt}`,
                            });
                          }}
                        />
                      )}
                    </View>
                  </View>
                );
              } else {
                upcoming.push(
                  <View
                    key={doc.id}
                    style={{
                      flexDirection: "row",
                      borderBottomWidth: 0.5,
                      bordercolor: "white",
                      paddingTop: 5,
                      paddingBottom: 5,
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View>
                      <Text
                        style={{ fontSize: RFValue(18, 816), color: "black" }}
                      >
                        {doc.data().athleteName}
                      </Text>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text
                          style={{
                            fontWeight: "bold",
                            fontSize: RFValue(18, 816),
                            color: "black",
                          }}
                        >
                          Due on :
                        </Text>
                        <Text
                          style={{ fontSize: RFValue(18, 816), color: "black" }}
                        >
                          {moment(doc.data().date.seconds * 1000).format("ll")}
                        </Text>
                      </View>
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: RFValue(18, 816),
                          color: "black",
                          textAlign: "center",
                        }}
                      >
                        {"\u20B9"} {doc.data().amt}
                      </Text>
                      {!route.params?.athlete && (
                        <TouchableOpacity
                          style={{
                            backgroundColor: "#C19F1E",
                            padding: 5,
                            borderRadius: 5,
                            paddingHorizontal: RFValue(10, 816),
                            marginTop: 5,
                          }}
                        >
                          <Text style={{ fontWeight: "bold", color: "black" }}>
                            Pay Now
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              }
            }
          });
          setData([
            {
              key: 1,
              amount: today.length,
              svg: { fill: "#FFE66D" },
            },
            {
              key: 2,
              amount: pending.length,
              svg: { fill: "#00B1C0" },
            },
            {
              key: 3,
              amount: upcoming.length,
              svg: { fill: "#FF6B6B" },
            },
            {
              key: 4,
              amount: completed.length,
              svg: { fill: "#FF6B6B" },
            },
          ]);

          setPending(pending);
          setUpcoming(upcoming);
          setCompleted(completed);
          setToday(today);
        });
    }
  }, [userData?.id]);

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: RFValue(10, 816) }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: RFValue(20, 816),
          marginRight: RFValue(20, 816),
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            style={{ paddingRight: 20 }}
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
            Payments
          </Text>
        </View>
        <Notification navigation={navigation} />
      </View>

      {today.length > 0 ? (
        <View>
          <View
            style={{
              flexDirection: "row",
              marginTop: RFValue(20, 816),
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: RFValue(20, 816),
                fontWeight: "bold",
                color: "black",
              }}
            >
              Payments Due today
            </Text>
            <View
              style={{
                borderRadius: 80,
                backgroundColor: "#707070",
                width: 5,
                height: 5,
                marginLeft: 10,
              }}
            ></View>
            <Text
              style={{
                fontSize: RFValue(20, 816),
                marginLeft: RFValue(10, 816),
                color: "black",
              }}
            >
              {today.length} Due today
            </Text>
          </View>
          <View style={{ marginTop: RFValue(20, 816) }}>{today}</View>
        </View>
      ) : null}

      <View
        style={{
          padding: RFValue(10, 816),
          backgroundColor: "white",
          borderRadius: RFValue(10, 816),
          marginTop: RFValue(20, 816),
          paddingBottom: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => setPendingOpen(!pendingOpen)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontSize: RFValue(20, 816),
                fontWeight: "bold",
                color: "black",
              }}
            >
              Pending Payments
            </Text>
            <View
              style={{
                borderRadius: 80,
                backgroundColor: "#707070",
                width: 5,
                height: 5,
                marginLeft: 10,
              }}
            ></View>
            <Text
              style={{
                fontSize: RFValue(20, 816),
                marginLeft: RFValue(10, 816),
                color: "black",
              }}
            >
              {pending.length} Pending
            </Text>
          </View>
          {pendingOpen ? (
            <Image source={require("../../assets/up.png")} />
          ) : (
            <Image source={require("../../assets/down.png")} />
          )}
        </TouchableOpacity>
        {pendingOpen ? (
          <View style={{ marginTop: RFValue(10, 816) }}>
            {pending.length > 0 ? (
              pending
            ) : (
              <Text
                style={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: RFValue(18, 816),
                  marginTop: RFValue(10, 816),
                }}
              >
                No pending Payments
              </Text>
            )}
          </View>
        ) : null}
      </View>

      <View
        style={{
          padding: RFValue(10, 816),
          backgroundColor: "white",
          borderRadius: RFValue(10, 816),
          marginTop: RFValue(20, 816),
          paddingBottom: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => setUpcomingOpen(!upcomingOpen)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontSize: RFValue(20, 816),
                fontWeight: "bold",
                color: "black",
              }}
            >
              Upcoming Payments
            </Text>
            <View
              style={{
                borderRadius: 80,
                backgroundColor: "#707070",
                width: 5,
                height: 5,
                marginLeft: 10,
              }}
            ></View>
            <Text
              style={{
                fontSize: RFValue(20, 816),
                marginLeft: RFValue(10, 816),
                color: "black",
              }}
            >
              {upcoming.length} upcoming
            </Text>
          </View>
          {upcomingOpen ? (
            <Image source={require("../../assets/up.png")} />
          ) : (
            <Image source={require("../../assets/down.png")} />
          )}
        </TouchableOpacity>
        {upcomingOpen ? (
          <View style={{ marginTop: RFValue(10, 816) }}>
            {upcoming.length > 0 ? (
              upcoming
            ) : (
              <Text
                style={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: RFValue(18, 816),
                  marginTop: RFValue(10, 816),
                }}
              >
                No upcoming Payments
              </Text>
            )}
          </View>
        ) : null}
      </View>

      <View
        style={{
          padding: RFValue(10, 816),
          backgroundColor: "white",
          borderRadius: RFValue(10, 816),
          marginTop: RFValue(20, 816),
          paddingBottom: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => setCompletedOpen(!completedOpen)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontSize: RFValue(20, 816),
                fontWeight: "bold",
                color: "black",
              }}
            >
              Completed Payments
            </Text>
            <View
              style={{
                borderRadius: 80,
                backgroundColor: "#707070",
                width: 5,
                height: 5,
                marginLeft: 10,
              }}
            ></View>
            <Text
              style={{
                fontSize: RFValue(20, 816),
                marginLeft: RFValue(10, 816),
                color: "black",
              }}
            >
              {completed.length} completed
            </Text>
          </View>
          {completedOpen ? (
            <Image source={require("../../assets/up.png")} />
          ) : (
            <Image source={require("../../assets/down.png")} />
          )}
        </TouchableOpacity>

        {completedOpen ? (
          <View style={{ marginTop: RFValue(10, 816) }}>
            {completed.length > 0 ? (
              completed
            ) : (
              <Text
                style={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: RFValue(18, 816),
                  marginTop: RFValue(10, 816),
                }}
              >
                No completed Payments
              </Text>
            )}
          </View>
        ) : null}
      </View>
    </KeyboardAwareScrollView>
  );
};
