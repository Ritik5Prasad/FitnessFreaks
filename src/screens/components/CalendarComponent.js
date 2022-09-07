import * as React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
let ScreenWidth = Dimensions.get("window").width;
import { Icon } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { selectUserData, selectUserType } from "../../features/userSlice";

function Calendar({ requestDate, setRequestDate }) {
  const [currentStartWeek, setCurrentStartWeek] = React.useState("");
  const [currentEndWeek, setCurrentEndWeek] = React.useState("");
  const [daysList, setDaysList] = React.useState([
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ]);

  const [specificDates, setSpecificDates] = React.useState([]);
  const userType = useSelector(selectUserType);

  function formatDate() {
    var d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  function formatSpecificDate(d) {
    var d = new Date(d),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  function getDate(d) {
    var d = new Date(d),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return day;
  }

  React.useEffect(() => {
    var curr = new Date(); // get current date
    var first = curr.getDate() - curr.getDay(); // First day is the  day of the month - the day of the week \

    var firstday = new Date(curr.setDate(first)).toUTCString();
    var lastday = new Date(curr.setDate(curr.getDate() + 6)).toUTCString();

    setCurrentStartWeek(formatSpecificDate(firstday));
    setCurrentEndWeek(formatSpecificDate(lastday));
  }, []);

  React.useEffect(() => {
    let temp = currentStartWeek;
    let datesCollection = [];

    for (var i = 0; i < 7; i++) {
      datesCollection.push(temp);
      temp = incr_date(temp);
    }

    setSpecificDates(datesCollection);
  }, [currentStartWeek]);

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

  React.useEffect(() => {
    formatDate2();
  }, [currentStartWeek]);

  function formatDate2() {
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
    var d = new Date(currentStartWeek),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    month = monthNames[d.getMonth()];

    return [month, year].join(" ");
  }

  return (
    <View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: ScreenWidth - 10,
        }}
      >
        <Text
          style={{
            width: ScreenWidth,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {formatDate2()}
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#C19F1E",
            paddingHorizontal: RFValue(15, 816),
            paddingVertical: RFValue(8, 816),
            borderRadius: 50,
            marginLeft: "-30%",
          }}
          onPress={() => {
            var curr = new Date(); // get current date
            var first = curr.getDate() - curr.getDay(); // First day is the  day of the month - the day of the week \

            var firstday = new Date(curr.setDate(first)).toUTCString();
            var lastday = new Date(
              curr.setDate(curr.getDate() + 6)
            ).toUTCString();

            setCurrentStartWeek(formatSpecificDate(firstday));
            setCurrentEndWeek(formatSpecificDate(lastday));
          }}
        >
          <Text
            style={{
              fontSize: RFValue(14, 816),
              fontWeight: "bold",
              color: "white",
              textAlign: "center",
            }}
          >
            Set to Today
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: RFValue(20, 816),
          width: ScreenWidth,
        }}
      >
        <TouchableOpacity
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: RFValue(15, 816),
            paddingHorizontal: RFValue(10, 816),
          }}
          activeOpacity={0.6}
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
          <Icon name="chevron-left" size={15} type="font-awesome-5" />
        </TouchableOpacity>
        {daysList.map((day, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => {
              setRequestDate(specificDates[idx]);
            }}
            style={{
              backgroundColor:
                (requestDate === specificDates[idx] && "#C19F1E") ||
                (formatDate() === specificDates[idx] && "black") ||
                "#f3f3f3",
              color:
                (formatDate() === specificDates[idx] && "#b3b3b3") || "#f3f3f3",
              width: ScreenWidth / 9,
              height: RFValue(50, 816),
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              borderRadius: RFValue(10, 816),
              marginBottom: RFValue(5, 816),
            }}
            // disabled={
            //   userType == "athlete" &&
            //   new Date(specificDates[idx]) >= new Date()
            //     ? true
            //     : false
            // }
          >
            <View>
              <Text
                style={{
                  fontSize: RFValue(12, 816),
                  fontWeight:
                    requestDate === specificDates[idx] ? "bold" : "normal",
                  textAlign: "center",
                  color:
                    (requestDate === specificDates[idx] && "white") ||
                    (formatDate() === specificDates[idx] && "white") ||
                    "#8B8B8B",
                  marginBottom: RFValue(7, 816),
                }}
              >
                {getDate(specificDates[idx])}
              </Text>
              <Text
                style={{
                  fontSize: RFValue(10, 816),
                  fontWeight: "bold",
                  textAlign: "center",
                  color:
                    (requestDate === specificDates[idx] && "white") ||
                    (formatDate() === specificDates[idx] && "white") ||
                    "#8B8B8B",
                }}
              >
                {day}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: RFValue(10, 816),
            paddingVertical: RFValue(15, 816),
          }}
          activeOpacity={0.6}
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
            style={{
              marginRight: RFValue(5, 816),
            }}
            type="font-awesome-5"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Calendar;
