import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Icon } from "react-native-elements";
import moment from "moment";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MultipleDatePicker = (props) => {
  const { modalVisible, onCloseModel, onDonePress, selectedDates } = props;

  const [indexUpdate, setIndexUpdate] = useState(0);
  const [year, setYear] = useState(0);
  const [month, setMonth] = useState(0);
  const [monthDateList, setMonthDateList] = useState([]);
  const [selectedDateList, setSelectedDateList] = useState([]);

  useEffect(() => {
    if (selectedDates) {
      setSelectedDateList(selectedDates);
    }

    var month = moment().format("M");
    var year = moment().format("YYYY");

    // console.log("month->", month);
    // console.log("year->", year);

    setYear(parseInt(year));
    setMonth(parseInt(month));
  }, []);

  useEffect(() => {
    // console.log("month->", month);
    // console.log("year->", year);
    if (year != 0) {
      getDaysInMonth();
    }
  }, [year, month]);

  const getDaysInMonth = () => {
    var count = moment()
      .month(month - 1)
      .year(year)
      .daysInMonth();
    let firstDay = new Date(year, month - 1, 1).getDay()

    var days = Array(firstDay).fill("");

    for (var i = 1; i < count + 1; i++) {
      days.push(
        moment()
          .month(month - 1)
          .year(year)
          .date(i)
      );
    }
    // console.log("days->", days);
    setMonthDateList(days);
  };

  const loadNextMonth = () => {
    if (month == 12) {
      setYear(year + 1);
      setMonth(1);
    } else {
      setMonth(month + 1);
    }
  };

  const loadPreviousMonth = () => {
    if (month == 1) {
      setYear(year - 1);
      setMonth(12);
    } else {
      setMonth(month - 1);
    }
  };

  const onSelectData = (date) => {
    const formattedDate = moment(date).format("DD-MM-YYYY");
    var tmpList = selectedDateList;
    if (tmpList.includes(formattedDate)) {
      tmpList = tmpList.filter((subItem) => subItem != formattedDate);
    } else {
      tmpList.push(formattedDate);
    }
    setSelectedDateList(tmpList);
    setIndexUpdate(Math.random());
  };

  const renderDateItem = ({ item }) => {
    const formattedDate = moment(item).format("DD-MM-YYYY");
    var isSelected = false;
    if (selectedDateList.includes(formattedDate)) {
      isSelected = true;
    }

    return (
      <TouchableOpacity
        style={isSelected ? styles.selectedDateItem : styles.dateItem}
        onPress={() => { item == "" ? null : onSelectData(item) }}
      >
         <Text style={{ padding: 5 }}>{item == "" ? "" : moment(item).format("D")}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => { }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.headerContainer}>
            <Icon
              name="arrow-back-ios"
              type="material"
              size={24}
              onPress={loadPreviousMonth}
            />

            <Text>
              {monthNames[month - 1]} {year}
            </Text>
            <Icon
              name="arrow-forward-ios"
              type="material"
              size={24}
              onPress={loadNextMonth}
            />
          </View>

          <View style={{ justifyContent: "center" }}>
            <FlatList
              data={monthDateList}
              extraData={monthDateList}
              renderItem={renderDateItem}
              keyExtractor={(index) => index}
              numColumns={7}
              style={{ marginVertical: 20 }}
            />
          </View>

          <View style={styles.bottomContainer}>
            <Text onPress={onCloseModel}>Close</Text>
            <Text
              onPress={() => {
                onDonePress(selectedDateList);
              }}
            >
              Done
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MultipleDatePicker;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(169,169,169, 0.5)",
  },
  modalView: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    padding: 20,
    justifyContent: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  dateItem: {
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "10%",
  },
  selectedDateItem: {
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "10%",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#111111",
  },
});
