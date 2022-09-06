import * as React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
//import { StackedBarChart } from "react-native-svg-charts";
import { StackedBarChart } from "react-native-chart-kit";
let ScreenWidth = Dimensions.get("window").width;
import { Icon } from "react-native-elements";
import { useSelector } from "react-redux";
import { selectUserData } from "../../features/userSlice";
import { db } from "../../firebase";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

function ComplianceCard() {
  const userData = useSelector(selectUserData);
  const [currentStartWeek, setCurrentStartWeek] = React.useState(null);
  const [currentEndWeek, setCurrentEndWeek] = React.useState(null);
  const [workouts, setWorkouts] = React.useState([]);
  const [compliance, setCompliance] = React.useState([]);
  const [complianceCount, setComplianceCount] = React.useState(0);
  const [maxCompliance, setMaxCompliance] = React.useState(0);

  React.useEffect(() => {
    var curr = new Date(); // get current date
    var first = curr.getDate() - curr.getDay(); // First day is the  day of the month - the day of the week \

    var firstday = new Date(curr.setDate(first)).toUTCString();
    var lastday = new Date(curr.setDate(curr.getDate() + 6)).toUTCString();

    setCurrentStartWeek(formatSpecificDate(firstday));
    setCurrentEndWeek(formatSpecificDate(lastday));
  }, []);

  function formatSpecificDate(d) {
    var d = new Date(d),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  function formatSpecificDate2(d) {
    var d = new Date(d),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month].join("/");
  }

  function formatDate2(date) {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    month = monthNames[d.getMonth()];
    if (day.length < 2) day = "0" + day;

    return [month, day].join(" ");
  }

  function incr_date(date_str) {
    var parts = date_str.split("-");
    var dt = new Date(
      parseInt(parts[0], 10), // year
      parseInt(parts[1], 10) - 1, // month (starts with 0)
      parseInt(parts[2], 10) // date
    );
    dt.setDate(dt.getDate() + 1);
    parts[0] = "" + dt.getFullYear();
    parts[1] = "" + (dt.getMonth() + 1);
    if (parts[1].length < 2) {
      parts[1] = "0" + parts[1];
    }
    parts[2] = "" + dt.getDate();
    if (parts[2].length < 2) {
      parts[2] = "0" + parts[2];
    }
    return parts.join("-");
  }

  function addDate(str, i) {
    var tomorrow = new Date(str);
    tomorrow.setDate(tomorrow.getDate() + i);
    return tomorrow;
  }

  React.useEffect(() => {
    db.collection("workouts")
      .where("date", ">=", currentStartWeek)
      .where("date", "<=", currentEndWeek)
      .orderBy("date")
      .get()
      .then((querySnapshot) => {
        let data = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        data = data.filter((d) => d.assignedById === userData?.id);
        setWorkouts(data);
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  }, [currentStartWeek, currentEndWeek]);

  function arrayMax(arr) {
    return arr.reduce(function (p, v) {
      return p > v ? p : v;
    });
  }

  React.useEffect(() => {
    if (workouts.length > 0) {
      let tDate = workouts[0].date;
      let temp = [];
      let count = 0;
      let maxArr = [];
      for (let i = 0; i < 7; i++) {
        let t1 = workouts.filter(
          (w) => w.date === tDate && w.compliance === "Fully compliant"
        );
        let t2 = workouts.filter(
          (w) => w.date === tDate && w.compliance === "Partially compliant"
        );
        let t3 = workouts.filter(
          (w) => w.date === tDate && w.compliance === "Non compliant"
        );
        let t4 = workouts.filter(
          (w) => w.date === tDate && w.compliance === "Exceeded"
        );
        temp.push([t1.length, t2.length, t3.length, t4.length]);
        count = t1.length + t2.length + t3.length + t4.length;
        maxArr.push(count);
        tDate = incr_date(tDate);
      }
      setCompliance(temp);
      setComplianceCount(count);
      setMaxCompliance(arrayMax(maxArr));
    } else {
      setCompliance([]);
      setComplianceCount(0);
      setMaxCompliance(0);
    }
  }, [workouts]);

  return (
    <View
      style={{
        marginTop: RFValue(20, 816),
        padding: RFValue(10, 816),
        marginHorizontal: RFValue(10, 816),
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        borderRadius: RFValue(12, 816),
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            marginRight: RFValue(20, 816),
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={() => {
            var curr = new Date(currentStartWeek); // get current date
            var first = curr.getDate() - curr.getDay() - 7; // First day is the  day of the month - the day of the week \

            var firstday = new Date(curr.setDate(first)).toUTCString();
            var lastday = new Date(
              curr.setDate(curr.getDate() + 6)
            ).toUTCString();

            setCurrentStartWeek(formatSpecificDate(firstday));
            setCurrentEndWeek(formatSpecificDate(lastday));
          }}
        >
          <Icon
            name="chevron-left"
            size={15}
            style={{
              padding: RFValue(10, 816),
              paddingHorizontal: RFValue(15, 816),
            }}
            type="font-awesome-5"
          />
        </TouchableOpacity>
        <Text style={{ width: ScreenWidth / 2.2, textAlign: "center" }}>
          {formatDate2(currentStartWeek)} - {formatDate2(currentEndWeek)}
        </Text>
        <TouchableOpacity
          style={{
            marginLeft: RFValue(20, 816),
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={() => {
            var curr = new Date(currentStartWeek); // get current date
            var first = curr.getDate() - curr.getDay() + 7; // First day is the  day of the month - the day of the week \

            var firstday = new Date(curr.setDate(first)).toUTCString();
            var lastday = new Date(
              curr.setDate(curr.getDate() + 6)
            ).toUTCString();

            setCurrentStartWeek(formatSpecificDate(firstday));
            setCurrentEndWeek(formatSpecificDate(lastday));
          }}
        >
          <Icon
            name="chevron-right"
            size={15}
            style={{ padding: RFValue(10, 816), paddingHorizontal: 15 }}
            type="font-awesome-5"
          />
        </TouchableOpacity>
      </View>

      {maxCompliance !== 0 && (
        <View
          style={{
            width: "100%",
            alignItems: "flex-end",
            marginTop: RFValue(10, 816),
            marginRight: RFValue(15, 816),
          }}
        >
          <View
            style={{ flexDirection: "row", alignItems: "center", width: 100 }}
          >
            <View
              style={{
                width: RFValue(10, 816),
                height: RFValue(10, 816),
                borderRadius: RFValue(10, 816),
                backgroundColor: "red",
                marginRight: RFValue(5, 816),
              }}
            ></View>
            <Text style={{ fontSize: RFValue(10, 816) }}>Exceeded</Text>
          </View>
          <View
            style={{ flexDirection: "row", alignItems: "center", width: 100 }}
          >
            <View
              style={{
                width: RFValue(10, 816),
                height: RFValue(10, 816),
                borderRadius: RFValue(10, 816),
                backgroundColor: "#C19F1E",
                marginRight: RFValue(5, 816),
              }}
            ></View>
            <Text style={{ fontSize: RFValue(10, 816) }}>Fully Compliant</Text>
          </View>
          <View
            style={{ flexDirection: "row", alignItems: "center", width: 100 }}
          >
            <View
              style={{
                width: RFValue(10, 816),
                height: RFValue(10, 816),
                borderRadius: RFValue(10, 816),
                backgroundColor: "#d3d3d3",
                marginRight: RFValue(5, 816),
              }}
            ></View>
            <Text style={{ fontSize: RFValue(10, 816) }}>
              Partially Compliant
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", alignItems: "center", width: 100 }}
          >
            <View
              style={{
                width: RFValue(10, 816),
                height: RFValue(10, 816),
                borderRadius: RFValue(10, 816),
                backgroundColor: "#454545",
                marginRight: RFValue(5, 816),
              }}
            ></View>
            <Text style={{ fontSize: RFValue(10, 816) }}>Non Compliant</Text>
          </View>
        </View>
      )}

      <View
        style={{
          flexDirection: maxCompliance === 0 ? "column" : "row",
          height: maxCompliance === 0 ? RFValue(50, 816) : RFValue(200, 816),
          marginTop: 30,
        }}
      >
        <View>
          {maxCompliance !== 0 ? (
            <View
              style={{
                justifyContent: "space-between",
                alignItems: "flex-end",
                flex: RFValue(10, 816),
                marginRight: RFValue(10, 816),
              }}
            >
              {[...Array(maxCompliance + 1)].map((e, i) => (
                <Text>{maxCompliance - i}</Text>
              ))}

              {/* <Text>{(maxCompliance * 0.8).toFixed(1)}</Text>
            <Text>{(maxCompliance * 0.6).toFixed(1)}</Text>
            <Text>{(maxCompliance * 0.4).toFixed(1)}</Text>
            <Text>{(maxCompliance * 0.2).toFixed(1)}</Text>
            <Text>0</Text> */}
            </View>
          ) : (
            <View
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                paddingHorizontal: RFValue(30, 816),
              }}
            >
              <Text style={{ textAlign: "center", fontSize: RFValue(14, 816) }}>
                There is no compliance data from your athletes yet.
              </Text>
            </View>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            width: "90%",
            justifyContent: "space-evenly",
          }}
        >
          {compliance.map((c, i) => (
            <View
              key={i}
              style={{
                width: RFValue(20, 816),
                height: `${((c[0] + c[1] + c[2]) / complianceCount) * 100}%`,
                marginLeft: RFValue(20, 816),
              }}
            >
              <View
                style={{
                  flex: 1,
                }}
              >
                <View style={{ flex: RFValue(10, 816) }}></View>
                <View
                  style={{
                    height: `${(c[3] / (c[0] + c[1] + c[2] + c[3])) * 100}%`,
                    backgroundColor: "red",
                    borderTopLeftRadius: RFValue(5, 816),
                    borderTopRightRadius: RFValue(5, 816),
                    borderBottomLeftRadius:
                      c[2] === 0 && c[1] === 0 && c[0] === 0 ? 5 : 0,
                    borderBottomRightRadius:
                      c[2] === 0 && c[1] === 0 && c[0] === 0 ? 5 : 0,
                  }}
                ></View>
                <View
                  style={{
                    height: `${(c[0] / (c[0] + c[1] + c[2] + c[3])) * 100}%`,
                    backgroundColor: "#C19F1E",
                    borderTopLeftRadius: c[3] === 0 ? 5 : 0,
                    borderTopRightRadius: c[3] === 0 ? 5 : 0,
                    borderBottomRightRadius: c[1] === 0 && c[2] === 0 ? 5 : 0,
                    borderBottomLeftRadius: c[1] === 0 && c[2] === 0 ? 5 : 0,
                  }}
                ></View>
                <View
                  style={{
                    height: `${(c[1] / (c[0] + c[1] + c[2] + c[3])) * 100}%`,
                    backgroundColor: "#d3d3d3",
                    borderTopLeftRadius: c[0] === 0 && c[3] === 0 ? 5 : 0,
                    borderTopRightRadius: c[0] === 0 && c[3] === 0 ? 5 : 0,
                    borderBottomRightRadius: c[2] === 0 ? 5 : 0,
                    borderBottomLeftRadius: c[2] === 0 ? 5 : 0,
                  }}
                ></View>
                <View
                  style={{
                    height: `${(c[2] / (c[0] + c[1] + c[2] + c[3])) * 100}%`,
                    backgroundColor: "#454545",
                    borderBottomRightRadius: RFValue(5, 816),
                    borderBottomLeftRadius: RFValue(5, 816),
                    borderTopLeftRadius:
                      c[0] === 0 && c[3] === 0 && c[1] === 0 ? 5 : 0,
                    borderTopRightRadius:
                      c[0] === 0 && c[1] === 0 && c[3] === 0 ? 5 : 0,
                  }}
                ></View>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          marginLeft: RFValue(45, 816),
          justifyContent: "space-evenly",
        }}
      >
        {maxCompliance !== 0 &&
          compliance.map((c, i) => (
            <View
              style={{
                flex: 1,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  marginTop: RFValue(5, 816),
                  fontSize: RFValue(10, 816),
                  width: RFValue(30, 816),
                }}
              >
                {formatSpecificDate2(addDate(currentStartWeek, i))}
                {/* {i + 1} */}
              </Text>
            </View>
          ))}
      </View>
    </View>
  );
}

export default ComplianceCard;
