import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { PieChart } from "react-native-svg-charts";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Icon } from "react-native-elements";
import * as firebase from "firebase";
import moment from "moment";
import { db } from "../../firebase";
import { selectUserData, selectUserType } from "../../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import darkColors from "react-native-elements/dist/config/colorsDark";
import Notification from "../components/Notification";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default Payments = ({ navigation }) => {
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
    db.collection("payments")
      .where("coach", "==", userData?.id)
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
                  borderColor: "black",
                  paddingTop: 5,
                  paddingBottom: 5,
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View>
                  <Text style={{ fontSize: RFValue(18, 816), color: "black" }}>
                    {doc.data().athleteName}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                      {moment(doc.data().paidDate.seconds * 1000).format("ll")}
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
                    borderColor: "black",
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
                  </View>
                  <Text style={{ fontSize: RFValue(18, 816), color: "black" }}>
                    {"\u20B9"} {doc.data().amt}
                  </Text>
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
                    borderColor: "black",
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
                  </View>
                  <Text style={{ fontSize: RFValue(18, 816), color: "black" }}>
                    {"\u20B9"} {doc.data().amt}
                  </Text>
                </View>
              );
            } else {
              upcoming.push(
                <View
                  key={doc.id}
                  style={{
                    flexDirection: "row",
                    borderBottomWidth: 0.5,
                    borderColor: "black",
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
                  </View>
                  <Text style={{ fontSize: RFValue(18, 816), color: "black" }}>
                    {"\u20B9"} {doc.data().amt}
                  </Text>
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
            svg: { fill: "#FF6B6B" },
          },
          {
            key: 3,
            amount: upcoming.length,
            svg: { fill: "#00B1C0" },
          },
          {
            key: 4,
            amount: completed.length,
            svg: { fill: "#FFE66D" },
          },
        ]);

        setPending(pending);
        setUpcoming(upcoming);
        setCompleted(completed);
        setToday(today);
      });
  }, []);

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: RFValue(20, 816) }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: RFValue(20, 816),
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
      <View
        style={{
          padding: RFValue(20, 816),
          backgroundColor: "white",
          borderRadius: RFValue(20, 816),
          flexDirection: "row",
        }}
      >
        <PieChart
          style={{ height: 200, width: "50%" }}
          valueAccessor={({ item }) => item.amount}
          data={data}
          spacing={0}
          outerRadius={"95%"}
        ></PieChart>
        <View style={{ padding: RFValue(10, 816), width: "50%" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: RFValue(20, 816),
            }}
          >
            <View
              style={{
                borderRadius: 80,
                backgroundColor: "#FFE66D",
                width: 12,
                height: 12,
                marginLeft: 10,
              }}
            ></View>
            <Text
              style={{
                marginLeft: RFValue(20, 816),
                fontSize: RFValue(18, 816),
              }}
            >
              {today.length} - Due today
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: RFValue(20, 816),
            }}
          >
            <View
              style={{
                borderRadius: 80,
                backgroundColor: "#FF6B6B",
                width: 12,
                height: 12,
                marginLeft: 10,
              }}
            ></View>
            <Text
              style={{
                marginLeft: RFValue(20, 816),
                fontSize: RFValue(18, 816),
              }}
            >
              {pending.length} - Pending
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: RFValue(20, 816),
            }}
          >
            <View
              style={{
                borderRadius: 80,
                backgroundColor: "#00B1C0",
                width: 12,
                height: 12,
                marginLeft: 10,
              }}
            ></View>
            <Text
              style={{
                marginLeft: RFValue(20, 816),
                fontSize: RFValue(18, 816),
              }}
            >
              {upcoming.length} - Due Soon
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: RFValue(20, 816),
            }}
          >
            <View
              style={{
                borderRadius: 80,
                backgroundColor: "#FFE66D",
                width: 12,
                height: 12,
                marginLeft: 10,
              }}
            ></View>
            <Text
              style={{
                marginLeft: RFValue(20, 816),
                fontSize: RFValue(18, 816),
              }}
            >
              {completed.length} - Completed
            </Text>
          </View>
        </View>
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
          <View style={{ marginTop: RFValue(10, 816) }}>{pending}</View>
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
          <View style={{ marginTop: RFValue(10, 816) }}>{upcoming}</View>
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
          <View style={{ marginTop: RFValue(10, 816) }}>{completed}</View>
        ) : null}
      </View>
    </KeyboardAwareScrollView>
  );
};
